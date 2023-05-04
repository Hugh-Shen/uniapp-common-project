<template>
	<view class="login">
		<view class="login-messages">
			<view class="login-messages-title">
				<view class="">欢迎使用方程圈</view>
				<view class="">你困惑的，圈里都有答案</view>
			</view>
			<view class="logo">
				<image src="/static/logo.png" mode="" />
				<view class="">方程圈</view>
			</view>
		</view>
		<view class="login-btn">
			<view class="">
				<!-- <van-button
					type="default"
					round
					color="#0256FF"
					block
					disabled
					:custom-style="customStyle"
				>
					使用手机号登录
				</van-button> -->
				<van-button
					v-if="!approve"
					type="default"
					round
					block
					color="#07C160"
					:custom-style="customStyle + 'margin-top: 32rpx;'"
					@click="() => showHint = true"
				>
					使用微信登录
				</van-button>
				
				<van-button
					v-else
					type="default"
					round
					block
					color="#07C160"
					open-type="getPhoneNumber"
					:disabled="!approve"
					:custom-style="customStyle + 'margin-top: 32rpx;'"
					@getphonenumber="getphonenumber"
				>
					使用微信登录
				</van-button>
			</view>
			<view class="approve">
				<view class="circle">
					<view v-show="approve" class="bc"></view>
					<view v-show="!approve && showHint" class="hint">请先阅读并同意协议</view>
					<view class="mask" @click="setApprove"></view>
				</view>
				<view class="content">
					<text>登录即代表同意</text>
					<text class="ligth-color" @click="() => navigationToSpecifiedPage('/pagesProtocol/use/index')">《用户使用协议》</text>
					<text>及</text>
					<text class="ligth-color"  @click="() => navigationToSpecifiedPage('/pagesProtocol/privacy/index')">《隐私政策》</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { ref } from 'vue'
	import { getSystemInfo } from "@/utils/login.js"
	import { navigationToMain, getcurrentPageOption, navigationToSpecifiedPage, returnExcludeParameter } from '@/utils/common.js'
	import { useUserStore } from '@/stores/user.js'
	import localStorage from '@/utils/localStorage.js'
	import api from './api.js'
	import { TABBAR_PATH } from '@/config/default.js'
	
	const customStyle = 'height: 84rpx;'
	const user = useUserStore()
	const approve = ref(false)
	const showHint = ref(false)
	
	const getUserInfo = async (params) => await api.getUserInfo(params)
	const canChangeUserName = async (params) => await api.canChangeUserName(params)
	
	const loginFn = async (params) => {
		const { data } = await api.parseInfoNew(params)
		localStorage.set('token', data.access_token || '')
		localStorage.set('openid', params.openid || '')
		localStorage.set('unionid', params.unionid || '')
		user.setToken(data.access_token || '')
		user.setAward(data.award || null)
		uni.hideLoading()
		if (data) {
			const res = await getUserInfo()
			user.setUserInfoData(res.data)
			// 是否跳转指引页
			const res_guide = await canChangeUserName()
			
			if (res_guide.data && !uni.getStorageSync('hasSetName')) {
				uni.redirectTo({
					url: '/pages/login/guide'
				})
			} else {
				const { replace, isGoBack } = getcurrentPageOption()
				const filterOpt = returnExcludeParameter(['replace'])
				const otherParams = Boolean(filterOpt.length)
				const _opt = otherParams ? filterOpt.reduce((cur, next) => cur + `&${next}`) : ''
				
				if (isGoBack) {
					uni.navigateBack()
				} else {
					const pages = getCurrentPages()
					const isRedundant = pages.findLastIndex((item) => `/${item.route}` === replace)
					if (isRedundant >= 0) {
						// 能否直接修改路由栈了
						
						// const route = pages.splice(isRedundant, 1)
						uni.$emit('reload')
						return uni.navigateBack({ delta: pages.length - (isRedundant + 1) })
					}
					
					uni.redirectTo({
						url: replace ? `${replace}${otherParams ? ('?$' + _opt) : ''}` : '/pages/index/index',
					})
				}
				
			}
			
			// if (TABBAR_PATH.includes(replace)) {
			// 	uni.reLaunch({
			// 		url: targetReplace ? targetReplace : '/pages/index/index',
			// 	})
			// } else {
			// 	if (isGoBack) {
			// 		uni.navigateBack()
			// 	} else {
			// 		uni.redirectTo({
			// 			url: targetReplace ? targetReplace : '/pages/index/index',
			// 		})
			// 	}
			// }
		}
	}
	
	
	const getphonenumber = async ({ detail }) => {
		// 如果拒绝登录，不做处理
		if (!detail.code) return
		const openid = localStorage.get('openid')
		const unionid = localStorage.get('unionid')
		uni.showLoading({
			title: '正在登录'
		})
		const inviteData = uni.getStorageSync('inviteData')
		if (openid && unionid) {
			loginFn({
				code: detail.code,
				openid,
				unionid,
				inviteUserId: inviteData.inviteUserId??0,
				inviteType: inviteData.inviteType??0
			})
		} else {
			try {
				await getSystemInfo().then(({ openid, unionid }) => {
					loginFn({
						code: detail.code,
						openid,
						unionid,
						inviteUserId: inviteData.inviteUserId??0,
						inviteType: inviteData.inviteType??0
					})
				})
			} catch (e) {
				uni.hideLoading()
				console.warn('login error')
			}
		}
	}
	
	const setApprove = () => {
		showHint.value = !showHint.value
		approve.value = !approve.value
	}
	
