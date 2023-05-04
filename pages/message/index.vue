<template>
	<view class="message-index-page">
		<template v-if="loginStatus == '1'">
			<Guidance :show="showGuidance && !isHasSub" @close="() => user.setShowGuidance(false)" />
			<view class="msg-list">
				<view class="li fcq-clickable" v-for="(item, index) in listData" :key="index" @click="navigationToSpecifiedPage(item.path)">
					<view class="li-icon-l">
						<CustomIcon :type="item.type" :color="item.color" :size="32" />
						<view class="badge" v-if="item.unReadCount">{{item.unReadCount <= 99 ? item.unReadCount : '99+'}}</view>
					</view>
					<view class="li-content">
						<view class="top">
							<view class="title">{{item.title}}</view>
							<view class="time pr-30" v-if="item.sendTime">{{setTimes(item.sendTime)}}</view>
							<view class="dot" v-if="item.unReadCount"></view>
						</view>
						<view class="bottom">{{item.secondTitle}}</view>
						<van-icon class="icon-right" name="arrow" size="20rpx"/>
					</view>
					<view class="li-icon-r"></view>
				</view>
			</view>
			
		</template>
		<view v-if="loginStatus == '2'" class="not-logged-in">
			<image :src="notLoginBg" mode="widthFix" />
			<view class="tips">登录后方可查看消息哦~</view>
			<van-button
				type="default"
				color="#FF9933"
				:custom-style="customStyle"
				round
				@click="navigationToSpecifiedPage('/pages/login/index')"
			>
				立即登录
			</van-button>
		</view>
	</view>
</template>

<script setup>
	import { computed, reactive, ref, toRefs } from "vue";
	import { onShow, onLoad } from "@dcloudio/uni-app";
	import { useUserStore } from '@/stores/user.js'
	import { navigationToSpecifiedPage } from "@/utils/common.js"
	import CustomIcon from "@/components/custom-icon/custom-icon.vue"
	import notLoginBg from '@/static/not-login-bg.png'
	import Guidance from "@/components/guidance/guidance.vue"
	import Api from './api.js'
	import useTimes from '@/hooks/useTimes.js'
	
	const customStyle = 'height: 72rpx;width: 312rpx;border-radius: 124rpx;'
	
	const getList = () => {
		// uni.showLoading({})
		Api.getInnerNoticeSummaryList({}).then(res => {
			// uni.hideLoading()
			if (res.code == 200) {
				res.data.forEach(item => {
					let obj = msgNavs.value.find(val => {
						return val.bigType == item.bigType
					})
					if (obj) {
						item.type = obj.type
						item.color = obj.color
						item.path = obj.path
						item.title = obj.title
					}
				})
				listData.value = res.data
			}
		})
	}
	const hasSubWxApp = () => {
		Api.hasSubWxApp().then(({ data }) => {
			isHasSub.value = data
		})
	}
	
	const user = useUserStore()
	const { setTimes } = useTimes()
	const { showGuidance } = toRefs(user.store)
	const loginStatus = ref('0')
	const msgNavs = ref([
		{title: '订单信息', bigType: 1, type: 'wodedingdan', color: '#FF6633',  path: '/pagesMessage/order/list'},
		// {title: '优惠活动', bigType: 2, type: 'youhuihuodong', color: '#009EBA', },
		{title: '通知消息', bigType: 3, type: 'tongzhixiaoxi', color: '#85CAE4',  path: '/pagesMessage/notice/list'},
		{title: '我的橙汁', bigType: 4, type: 'wodezichan', color: '#FF6633',  path: '/pagesMessage/riches/list'},
		{title: '联系方橙君', bigType: 5, type: 'kefuzhongxin', color: '#85CAE4', path: '/pagesMessage/contact/index'},
	])
	const listData = ref([])
	const isHasSub = ref(true)
	
	const verify = () => {
		uni.getSetting({
			withSubscriptions: true,
			success: (e) => {
				console.log(e)
			}
		})
	}
	
	onShow(() => {
		loginStatus.value = uni.getStorageSync('token') ? '1' : '2'
		if (loginStatus.value == '1') {
			getList()
			hasSubWxApp()
		}
	})
</script>

<style lang="scss" scoped>
	.message-index-page{
		width: 100%;
		height: 100vh;
		padding-top: 10rpx;
		background-color: #fff;
		.msg-list{
			padding: 0 24rpx;
			margin-top: 10rpx;
			background-color: #fff;
			.li{
				display: flex;
				padding: 24rpx 10rpx 24rpx 18rpx;
				align-items: center;
				position: relative;
				margin-bottom: 18rpx;
				&:active{
					background-color: #eee;
				}
				&::after{
					content: '';
					position: absolute;
					bottom: 0;
					left: 128rpx;
					right: 0;
					height: 1rpx;
					background-color: #D8D8D8;
					transform: scaleY(0.5);
				}
				&:last-child{
					// &::after{
					// 	display: none;
					// }
				}
				.li-icon-l{
					width: 88rpx;
					height: 88rpx;
					border-radius: 16rpx;
					background-color: #F8F8F8;
					margin-right: 24rpx;
					position: relative;
					display: flex;
					align-items: center;
					justify-content: center;
					.badge{
						background-color: #FF6633;
						color: #fff;
						height: 22rpx;
						min-width: 22rpx;
						text-align: center;
						line-height: 22rpx;
						border-radius: 10rpx;
						position: absolute;
						top: -10rpx;
						right: -10rpx;
						font-size: 18rpx;
						padding: 0 6rpx;
					}
				}
				.li-content{
					flex: 1;
					position: relative;
					.top{
						display: flex;
						justify-content: space-between;
						align-items: center;
						margin-bottom: 16rpx;
						position: relative;
						.dot{
							position: absolute;
							top: 50%;
							right: 6rpx;
							transform: translateY(-50%);
							width: 12rpx;
							height: 12rpx;
							border-radius: 50%;
							background-color: #FF6633;
						}
						.title{
							font-size: 28rpx;
							color: #333;
							font-weight: 500;
						}
						.time{
							font-size: 24rpx;
							color: #999;
						}
					}
					.bottom{
						font-size: 24rpx;
						color: #666;
						
					}
					.icon-right{
						position: absolute;
						bottom: 0;
						right: 0;
						color: #999;
					}
				}
			}
		}
		.not-logged-in{
			width: 100%;
			height: 100%;
			display: flex;
			flex-direction: column;
			align-items: center;
			padding-top: 142rpx;
			image, img{
				width: 254rpx;
				height: 245rpx;
			}
			.tips{
				font-size: 24rpx;
				color: #999;
				margin-top: 60rpx;
				margin-bottom: 20rpx;
			}
		}
	}
</style>