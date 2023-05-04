<template>
	<view class="login-guide-page">
		<view class="ignore" @click="ignoreFn">跳过</view>
		<view class="input-box">
			<input
				:value="editName"
				type="nickname"
				:border="false"
				:maxlength="12"
				placeholder="请输入你的专属用户名"
				@focus="focus"
				@input="handleChangeToInput"
				@nicknamereview="nicknamereview"
			/>
			<view v-if="showLength" class="count">{{ nameLength }}</view>
		</view>
		<view class="tips">填写用户名，即可获得5橙汁哟～</view>
		<view class="login-btn fcq-clickable" @click="setUserUserName">确定登录</view>
	</view>
</template>

<script setup>
	import { ref, computed } from 'vue'
	import api from "./api.js"
	
	const editName = ref('')
	
	const nameLength = computed(() => {
		return `${editName.value.length}/12`
	})
	
	const showLength = ref(true)
	
	const handleChangeToInput = ({ detail }) => {
		editName.value = detail.value
	}
	
	const ignoreFn = () => {
		uni.setStorageSync('hasSetName', true)
		uni.navigateBack()
	}
	
	const getUserInfo = async () => {
		await api.getUserInfo().then(({ data }) => {
			user.setUserInfoData(data)
		})
	}
	
	const nicknamereview = ({ detail }) => {
		
		if (detail.pass) {
			showLength.value = false
		}
	}
	
	const focus = () => {
		showLength.value = true
	}
	
	const setUserUserName = async () => {
		const { code } = await api.setUserUserName({
			userName: editName.value
		})
		if (code == 200) {
			uni.setStorageSync('hasSetName', true)
			uni.showToast({
				title: '修改成功',
				success: () => {
					getUserInfo()
					setTimeout(() => {
						uni.$emit('reload')
						uni.navigateBack()
					}, 1000)
				}
			})
		}
	}
</script>

<style lang="scss" scoped>
	.login-guide-page{
		padding: 108rpx 24rpx 24rpx;
		width: 100%;
		height: 100vh;
		background-color: #fff;
		position: relative;
		.ignore{
			color: #333333;
			font-size: 28rpx;
			line-height: 28rpx;
			position: absolute;
			top: 24rpx;
			right: 24rpx;
		}
		.input-box{
			width: 100%;
			height: 82rpx;
			background: #F8F8F8;
			border-radius: 16rpx;
			border: 1rpx solid #999999;
			position: relative;
			input{
				height: 100%;
				line-height: 82rpx;
				color: #333;
				font-size: 28rpx;
				padding: 0 80rpx 0 20rpx;
			}
			.count{
				position: absolute;
				font-size: 28rpx;
				color: #999;
				right: 20rpx;
				top: 50%;
				transform: translateY(-50%);
			}
		}
		.tips{
			color: #999999;
			line-height: 28rpx;
			font-size: 28rpx;
			margin-top: 20rpx;
		}
		.login-btn{
			margin-top: 40rpx;
			width: 100%;
			height: 84rpx;
			background: #FF9933;
			text-align: center;
			line-height: 84rpx;
			font-size: 28rpx;
			font-weight: 500;
			color: #FFFFFF;
			border-radius: 42rpx;
		}
	}
</style>