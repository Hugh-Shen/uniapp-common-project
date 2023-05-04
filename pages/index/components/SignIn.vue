<template>
	<view class="sign-in">
		<!-- <image class="background" src="@/static/sign-in-bgc.png" mode="" /> -->
		<image class="sign-lihua" src="@/static/sign-lihua.png" mode="" />
		<view class="sign-in-content">
			<view class="sign-in-content-left">
				<view class="" @click="navigationToSpecifiedPage({ url: '/pagesIntegral/detail/index' })">
					<view class="content">
						<image class="content-icon" src="@/static/drop-shape-active.png" mode="" />
						<text>{{ currentIntegral || '--' }}</text>
						<view class="arrow"></view>
					</view>
					<view class="count-juice">当前剩余橙汁</view>
				</view>
				<!-- <view class="drop-shape">
					<image src="@/static/drop-shape-active.png" mode="" />
					<text>橙汁</text>
					<text class="number">5</text>
				</view> -->
			</view>
			<view class="sign-in-content-middle">
				<image src="@/static/mascot.png" mode="" />
				<view :class="['btn', sign ? 'fitler' : '']" type="default" @click="signFn">{{ sign ? '今日已签到' : '签到赚橙汁' }}</view>
			</view>
			<view class="sign-in-content-right">
				<view class="rule" @click="navigationToSpecifiedPage({ url: '/pagesSign/rule/index' })">
					<text>签到规则</text>
					<view class="arrow"></view>
				</view>
				<!-- <view class="drop-shape">
					<image src="@/static/drop-shape-active.png" mode="" />
					<text>橙汁</text>
					<text class="number">5</text>
				</view> -->
			</view>
		</view>
	</view>
</template>

<script setup>
	import { reactive, ref } from "vue"
	import { navigationToSpecifiedPage } from "@/utils/common.js"
	
	const props = defineProps({
		sign: {
			type: Boolean,
			default: false,
		},
		currentIntegral: {
			type: [String, Number],
			default: 0,
		},
	})
	const emit = defineEmits(['click'])
	
	const signFn = () => {
		emit('click')
	}
</script>

<style lang="scss" scoped>
	.sign-in {
		width: 100vw;
		height: 417rpx;
		position: relative;
		.background {
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			z-index: -2;
		}
		.sign-lihua{
			position: absolute;
			left: 50%;
			top: 0;
			width: 529rpx;
			height: 305rpx;
			z-index: -1;
			transform: translateX(-50%);
		}
		&-content {
			display: flex;
			height: 100%;
			.sign-in-content-left,.sign-in-content-right {
				flex: 1;
			}
			&-left {
				padding: 21rpx 0 0 24rpx;
				.content {
					display: flex;
					align-items: center;
					font-size: 36rpx;
					color: $uni-color-theme;
					&-icon {
						width: 28rpx;
						height: 35rpx;
						margin-top: 3rpx;
					}
					& > text {
						margin: 0 5rpx;
					}
				}
				.count-juice {
					font-size: 24rpx;
					color: $uni-text-color-sub;
					// margin-left: 10rpx;
				}
			}
			&-middle {
				flex-shrink: 0;
				display: flex;
				flex-direction: column;
				align-items: center;
				width: 300rpx;
				& > image {
					width: 270rpx;
					height: 302rpx;
					display: block;
					margin-top: 10rpx;
				}
				.btn {
					width: 300rpx;
					height: 92rpx;
					line-height: 92rpx;
					text-align: center;
					font-size: 36rpx;
					box-sizing: border-box;
					background-image: url('../../../static/gradients-btn.png');
					background-size: 100% 100%;
					background-repeat: no-repeat;
				}
			}
			&-right {
				padding-top: 24rpx;
				padding-right: 24rpx;
				display: flex;
				flex-direction: column;
				align-items: flex-end;
				.rule {
					display: flex;
					justify-content: center;
					align-items: center;
					width: 150rpx;
					height: 44rpx;
					box-sizing: border-box;
					border: 1px solid $uni-text-color-grey;
					color: $uni-text-color-grey;
					border-radius: 110rpx;
					font-size: 24rpx;
					text-align: center;
					& > view {
						margin-left: 6rpx;
					}
				}
				& > view:last-child {
					// width: 100%;
					// transform: translateY(60rpx);
				}
			}
		}
	}
	.drop-shape {
		display: flex;
		flex-direction: column;
		align-items: center;
		color: $uni-text-color-sub;
		font-size: 24rpx;
		transform: translateY(155rpx);
		position: relative;
		& > image {
			width: 63rpx;
			height: 70rpx;
		}
		.number {
			position: absolute;
			top: 12rpx;
			color: #fff;
			font-size: 36rpx;
		}
	}
	.fitler {
		filter: grayscale(100%);
		filter: gray;
		color: #fff;
	}
</style>