<template>
	<view class="date-picker">
		<view class="title">{{ title }}</view>
		<van-datetime-picker
			:type="type"
			:show-toolbar="false"
			:value="value"
			@input="onChange"
		/>
		<view class="date-picker-footer">
			<view class="btn-container">
				<van-button
					type="default"
					round
					color="#FF9933"
					plain
					:custom-style="customStyle"
					@click.stop="cancel"
				>
					取消
				</van-button>
				<van-button type="default" color="#FF9933" round :custom-style="customStyle + 'margin-left: 70rpx;'" @click.stop="save">确认</van-button>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { ref } from "vue"
	
	const customStyle = 'height: 35px;width: 232rpx;'
	const props = defineProps({
		title: {
			type: String,
			default: '设置提醒时间'
		},
		value: {
			type: [String, Date],
			default: ({ type, value }) => {
				if (value) {
					return value
				}
				return type === 'date' ? new Date().getTime() : '00:00'
			},
		},
		type: {
			type: String,
			default: 'date',
		},
	})
	
	const emit = defineEmits(['cancel', 'confirm'])
	const dateTime = ref(props.value)
	
	const onChange = ({ detail }) => {
		dateTime.value = detail
	}
	const cancel = () => {
		emit('cancel')
	}
	const save = (e) => {
		emit('confirm', dateTime.value)
	}
</script>

<style lang="scss" scoped>
	.date-picker {
		width: 100vw;
		padding-top: 20rpx;
		background-color: #fff;
		.title {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 80rpx;
			color: $uni-color-black;
			font-size: 30rpx;
		}
		&-footer {
			height: 155rpx;
			padding-top: 20rpx;
			.btn-container {
				display: flex;
				justify-content: center;
				height: 70rpx;
			}
		}
	}
</style>