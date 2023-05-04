<template>
	<view class="action-bar" :style="costomStyle">
		<view v-if="title" class="title">{{ title }}</view>
		<view class="action-bar-list">
			<view
				class="action-bar-list-item"
				v-for="(item, index) in list" :key="index"
				@click="onClick(item)"
			>
				<CustomIcon :type="item.icon" :color="item.color" size="28" />
				<view class="">{{ item.label }}</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import CustomIcon from "@/components/custom-icon/custom-icon.vue"
	import { ref, computed } from "vue"
	
	const emit = defineEmits(['onClick'])
	const props = defineProps({
		title: {
			type: String,
			default: '',
		},
		round: {
			type: Boolean,
			default: false,
		},
		list: {
			type: Array,
			default: () => [],
		},
	})
	
	const costomStyle = computed(() => props.round ? { borderRadius: '16rpx' } : {})
	
	const onClick = (val) => {
		emit('onClick', val)
	}
</script>

<style lang="scss" scoped>
	.action-bar {
		padding: 24rpx 25rpx;
		background-color: #fff;
		font-size: 24rpx;
		.title {
			margin-bottom: 30rpx;
		}
		&-list {
			display: flex;
			justify-content: space-between;
			&-item {
				text-align: center;
				font-size: 24rpx;
				color: $uni-text-color;
				& > view:last-child {
					margin-top: 8rpx;
				}
			}
		}
	}
</style>