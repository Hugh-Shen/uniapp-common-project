<template>
	<view class="username">
		<view class="hint">
			<view class="">昵称不能超过12个字符</view>
		</view>
		<view class="input-contianer">
			<input
				type="nickname"
				:border="false"
				:maxlength="12"
				:placeholder="name"
				@focus="focus"
				@input="handleChangeToInput"
				@nicknamereview="nicknamereview"
			/>
			<view v-if="showLength" :class="[ nameLength ? 'length' : '' ]">{{ `${nameLength}/12` }}</view>
		</view>
		
		<view class="font-28" :style="{ marginTop: '63rpx' }">
			<van-button
				type="default"
				round
				:color="nameLength ? '#FF9933' : '#D8D8D8'"
				block
				:custom-style="customStyle"
				:disabled="nameLength <= 0"
				@click="save"
			>
				保存
			</van-button>
		</view>
	</view>
</template>

<script setup>
	import { computed, ref, toRefs } from "vue"
	import { onLoad, onShow } from '@dcloudio/uni-app'
	import { useUserStore } from '@/stores/user.js'
	import api from "@/pagesMine/info/api.js"
	

	const customStyle = 'height: 35px;'
	
	const showLength = ref(true)
	
	/* 数据请求 */
	const getUserInfo = async () => {
		await api.getUserInfo().then(({ data }) => {
			user.setUserInfoData(data)
		})
	}
	const setUserUserName = async (params) => {
		const { code } = await api.setUserUserName(params)
		if (code == 200) {
			uni.showToast({
				title: '修改成功',
				success: () => {
					getUserInfo()
					setTimeout(() => {
						uni.navigateBack()
					}, 1500)
				}
			})
		}
	}
	
	const user = useUserStore()
	const { userInfo } = toRefs(user.store)
	const name = ref(userInfo.value?.userName || '')
	const editName = ref('')
	
	const nameLength = computed(() => editName.value.length)
	
	const handleChangeToInput = ({ detail }) => {
		editName.value = detail.value
	}
	const focus = () => {
		showLength.value = true
	}
	const nicknamereview = ({ detail }) => {
		
		if (detail.pass) {
			showLength.value = false
		}
	}
	const save = () => {
		setUserUserName({ userName: editName.value })
	}
</script>

<style lang="scss" scoped>
	.username {
		display: flex;
		flex-direction: column;
		align-items: center;
		height: 100vh;
		padding: 70rpx 120rpx 0;
		font-size: 24rpx;
		color: #333333;
		background-color: #fff;
		& > view {
			width: 100%;
		}
		.hint {
			font-size: 28rpx;
		}
		.input-contianer {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 72rpx;
			margin-top: 10rpx;
			padding: 0 10rpx;
			border: 1px solid $uni-border-grey;
			border-radius: 8rpx;
			color: #666;
			input{
				flex: 1;
				height: 100%;
				font-size: 28rpx;
			}
			.length {
				color: $uni-text-color;
			}
		}
	}
	:deep(.van-cell) {
		padding: 0 !important;
	}
</style>