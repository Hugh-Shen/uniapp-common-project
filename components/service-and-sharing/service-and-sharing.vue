<template>
	<view class="market-confirm">
		<view class="main">
			<view class="main-left">
				<view class="" @click="handleClickToService">
					<custom-icon type="kefuzhongxin" size="22" color="#85CAE4" :style="{ marginRight: '10rpx' }"></custom-icon>
					<text>方橙君</text>
				</view>
				<button class="service" open-type="share">
					<custom-icon type="fenxiang" size="19" color="#28C445" :style="{ marginRight: '10rpx' }"></custom-icon>
					<text>分享</text>
				</button>
			</view>
			<slot>
				<van-button
					type="default"
					round
					color="#FF9933"
					block
					:disabled="disabled"
					:custom-style="customStyle"
					@click.stop="onClick"
				>
					{{ text }}
				</van-button>
			</slot>
		</view>
	</view>
</template>

<script setup>
	import { navigationToSpecifiedPage } from '@/utils/common.js'
	
	const customStyle = 'height: 72rpx;'
	
	const props = defineProps({
		disabled: {
			type: Boolean,
			default: false,
		},
		text: {
			type: String,
			default: '立即兑换'
		},
	})
	const emit = defineEmits(['click', 'service'])
	
	const onClick = () => {
		emit('click')
	}
	const handleClickToService = () => {
		navigationToSpecifiedPage('/pagesMessage/contact/index')
	}
	const handleClickToShare = () => {
		emit('share')
	}
</script>

<style lang="scss" scoped>
	.market-confirm {
		.main {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 17rpx 24rpx;
			background-color: #fff;
			// border-bottom: 1px solid $uni-border-line;
			border-top: 1px solid $uni-border-line;
			&-left {
				display: flex;
				align-items: center;
				& > view, button {
					display: flex;
					align-items: center;
					height: 72rpx;
					font-size: 28rpx;
					padding: 0;
					color: #333;
				}
				.service {
					margin-left: 48rpx;
				}
			}
		}
	}
</style>