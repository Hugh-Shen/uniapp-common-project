<template>
	<view class="data-package">
		<view class="data-package-header">
			<swiper v-if="slideData.length > 0" class="swiper" indicator-dots indicator-color="#fff" indicator-active-color="#FF9933">
				<swiper-item v-for="item in slideData" :key="item.mediaUrl">
					<view class="swiper-item">
						<image :src="item.mediaUrl" mode="aspectFill" />
					</view>
				</swiper-item>
			</swiper>
			<view class="control-strip">
				<view
					:class="['control-strip-item', (index > 4) ? 't-40' : '']"
					v-for="(item, index) in controlDataProcessed"
					:key="item.id"
					@click="navigationFn(item.id, item.name)"
				>
					<custom-icon
						size="32"
						:type="item.icon || 'queshengtubiao'"
						:color="item.iconColor || '#fcbc00'"
					/>
					<view class="ellipsis">{{ item.name }}</view>
				</view>
			</view>
		</view>
		<view class="list">
			<card
				v-for="item in datagramList"
				:key="item.id"
				:styleData="initStyle"
				:title="item.name"
				:picture="item.coverPicUrl"
				:integral="item.salePointPrice"
				:price="item.saleCurrencyPrice"
				:total="item.downloadCount"
				:saleType="item.saleType"
				:fileType="item.type"
				@click="navigationToSpecifiedPage(`/pagesMarket/datagramDetail/index?id=${item.id || 0}`)"
			/>
			<view v-if="allowRequestForDatagram" class="loading-more"><van-loading color="#FF6633" /></view>
			<view class="no-more" v-if="!allowRequestForDatagram">没有更多资料包了</view>
		</view>
	</view>
</template>

<script setup>
	import { ref, getCurrentInstance, nextTick, computed } from 'vue'
	import { navigationToSpecifiedPage, throttle, getElement } from "@/utils/common.js"
	import api from '../api.js'
	
	
	const { statusBar: { height, top } } = getApp().globalData
	const barHeight = `${height + 10}px`
	const statusTop = `${top - 5}px`
	const initStyle= { marginBottom: '20rpx' }
	const { proxy } = getCurrentInstance()
	let intermediateVariable = 0
	
	
	/* 数据请求 */
	const getCategory = (params) => {
		api.getCategory(params).then(({ data }) => {
			controlData.value = data
		})
	}
	const getCategoryChildren = (params) => api.getCategoryChildren(params)
	const getSlideInDatagram = () => {
		api.getSlideInDatagram().then(({ data }) => {
			slideData.value = data
		})
	}
	const getDataDatagramList = (params) => {
		if (allowRequestForDatagram.value) {
			api.getDataDatagramList(params).then(({ data }) => {
				uni.stopPullDownRefresh()
				const { pageNum, pageSize } = params
				const { total, rows } = data
				if ((pageNum * pageSize) >=  total) {
					allowRequestForDatagram.value = false
				}
				datagramList.value = pageNum === 1 ? rows : datagramList.value.concat(rows)
				datagramConfig.value.pageNum += 1
			})
		}
	}
	
	
	const controlData = ref([])
	const slideData = ref([])
	const showTop = ref(false)
	const scrollTop = ref(0)
	const allowRequestForDatagram = ref(true)
	const datagramList = ref([])
	const datagramConfig = ref({
		pageNum: 1,
		pageSize: 10,
	})
	
	const controlDataProcessed = computed(() => {
		const more = [{ name: '全部资料', icon: 'quanbuziliao', color: '#FCBC00', id: controlData.value[0]?.id, }]
		return controlData.value.length <= 9
			? controlData.value : controlData.value.slice(0, 9).concat(more)
	})
	
	
	const getList = () => {
		getDataDatagramList(datagramConfig.value)
	}
	const reload = () => {
		datagramConfig.value.pageNum = 1
		allowRequestForDatagram.value = true
		getDataDatagramList(datagramConfig.value)
	}
	const navigationFn = async (id, name) => {
		const { data } = await getCategoryChildren({ type: 2, parentId:id })
		const url = (data.length || name === '全部资料') ?
			`/pagesMarket/list/index?id=${id}&type=2` : `/pagesMarket/specialProjectList/index?type=parent&id=${id}`
		navigationToSpecifiedPage(url)
	}
	
	defineExpose({
		getList,
		reload
	})
	
	getCategory({ type: 2 })
	getSlideInDatagram()
	getDataDatagramList(datagramConfig.value)
</script>

<style lang="scss" scoped>
	$statusHeight: v-bind('barHeight');
	$statusTop: v-bind('statusTop');
	
	.data-package {
		width: 100%;
		// height: calc(100vh - $statusHeight - $statusTop - 44px);
		font-size: 24rpx;
		position: relative;
		&-header {
			padding: 24rpx 24rpx;
			background-color: #fff;
			.swiper {
				height: 394rpx;
				&-item {
					width: 100%;
					height: 100%;
					border-radius: 16rpx;
					overflow: hidden;
					& > image {
						width: 100%;
						height: 100%;
					}
				}
			}
			.control-strip {
				display: flex;
				flex-wrap: wrap;
				margin-top: 30rpx;
				& > view {
					display: flex;
					flex-direction: column;
					align-items: center;
					width: 20%;
				}
				&-item {
					& > view {
						width: 100%;
						padding: 0 10rpx;
						margin-top: 10rpx;
						text-align: center;
					}
				}
			}
		}
		.list {
			padding: 24rpx;
		}
		.top {
			position: fixed;
			right: 24rpx;
			bottom: 30rpx;
			width: 88rpx;
			height: 88rpx;
			border-radius: 50%;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			font-size: 22rpx;
			color: $uni-text-color-sub;
			box-shadow: 0rpx 3rpx 8rpx 0rpx rgba(0, 0, 0, 0.16);
			opacity: 0.7;
		}
	}
	.no-more{
		font-size: 24rpx;
		color: #ccc;
		text-align: center;
		// padding-top: 10rpx;
		position: relative;
		margin: 0 auto;
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
	.t-40 {
		margin-top: 40rpx;
	}
</style>