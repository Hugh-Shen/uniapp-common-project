<template>
	<view class="order-detail-page">
		<view class="count-down-box" v-if="countDownTime > 0 && showCountDown && orderInfo?.orderStatus == 0">
			<text>请在</text>
			<van-count-down :time="countDownTime" format="mm:ss" @finish="timeFinish" />
			<text>分钟内完成支付</text>
		</view>
		<view class="address-box" v-if="goodsType == '2'">
			<view class="left">
				<CustomIcon type="wodedizhi" :size="18"/>
				<!-- <view class="type">默认</view> -->
			</view>
			<view class="center">
				<view class="user-info">
					<text class="mr-36">{{orderInfo?.addrInfo.consignee}}</text>
					<text>{{phoneFormat(orderInfo?.addrInfo.consigneeMobile)}}</text>
				</view>
				<view class="address">{{ orderInfo?.addrInfo.completeAddress }}</view>
			</view>
		</view>
		<view class="goods-box">
			<navigator :url="navigatorUrl" open-type="reLaunch" class="order-li-nav">
				<van-skeleton row="3" :loading="loading" >
					<material-item v-if="goodsType == '1'" :item="orderInfo" :goodsType="goodsType"></material-item>
					<goods-item v-if="goodsType == '2'" :item="orderInfo" :goodsType="goodsType"></goods-item>
					<activity-item v-if="goodsType == '3'" :item="orderInfo" :goodsType="goodsType" :showPrice="false"></activity-item>
				</van-skeleton>
			</navigator>
		</view>
		<view class="contact-box">
			<view class="fcq-clickable" @click="gotoContact">
				<CustomIcon type="kefuzhongxin" :size="18"/>
				<text class="ml-12">联系方橙君</text>
			</view>
			<view class="fcq-clickable" @click="call">
				<CustomIcon type="dianhua" :size="18"/>
				<text class="ml-12">拨打电话</text>
			</view>
		</view>
			
		<view class="order-info">
			<van-skeleton row="8" :loading="loading" >
				<view class="mb-50">
					<text class="label">订单编号：</text>
					<text>{{orderInfo?.orderNo}}</text>
					<text class="copy" @click="copy(orderInfo?.orderNo, '订单编号')">复制</text>
				</view>
				<view class="mb-50">
					<text class="label">下单时间：</text>
					<text>{{dayjs(orderInfo?.orderTime).format('YYYY-MM-DD HH:mm:ss')}}</text>
				</view>
				<view class="mb-50">
					<text class="label">支付方式：</text>
					<text v-if="goodsType == '3'">{{paymentTypeText(orderInfo?.actPaymentType) }}</text>
					<text v-else>{{paymentTypeText(orderInfo?.paymentType)}}</text>
				</view>
				<view class="mb-50" v-if="[0, 1, 2, 3, 4].includes(orderInfo?.orderStatus)">
					<text class="label">支付时间：</text>
					<text v-if="orderInfo?.paymentTime">{{dayjs(orderInfo?.paymentTime).format('YYYY-MM-DD HH:mm:ss')}}</text>
					<text v-else>--</text>
				</view>
				<view class="mb-50" v-else>
					<text class="label">取消时间：</text>
					<text>{{dayjs(orderInfo?.expireTime).format('YYYY-MM-DD HH:mm:ss')}}</text>
				</view>
				<!-- new info -->
				<template v-if="goodsType === '3'">
					<view class="mb-50">
						<text class="label">姓名：</text>
						<text>{{orderInfo?.reportUserName}}</text>
					</view>
					<view class="mb-50">
						<text class="label">公司名称：</text>
						<text>{{orderInfo?.reportCompanyName}}</text>
					</view>
					<view class="mb-50">
						<text class="label">所属职位：</text>
						<text>{{orderInfo?.reportJobName}}</text>
					</view>
				</template>
				<template v-if="orderInfo?.logisticsNo">
					<view class="mb-50">
						<text class="label">物流公司：</text>
						<text>{{ orderInfo?.deliveryCompanyName }}</text>
					</view>
					<view class="mb-50">
						<text class="label">物流单号：</text>
						<text>{{ orderInfo?.logisticsNo }}</text>
						<text class="copy" @click="copy(orderInfo?.logisticsNo, '物流单号')">复制</text>
					</view>
					<view>
						<text class="label">发货时间：</text>
						<text>{{ orderInfo?.shippedTime }}</text>
					</view>
				</template>
			</van-skeleton>
		</view>
		<view class="price-box clearfix">
			<template v-if="['1', '2'].includes(goodsType)">
				<view class="mb-20">
					<text class="label">商品总额</text>
					<text><text class="text-main">{{ orderInfo?.shouldPayPoint }}</text> 橙汁</text>
					<!-- <Price :price="59" size="small" :need-symbol="true" :thousands="true" color="#000" /> -->
				</view>
				<view class="mb-20">
					<text class="label">橙汁</text>
					<text class="text-main">-{{ orderInfo?.actPayPoint }}橙汁</text>
				</view>
				<view class="paid">
					<text>实付：</text>
					<text class="text-main">{{ orderInfo?.actPayPoint }}橙汁</text>
				</view>
				<view class="line"></view>
				<view class="btn fcq-clickable" @click="exchangeAgain">{{goodsType == '2'?'再次兑换':'免费下载并发送'}}</view>
			</template>
			<template v-if="['3'].includes(goodsType)">
				<view class="mb-20">
					<text class="label">活动费用</text>
					<Price :price="orderInfo?.orderGoodsVO?.salesCurrencyPrice" size="small" :need-symbol="true" :thousands="true" color="#000" />
				</view>
				<view class="paid">
					<text>{{orderInfo?.orderStatus?'实付':'待付款'}}：</text>
					<text v-if="orderInfo?.actPaymentType == 1" class="text-main">{{ orderInfo?.actPayPoint }}橙汁</text>
					<template v-else>
						<Price :price="orderInfo?.orderStatus == 0 ? orderInfo?.tobePaiedAmount : orderInfo?.actPayAmount" size="small" :need-symbol="true" :thousands="true" color="#000" />
					</template>
					<!-- <text v-else class="text-main">
					</text> -->
				</view>
			</template>
		</view>
		<view class="pall-24" v-if="countDownTime > 0 && orderInfo?.orderStatus == 0 && showCountDown">
			<van-button
				type="default"
				round
				color="#FF9933"
				block
				:custom-style="customStyle"
				@click.stop="payOrder"
			>立即支付</van-button>
		</view>
	</view>
