<template>
	<view class="goods-page">
		<view class="swiper-box" v-if="adCycleList.length > 0">
			<swiper class="top-swiper" indicator-dots indicator-color="rgba(0, 0, 0, .3)"
				indicator-active-color="#FF6633" autoplay>
				<block v-for="item in adCycleList" :key="item">
					<swiper-item class="top-swiper-item">
						<image :src="item.mediaUrl" mode="aspectFit"></image>
					</swiper-item>
				</block>
			</swiper>

		</view>
		<!-- <view class="control-strip">
			<view
				:class="['control-strip-item', (index > 3) ? 't-40' : '']"
				v-for="(item, index) in controlDataProcessed"
				:key="item.id"
				@click="navigationFn(item.id, item.name)"
			>
				<custom-icon
					size="25"
					:type="item.icon"
					:color="item.color"
					:style="{ marginRight: '10rpx' }"
				/>
				<view class="ellipsis">{{ item.name }}</view>
			</view>
		</view> -->
		<view class="goods-list">
			<view class="item" v-for="(item, index) in dataSource.list" :key="item.id">
				<navigator :url="`/pagesMarket/goodsDetail/index?id=${item.id}`" class="li">
					<view class="img-box">
						<image :src="item.firstPic" mode="aspectFill"></image>
						<!-- <image :src="setImgUrl_100(item.firstPic)" mode="aspectFill"></image> -->
					</view>
					<view class="text-box">
						<view class="good-title ellipsis-2">{{item.name}}</view>
						<Price :price="item.marketCurrentcyPrice" size="large" :need-symbol="true" :thousands="true" />
						<view class="tips" v-if="item.saleType === 1">可用<text
								class="number">{{item.salePointPrice}}</text>橙汁兑换</view>
						<view class="tips" v-if="item.saleType === 3">可用<text
								class="number">{{item.salePointPrice}}</text>橙汁 + <text
								class="number">￥{{item.saleCurrencyPrice}}</text>支付</view>
					</view>
				</navigator>
			</view>
			<view v-if="dataSource.hasNextPage" class="loading-more"><van-loading color="#FF6633" /></view>
			<empty v-if="!dataSource.hasNextPage && dataSource.list.length == 0" title="暂无商品" :hasBtn="false"/>
			<view v-if="!dataSource.hasNextPage && dataSource.list.length > 0" class="no-more">没有更多商品了</view>
		</view>
	</view>
</template>

<script setup>
	import {
		computed,
		ref,
		reactive
	} from "vue";
	import Price from '@/components/price/price.vue'
	import { navigationToSpecifiedPage } from "@/utils/common.js"
	import Api from '../api.js'
	import useFileFormat from '@/hooks/useFileFormat.js'
	const { setImgUrl_100 } = useFileFormat()

	const controlData = ref([])
	const adCycleList = ref([])
	const dataSource = reactive({
		pageNum: 1,
		pageSize: 12,
		list: [],
		hasNextPage: true
	})

	const getAdCycleListProduct = () => {
		Api.getAdCycleListProduct({
			type: 1
		}).then(({
			data
		}) => {
			adCycleList.value = data
		})
	}

	const getMarketProductList = () => {
		Api.getMarketProductList({
			categoryPath: '',
			keyword: '',
			pageNum: dataSource.pageNum,
			pageSize: dataSource.pageSize,
		}).then(({
			data
		}) => {
			uni.stopPullDownRefresh()
			if (dataSource.pageNum == 1) {
				dataSource.list = data.rows
			} else {
				dataSource.list = dataSource.list.concat(data.rows)
			}
			if (dataSource.list.length < data.total) {
				dataSource.hasNextPage = true
				dataSource.pageNum ++
			} else {
				dataSource.hasNextPage = false
			}
		})
	}
	
	const getList = () => {
		if (dataSource.hasNextPage) getMarketProductList()
	}
	
	const getCategory = (params) => {
		Api.getCategory(params).then(({ data }) => {
			controlData.value = data
		})
	}
	
	const getCategoryChildren = (params) => Api.getCategoryChildren(params)
	
	const controlDataProcessed = computed(() => {
		const more = [{ name: '全部资料', icon: 'quanbuziliao', color: '#FCBC00', id: controlData.value[0]?.id, }]
		return controlData.value.length <= 7
			? controlData.value : controlData.value.slice(0, 7).concat(more)
	})
	
	const navigationFn = async (id, name) => {
		const { data } = await getCategoryChildren({ type: 1, parentId:id })
		const url = (data.length || name === '全部资料') ?
			`/pagesMarket/list/index?id=${id}&type=1` : `/pagesMarket/specialProjectList/index?type=parent&id=${id}`
		navigationToSpecifiedPage(url)
	}
	
	const reload = () => {
		dataSource.pageNum = 1
		dataSource.hasNextPage = true
		getMarketProductList()
	}
	// getCategory({ type: 1 })
	getAdCycleListProduct()
	getMarketProductList()
	
	defineExpose({
		getList,
		reload
	})
</script>

<style lang="scss" scoped>
	.goods-page {

		// width: 100%;
		// overflow-x: hidden;
		.swiper-box {
			width: 100%;
			height: 100%;
			padding: 0rpx 24rpx 24rpx;
			background-color: #fff;
			margin-bottom: 10rpx;

			.top-swiper {
				box-sizing: border-box;
				width: 100%;
				height: 380rpx;
				border-radius: 16rpx;
				overflow: hidden;

				.top-swiper-item {
					width: 100%;
					height: 100%;

					image,
					img {
						width: 100%;
						height: 100%;
					}
				}
			}
		}
		.control-strip {
			display: flex;
			flex-wrap: wrap;
			margin-top: 30rpx;
			padding: 0rpx 24rpx 24rpx;
			& > view {
				display: flex;
				flex-direction: column;
				align-items: center;
				width: 25%;
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

		.goods-list {
			padding: 20rpx 11rpx 24rpx;

			.item {
				display: inline-block;
				width: 50%;
				// height: 518rpx;
				padding: 10rpx;

				.li {
					width: 100%;
					height: 100%;
					overflow: hidden;
					border-radius: 16rpx;
					box-shadow: 0px 3rpx 8rpx 0px rgba(0, 0, 0, 0.16);

					.img-box {
						width: 100%;
						height: 338rpx;

						image,
						img {
							width: 100%;
							height: 100%;
						}
					}

					.text-box {
						padding: 16rpx 20rpx;
						background-color: #fff;
						.good-title {
							height: 58rpx;
							font-size: 28rpx;
							font-weight: 500;
							color: #666;
							line-height: 29rpx;
							margin-bottom: 16rpx;
						}

						.tips {
							font-size: 24rpx;
							line-height: 24rpx;

							.number {
								color: $uni-color-theme;
							}
						}
					}
				}
			}
		}

		.diy-img {
			width: 600rpx;
		}

		.rich-text {
			width: 100%;
			overflow: hidden;
		}
	}
	.no-more{
		font-size: 24rpx;
		color: #ccc;
		text-align: center;
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
