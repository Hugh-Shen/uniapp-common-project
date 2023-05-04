<template>
	<view class="order-li">
		<view class="li-top">
			<view class="shop-name">
				<image src="/static/logo.png" mode="" />
				<text>方程圈</text>
			</view>
			<view class="order-status">{{orderStatusText(props.item?.orderStatus)}}</view>
		</view>
		<view class="li-bottom">
			<view class="img-box">
				<image :src="props.item?.goodsInfo[0].firstPic" mode="aspectFill" />
			</view>
			<view class="goods-info">
				<view class="good-name ellipsis">{{props.item?.goodsInfo[0].goodsName}}</view>
				<view class="sub-title ellipsis-2"></view>
				<view class="number">x{{props.item?.goodsInfo[0].goodsNum}}</view>
				<view class="price">
					<template v-if="props.item?.paymentType == 1">
						<text>实付：</text>
						<text class="text-main">{{props.item?.actPayPoint}}橙汁</text>
					</template>
					<template v-if="props.item?.paymentType == 2">
						<text>实付：</text>
						<Price :price="59" size="small" :need-symbol="true" :thousands="true" color="#000" />
					</template>
					<template v-if="props.item?.paymentType == 3">
						<text>实付：</text>
						<text class="text-main">{{props.item?.actPayPoint}}橙汁</text>
						<text>+</text>
						<Price :price="59" size="small" :need-symbol="true" :thousands="true" color="#000" />
					</template>
					<template v-if="props.item?.paymentType == 4">
						<text>兑换福利</text>
					</template>
					
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { reactive, ref, nextTick, computed } from 'vue';
	import Price from '@/components/price/price.vue';
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
		}
	})
	
	const orderStatus = ref([
		{label: '待支付', value: 0},
		{label: '已付款', value: 1},
		{label: '待发货', value: 2},
		{label: '已发货', value: 3},
		{label: '已收货', value: 4},
		{label: '订单取消', value: 5},
		{label: '订单取消', value: 6},
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
		// height: 240rpx;
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
					padding-right: 100rpx;
					font-size: 28rpx;
					font-weight: 500;
					color: #000000;
					// line-height: 28rpx;
					margin-bottom: 12rpx;
				}
				.sub-title{
					font-size: 22rpx;
					padding-right: 100rpx;
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