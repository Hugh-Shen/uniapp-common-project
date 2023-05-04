<template>
	<view class="cell" @click="handleClickEvent">
		<view class="cell-label ellipsis">{{ label }}</view>
		<view class="cell-content">
			<slot>
				<view :class="['default-content', 'ellipsis', styleName ? 'default-text' : '']">{{ valueComputed || value }}</view>
			</slot>
			<view v-if="showArrow" class="arrow reset-arrow"></view>
		</view>
	</view>
</template>

<script>
	const textMap = {
		'个性签名': '还没有个性签名哟',
	}
	const valList = ['还没有个性签名哟']
</script>
<script setup>
	import { computed, ref, toRefs, watch } from "vue"
	
	const props = defineProps({
		label: {
			type: String,
			default: '标题',
		},
		value: {
			type: String,
			default: '',
		},
		showArrow: {
			type: Boolean,
			default: true,
		},
	})
	
	const emit = defineEmits(['onClick'])
	
	const valueComputed = computed(() => textMap[props.label])
	const styleName = computed(() => valList.includes(valueComputed.value) ? 'default-text' : '')
	
	const handleClickEvent = () => {
		const key = {
			'生日': 'birthday',
			'性别': 'default',
		}
		emit('onClick', { label: props.label, value: props.value, key: key[props.label] })
	}
</script>

<style lang="scss" scoped>
	.cell {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		padding: 33rpx 63rpx 33rpx 68rpx;
		background-color: #fff;
		font-size: 28rpx;
		&-label {
			flex-shrink: 0;
			width: 155rpx;
		}
		&-content {
			flex: 1;
			display: flex;
			justify-content: flex-end;
			align-items: center;
			padding-right: 15rpx;
			overflow: hidden;
			.default-content {
			}
		}
	}
	.reset-arrow {
		flex-shrink: 0;
		width: 15rpx;
		height: 15rpx;
		margin-left: 32rpx;
	}
	.default-text {
		color: #D8D8D8;
	}
</style>