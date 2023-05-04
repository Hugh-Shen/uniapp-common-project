<template>
	<view class="rule">
		<view class="rule-content">
			<view class="rule-content-item" v-for="item in ruleData" :key="item.label">
				<view class="">{{ item.label }}</view>
				<view class="" v-for="child in item.cotent" :key="child">{{ child }}</view>
			</view>
		</view>
	</view>
</template>

<script setup>	
	const ruleData = [
		{
			label: '一、签到规则',
			cotent: [
				'1、用户登录后，每日签到可获得5橙汁，连续签到7天后，可获得双倍橙汁',
				'2、断签后将重新计算连续签到天数，每日签到得5橙汁',
				'3、分享给好友，好友登录后，你将获得100橙汁',
				'4、好友首次签到，你将获得20橙汁',
			],
		},
		{
			label: '二、橙汁使用说明',
			cotent: [
				'1、获得的橙汁可兑换资料包和实物商品',
				'2、如有疑问，请咨询方程圈官方客服',
			],
		},
	]
</script>

<style lang="scss" scoped>
	.rule {
		padding: 0 24rpx;
		font-size: 24rpx;
		line-height: 46rpx;
		&-content {
			width: 100%;
			height: 702rpx;
			padding: 71rpx 64rpx 0;
			background-color: #fff;
			&-item {
				margin-bottom: 40rpx;
				color: $uni-text-color-sub;
				& > view:first-child {
					font-size: 28rpx;
				}
			}
		}
	}
</style>