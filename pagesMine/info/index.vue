<template>
	<view class="info root">
		<Cell label="头像" :showArrow="false">
			<van-uploader @after-read="handleAfterRead">
				<view class="avatar-box">
					
					<view class="avatar">
						<image :src="formData.avatar || '/static/default-avatar.png'" mode="aspectFill" />
					</view>
					<view class="arrow reset-arrow"></view>
				</view>
			</van-uploader>
		</Cell>
		<Cell
			label="用户名"
			:value="formData.userName"
			@onClick="canEditUsernameFn"
		/>
		<!-- <Cell
			label="个性签名"
			:showArrow="false"
			:value="formData.signature"
		/> -->
		<Cell label="生日" :value="formData.birthday" @onClick="handleClickToCellEvent"></Cell>
		<Cell label="性别" :value="GENDER_TEXT[formData.sex - 1]" @onClick="handleClickToCellEvent"></Cell>
		<Cell label="手机号码" :value="formData.mobile" :showArrow="false"></Cell>
		<view class="btn-container">
			<van-button
				type="default"
				round
				color="#fff"
				block
				:custom-style="customStyle"
				@click="loginOut"
			>
				退出登录
			</van-button>
		</view>
		
		<SelectPopup
			v-if="selectPopupShow"
			:type="selectPopupType"
			:value="selectPopupValue"
			:show="selectPopupShow"
			:list="GENDER"
			@onClose="selectPopupShow = false"
			@onSave="handleClickToSave"
		/>
		<LoginOutPopup
			v-if="loginOutShow"
			:show="loginOutShow"
			@close="() => loginOutShow = false"
			@save="clearUserInfo"
		/>
		<FcqCorp v-if="cropData.src" :src="cropData.src" :width="300" :height="300" :movableWidth="cropData.movableWidth" 
			:movableHeight="cropData.movableHeight" :canvasWidth="cropData.canvasWidth" :canvasHeight="cropData.canvasHeight"
			type="circle" @onMovableScale="movableScale" @onSave="cropSave" @onClose="corpClose" @onChange="chooseUploadType"
		/>
	</view>
</template>

