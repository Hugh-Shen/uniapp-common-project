<template>
	<van-overlay :show="overlayShow">
		<view class="award">
			<view class="award-content">
				<image src="/static/award.png" mode="aspectFill" @click="onClick" />
				<van-icon class="close-icon" name="close" size="64rpx" @click="onClose"/>
			</view>
		</view>
	</van-overlay>
</template>

<script setup>
	import { toRefs, ref } from "vue"

	const props = defineProps({
		show: {
			type: Boolean,
			default: false,
		},
		title: {
			type: String,
			default: '注册成功',
		},
		integral: {
			type: [String, Number],
			default: '100',
		},
		text: {
			type: String,
			default: '去签到',
		},
	})
	const emit = defineEmits('click', 'close')
	
	const overlayShow = ref(props.show)
	
	const onClick = () => {
		emit('click', props.show)
		overlayShow.value = false
	}
	const onClose = () => {
		emit('close')
		overlayShow.value = false
	}
</script>

<style lang="scss" scoped>
	.award {
		width: 100%;
		height: 100%;
		position: relative;
		&-content {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -60%);
			display: flex;
			flex-direction: column;
			align-items: center;
			height: 961rpx;
			// padding-top: 220rpx;
			position: relative;
			& > image:first-child {
				position: absolute;
				top: 0;
				left: 50%;
				transform: translateX(-50%);
				width: 535rpx;
				height: 100%;
			}
			&-header {
				width: 85rpx;
				margin-top: 20rpx;
				font-size: 42rpx;
				color: #fff;
			}
			&-integral {
				display: flex;
				align-items: center;
				font-size: 65rpx;
				margin-top: 110rpx;
				color: #fff;
				& > image {
					width: 80rpx;
					height: 90rpx;
				}
			}
			.chance {
				display: flex;
				margin-top: 70rpx;
				&-left {
					display: flex;
					align-items: center;
					font-size: 72rpx;
					color: $uni-color-red;
					& > view:first-child {
						font-size: 100rpx;
						font-weight: 500;
					}
				}
				&-right {
					padding-top: 42rpx;
					margin-left: 5rpx;
					text-align: center;
				}
			}
			.btn {
				width: 350rpx;
				height: 90rpx;
				margin-top: 90rpx;
				padding: 10rpx;
				border-radius: 45rpx;
				font-size: 38rpx;
				background: linear-gradient(180deg, #FFE3B5 0%, #FFB100 98%);
				& > view {
					width: 100%;
					height: 100%;
					line-height: 70rpx;
					border-radius: 45rpx;
					background: linear-gradient(180deg, #FFD16D 0%, #FF9B00 100%);
					text-align: center;
					color: #C61800;
				}
			}
			.close {
				width: 80rpx;
				height: 80rpx;
				border-radius: 50%;
				border: 1px solid #fff;
				position: absolute;
				bottom: -100rpx;
				&::before {
					content: '';
					position: absolute;
					top: 50%;
					left: 50%;
					width: 46rpx;
					height: 4rpx;
					background-color: #fff;
					translate: -50%;
					transform: rotateZ(-45deg);
				}
				&::after {
					content: '';
					position: absolute;
					top: 50%;
					left: 50%;
					width: 46rpx;
					height: 4rpx;
					background-color: #fff;
					translate: -50%;
					transform: rotateZ(225deg);
				}
			}
		}
	}
	.close-icon {
		position: absolute;
		bottom: -100rpx;
		color: #fff;
	}
</style>