</template>

<script setup>
	import { ref, computed } from 'vue'
	import CustomIcon from "@/components/custom-icon/custom-icon.vue"
	import { onLoad } from '@dcloudio/uni-app';
	import Price from '@/components/price/price.vue';
	import materialItem from './components/materialItem.vue'
	import goodsItem from './components/goodsItem.vue'
	import activityItem from './components/activityItem.vue'
	import { contact_info } from "@/config/default.js"
	import Api from './api.js'
	import { miniProgram } from "@/utils/login.js"
	import { getcurrentPageOption, shareFileFn } from "@/utils/common.js"
	import dayjs from '@/utils/dayjs.min.js';
	import useFileFormat from '@/hooks/useFileFormat.js'
	const { setFileFormat, setImgUrl_100 } = useFileFormat()
	
	const downloadFile = (params) => Api.downloadFile(params)
	
	const orderInfo = ref(null)
	const goodsType = ref('') // 1-资料包； 2-好货
	const orderNo = ref('')
	const loading = ref(true)
	const customStyle = 'height: 72rpx;'
	const showCountDown = ref(true)
	const paymentType = ref([
		{label: '橙汁支付', value: 1},
		{label: '现金支付', value: 2},
		{label: '橙汁加现金支付', value: 3},
		{label: '免费兑换福利', value: 4},
		{label: '免费', value: 5},
	])
	const orderStatus = ref([
		{label: '待付款', value: 0},
		{label: '已付款', value: 1},
		{label: '待发货', value: 2},
		{label: '已发货', value: 3},
		{label: '已收货', value: 4},
		{label: '已取消', value: 5},
		{label: '已取消', value: 6},
	])
	const paymentTypeText = computed(() => {
		return (status) => {
			let obj = paymentType.value.find(item => item.value == status)
			return obj?.label
		}
	})
	
	
	const phoneFormat = computed(() => {
		return (tel) => {
			return tel?.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2")
		}
	})
	
	const navigatorUrl = computed(() => {
		if (goodsType.value == '2') {
			return `/pagesMarket/goodsDetail/index?id=${orderInfo.value?.goodsInfo[0]?.goodsId}`
		} else if (goodsType.value == '1') {
			return `/pagesMarket/datagramDetail/index?id=${orderInfo.value?.goodsInfo[0]?.goodsId}`
		} else {
			return `/pagesActivity/details/index?id=${orderInfo.value?.orderGoodsVO?.goodsId}`
		}
	})
	
	const countDownTime = computed(() => {
		if ( !orderInfo.value) return 0
		let ms = dayjs(orderInfo.value.expireTime).valueOf() - dayjs(orderInfo.value.serverTime).valueOf()
		if (ms && ms > 0) return ms
		else return 0
	})
	const gotoContact = () => {
		uni.navigateTo({
			url: '/pagesMessage/contact/index'
		})
	}
	const call = () => {
		uni.makePhoneCall({
			phoneNumber: contact_info.phone
		})
	}
	
	const copy = (data, type) => {
		uni.setClipboardData({
			data,
			success: function () {
				uni.showToast({
					title: `${type}已复制~`,
					icon: 'none'
				})
			}
		})
	}
	
	const exchangeAgain = async () => {
		if (goodsType.value !== '2') {
			uni.showLoading({
				title: '下载中...',
				mask: true,
			})
			downloadFile({
				id: orderInfo.value.goodsInfo[0].goodsId,
				orderNo: orderInfo.value.orderNo,
			}).then(({ data, code, msg }) => {
				if (code !== 200) {
					return uni.showToast({
						title: msg,
						icon: 'error',
					})
				}
				shareFileFn({
					url: data.fileUrl,
					fileName: `${data.fileName}.${data.type}`,
				})
			}).finally(() => {
				uni.hideLoading()
			})
			return
		}
		uni.reLaunch({
			url: navigatorUrl.value
		})
	}
	
	const getDetail = () => {
		loading.value = true
		let query
		switch (goodsType.value){
			case '1':
				query = Api.getMatOrderDetail
				break;
			case '2':
				query = Api.getProOrderDetail
				break;
			case '3':
				query = Api.getActivityDetail
				break;
		}
		let params = goodsType.value == '2' ? {
			orderNo: orderNo.value
		} : orderNo.value
		query(params).then(res => {
			console.log(res)
			loading.value = false
			if (res.code == 200) {
				orderInfo.value = res.data
				let obj = orderStatus.value.find(item => item.value == res.data.orderStatus)
				uni.setNavigationBarTitle({
					title: obj?.label
				})
			}
		})
	}
	
	const payOrder = async () => {
		uni.showLoading({
			title: '正在支付'
		})
		const { openid } = await miniProgram()
		const res = await Api.activityPay({
			orderNo: orderInfo.value.orderNo,
			appletOpenId: openid,
		})
		uni.hideLoading()
		if (res.code == 200) {
			uni.requestPayment({
				"appId": res.data.jsSign.appId,
				"timeStamp":res.data.jsSign.timeStamp,
				"nonceStr": res.data.jsSign.nonceStr,
				"package": res.data.jsSign.jspackage,
				"signType": res.data.jsSign.signType,
				"paySign": res.data.jsSign.paySign,
				"success":function(res){
					console.log(res)
					getDetail()
				},
				"fail":(res) => {
					console.log(res)
				},
				"complete":(res) => {
					console.log(res)
				}
			})
		} else {
			uni.showToast({
				icon: 'none',
				title: res.data.errorMsg
			})
		}
	}
	const timeFinish = () => {
		showCountDown.value = false
		getDetail()
	}
	onLoad(() => {
		const options = getcurrentPageOption()
		goodsType.value = options.goodsType
		orderNo.value = options.orderNo
		getDetail()
	})
