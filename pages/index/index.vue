<template>
	<view class="root">
		<nav-bar>
			<view class="nav-bar-content">
				<!-- <image class="background" src="/static/navbar-bgc.png" /> -->
				<image class="logo" src="/static/logo.png" />
				<view class="name">
					<view>方程圈</view>
					<view class="font-24">你困惑的 圈里都有答案</view>
				</view>
			</view>
		</nav-bar>
		<view class="content-view">
			<SignIn :sign="todaySign" :currentIntegral="userInfo.userAccount?.availableAmount" @click="signInEvent"></SignIn>
			<view class="calendar-container">
				<NewCalendar v-if="unfold" :date="signIn" @change="monthSwitchFn" />
				<Week v-else :list="weekData" />
				<!-- <view class="arrow-container" @click="() => unfold = !unfold"><view :class="['arrow', unfold ? 'buttom-arrow' : 'top-arrow']"></view></view> -->
				<view class="arrow-container" @click="unfoldChange">
					<van-icon size="18" color="#999" :name="unfold?'arrow-up':'arrow-down'" />
				</view>
			</view>
			<view class="other-contianer">
				<swiper class="swiper" autoplay circular :interval="3000" indicator-dots indicator-color="#fff" indicator-active-color="#FF9933">
					<swiper-item>
						<view class="swiper-item" @click="gotoGcs">
							<image src="https://hr-community-new-prod.obs.cn-south-1.myhuaweicloud.com/obs/adcyle/sign/20230320/gcs-banner.png" mode="aspectFill" />
						</view>
					</swiper-item>
					<swiper-item>
						<view class="swiper-item">
							<image src="https://hr-community-new-prod.obs.cn-south-1.myhuaweicloud.com/obs/adcyle/sign/20230320/悬赏-banner.png" mode="aspectFill" />
						</view>
					</swiper-item>
				</swiper>
				<view class="operate">
					<view
					v-for="item in operateList" :key="item.label"
						class="operate-item"
						@click="operateItemEvent(item)"
					>
						<view class="icon">
							<CustomIcon :type="item.icon" />
						</view>
						<view class="t-a-c">{{ item.label }}</view>
					</view>
				</view>
			</view>
		</view>
		<SignPopup ref="signPopupRef" :showHeader="showPopupHeader" :integral="integral"/>
		<Award
			v-if="award"
			:show="awardShow"
			@click="handleClickToAward"
			@close="handleClickToAward"
		/>
	</view>
</template>

