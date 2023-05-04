<template>
	<view class="order-li">
		<view class="li-top">
			<view class="shop-name">
				<image src="/static/logo.png" mode="" />
				<text>方程圈</text>
			</view>
			<view class="order-status" v-if="props.showPrice">{{orderStatusText(props.item?.orderStatus)}}</view>
		</view>
		<view class="li-bottom">
			<view class="img-box">
					<image :src="setImgUrl_100(props.item?.orderGoodsVO?.firstPic)" mode="aspectFill" />
			</view>
			<view class="goods-info">
				<view class="good-name ellipsis">{{props.item?.orderGoodsVO?.goodsName}}</view>
				<view class="time">{{useTime({beginTime: props.item?.orderGoodsVO?.beginTime, endTime: props.item?.orderGoodsVO?.endTime})}}</view>
				<view class="sub-title ellipsis-2">{{props.item?.orderGoodsVO?.detailAddr}}</view>
				<view class="price" v-if="props.showPrice">
					<template v-if="props.item?.actPaymentType == 1">
						<text>实付：</text>
						<text class="text-main">{{props.item?.actPayPoint}}橙汁</text>
					</template>
					<template v-else-if="props.item?.actPaymentType == 2">
						<template v-if="props.item?.orderStatus">
							<text>实付：</text>
							<Price :price="props.item?.actPayAmount" size="small" :need-symbol="true" :thousands="true" color="#000" />
						</template>
						<template v-else>
							<text>待付款：</text>
							<Price :price="props.item?.tobePaiedAmount" size="small" :need-symbol="true" :thousands="true" color="#000" />
						</template>
					</template>
					<!-- <template v-else-if="props.item?.actPaymentType == 3">
						<text>实付：</text>
						<text class="text-main">{{props.item?.actPayPoint}}橙汁</text>
						<text>+</text>
						<Price :price="59" size="small" :need-symbol="true" :thousands="true" color="#000" />
					</template> -->
					<template v-else-if="props.item?.actPaymentType == 4">
						<text>兑换福利</text>
					</template>
					<template v-else-if="props.item?.actPaymentType == 5">
						<text>免费</text>
					</template>
					
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { reactive, ref, nextTick, computed } from 'vue';
	import Price from '@/components/price/price.vue';
	import useTime from '@/hooks/useTime.js'
	import useFileFormat from '@/hooks/useFileFormat.js'
	const { setFileFormat, setImgUrl_100 } = useFileFormat()
	
	const props = defineProps({
		item: {
			type: Object,
			default: {}
		},
		goodsType: {
			type: String,
			default: '1'
		},
		url: {
			type: String,
			default: ''
		},
		showPrice: {
			type: Boolean,
			default: true
		}
	})
	
	const orderStatus = ref([
		{label: '待付款', value: 0},
		{label: '已付款', value: 1},
		{label: '待发货', value: 2},
		{label: '已发货', value: 3},
		{label: '已收货', value: 4},
		{label: '已取消', value: 5},
		{label: '已取消', value: 6},
	])
	const orderStatusText = computed(() => {
		return (status) => {
			let obj = orderStatus.value.find(item => item.value == status)
			return obj?.label
		}
	})
</script>

<style lang="scss" scoped>
	.order-li{
		width: 100%;
		.li-top{
			display: flex;
			align-items: center;
			justify-content: space-between;
			font-size: 28rpx;
			font-weight: 500;
			line-height: 28rpx;
			margin-bottom: 14rpx;
			.shop-name{
				color: #000000;
				display: flex;
				align-items: center;
				image, img{
					width: 32rpx;
					height: 32rpx;
					margin-right: 4rpx;
				}
			}
			.order-status{
				color: $uni-color-primary;
			}
		}
		.li-bottom{
			display: flex;
			.img-box{
				width: 160rpx;
				height: 160rpx;
				margin-right: 16rpx;
				border-radius: 16rpx;
				border: 1rpx solid #eee;
				overflow: hidden;
				position: relative;
				image, img{
					width: 100%;
					height: 100%;
					&.img-icon{
						position: absolute;
						width: 73rpx;
						height: auto;
						bottom: 3rpx;
						right: 6rpx;
					}
				}
			}
			.goods-info{
				flex: 1;
				width: 0;
				position: relative;
				.good-name{
					font-size: 28rpx;
					font-weight: 500;
					color: #000000;
					// line-height: 28rpx;
					margin-bottom: 12rpx;
				}
				.time{
					font-size: 22rpx;
					line-height: 30rpx;
					color: #666;
				}
				.sub-title{
					font-size: 22rpx;
					line-height: 30rpx;
					height: 60rpx;
					color: #666;
					margin-bottom: 24rpx;
				}
				.number{
					position: absolute;
					top: 2rpx;
					right: 0;
					font-size: 24rpx;
					color: #666;
				}
				.price{
					font-size: 28rpx;
					// line-height: 28rpx;
					text-align: right;
				}
			}
		}
	}
</style>