<script setup>
	import { onBeforeMount, ref, toRefs, toRaw, computed, nextTick, reactive } from "vue"
	import { onShow } from '@dcloudio/uni-app'
	import { navigationToSpecifiedPage, navigationToMain } from "@/utils/common.js"
	import { useUserStore } from '@/stores/user.js'
	import { GENDER_TEXT, GENDER } from '@/config/default.js'
	import Cell from "@/components/cell/cell.vue"
	import SelectPopup from "@/components/select-popup/select-popup.vue"
	import LoginOutPopup from "./components/LoginOutPopup.vue"
	import OBSupload from "@/OBS/obsUpload.js"
	import dayjs from "@/utils/dayjs.min.js"
	import localStorage from "@/utils/localStorage.js"
	import api from "./api.js"
	import FcqCorp from '@/components/corp.vue';

	const currentDate = new Date().getTime()
	const minDate = new Date().getTime()
	const customStyle = 'height: 42px;color: #000;'
	const initFormData = {
		avatar: '',
		userName: '',
		signature: '',
		birthday: '',
		sex: '',
		mobile: '',
	}
	
	
	/* 数据请求 */
	const canCurrentMonthEditUsername = () => {
		api.canCurrentMonthEditUsername().then(({ data }) => {
			canEditUsername.value = data
		})
	}
	const getUserInfo = () => {
		api.getUserInfo().then(({ data }) => {
			formData.value = data
			user.setUserInfoData(data)
		})
	}
	const loginOutFn = () => {
		api.loginOut().then(({ data, msg }) => {
			uni.showToast({
				title: msg || '操作成功',
				mask: true,
			})
			// clear info
			user.setUserInfoData({})
			user.setToken('')
			user.setShowGuidance(true)
			localStorage.remove('token')
			setTimeout(() => {
				navigationToMain('/pages/mine/index')
			}, 1500)
		})
	}
	const strategyRequstFn = (type, params) => {
		const list = {
			avatar: (params) => api.setUserAvatar(params),
			birthday: (params) => api.setUserBirthday(params),
			sex: (params) => api.setUserGender(params),
		}
		list[type](params).then(() => {
			uni.showToast({
				title: '操作成功',
			})
			selectPopupShow.value = false
			// 刷新界面
			getUserInfo()
		})
	}
	
	const user = useUserStore()
	const { userInfo } = toRefs(user.store)
	const formData = ref({})
	const selectPopupShow = ref(false)
	const selectPopupType = ref('default')
	const selectPopupValue = ref(null)
	const canEditUsername = ref(true)
	const loginOutShow = ref(false)

	// 裁剪开始
	const cropData = reactive({ // 裁剪数据
		src: '', // 裁剪图片地址
		movableWidth: 300,
		movableHeight: 300,
		canvasWidth: 300,
		canvasHeight: 300,
	})
	const chooseUploadType = () => {
		uni.chooseImage({
			count: 1,
			sizeType: ['original', 'compressed'],
			sourceType: ['album', 'camera'],
			success: (chooseres) => {
				setCanvasSize(chooseres.tempFilePaths[0])
				// cropData.src = chooseres.tempFilePaths[0]
				// uni.getImageInfo({
				// 	src: chooseres.tempFilePaths[0],
				// 	success: (imgres) => {
				// 		console.log(imgres.width, imgres.height)
				// 		const aspectRatio = imgres.width/imgres.height
				// 		if (aspectRatio >= 1) {
				// 			cropData.canvasHeight = 300
				// 			cropData.movableHeight = 300
				// 			cropData.movableWidth = imgres.width * (300/imgres.height)
				// 			cropData.canvasWidth = imgres.width * (300/imgres.height)
				// 		} else {
				// 			cropData.canvasWidth = 300
				// 			cropData.movableWidth = 300
				// 			cropData.canvasHeight = imgres.height * (300/imgres.width)
				// 			cropData.movableHeight = imgres.height * (300/imgres.width)
				// 		}
				// 	}
				// })
			}
		})
	}
	const setCanvasSize = (url) => {
		cropData.src = url
		uni.getImageInfo({
			src: url,
			success: (imgres) => {
				console.log(imgres.width, imgres.height)
				const aspectRatio = imgres.width/imgres.height
				if (aspectRatio >= 1) {
					cropData.canvasHeight = 300
					cropData.movableHeight = 300
					cropData.movableWidth = imgres.width * (300/imgres.height)
					cropData.canvasWidth = imgres.width * (300/imgres.height)
				} else {
					cropData.canvasWidth = 300
					cropData.movableWidth = 300
					cropData.canvasHeight = imgres.height * (300/imgres.width)
					cropData.movableHeight = imgres.height * (300/imgres.width)
				}
			}
		})
	}
	const movableScale = (val) => {
		cropData.canvasWidth = val.width
		cropData.canvasHeight = val.height
	}
	const cropSave = (val) => {
		// signData.mainImgSrc = val.cut_src
		OBSupload(val.cut_src, 'avatar', (fullUrl, url) => {
			strategyRequstFn('avatar', { avatar: url})
		})
		cropData.src = ''
	}
	const corpClose = () => {
		cropData.src = ''
	}
	// 裁剪结束
	
	const handleAfterRead = ({ detail: file }) => {
		setCanvasSize(file.file.url)
		// cropData.src = file.file.url
		// OBSupload(file.file.url, 'avatar', (url) => {
		// 	strategyRequstFn('avatar', { avatar: url.slice(url.indexOf('.com') + 6)})
		// })
	}
	const dateTransitionToNumber = (date) => {
		if (!date){
			return new Date().getTime()
		}
		const time = dayjs(date).toDate()
		return time.getTime()
	}
	const handleClickToCellEvent = ({ label, value, key }) => {
		selectPopupType.value = key
		if (['birthday', 'default'].includes(key)) {
			selectPopupType.value = key	=== 'birthday' ? 'date' : 'default'
		}
		selectPopupShow.value = true
		selectPopupValue.value = key === 'default' ? [formData.value.sex - 1] : dateTransitionToNumber(formData.value.birthday)
	}
	const handleClickToSave = ({ type, value }) => {
		const map = {
			date: 'birthday',
			default: 'sex',
		}
		let key = map[type]
		let params = {}
		switch(key) {
			case 'birthday':
				// formData.value.birthday = value.date
				params = { birthday: value.date }
				break
			default:
				formData.value.sex = value.picker[0] + 1
				params = { sex: value.picker[0] + 1 }
				break
		}
		
		strategyRequstFn(key, params)
	}
	const canEditUsernameFn = () => {
		// if (canEditUsername.value) {
			navigationToSpecifiedPage(`/pagesMine/username/index?name=${formData.userName}`)
		// }
	}
	const clearUserInfo = () => {
		loginOutShow.value = false
		loginOutFn()
	}
	const loginOut = () => {
		loginOutShow.value = true
	}
	
	onShow(() => {
		getUserInfo()
		if(userInfo.value.userName !== formData.value.userName) {
			formData.value = {
				...initFormData,
				...toRaw(userInfo.value),
			}
			canCurrentMonthEditUsername()
		}
	})
	// onBeforeMount(() => {
	// 	formData.value = {
	// 		...initFormData,
	// 		...toRaw(userInfo.value),
	// 	}
		
	// 	canCurrentMonthEditUsername()
	// })
</script>

<style lang="scss" scoped>
	.info {
		height: calc(100vh);
		position: relative;
		& :deep(.cell) {
			border-bottom: 1px solid $uni-bg-color-grey;
		}
		.btn-container {
			position: absolute;
			bottom: 80rpx;
			left: 0;
			width: 100%;
			padding: 0 24rpx;
		}
		.avatar-box{
			display: flex;
			align-items: center;
		}
		.avatar {
			width: 112rpx;
			height: 112rpx;
			& > image {
				width: 100%;
				height: 100%;
				border-radius: 50%;
			}
		}
		.reset-arrow {
			flex-shrink: 0;
			width: 15rpx;
			height: 15rpx;
			margin-left: 32rpx;
		}
	}
	.birthday-container{
		width: 100vw;
		padding: 70rpx 50rpx 85rpx;
		picker-view {
			height: 300rpx;
			.picker-item {
				display: flex;
				justify-content: center;
				line-height: 34px;
			}
		}
		.footer {
			padding-top: 20rpx;
			.btn-container {
				display: flex;
				justify-content: center;
				height: 70rpx;
			}
		}
	}
</style>