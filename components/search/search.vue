<template>
	<view class="search fcq-clickable" @click="handleClickToSearch">
		<custom-icon type="sousuo" size="16" :style="{ marginRight: '10rpx' }"></custom-icon>
		<view class="label">{{ label }}</view>
	</view>
</template>

<script setup>
	import { computed } from "vue"
	
	const props = defineProps({
		width: {
			type: Number,
			default: 376,
		},
		label: {
			type: String,
			default: 'HR资料',
		},
	})
	const emit = defineEmits(['click'])
	
	const width = computed(() => `${props.width}rpx`)
	
	const handleClickToSearch = () => {
		emit('click')
	}
</script>

<style lang="scss" scoped>
	.search {
		display: flex;
		align-items: center;
		width: v-bind('width');
		height: 64rpx;
		padding: 0 10rpx;
		border-radius: 200rpx;
		background-color: #fff;
		.label {
			font-size: 32rpx;
			color: $uni-color-grey;
		}
	}
</style>