</script>

<style lang="scss" scoped>
	.login {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-top: 100rpx;
		font-size: 24rpx;
		&-messages {
			display: flex;
			flex-direction: column;
			align-items: center;
			&-title {
				color: $uni-text-color-grey;
				& > view:first-child {
					font-size: 40rpx;
					color: #000;
				}
			}
			.logo {
				text-align: center;
				font-size: 28rpx;
				margin-top: 40rpx;
				& > image {
					width: 144rpx;
					height: 144rpx;
					border-radius: 50%;
					margin-bottom: 10rpx;
				}
			}
		}
		&-btn {
			display: flex;
			flex-direction: column;
			align-items: center;
			width: 100%;
			margin-top: 92rpx;
			padding: 0 24rpx;
			& > view:first-child {
				display: flex;
				flex-direction: column;
				width: 100%;
			}
			.approve {
				display: flex;
				justify-content: center;
				// width: 320rpx;
				width: 100%;
				font-size: 24rpx;
				margin-top: 19rpx;
				.circle {
					flex-shrink: 0;
					display: flex;
					justify-content: center;
					align-items: center;
					width: 25rpx;
					height: 25rpx;
					border: 1px solid $uni-text-color-grey;
					border-radius: 50%;
					margin-top: 5rpx;
					position: relative;
					.mask {
						position: absolute;
						left: 50%;
						top: 50%;
						transform: translate(-50%, -50%);
						width: 50rpx;
						height: 50rpx;
					}
					.bc {
						width: 12rpx;
						height: 12rpx;
						background-color: $uni-text-color-grey;
						border-radius: 50%;
					}
					.hint {
						position: absolute;
						bottom: -80rpx;
						left: -30rpx;
						width: 300rpx;
						height: 58rpx;
						line-height: 58rpx;
						text-align: center;
						color: #fff;
						font-size: 28rpx;
						border-radius: 8rpx;
						background-color: #000;
						&::before {
							content: '';
							width: 14rpx;
							height: 14rpx;
							position: absolute;
							left: 32rpx;
							top: -7rpx;
							background-color: #000;
							transform: rotate(45deg);
						}
					}
				}
				.content {
					color: $uni-text-color-grey;
					margin-left: 10rpx;
					.ligth-color {
						color: #94BFFF;
					}
				}
			}
		}
	}
</style>