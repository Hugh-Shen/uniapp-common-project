<template>
	<view class="about">
		<view class="about-content">
			<image src="/static/logo.png" mode="" />
			<view class="">方程圈</view>
			<view class="">你困惑的 圈里都有答案</view>
			<view class="version">{{ `当前版本${ miniProgram.version || '1.0.0' }` }}</view>
		</view>
		<!-- <view class="company">湖南安蚁企业服务有限公司 版权所有</view> -->
	</view>
</template>

<script setup>
	const { miniProgram } = uni.getAccountInfoSync()
</script>

<style lang="scss" scoped>
	.about {
		height: calc(100vh);
		color: $uni-text-color;
		font-size: 24rpx;
		padding-top: 204rpx;
		position: relative;
		&-content {
			display: flex;
			flex-direction: column;
			align-items: center;
			& > view:nth-child(2) {
				font-size: 28rpx;
				margin-top: 12rpx;
			}
			& > image {
				width: 144rpx;
				height: 144rpx;
			}
			.version {
				margin-top: 42rpx;
				color: $uni-text-color-sub;
			}
		}
		.company {
			position: absolute;
			left: 50%;
			bottom: 50rpx;
			width: 100%;
			text-align: center;
			color: $uni-text-color-grey;
			transform: translateX(-50%);
		}
	}
</style>