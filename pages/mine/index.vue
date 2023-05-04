<template>
	<page-meta :page-style="'overflow:'+(guideShow && canEditUsername?'hidden':'visible')"></page-meta>
	<view class="mine">
		<Card class="mt-16" :name="userInfo.userName" :juice="userInfo.userAccount?.currentTotalAmount" :avatar="userInfo.avatar || ''" :canEditUsername="tipsShow" @closeTips="closeTips" />
		<swiper class="swiper" indicator-dots indicator-color="#fff" indicator-active-color="#FF9933">
			<swiper-item>
				<view class="swiper-item">
					<image src="https://hr-community-new-prod.obs.cn-south-1.myhuaweicloud.com/obs/adcyle/sign/20230320/悬赏-banner.png" mode="aspectFill" />
				</view>
			</swiper-item>
		</swiper>
		<ActionBar title="我的工具" round :list="actionBarList" @onClick="navigation" />
		<!-- view.guide- -->
		<van-overlay :show="guideShow && canEditUsername" class="guide-overlay" >
			<view class="user-name-box" @click="gotoUserInfo">
				<image class="guide-avatar" :src="userInfo.avatar || defaultAvatar" mode="aspectFill" />
				<view class="name">{{userInfo.userName}}</view>
				<van-icon class="arrow-icon" name="arrow" />
				<image class="guide_i" :src="guide_i" />
			</view>
			<image class="guide_1" :src="guide_1" mode="heightFix" />
			<view class="close-btn" @click="closeGuide">我知道了</view>
		</van-overlay>
	</view>
</template>

<script setup>
	import { computed, onBeforeMount, onMounted, ref, toRaw, toRefs } from "vue"
	import { useUserStore } from '@/stores/user.js'
	import { onShow } from '@dcloudio/uni-app'
	import { navigationToSpecifiedPage } from "@/utils/common.js"
	import Card from "./components/Card.vue"
	import ActionBar from "@/components/action-bar/action-bar.vue"
	import { GUIDE_STEP } from '@/config/default.js'
	import api from "./api.js"
	import commonApi from '@/api/common.api.js'
	
	const guide_1 = '/static/guide-1.png'
	const guide_i = '/static/guide-i.png'
	const defaultAvatar = '/static/default-avatar.png'
	
	const guideShow = ref(false)
	const canEditUsername = ref(false)
	const actionBarList = [
		{
			icon: 'kefuzhongxin',
			label: '联系方橙君',
			color: '#85CAE4',
			navigation: '/pagesMessage/contact/index',
		},
		{
			icon: 'wodedingdan',
			label: '我的订单',
			color: '#FF6633',
			navigation: '/pagesMine/order/index',
		},
		{
			icon: 'wodedizhi',
			label: '我的地址',
			color: '#009EBA',
			navigation: '/pagesMarket/address/index?mine=1',
		},
		{
			icon: 'guanyuwomen',
			label: '关于我们',
			color: '#FF9933',
			navigation: '/pagesMine/aboutUs/index',
		},
	]
	
	const tipsShow = computed(() => {
		return canEditUsername.value && !guideShow.value
	})
	
	/* 数据请求 */
	const getUserInfo = () => {
		api.getUserInfo().then(({ data }) => {
			user.setUserInfoData(data)
		})
	}
	
	const user = useUserStore()
	const { userInfo, token } = toRefs(user.store)

	const navigation = (val) => {
		if (!val.navigation) {
			return uni.showToast({
				icon: 'none',
				title: '功能暂未开放,敬请期待！'
			})
		}
		navigationToSpecifiedPage(val.navigation)
	}
	
	const closeGuide = () => {
		guideShow.value = false
		commonApi.coverReadIncrStep().then(res => {
			
		})
	}
	
	const closeTips = () => {
		canEditUsername.value = false
	}
	
	const gotoUserInfo = () => {
		closeGuide()
		navigationToSpecifiedPage({ url: '/pagesMine/info/index' })
	}
	
	onShow(() => {
		if (token.value) {
			commonApi.getCurrentStep().then(res => {
				guideShow.value = GUIDE_STEP == res.data
			})
			api.canChangeUserName().then(({ data }) => {
				canEditUsername.value = data
			})
		} else {
			canEditUsername.value = false
		}
	})

	onBeforeMount(() => {
		const info = toRaw(userInfo.value)
		if (!Object.keys(info).length && token.value) {
			return getUserInfo()
		}
	})
</script>

<style lang="scss" scoped>
	.mine {
		display: flex;
		flex-direction: column;
		padding: 0 24rpx;
		.swiper {
			height: 394rpx;
			margin: 16rpx 0;
			&-item {
				width: 100%;
				height: 100%;
				border-radius: 16rpx;
				overflow: hidden;
				& > image {
					width: 100%;
					height: 100%;
				}
			}
		}
	}
	.guide-overlay{
		position: relative;
		.user-name-box{
			position: absolute;
			top: 62rpx;
			left: 69rpx;
			padding: 12rpx;
			background-color: #fff;
			border-radius: 32rpx;
			display: flex;
			align-items: center;
			min-width: 120rpx;
			> image.guide-avatar, img.guide-avatar{
				width: 112rpx;
				height: 112rpx;
				border-radius: 50%;
				margin-right: 8rpx;
			}
			.name{
				font-size: 28rpx;
				color: #333333;
				line-height: 30rpx;
				margin-right: 20rpx;
			}
			.arrow-icon{
				line-height: 30rpx;
			}
			.guide_i{
				position: absolute;
				width: 35rpx;
				height: 38rpx;
				top: -18rpx;
				right: -22rpx;
				z-index: 9;
			}
		}
		.guide_1{
			position: absolute;
			height: 136rpx;
			top: 200rpx;
			left: 100rpx;
		}
		.close-btn{
			width: 240rpx;
			height: 72rpx;
			border-radius: 124rpx 124rpx 124rpx 124rpx;
			border: 2rpx solid #FFFFFF;
			position: absolute;
			bottom: 180rpx;
			left: 50%;
			transform: translateX(-50%);
			color: #fff;
			font-size: 28rpx;
			line-height: 72rpx;
			text-align: center;
			font-weight: 500;
		}
	}
</style>