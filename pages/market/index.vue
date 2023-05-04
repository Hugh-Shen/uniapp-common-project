<template>
	<view class="market-page">
		<view class="page-header">
			<nav-bar>
				<view class="nav-bar-content">
					<view class="title">橙市</view>
					<search @click="navigationToSpecifiedPage('/pagesMarket/search/index')"></search>
				</view>
			</nav-bar>
			<van-tabs title-active-color="#FF6633" :active="goodsType" @change="tabsChange">
				<van-tab title="橙文馆" name="1">
					<!-- <DataPackage /> -->
				</van-tab>
				<van-tab title="橙品铺" name="2">
					<!-- <scroll-view class="scroll" scroll-y="true">
						<Goods/>
					</scroll-view> -->
				</van-tab>
			</van-tabs>
			
		</view>
		<view class="page-content">
			<DataPackage ref="dataPackageRef" v-if="goodsType === '1'" />
			<Goods ref="goodsRef" v-else/>
		</view>
		<view class="go-top" :style="{ display: showTop ? 'flex' : 'none' }" @click="handleClickToTop">
			<van-icon name="back-top" size="20" />
			<view class="">顶部</view>
		</view>
	</view>
</template>

<script setup>
	import { onBeforeMount, onMounted, reactive, ref } from "vue"
	import { onShow, onPageScroll, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app'
	import { navigationToSpecifiedPage } from '@/utils/common.js'
	import search from '@/components/search/search.vue'
	import DataPackage from "./components/dataPackage.vue"
	import Goods from './components/goods.vue'
	
	const { statusBar: { height, top } } = getApp().globalData
	const barHeight = `${height + 10}px`
	const statusTop = `${top - 5}px`
	
	const showTop = ref(false)
	const goodsType = ref('1') // 1-资料包； 2-商品
	const dataPackageRef = ref(null)
	const goodsRef = ref(null)
	const initTabs = ref(false)
	
	const tabsChange = (e) => {
		goodsType.value = e.detail.name
		getApp().globalData.goodsType = e.detail.name
	}
	const handleClickToTop = () => {
		uni.pageScrollTo({
			scrollTop: 0,
			duration: 300
		})
	}
	
	
	onBeforeMount(() => {
		initTabs.value = true
	})
	onPageScroll((e) => {
		if (e.scrollTop > 400) {
			showTop.value = true
		} else {
			showTop.value = false
		}
	})
	onReachBottom(() => {
		if (goodsType.value == '1') {
			dataPackageRef.value.getList()
		} else {
			goodsRef.value.getList()
		}
	})
	onPullDownRefresh(() => {
		uni.showLoading({
			title: '加载中',
		})
		if (goodsType.value == '1') {
			dataPackageRef.value.reload()
		} else {
			goodsRef.value.reload()
		}
		setTimeout(() => {
			uni.hideLoading()
		}, 500)
	})
	onShow(() => {
		goodsType.value = getApp().globalData.goodsType
	})
</script>

<style lang="scss" scoped>
	$statusHeight: v-bind('barHeight');
	$statusTop: v-bind('statusTop');
	.market-page{
		padding-top: calc($statusHeight + $statusTop + 44px);
		// background-color: #fff;
		min-height: 100vh;
		.page-header{
			// padding-top: $statusTop;
			position: fixed;
			width: 100%;
			top: 0;
			right: 0;
			background-color: #f8f8f8;
			z-index: 99;
			box-shadow: 0rpx 3rpx 8rpx 0rpx rgba(0,0,0,0.16);
			.nav-bar-content {
				display: flex;
				align-items: center;
				width: 100%;
				height: 100%;
				padding: 0 22rpx;
				font-size: 36rpx;
				& > .title {
					 margin-right: 20rpx;
				}
			}
		}
	}
	.go-top{
		position: fixed;
		bottom: 100rpx;
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
	// .market {
	// 	width: 100vw;
	// 	height: 100vh;
	// 	padding-top: $statusTop;
	// 	font-size: 24rpx;
	// 	.nav-bar-content {
	// 		display: flex;
	// 		align-items: center;
	// 		width: 100%;
	// 		height: $statusHeight;
	// 		padding: 0 22rpx;
	// 		font-size: 36rpx;
	// 		& > .title {
	// 			 margin-right: 20rpx;
	// 		}
	// 	}
	// 	.scroll {
	// 		height: calc(100vh - $statusHeight - $statusTop - 44px);
	// 	}
	// }
</style>