<script setup>
	import { reactive, ref, nextTick, toRef, toRefs, toRaw, onBeforeMount } from 'vue'
	import { onLoad, onShow, onShareAppMessage } from '@dcloudio/uni-app'
	import { useUserStore } from '@/stores/user.js'
	import { navigationToSpecifiedPage } from "@/utils/common.js"
	// import { useRequest } from '@/hooks/useRequest.js'
	import NewCalendar from "@/components/new-calendar/new-calendar.vue"
	import CustomIcon from "@/components/custom-icon/custom-icon.vue"
	import SignIn from "./components/SignIn.vue"
	import Week from "./components/Week.vue"
	import SignPopup from "@/components/sign-popup/sign-popup.vue"
	import Award from "@/components/award/award.vue"
	import dayjs from '@/utils/dayjs.min.js'
	import api from "./api.js"
	import commonApi from '@/api/common.api.js'
	
	const { statusBar: { height, top } } = getApp().globalData
	const barHeight = `${height + 10}px`
	const statusTop = `${top - 5}px`
	const barHeightFb = `${height + top + 5}px`
	const operateList = [
		{
			icon: 'xinyuqian',
			label: '心语签',
			url: '/pagesWordSign/index'
		},
		{
			icon: 'paihangbang',
			label: '签到排行',
			url: '/pagesRank/index'
		},
		{
			icon: 'a-fageihaoyouzhifeiji',
			label: '分享好友',
		},
		{
			icon: 'qiandaotixing',
			label: '签到提醒',
			url: '/pagesSign/remind/index',
		},
	]
	
	/* 请求方法 */
	const isTodaySign = () => {
		api.isTodaySign().then(({ data }) => {
			todaySign.value = data
		})
	}
	const sign = async () => {
		return await api.sign().then(res => {
			if (res.code == 200) {
				
				integral.value = res.data
				isTodaySign()
				getUserInfo()
			}
		})
	}
	const weekSign = () => {
		api.weekSign().then(({ data }) => {
			weekData.value = data
		})
	}
	const defaultWeekSign = () => {
		api.defaultWeekSign().then(({ data }) => {
			weekData.value = data
		})
	}
	const monthSign = (params) => {
		api.monthSign(params).then(({ data }) => {
			signIn.value = data
		})
	}
	const defaultMonthSign = (params) => {
		api.defaultMonthSign(params).then(({ data }) => {
			signIn.value = data
		})
	}
	const getUserInfo = () => {
		api.getUserInfo().then(({ data }) => {
			user.setUserInfoData(data)
		})
	}
	

	const user = useUserStore()
	const { userInfo, token, award } = toRefs(user.store)
	const signPopupRef = ref()
	const unfold = ref(false)
	const signIn = ref([])
	const todaySign = ref(false)
	const weekData = ref([])
	const awardShow = ref(true)
	const showShareToast = ref(false)
	const showPopupHeader = ref(true) // 是否显示分享弹窗header
	const integral = ref(0)
	
	const getCurrentYearAndMonth = () => {
		const year = dayjs().year()
		const month = dayjs().month() + 1
		
		return {
			year,
			month: month > 9 ? month : `0${month}`,
		}
	}
	const operateItemEvent = ({ url }) => {
		if (!url && token.value) {
			const share = signPopupRef
			showPopupHeader.value = false
			share.value.share.openShare()
			return
		}
		navigationToSpecifiedPage(url)
	}
	const signInEvent = async () => {
		if (!token.value) return navigationToSpecifiedPage('/pages/login/index')
		
		showPopupHeader.value = true
		if (!todaySign.value) {
			await sign()
			weekSign()
			monthSign(getCurrentYearAndMonth())
			// 展示弹窗
			const share = signPopupRef
			share.value.share.openShare()
		}
	}
	const monthSwitchFn = (val) => {
		if (!token.value) {
			return defaultMonthSign(val)
		}
		monthSign(val)
	}
	const handleClickToAward = () => {
		awardShow.value = false
		user.setUserInfoData({
			...userInfo.value,
			userAccount: { ...userInfo.value.userAccount, firstSign: null },
		})
	}
	
	// const getUrlParams = (url) => {
	//     // \w+ 表示匹配至少一个(数字、字母及下划线), [\u4e00-\u9fa5]+ 表示匹配至少一个中文字符
	//     let pattern = /(\w+|[\u4e00-\u9fa5]+)=(\w+|[\u4e00-\u9fa5]+)/ig;
	//     let result = {};
	//     url.replace(pattern, ($, $1, $2)=>{
	//         result[$1] = $2;
	//     })
	//     return result
	// }
	
	const unfoldChange = () => {
		unfold.value = !unfold.value
		if (unfold.value) {
			if (token.value) {
				monthSign(getCurrentYearAndMonth())
			} else {
				defaultMonthSign(getCurrentYearAndMonth())
			}
		}
	}
	
	const updateFn = () => {
		// 版本自动更新代码
		const updateManager = uni.getUpdateManager()
		updateManager.onUpdateReady(function (e) {
			uni.showModal({
				title: '更新检测',
				content: '检测到新版本，是否重启小程序？',
				success: function (res) {
					if (res.confirm) {
						// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
						updateManager.applyUpdate()
					}
				}
			})
		})
		updateManager.onUpdateFailed(function () {
			// 新的版本下载失败
			uni.showModal({
				title: '已有新版本咯',
				content: '请您删除当前小程序，重新打开呦~',
				showCancel: false
			})
		})
	}
	
	const gotoGcs = () => {
		uni.navigateTo({
			url: '/pagesEvents/gcs/index'
		})
	}
	
	const getAdCycleList = () => { // 获取banner图
		commonApi.getAdCycleList({
			
		})
	}
	
	onLoad((option) => {
		updateFn()
		// if (option.scene) {
		// 	//获取二维码的携带的链接信息
		// 	let qrParams = decodeURIComponent(option.scene)
		// 	let params = getUrlParams(qrParams)
		// 	if (params.invite) {
		// 		user.setInviteData({
		// 			inviteUserId: params.invite,
		// 			inviteType: params.inviteType?params.inviteType:'3' // 邀请类型1分享资料包，2分享商品，3分享签到
		// 		})
		// 	}
		// } else if (option.invite) {
		// 	user.setInviteData({
		// 		inviteUserId: option.invite,
		// 		inviteType: option.inviteType?option.inviteType:'3' // 邀请类型1分享资料包，2分享商品，3分享签到
		// 	})
		// }
	})
	// onShow(() => {
	// 	if (!token.value) {
	// 		defaultWeekSign()
	// 		defaultMonthSign(getCurrentYearAndMonth())
	// 		todaySign.value = false
	// 	}
	// 	if (showShareToast.value) {
	// 		const share = signPopupRef
	// 		share.value.share.closeShare()
	// 		uni.showToast({
	// 			title: '分享成功',
	// 			icon: 'none',
	// 			duration: 2000,
	// 			success: () => {
	// 				showShareToast.value = false
	// 			}
	// 		})
	// 	}
	// })
	
	onShow(() => {
		const info = toRaw(userInfo.value)
		if (!Object.keys(info).length && token.value) {
			getUserInfo()
		}
		if (showShareToast.value) {
			const share = signPopupRef
			share.value.share.closeShare()
			uni.showToast({
				title: '分享成功',
				icon: 'none',
				duration: 2000,
				success: () => {
					showShareToast.value = false
				}
			})
		}
		if (!token.value) {
			// 如果没有登录，调用其它无需权限接口
			defaultWeekSign()
			defaultMonthSign(getCurrentYearAndMonth())
			todaySign.value = false
			return 
		}
	
		isTodaySign()
		weekSign()
		monthSign(getCurrentYearAndMonth())
		
	})
	
	onShareAppMessage(() => {
		const params = signPopupRef.value.shareData()
		showShareToast.value = true
		return {
			...params
		}
	})
	
	console.log('enter page for home')
