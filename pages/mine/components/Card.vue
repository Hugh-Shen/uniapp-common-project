<template>
	<view class="card" @click="onClick">
		<view class="user-avatar">
			<image :src="avatar || defaultAvatar" mode="aspectFill" />
			<view v-if="name" class="">{{ name }}</view>
			<view v-else class="" @click.stop.self="handleClickToLogin">点击登录/注册</view>
			<van-icon class="arrow-icon" name="arrow" />
		</view>
		<view v-if="canEditUsername" class="change-name-tips" @click.stop.self="closeTips">
			<text class="mr-10">完善个人信息可获20橙汁</text>
			<van-icon class="close-icon" name="close" size="16" />
		</view>
		<view class="other-content">
			<view class="tag" @click.stop.self="navigationToSpecifiedPage({ url: '/pagesIntegral/detail/index' })">
				<text>{{ juice }}橙汁</text>
				<view class="arrow" v-if="isLogin" style="margin-left: 5rpx;"></view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { computed, watch } from "vue"
	import { navigationToSpecifiedPage } from "@/utils/common.js"
	
	const props = defineProps({
		name: {
			type: String,
			default: '点击登录/注册',
		},
		juice: {
			type: [String, Number],
			default: '--',
		},
		avatar: {
			type: String,
			default: '',
		},
		canEditUsername: {
			type: Boolean,
			default: false,
		}
	})
	
	const emits = defineEmits(['closeTips'])
	
	const defaultAvatar = '/static/default-avatar.png'
	
	const isLogin = computed(() => props.name !== '点击登录/注册')
	
	const handleClickToLogin = () => {
		if (props.name === '点击登录/注册') {
			navigationToSpecifiedPage('/pages/login/index?replace=/pages/mine/index')
		}
	}
	const onClick = () => {
		navigationToSpecifiedPage({ url: '/pagesMine/info/index' })
	}
	
	const closeTips = () => {
		emits('closeTips')
	}
	
	watch(() => props.canEditUsername, (val) => {
		console.log(val)
	})
</script>

<style lang="scss" scoped>
	.card {
		width: 100%;
		height: 325rpx;
		padding: 74rpx 57rpx 0;
		border-radius: 16rpx;
		background-color: #fff;
		font-size: 24rpx;
		.user-avatar {
			display: flex;
			align-items: center;
			font-size: 28rpx;
			color: $uni-text-color;
			& > image {
				flex-shrink: 1;
				width: 112rpx;
				height: 112rpx;
				border-radius: 50%;
				margin-right: 8rpx;
			}
			& > view {
				// max-width: 240rpx;
				margin-right: 20rpx;
				line-height: 30rpx;
			}
			.arrow-icon{
				line-height: 30rpx;
			}
		}
		.other-content {
			.tag {
				// display: flex;
				// justify-content: center;
				// align-items: center;
				display: inline-block;
				min-width: 160rpx;
				text-align: center;
				height: 45rpx;
				line-height: 45rpx;
				padding: 0 16rpx;
				border-radius: 110rpx;
				background-color: rgba(255,153,51,.1);
				color: $uni-color-theme;
				margin-left: 110rpx;
				.arrow{
					display: inline-block;
					vertical-align: middle;
					
				}
			}
		}
		.change-name-tips{
			position: absolute;
			top: 22rpx;
			left: 202rpx;
			// width: 350rpx;
			background-color: rgba(0,0,0,.6);
			padding: 12rpx 50rpx 12rpx 24rpx;
			color: #fff;
			font-size: 24rpx;
			line-height: 34rpx;
			border-radius: 16rpx;
			.close-icon{
				position: absolute;
				top: 50%;
				right: 20rpx;
				transform: translateY(-50%);
			}
			&::before{
				content: '';
				position: absolute;
				bottom: -16rpx;
				left: 22rpx;
				height: 0rpx;
				width: 0rpx;
				border-width: 16rpx 8rpx 0rpx;
				border-style: solid;
				border-color: rgba(0,0,0,.6) transparent transparent;
			}
		}
	}
	
	.reset-arrow {
		width: 20rpx;
		height: 20rpx;
	}
</style>