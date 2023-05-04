<template>
	<view class="card" @click="handleClickToDetails">
		<image class="cover-picture" :src="coverPicture" mode="aspectFill" />
		<view class="card-title">
			<view class="title ellipsis-2">{{ title }}</view>
		</view>
		<view class="card-footer">
			<view :class="['site-and-time', site ? 'space' : '']">
				<view>
					<custom-icon class="icon-container" type="a-huodongkapianshijian" :size="16" color="#666666" />
					<text>{{ time }}</text>
				</view>
				<view class="site" v-if="site">
					<custom-icon class="icon-container" type="a-huodongkapiandizhi" :size="16" color="#666666" />
					<text>{{ site }}</text>
				</view>
			</view>
			<van-button
				color="#FF9933"
				round
				class="vant-btn"
				:custom-style="customStyleBtn"
			>
				{{ text }}
			</van-button>
		</view>
	</view>
</template>

<script setup>
	const customStyleBtn = 'height: 72rpx;'
	
	const props = defineProps({
		coverPicture: {
			type: String,
			default: 'http://img.kubigou.com/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20230109134128.png',
		},
		title: {
			type: String,
			default: '标题',
		},
		site: {
			type: String,
			default: '长沙',
		},
		time: {
			type: String,
			default: '2022.9.24  14:00',
		},
		text: {
			type: String,
			default: 'default',
		},
	})
	
	const emit = defineEmits(['click'])
	
	const handleClickToDetails = () => {
		emit('click')
	}
</script>

<style lang="scss" scoped>
	.card {
		padding: 24rpx;
		background-color: #fff;
		.cover-picture {
			width: 100%;
			height: 394rpx;
			border-radius: 16rpx;
			box-shadow: 0rpx 3rpx 8rpx 0rpx rgba(0,0,0,0.16);
		}
		.card-title {
			margin-top: 12rpx;
			margin-bottom: 8rpx;
			font-size: 28rpx;
			.title {
				width: 100%;
				font-weight: 500;
			}
		}
		.card-footer {
			display: flex;
			justify-content: space-between;
			height: 72rpx;
			.space {
				justify-content: space-between !important; 
			}
			.site-and-time {
				display: flex;
				flex-direction: column;
				justify-content: flex-end;
				height: 100%;
				font-size: 24rpx;
				& > view {
					display: flex;
					align-items: center;
					:deep(.icon-container) {
						height: 16px;
						margin-right: 4rpx;
					}
				}
				& > view:last-child {
					:deep(.icon-container) {
						height: 16px;
						margin-right: 4rpx;
						scale: 0.95;
					}
				}
				.site {
					margin-right: 10rpx;
				}
			}
		}
	}
	:deep(.vant-btn) {
		flex-shrink: 0;
	}
</style>