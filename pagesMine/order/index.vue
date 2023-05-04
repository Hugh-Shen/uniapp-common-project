<template>
	<view class="order-list-page">
		<view class="sticky">
			<view class="search-box">
				<van-icon class="arrow-left-icon" name="arrow-left" size="22" @click="goback"/>
				<view class="input-box">
					<input :value="searchData.keyWord" placeholder="搜索订单" confirm-type="search" @input="inputChange" @confirm="searchFn"/>
					<van-icon v-if="searchData.keyWord" class="arrow-clear-icon" name="clear" color="#999" @click="clearSearch"/>
					<view class="btn fcq-clickable" @click="searchFn">搜索</view>
				</view>
			</view>
			<view class="tab-box">
				<van-tabs title-active-color="#FF6633" :active="goodsType" @change="typeChange">
					<van-tab title="橙文馆" name="1"></van-tab>
					<van-tab title="橙品铺" name="2"></van-tab>
					<van-tab title="活动" name="3"></van-tab>
				</van-tabs>
				<view v-if="goodsType == '2'" class="status-box">
					<view v-for="item in goodsStatusList" :key="item.value" :class="currentStatus === item.value ? 'active' : ''" @click="statusChange(item.value)">{{item.label}}</view>
				</view>
				<view v-if="goodsType == '3'" class="status-box">
					<view v-for="item in activityStatusList" :key="item.value" :class="currentStatus === item.value ? 'active' : ''" @click="statusChange(item.value)">{{item.label}}</view>
				</view>
			</view>
			
		</view>
		<view class="order-list" :style="`padding-top: ${paddingTop}px`">
			<template v-for="item in dataSource.list" :key="item?.id">
				<navigator :url="'/pagesMine/order/detail?orderNo=' + item?.orderNo + '&goodsType=' + goodsType" class="order-li-nav">
					<material-item v-if="goodsType == '1'" :item="item" :goodsType="goodsType"></material-item>
					<goods-item v-if="goodsType == '2'" :item="item" :goodsType="goodsType"></goods-item>
					<activity-item v-if="goodsType == '3'" :item="item" :goodsType="goodsType"></activity-item>
				</navigator>
			</template>
			
			<empty v-if="!dataSource.hasNextPage && dataSource.list.length == 0" title="您暂时还没有相关订单~" confirmText="去逛逛" @click="gotoMarket"/>
			<view v-if="!dataSource.hasNextPage && dataSource.list.length > 0" class="no-more">没有更多订单了</view>
			<!-- <view v-if="dataSource.hasNextPage" class="loading-more"><van-loading color="#FF6633" /></view> -->
			<view class="mt-20"></view>
		</view>
		<view v-if="goTopShow" class="go-top" @click="goTop">
			<van-icon name="back-top" size="20" />
			<text>顶部</text>
		</view>
	</view>
</template>

