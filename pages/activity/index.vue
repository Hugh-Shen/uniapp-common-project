<template>
	<view class="activity">
		<view class="page-header">
			<nav-bar>
				<view class="nav-bar-content">
					<search
						label="如何进行高效招聘"
						@click="navigationToSpecifiedPage('/pagesMarket/search/index')"
					/>
				</view>
			</nav-bar>
		</view>
		<swiper class="swiper" autoplay circular indicator-dots indicator-color="#fff" indicator-active-color="#FF9933">
			<swiper-item v-for="item in adCycleList" :key="item">
				<view class="swiper-item">
					<image :src="item.mediaUrl" mode="aspectFill" />
				</view>
			</swiper-item>
		</swiper>
		<van-sticky :offset-top="offsetTop">
			<van-tabs
				lazy-render
				title-active-color="#FF6633"
				:active="configParams.status"
				@change="handleTabChange"
			>
				<van-tab v-for="item in tabsConfig" :key="item.title" :title="item.title" :name="item.name"></van-tab>
			</van-tabs>
		</van-sticky>
		<view class="tabs-content-view">
			<Card
				class="card"
				v-for="(item, index) in configParams.list"
				:key="index"
				:coverPicture="item.firstPic"
				:title="item.name"
				:site="item.cityName"
				:time="useTime({ beginTime: item.beginTime, endTime: item.endTime })"
				:text="signUpText"
				@click="navigationToSpecifiedPage(`/pagesActivity/details/index?id=${item.id}`)"
			/>
			<view v-if="configParams.hasNextPage" class="loading-more"><van-loading color="#FF6633" /></view>
			<empty
				v-if="!configParams.hasNextPage && configParams.list.length == 0"
				title="暂无活动，敬请期待~"
				:hasBtn="false"
			/>
			<view class="not-more" v-if="!configParams.hasNextPage && configParams.list.length > 0">——没有更多活动了——</view>
		</view>
	</view>
</template>

<script setup>
	import { computed, onBeforeMount, ref, reactive } from 'vue'
	import { onPageScroll, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app'
	import { navigationToSpecifiedPage } from '@/utils/common.js'
	import { ACTIVITY_STATUS } from '@/config/default.js'
	import Card from './components/Card.vue'
	import useTime from '@/hooks/useTime.js'
	import api from './api.js'
	
	const { statusBar: { height, top } } = getApp().globalData
	const barHeight = `${height + 10}px`
	const statusTop = `${top - 5}px`
	const offsetTop = height + top + 9
	const tabsConfig = [
		{
			title: '待开始',
			name: 1,
		},
		{
			title: '进行中',
			name: 2,
		},
		{
			title: '已结束',
			name: 3,
		},
	]
	
	/* 数据请求 */
	const getActivityList = () => {
		api.getActivityList({
			status: configParams.status,
			pageNum: configParams.pageNum,
			pageSize: configParams.pageSize
		}).then(({ data }) => {
			configParams.list = configParams.pageNum <= 1 ? (data.rows || []) : configParams.list.concat(data.rows)
			if (configParams.list.length < data.total) {
				configParams.hasNextPage = true
				configParams.pageNum ++
			} else {
				configParams.hasNextPage = false
			}
			
			uni.stopPullDownRefresh()
		})
	}
	const getAdCycleList = () => {
		api.getAdCycleList({
			type: 1
		}).then(({ data }) => {
			adCycleList.value = data
		})
	}
	
	const adCycleList = ref([])
	const activeList = ref([])
	const configParams = reactive({
		status: 1, // 1待开始，2进行中，3已结束
		list: [],
		pageNum: 1,
		pageSize: 10,
		hasNextPage: true // 是否还有下一页
	})
	
	const signUpText = computed(() => {
		const active = configParams.status
		return ACTIVITY_STATUS[active]
	})
	
	const handleTabChange = (curTab) => {
		const { name } = curTab.detail
		configParams.status = name
		configParams.pageNum = 1
		configParams.hasNextPage = true
		getActivityList()
	}
	
	
	onBeforeMount(() => {
		getAdCycleList()
		getActivityList()
	})
	onReachBottom(() => {
		if (configParams.hasNextPage) {
			getActivityList()
		}
	})
	onPullDownRefresh(() => {
		uni.showLoading({
			title: '加载中',
		})
		configParams.pageNum = 1
		configParams.hasNextPage = true
		getActivityList()
		setTimeout(() => {
			uni.hideLoading()
		}, 500)
	})
</script>

<style lang="scss" scoped>
	$statusHeight: v-bind('barHeight');
	$statusTop: v-bind('statusTop');
	.activity {
		padding-top: calc($statusHeight + $statusTop);
		.page-header{
			position: fixed;
			width: 100%;
			top: 0;
			right: 0;
			background-color: #f8f8f8;
			z-index: 120;
		}
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
		.swiper {
			height: 434rpx;
			padding: 20rpx 24rpx;
			background-color: #fff;
			&-item {
				height: 100%;
				border-radius: 16rpx;
				overflow: hidden;
				& > image {
					width: 100%;
					height: 100%;
				}
			}
		}
		.tabs-content-view {
			padding-bottom: 20px;
			.not-more {
				text-align: center;
				color: $uni-color-grey;
			}
		}
		.loading-more{
			text-align: center;
			padding-top: 10rpx;
		}
	}
	:deep(.van-tabs__wrap) {
		// box-shadow: 0rpx 2rpx 0rpx 1rpx #E6E6E6 !important;
		box-shadow: 0rpx 3rpx 8rpx 0rpx rgba(0,0,0,0.16);
	}
	:deep(.card) {
		margin-bottom: 20rpx;
	}
</style>