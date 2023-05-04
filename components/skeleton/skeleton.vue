<template>
	<view class="loading">
		<view v-if="statusBarDistance" class="status-bar-distance"></view>
		<view class="content">
			<view class="skeleton-container" v-if="first">
				<van-skeleton title avatar row="5" avatar-size="114rpx" :row-width="rowWidth" />
				<van-skeleton title avatar row="3" avatar-size="114rpx" />
			</view>
			<template v-else>
				<slot></slot>
			</template>
		</view>
		<view class="loading-animation">
			<van-loading v-if="loading" color="#FF6633" size="120rpx" vertical>
				<view class="active-color">加载中...</view>
			</van-loading>
		</view>
	</view>
</template>

<script setup>
	import { ref } from "vue"
	
	const { statusBar: { height, top } } = getApp().globalData
	const barHeight = `${height + 10}px`
	const statusTop = `${top - 5}px`
	const rowWidth = ['80px', '80px', '140px', '70px', '240px']
	
	const props = defineProps({
		loading: {
			type: Boolean,
			default: true,
		},
		statusBarDistance: {
			type: Boolean,
			default: true,
		},
	})
	
	const loadingTop = ref(props.statusBarDistance ? barHeight : '0px')
	const first = ref(true)
</script>

<style lang="scss" scoped>
	$top: v-bind('loadingTop.value');
	.loading {
		width: 100%;
		height: 100%;
		background-color: #fff;
		position: relative;
		.status-bar-distance {
			height: v-bind(barHeight);
		}
		.content {
			.skeleton-container {
				display: flex;
				flex-direction: column;
				gap: 50rpx;
			}
		}
		&-animation {
			display: flex;
			justify-content: center;
			align-items: center;
			position: absolute;
			left: 50%;
			top: calc(50% - $top);
			transform: translate(-50%);
		}
	}
	
	.active-color {
		color: $uni-color-theme;
	}
</style>