<script setup>
	import { reactive, ref, nextTick, computed } from 'vue';
	import { onShow, onLoad, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app';
	import materialItem from './components/materialItem.vue'
	import goodsItem from './components/goodsItem.vue'
	import activityItem from './components/activityItem.vue'
	import Price from '@/components/price/price.vue';
	import Empty from "@/components/empty/empty.vue";
	import Api from './api.js';
	import useFileFormat from '@/hooks/useFileFormat.js'
	const { setFileFormat, setImgUrl_100 } = useFileFormat()
	
	const { statusBar: { height, width, top } } = getApp().globalData
	const barHeight = `${height + 10}px`
	const barWidth = `${width + 25}px`
	const barTop = `${top}px`
	const bHeight = `${height}px`
	
	const scrollTop = ref(0)
	const goTopShow = ref(false)
	const searchData = reactive({
		keyWord: '',
		list: [],
	})
	
	const dataSource = reactive({
		lastId: undefined,
		list: [],
		hasNextPage: true,
		pageNum: 1
	})
	const goodsType = ref('1') // 1-资料包； 2-商品； 3-活动
	const goodsStatusList = ref([
		{label: '全部', value: ''},
		{label: '待发货', value: 2},
		{label: '已发货', value: 3}
	])
	const activityStatusList = ref([
		{label: '全部', value: ''},
		{label: '待付款', value: 0},
		{label: '已付款', value: 1},
		{label: '已取消', value: 5}
	])
	
	const paddingTop = computed(() => {
		let num = height + top + 47
		if (goodsType.value !== '1') num = height + top + 47 + 31
		return num
	})
	
	const currentStatus = ref('')
	const statusChange = (val) => {
		console.log(val)
		dataSource.hasNextPage = true
		currentStatus.value = val
		dataSource.lastId = undefined
		dataSource.list.length = 0
		dataSource.pageNum = 1
		getList()
	}
	
	
	const typeChange = (e) => {
		goodsType.value = e.detail.name
		dataSource.hasNextPage = true
		currentStatus.value = ''
		dataSource.list.length = 0
		dataSource.list = []
		dataSource.lastId = undefined
		dataSource.pageNum = 1
		getList()
	}
	
	const clearSearch = () => {
		searchData.keyWord = ''
		searchFn()
	}
	
	const getList = () => { // goodsType  1-资料包； 2-商品； 3-活动
		let query
		switch (goodsType.value){
			case '1':
				query = Api.getMatOrderList
				break;
			case '2':
				query = Api.getProOrderList
				break;
			case '3':
				query = Api.getActivityList
				break;
		}
		const params = goodsType.value == '2' ? {
			pageNum: dataSource.pageNum,
			orderStatus: currentStatus.value
		} : {
			orderStatus: currentStatus.value,
			lastId: dataSource.lastId,
		}
		query({
			search: searchData.keyWord,
			pageSize: 10,
			...params
		}).then(res => {
			uni.stopPullDownRefresh()
			if (res && res.code == 200) {
				const arr = goodsType.value == '2' ? res.data.rows : res.data.list
				dataSource.list = dataSource.list.concat(arr || [])
				dataSource.hasNextPage = res.data.hasNextPage
				dataSource.lastId = res.data.lastId
				if (goodsType.value == '2') {
					if (dataSource.list.length < res.data.total) {
						dataSource.hasNextPage = true
						dataSource.pageNum ++
					} else {
						dataSource.hasNextPage = false
					}
				}
				
			} else {
				dataSource.hasNextPage = false
			}
		})
	}
	
	const inputChange = (e) => {
		searchData.keyWord = e.detail.value
	}
	
	const searchFn = () => {
		dataSource.hasNextPage = true
		dataSource.list.length = 0
		dataSource.lastId = undefined
		getList()
	}
	const goback = () => {
		uni.navigateBack()
	}
	const gotoMarket = () => {
		if (goodsType.value == '3') {
			uni.switchTab({
				url: '/pages/activity/index'
			})
		} else {
			getApp().globalData.goodsType = goodsType.value
			uni.switchTab({
				url: '/pages/market/index'
			})
		}
	}
	
	const goTop = () => {
		
		scrollTop.value = oldScrollTop.value
		nextTick(() => {
			scrollTop.value = 0
		})
	}
	const scroll = (e) => {
		oldScrollTop.value = e.detail.scrollTop
		if (e.detail.scrollTop > 400) {
			if (goTopShow.value) return
			else goTopShow.value = true
		} else {
			if (!goTopShow.value) return
			else goTopShow.value = false
		}
	}
	
	
	onPullDownRefresh(() => {
		uni.showLoading({
			title: '加载中',
		})
		searchFn()
		setTimeout(() => {
			uni.hideLoading()
		}, 500)
	})
	
	onReachBottom(() => {
		if (dataSource.hasNextPage) getList()
	})
	
	onLoad(() => {
		searchFn()
	})
	
</script>

<style lang="scss" scoped>
	$statusHeight: v-bind('barHeight');
	$barTop: v-bind('barTop');
	$bHeight: v-bind('bHeight');
	$bWidth: v-bind('barWidth');
	.order-list-page{
		width: 100vw;
		// height: 100vh;
		// display: flex;
		// flex-direction: column;
		.sticky{
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			z-index: 9;
		}
		.search-box{
			padding-top: $barTop;
			padding-right: $bWidth;
			padding-bottom: 12rpx;
			display: flex;
			align-items: center;
			background-color: #f2f3f4;
			.arrow-left-icon{
				padding: 0 20rpx;
			}
			.input-box{
				flex: 1;
				height: $bHeight;
				position: relative;
				padding-right: 130rpx;
				background: #FFFFFF;
				border-radius: 200rpx 200rpx 200rpx 200rpx;
				border: 1rpx solid #D8D8D8;
				input{
					display: inline-block;
					box-sizing: border-box;
					height: 100%;
					width: 100%;
					padding: 9rpx 20rpx;
					font-size: 24rpx;
					line-height: $bHeight;
				}
				.btn{
					width: 84rpx;
					height: 45rpx;
					background: $uni-color-primary;
					border-radius: 30rpx;
					text-align: center;
					line-height: 45rpx;
					color: #fff;
					font-size: 30rpx;
					position: absolute;
					right: 10rpx;
					top: 50%;
					transform: translateY(-50%);
				}
				.arrow-clear-icon{
					position: absolute;
					right: 100rpx;
					top: 50%;
					transform: translateY(-50%);
				}
			}
		}
		.tab-box{
			box-shadow: 0rpx 3rpx 8rpx 0rpx rgba(0,0,0,0.16);
			// padding: 0 24rpx;
			background-color: #fff;
		}
		.status-box{
			display: flex;
			height: 31px;
			align-items: center;
			justify-content: space-around;
			border-top: 1rpx solid #e6e6e6;
			>view{
				// height: 44rpx;
				padding: 10rpx 20rpx;
				color: #999;
				font-size: 24rpx;
				line-height: 24rpx;
				&.active{
					background-color: $uni-color-primary;
					color: #fff;
					border-radius: 40rpx;
				}
			}
		}
		.order-list{
			.mt-20{
				height: 20rpx;
				height: env(safe-area-inset-bottom);
			}
			.order-li-nav{
				background: #FFFFFF;
				box-shadow: 0rpx 3rpx 8rpx 0rpx rgba(0,0,0,0.16);
				border-radius: 16rpx 16rpx 16rpx 16rpx;
				padding: 20rpx;
				// margin-top: 20rpx;
				margin: 20rpx 24rpx 0;
			}
		}
		.go-top{
			position: fixed;
			bottom: 200rpx;
			right: 24rpx;
			z-index: 999;
			width: 88rpx;
			height: 88rpx;
			text-align: center;
			display: flex;
			flex-direction: column;
			justify-content: center;
			border-radius: 50%;
			font-size: 22rpx;
			color: #666;
			background: #FFFFFF;
			box-shadow: 0rpx 3rpx 8rpx 0rpx rgba(0,0,0,0.16);
			opacity: 0.7;
		}
		.no-more{
			font-size: 24rpx;
			color: #ccc;
			text-align: center;
			position: relative;
			margin: 24rpx auto;
			width: 210rpx;
			&::after{
				content: '';
				position: absolute;
				width: 50rpx;
				height: 1rpx;
				background-color: #ccc;
				top: 50%;
				right: -50rpx;
				transform: translateY(-50%);
			}
			&::before{
				content: '';
				position: absolute;
				width: 50rpx;
				height: 1rpx;
				background-color: #ccc;
				top: 50%;
				left: -50rpx;
				transform: translateY(-50%);
			}
		}
		.loading-more{
			text-align: center;
			padding-top: 10rpx;
		}
	}
</style>