<template>
	<view class="timeout root">
		<view class="timeout-content">
			<image src="/static/rest.png" mode="aspectFill" />
			<view class="text">
				<text>哇哦～网络好像不给力啊～</text>
				<text>刷新下试试吧</text>
			</view>
			<van-button
				type="default"
				round
				plain
				color="#999"
				:custom-style="customStyle"
				@click="onClick"
			>
				刷新
			</van-button>
		</view>
	</view>
</template>

<script setup>
	const customStyle = 'height: 72rpx;padding: 0 56rpx;border-radius: 100rpx;'

</script>

<style lang="scss" scoped>
	.timeout {
		display: flex;
		justify-content: center;
		width: 100vw;
		height: 100vh;
		&-content {
			display: flex;
			flex-direction: column;
			align-items: center;
			max-height: 400rpx;
			margin-top: 200rpx;
			& > image {
				width: 173rpx;
				height: 200rpx;
			}
			& > .text {
				width: 340rpx;
				font-size: 28rpx;
				color: #333;
				text-align: center;
				margin: 12rpx 0 48rpx;
				& > text:last-child {
					font-size: 24rpx;
				}
			}
		}
	}
</style>