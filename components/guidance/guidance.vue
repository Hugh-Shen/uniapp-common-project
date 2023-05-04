<template>
	<view :class="['dingyue-box', hasFollow ? 'unfold': '']">
		<view class="dingyue">
			<van-icon class="dingyue-close" name="close" size="36rpx" @click="closeDingyue" />
			<view class="tips">关注【方程圈】公众号，可以第一时间接收最新消息哟!</view>
			<view class="handle-box">
				<view class="btn cancel" @click="closeDingyue">暂不关注</view>
				<view class="btn confirm" @click="openSub">立即关注</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { ref, watch } from "vue"
	import { navigationToSpecifiedPage } from "@/utils/common.js"
	
	const props = defineProps({
		show: {
			type: Boolean,
			default: true,
		},
	})
	const emit = defineEmits(['close', 'open'])
	
	const hasFollow = ref(false)
	
	watch(() => props.show, (cur, next) => {
		cur ? hasFollow.value = false : hasFollow.value = true
	}, { immediate: true })
	
	const closeDingyue = () => {
		hasFollow.value = true
		emit('close')
	}
	
	const openSub = () => {
		navigationToSpecifiedPage('/pages/message/follow')
		emit('open')
	}
</script>

<style lang="scss" scoped>
	.dingyue-box {
		transition: height 0.3s ease;
		will-change: height;
		width: 100%;
		height: 224rpx;
		// margin-top: 10rpx;
		display: flex;
		justify-content: center;
		position: relative;
		z-index: 99;

		&.unfold {
			height: 0;
			overflow: hidden;
		}

		.dingyue {
			width: 702rpx;
			padding: 60rpx 0 34rpx;
			height: 224rpx;
			border-radius: 16rpx;
			/* 纯白 */
			background: #FFFFFF;
			box-shadow: 2rpx 2rpx 10rpx 0rpx #D8C2C2;
			position: relative;

			.dingyue-close {
				position: absolute;
				top: 20rpx;
				right: 20rpx;
				color: #999;
			}

			.tips {
				font-size: 24rpx;
				line-height: 24rpx;
				color: #333;
				text-align: center;
				margin-bottom: 30rpx;
			}

			.handle-box {
				display: flex;
				align-items: center;
				justify-content: center;

				>.btn {
					width: 224rpx;
					height: 72rpx;
					border-radius: 64rpx;
					font-size: 28rpx;
					color: #fff;
					text-align: center;
					line-height: 70rpx;

					&.cancel {
						background-color: #fff;
						margin-right: 64rpx;
						border: 1rpx solid #999999;
						color: #999;
					}

					&.confirm {
						background-color: $uni-color-primary;
						border: 1rpx solid $uni-color-primary;
					}
				}
			}
		}
	}
</style>
