<template>
	<view class="week">
		<view class="week-item" v-for="item in currentWeek" :key="item.signDate">
			<view class="">
				<image
					:class="[1, 2].includes(item.signType) ? 'background' : 'background-f'"
					mode="aspectFit"
					:src="[1, 2].includes(item.signType) ? '/static/drop-shape-active.png' : '/static/drop-shape.png'"
				/>
				<text>{{ item.signType >= 1 ? item.opNum : item.predicateOpNum }}</text>
			</view>
			<view class="content">
				<text :style="{ color: formatterToDay(item.signDate) === '今日' ? '#FF9933' : '' }">{{ formatterToDay(item.signDate) }}</text>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { onBeforeMount, ref, computed, toRef } from "vue"
	import { splitFn } from "@/utils/common.js"
	import dayjs from '@/utils/dayjs.min.js'

	const props = defineProps({
		list: {
			type: Array,
			default: () => []
		},
	})
	const currentWeek = toRef(props, 'list')

	const formatterToDay = (date) => {
		const today = dayjs().format('YYYY-MM-DD')
		const arr = splitFn(date)
		return date === today ? '今日' : arr[arr.length - 1]
	}
	
</script>

<style lang="scss" scoped>
 .week {
	 display: flex;
	 padding: 20rpx 20rpx 0;
	&-item {
		width: 14.28%;
		display: flex;
		justify-content: center;
		align-items: flex-end;
		position: relative;
		// height: 135rpx;
		& > view:first-child {
			position: absolute;
			top: 14rpx;
			left: 50%;
			transform: translateX(-50%);
			width: 52rpx;
			height: 58rpx;
			& > image {
				width: 100%;
				height: 100%;
				&.background-f{
					opacity: 0.7;
				}
			}
			& > text {
				position: absolute;
				top: 15rpx;
				left: 50%;
				transform: translateX(-50%);
				color: #fff;
				font-size: 24rpx;
			}
		}
		.content {
			width: 88rpx;
			height: 116rpx;
			padding-top: 69rpx;
			border-radius: 20rpx;
			background: #FFF;
			// box-shadow: 2rpx 2rpx 10rpx 0rpx #E1CECE;
			box-shadow: 0rpx 1rpx 0rpx 0rpx #E6E6E6;
			border: 1rpx solid #E6E6E6;
			text-align: center;
			color: $uni-text-color-grey;
			display: flex;
			align-items: center;
			justify-content: center;
			text, .text{
				font-size: 24rpx;
			}
		}
	}
 }
</style>