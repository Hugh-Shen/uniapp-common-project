<template>
	<view class="nav-bar">
		<view class="nav-bar-content">
			<slot>
				<view class="default-content">
					<view class="" @click="handleClickToBack">
						<custom-icon type="a-fanhuizuojiantou" size="20" :style="{ marginRight: '10rpx' }" />
					</view>
					<view class="">
						{{ title }}
					</view>
					<view class=""></view>
				</view>
			</slot>
		</view>
	</view>
</template>

<script setup>
	const { statusBar: { height, top } } = getApp().globalData
	const barHeight = `${height + 10}px`
	const statusTop = `${top - 5}px`
	const barHeightFb = `${height + top + 5}px`
	
	const props = defineProps({
		title: {
			type: String,
			default: '小橙子',
		},
		controlReturns: {
			type: Boolean,
			default: false
		},
	})
	
	const emit = defineEmits(['back'])
	
	const handleClickToBack = () => {
		emit('back')
		if (!props.controlReturns) {
			uni.navigateBack()
		}
	}
</script>

<style lang="scss" scoped>
	$statusHeight: v-bind('barHeight');
	$statusTop: v-bind('statusTop');
	$barHeightFb: v-bind('barHeightFb');
	.nav-bar {
		height: $statusHeight;
		padding: $statusTop 24rpx 10rpx;
		box-sizing: content-box;
		// position: sticky;
		top: 0;
		left: 0;
		background-color: $uni-bg-color-grey;
		z-index: 999;
		&-content {
			display: flex;
			justify-content: center;
			align-items: center;
			width: 100%;
			height: 100%;
			.default-content {
				display: flex;
				justify-content: space-between;
				width: 100%;
				height: 100%;
				& > view {
					flex-shrink: 0;
					display: flex;
					align-items: center;
					width: 120rpx;
				}
				& > view:nth-child(2) {
					flex: 1;
					justify-content: center;
				}
			}
		}
	}
</style>