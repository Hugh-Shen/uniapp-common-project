<template>
	<view class="empty">
		<view class="">
			<image :src="url" mode="" />
			<view class="title">{{ title }}</view>
		</view>
		<van-button v-if="hasBtn" type="default" color="#FF9933" round :custom-style="customStyle" @click.stop="save">{{ confirmText }}</van-button>
	</view>
</template>

<script setup>
	const customStyle = 'height: 72rpx;width: 312rpx;border-radius: 124rpx;'
	
	const props = defineProps({
		title: {
			type: String,
			default: '暂无橙汁明细',
		},
		confirmText: {
			type: String,
			default: '获取更多橙汁',
		},
		url: {
			type: String,
			default: '/static/not-found.png',
		},
		hasBtn: {
			type: Boolean,
			default: true,
		}
	})
	const emit = defineEmits(['click'])
	
	const save = () => {
		emit('click')
	}
</script>

<style lang="scss" scoped>
	.empty {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 450rpx;
		& > view:first-child {
			text-align: center;
			margin-bottom: 45rpx;
			& > image {
				display: inline-block;
				width: 210rpx;
				height: 210rpx;
			}
			.title {
				margin-top: 37rpx;
				font-size: 22rpx;
				color: $uni-text-color-grey;
			}
		}
	}
</style>