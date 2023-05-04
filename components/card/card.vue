<template>
	<view class="card" :style="styleData" @click="onClick">
		<view class="card-left">
			<image class="img-file" :src="setImgUrl_100(picture)" mode="aspectFit" />
			<image class="img-icon" :src="setFileFormat(fileType)" mode="widthFix"></image>
		</view>
		<view class="card-right">
			<view class="title ellipsis-2">{{ title }}</view>
			<view class="card-right-footer">
				<view class="total">
					<custom-icon type="xiazai" size="10"></custom-icon>
					<view class="">{{ downloadFormat(total) }}</view>
				</view>
				<view class="integral">
					<view class="">{{ integral || 0 }}橙汁</view>
					<view  v-if="saleType === 3" class="">+</view>
					<price v-if="[2, 3].includes(saleType)" color="#000" :price="price" />
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { computed } from 'vue'
	import { downloadFormat } from '@/utils/common.js'
	import useFileFormat from '@/hooks/useFileFormat.js'
	const { setFileFormat, setImgUrl_100 } = useFileFormat()
	
	const props = defineProps({
		picture: {
			type: String,
			default: '',
		},
		title: {
			type: String,
			default: '标题',
		},
		total: {
			type: [Number, String],
			default: 20,
		},
		integral: {
			type: Number,
			default: 0,
		},
		price: {
			type: Number,
			default: 0,
		},
		saleType: {
			type: Number,
			default: 1,
		},
		styleData: {
			type: Object,
			default: () => ({})
		},
		fileType: {
			type: String,
			default: '',
		}
	})

	const emit = defineEmits(['click'])
	
	
	const onClick = () => {
		emit('click')
	}
</script>

<style lang="scss" scoped>
	.card {
		display: flex;
		padding: 20rpx;
		height: 220rpx;
		font-size: 24rpx;
		background-color: #fff;
		border-radius: 16rpx;
		box-shadow: 0 3rpx 8rpx 0 rgba(0, 0, 0, 0.16);
		&-left {
			flex-shrink: 0;
			width: 126rpx;
			height: 100%;
			border-radius: 16rpx;
			overflow: hidden;
			border: 1rpx solid #eee;
			position: relative;
			& > image.img-file {
				width: 100%;
				height: 100%;
			}
			.img-icon{
				position: absolute;
				width: 73rpx;
				bottom: 3rpx;
				right: 6rpx;
			}
		}
		&-right {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			margin-left: 20rpx;
			.title {
				font-size: 28rpx;
				color: $uni-text-color-sub;
			}
			&-footer {
				.total {
					display: flex;
					align-items: center;
					& > view {
						margin-left: 8rpx;
						color: $uni-text-color;
					}
				}
				.integral {
					display: flex;
					align-items: center;
					margin-top: 20rpx;
					color: $uni-color-theme;
					font-size: 28rpx;
				}
			}
		}
	}
</style>