</script>

<style lang="scss" scoped>
	.order-detail-page{
		padding-bottom: env(safe-area-inset-bottom);
		.count-down-box{
			width: 100%;
			height: 75rpx;
			background-color: $uni-color-theme;
			font-size: 36rpx;
			font-weight: 500;
			color: #FFFFFF;
			display: flex;
			align-items: center;
			justify-content: center;
			--count-down-text-color: #fff !important;
			--count-down-font-size: 36rpx;
		}
		.address-box{
			padding: 30rpx;
			height: 176rpx;
			background-color: #fff;
			border-radius: 16rpx;
			display: flex;
			align-items: center;
			margin-bottom: 20rpx;
			.no-address{
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: center;
				.text{
					font-size: 28rpx;
					font-weight: 500;
					color: #1A1A1A;
					line-height: 28rpx;
					margin-left: 10rpx;
				}
			}
			.left{
				width: 64rpx;
				display: flex;
				flex-direction: column;
				align-items: center;
				.type{
					width: 64rpx;
					height: 32rpx;
					color: #fff;
					font-size: 22rpx;
					text-align: center;
					line-height: 32rpx;
					background-color: $uni-color-theme;
					border-radius: 16rpx;
					margin-top: 6rpx;
				}
			}
			.center{
				flex: 1;
				padding: 0 20rpx;
				.user-info{
					font-size: 28rpx;
					font-weight: 500;
					color: #1a1a1a;
					line-height: 28rpx;
					margin-bottom: 7rpx;
				}
				.address{
					width: 100%;
					// height: 67rpx;
					font-size: 24rpx;
					color: #767676;
				}
			}
			
		}
		.goods-box{
			.order-li-nav{
				background: #FFFFFF;
				border-radius: 16rpx 16rpx 16rpx 16rpx;
				padding: 20rpx;
				margin: 20rpx 0;
			}
		}
		.contact-box{
			display: flex;
			align-items: center;
			border-radius: 16rpx;
			background-color: #fff;
			position: relative;
			margin-bottom: 20rpx;
			>view{
				width: 50%;
				height: 88rpx;
				font-size: 28rpx;
				font-weight: 500;
				color: #666666;
				display: flex;
				align-items: center;
				justify-content: center;
				border-radius: 16rpx;
			}
			&::after{
				content: '';
				width: 1rpx;
				height: 48rpx;
				background-color: #d8d8d8;
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
			}
		}
		.order-info{
			font-size: 28rpx;
			line-height: 28rpx;
			color: #000;
			padding: 30rpx 20rpx;
			background-color: #fff;
			border-radius: 16rpx;
			margin-bottom: 20rpx;
			.label{
				color: #666;
			}
			.copy{
				display: inline-block;
				width: 68rpx;
				height: 32rpx;
				background: #EEEEEE;
				text-align: center;
				line-height: 32rpx;
				font-size: 24rpx;
				border-radius: 16rpx;
				margin-left: 24rpx;
			}
		}
		.price-box{
			font-size: 28rpx;
			line-height: 28rpx;
			color: #000;
			padding: 30rpx 20rpx;
			background-color: #fff;
			border-radius: 16rpx;
			> .mb-20{
				display: flex;
				justify-content: space-between;
			}
			.paid{
				text-align: right;
			}
			.line{
				border-bottom: 1rpx solid #D8D8D8;
				margin-top: 36rpx;
				margin-bottom: 24rpx;
			}
			.btn{
				float: right;
				width: 224rpx;
				height: 72rpx;
				border-radius: 124rpx 124rpx 124rpx 124rpx;
				border: 2rpx solid $uni-color-primary;
				text-align: center;
				line-height: 72rpx;
				color: $uni-color-primary;
				background-color: #fff;
			}
			.label{
				color: #666;
			}
		}
	}
</style>