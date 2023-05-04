<template>
	<view class="remind">
		<view class="remind-componet">
			<view class="remind-componet-item">
				<view class="setting">立即开启签到提醒设置：</view>
				<van-switch
					size="28px"
					active-color="#FF6633"
					inactive-color="#F2F3F4"
					:checked="enabled"
					@change="switchRemind"
				/>
			</view>
			<view :class="['remind-componet-item', enabled ? '' : 'disabled']">
				<view class="">提醒时间</view>
				<view class="" @click="handleClickToSetDate">
					<view class="">
						<text>{{ enabled ? (pushTime ? pushTime : '设置时间') : '不提醒' }}</text>
						<view class="arrow .ml-8"></view>
					</view>
				</view>
			</view>
		</view>
		
		<van-popup :show="showOverlay" round position="bottom" @close="() => showOverlay = false">
			<view class="wrapper">
				<DatePicker
					type="time"
					:value="pushTime"
					@cancel="() => showOverlay = false"
					@confirm="confirm"
				/>
			</view>
		</van-popup>
	</view>
</template>

<script setup>
	import { ref, toRefs } from "vue"
	import DatePicker from "./DatePicker.vue"
	
	const props = defineProps({
		enabled: {
			type: Boolean,
			default: false,
		},
		pushTime: {
			type: String,
			default: '',
		},
	})
	const emit = defineEmits(['confirm', 'switch'])
	const showOverlay = ref(false)
	

	const switchRemind = ({ detail }) => {
		emit('switch', detail)
	}
	const handleClickToSetDate = () => {
		if (!props.enabled) return
		showOverlay.value = true
	}
	const confirm = (date) => {
		emit('confirm', date)
		showOverlay.value = false
	}
</script>

<style lang="scss" scoped>
	.remind {
		.remind-componet {
			display: flex;
			flex-direction: column;
			justify-content: center;
			height: 240rpx;
			padding: 0 96rpx;
			border-radius: 16rpx;
			background-color: #fff;
			font-size: 24rpx;
			& > view:last-child {
				margin-top: 50rpx;
			}
			&-item {
				display: flex;
				justify-content: space-between;
				align-items: center;
				width: 100%;
				.setting {
					font-size: 28rpx;
				}
				& > view:last-child {
					& > view {
						display: flex;
						align-items: center;
					}
				}
			}
		}
		.wrapper {
			display: flex;
			align-items: flex-end;
			width: 100%;
			height: 100%;
		}
	}
	.disabled {
		color: $uni-text-color-grey;
	}
</style>