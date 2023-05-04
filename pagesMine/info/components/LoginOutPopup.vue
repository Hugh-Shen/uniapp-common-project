<template>
	<van-popup
		round
	  :show="showVal"
		position="bottom"
	  @close="onClose"
	>
		<view class="container">
			<view class="text">{{ text }}</view>
			<view class="btn-container">
				<van-button
					type="default"
					round
					color="#FF9933"
					plain
					:custom-style="customStyle"
					@click.stop="onClose"
				>
					取消
				</van-button>
				<van-button type="default" color="#FF9933" round :custom-style="customStyle + 'margin-left: 70rpx;'" @click.stop="save">确认</van-button>
			</view>
		</view>
	</van-popup>
</template>

<script setup>
	import { ref } from "vue"
	
	const customStyle = 'height: 35px;width: 232rpx;'
	
	const props = defineProps({
		text: {
			type: String,
			default: '是否确定退出登录！',
		},
		show: {
			type: Boolean,
			default: false,
		},
	})
	const emit = defineEmits(['close', 'save'])
	
	const showVal = ref(props.show)
	
	const onClose = () => {
		showVal.value = false
		emit('close')
	}
	const save = () => {
		showVal.value = false
		emit('save')
	}
</script>

<style lang="scss" scoped>
	.container {
		width: 100vw;
		padding: 70rpx 50rpx 85rpx;
		.text {
			text-align: center;
		}
		.btn-container {
			display: flex;
			justify-content: center;
			height: 70rpx;
			margin-top: 45rpx;
		}
	}
</style>