</script>

<style lang="scss">
	$statusHeight: v-bind('barHeight');
	$statusTop: v-bind('statusTop');
	$barHeightFb: v-bind('barHeightFb');
	.root {
		width: 100vw;
		height: 100vh;
		font-size: 24rpx;
		.nav-bar-content {
			display: flex;
			align-items: center;
			position: relative;
			width: 100%;
			height: 100%;
			color: #666;
			font-size: 28rpx;
			.name {
				font-size: 38rpx;
				line-height: 38rpx;
				color: #000;
				margin: 0rpx 8rpx;
				.font-24{
					line-height: 24rpx;
					margin-top: 2rpx;
				}
			}
			.background {
				position: absolute;
				left: 0;
				top: 0;
				width: 100%;
				height: 100%;
			}
			.logo {
				width: 72rpx;
				height: 72rpx;
			}
		}
		.content-view {
			height: calc(100vh - $statusHeight - $statusTop - 10rpx);
			overflow-y: auto;
			.calendar-container {
				background-color: #fff;
				padding-bottom: 10rpx;
				.arrow-container {
					display: flex;
					justify-content: center;
					align-items: flex-end;
					height: 50rpx;
					// padding-bottom: 10rpx;
					.buttom-arrow {
						width: 20rpx;
						height: 20rpx;
						transform: rotate(45deg);
					}
					.top-arrow {
						width: 20rpx;
						height: 20rpx;
						transform: rotate(225deg);
					}
				}
			}
		}
		.other-contianer {
			padding: 0 24rpx 20rpx;
			.swiper {
				margin-top: 20rpx;
				height: 394rpx;
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
			.operate {
				display: flex;
				justify-content: space-between;
				height: 182rpx;
				border-radius: 16rpx;
				background-color: #fff;
				margin-top: 20rpx;
				padding: 0 44rpx;
				& > view:nth-child(2) > .icon {
					background: linear-gradient(220deg, #DDFCF6 3%, #BFF4D1 96%);
				}
				& > view:nth-child(3) > .icon {
					background: linear-gradient(220deg, #FDEFEE 3%, #F5F1FD 96%);
				}
				& > view:nth-child(4) > .icon {
					background: linear-gradient(220deg, #F0ECFF 3%, #ECF7FF 96%);
				}
				&-item {
					display: flex;
					flex-direction: column;
					justify-content: center;
					& > .icon{
						width: 88rpx;
						height: 88rpx;
						line-height: 88rpx;
						text-align: center;
						border-radius: 16px;
						background: linear-gradient(220deg, #F0ECFF 3%, #ECF7FF 96%);
					}
					& > view:last-child {
						margin-top: 12rpx;
						color: #333;
					}
				}
			}
		}
	}
</style>
