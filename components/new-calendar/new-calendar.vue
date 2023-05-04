<template>
	<view class="calendar">
		<view class="calendar-header">
			<view class="pre-box fcq-clickable" @click="pre">
				<view class="arrow arrow-left common-arrow"></view>
			</view>
			<view class="">{{ formatCurrentDate }}</view>
			<view class="next-box fcq-clickable" @click="next">
				<view class="arrow common-arrow"></view>
			</view>
		</view>
		<view class="week">
			<view class="" v-for="item in week" :key="item">{{ item }}</view>
		</view>
		<view class="date">
			<view class="date-item" v-for="(item, index) in date" :key="index">
				<view class="">
					<image
						:class="[1, 2].includes(item.signType) ? 'background' : 'background-f'"
						:src="item.signType ? '/static/drop-shape-active.png' : '/static/drop-shape.png'"
						mode="aspectFit"
					/>
					<text>{{ item.signType ? item.opNum : item.predicateOpNum }}</text>
				</view>
				<view class="date-item-box">
					<text :style="{ color: (item.signType > 0 || formatDate(item.date) === '今日' ) ? '#FF9933' : '' }">{{ formatDate(item.date) }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { computed, ref } from 'vue'
	import { splitFn } from '@/utils/common.js'
	import dayjs from '@/utils/dayjs.min.js'
	
	const week = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
	
	const props = defineProps({
		date: {
			type: Array,
			default: () => Array(42).fill({
				opNum: 0,
				predicateOpNum: 5,
				date: 'time',
				signType: null,
			})
		},
	})
	
	const emit = defineEmits(['change'])
	
	const currentDate = ref(dayjs().format('YYYY-MM'))
	const formatCurrentDate = computed(() => {
		const date = splitFn(currentDate.value)
		return `${date[0]}年${date[1]}月`
	})
	const transformForDate = computed(() => dayjs(currentDate.value))
	
	const formatDate = (date) => {
		if (dayjs().isSame(dayjs(date), 'day')) {
			return '今日'
		}
		const val = splitFn(date)
		
		return val[val.length - 1]
	}
	
	const pre = () => {
		const val = dayjs(currentDate.value).subtract(1, 'M')
		currentDate.value = val.format('YYYY-MM')
		emit('change', { year: val.$y, month: val.$M + 1, })
	}
	const next = () => {
		const val = dayjs(currentDate.value).add(1, 'M')
		currentDate.value = val.format('YYYY-MM')
		emit('change', { year: val.$y, month: val.$M + 1, })
	}
</script>

<style lang="scss" scoped>
	.calendar {
		&-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 50rpx;
			padding: 0 10rpx;
			color: $uni-text-color-grey;
			.pre-box, .next-box{
				width: 60rpx;
				text-align: center;
			}
			.common-arrow {
				display: inline-block;
				width: 18rpx;
				height: 18rpx;
			}
			.arrow-left {
				transform: rotate(320deg);
			}
		}
		.week {
			display: flex;
			padding: 0 20rpx;
			font-size: 20rpx;
			color: $uni-text-color-grey;
			& > view { 
				flex: 1;
				text-align: center;
			}
		}
		.date {
			display: flex;
			flex-wrap: wrap;
			padding: 0 20rpx;
			&-item {
				display: flex;
				justify-content: center;
				align-items: flex-end;
				width: 14.28%;
				height: 135rpx;
				// margin-top: 18rpx;
				position: relative;
				& > view:first-child {
					position: absolute;
					top: 32rpx;
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
				&-box {
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
					& > text {
						color: $uni-text-color-grey;
					}
				}
			}
		}
	}
</style>