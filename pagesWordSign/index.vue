<template>
	<view class="sign-index-page">
		<view class="goback" @click="goback">
			<van-icon name="arrow-left" size="40rpx"/>
		</view>
		<view class="sign-box">
			<view :class="['sign-content', `style-${signData.format}`]">
				<image class="main-img" :src="signData.mainImgSrc" mode="aspectFill" lazy-load></image>
				<view class="user-box">
					<image :src="userInfo.avatar?userInfo.avatar:defaultAvatar" mode="aspectFill"></image>
					<view class="info">
						<view class="name">我是{{userInfo.userName}}</view>
						<view class="text">邀你加入方程圈<br/>一起签到领橙汁</view>
					</view>
				</view>
				<view class="sing-word">
					<view class="text-1">{{signData.word}}</view>
					<view class="text-2">{{signData.time}}</view>
				</view>
				<view class="time-box">
					<view class="time-day">{{signData.time.substring(8,10)}}</view>
					<view class="time-month">{{signData.time.substring(0,7)}}</view>
				</view>
				<view class="sign-in">
					<view class="box-1">
						<view class="text-1">{{signData.cumulativeDay}}<text>天</text></view>
						<view class="text-2">累计签到</view>
					</view>
					<view class="line"></view>
					<view class="box-2">
						<view class="text-1">{{signData.consecutiveDay}}<text>天</text></view>
						<view class="text-2">连续签到</view>
					</view>
				</view>
				<view class="block"></view>
				<image class="qr-code" :src="userQRCode"></image>
			</view>
			<view class="handle-box">
				<view @click="saveImage">
					<CustomIcon type="xiazai-tianchong" color="#85CAE4" size="25" />
					<view class="font-28 mt-4">保存图片</view>
				</view>
				<view @click="openShare">
					<CustomIcon type="fageihaoyou" color="#28C445" size="25"/>
					<view class="font-28 mt-4" >发给好友</view>
				</view>
			</view>
		</view>
		<view class="tab-box">
			<view v-for="item in tabNavs" :key="item.value" @click="tabClick(item.value)" :class="{ 'active': item.value == tabValue }">{{ item.label }}</view>
		</view>
		<scroll-view v-if="[1,2].includes(tabValue)" class="list-box" scroll-y="true" :show-scrollbar="false" :enhanced="true" @scrolltolower="scrolltolower">
			<view v-if="tabValue == 1">
				<view class="ul-box pb-80" @click="chooseFormat">
					<image :class="['li-box', 'format-list', signData.format == item.id ? 'active' : '']" v-for="(item) in formatList" :key="item.id" :src="item.imageUrl + '?x-image-process=image/resize,w_100,limit_1/sharpen,100'" :data-format="item.id+''" lazy-load />
				</view>
			</view>
			<view v-if="tabValue == 2">
				<view class="ul-box" @click="chooseImg">
					<image :class="['li-box', 'img-list', signData.mainImgSrc == item ? 'active' : '']" v-for="(item,index) in dataSource.imgList" :key="index" :src="item + '?x-image-process=image/resize,w_100,limit_1/sharpen,100'" :data-src="item" />
				</view>
				<view class="choose-type">
					<view class="upload-btn fcq-clickable" @click="chooseUploadType">照片上传</view>
					<view class="random-btn fcq-clickable" @click="randomFn">随机一张</view>
				</view>
				
			</view>
		</scroll-view>
		<view class="word-box" v-if="[3].includes(tabValue)">
			<picker-view class="word-ul" :value="[wordIndex]" indicator-class="pickerView" @change="wordChange">
				<picker-view-column>
					<view class="word-item" v-for="(item, index) in wordList" :key="index">{{item}}</view>
				</picker-view-column>
			</picker-view>
			<view class="custom-btn fcq-clickable" @click="customWord">自定义</view>
		</view>
	</view>
	<van-popup :show="customShow" round custom-style="background-color: transparent;">
		<view class="custom-box">
			<view class="font-28 t-a-c mb-14">编辑文字</view>
			<view class="surround">
				<!-- <van-field v-model:value="customText" custom-style="border: 1rpx solid #999;border-radius: 16rpx;height:160rpx" type="textarea" maxlength="20"  show-word-limit placeholder="输入你喜欢的文字吧~" autosize="{minHeight: 160rpx}" cursor-spacing="" @change="fieldChange"/> -->
				<textarea class="custom-textarea" :value="customText" type="text" :maxlength="20" placeholder="输入你喜欢的文字吧~" @input="fieldChange"/>
				<text class="maxlength">{{wordLength}}/20</text>
			</view>
			<!-- <button :class="['submit-btn', 'fcq-clickable', customText?'can':'']" @click="customSubmit">确定</button> -->
			<button :class="['submit-btn', customText?'can':'']" :disabled="!customText" @click="customSubmit">确定</button>
			<van-icon class="custom-close" name="close" size="40rpx" @click="closeCustom"/>
		</view>
	</van-popup>
	<SharePopup ref="sharePopupRef" :format="signData.format" :mainImgSrc="signData.mainImgSrc" :word="signData.word" :time="signData.time" @onSetDay="setSignDay">
		<template v-slot:footer>
			<view class="share-handle-box">
				<view class="btn save-btn" @click="saveImage">保存相册</view>
				<button class="btn share-btn" open-type="share">发给好友</button>
			</view>
		</template>
	</SharePopup>
	<FcqCorp v-if="cropData.src" :src="cropData.src" :movableWidth="cropData.movableWidth" :movableHeight="cropData.movableHeight" :canvasWidth="cropData.canvasWidth" :canvasHeight="cropData.canvasHeight" @onMovableScale="movableScale" @onSave="cropSave" @onClose="corpClose" @onChange="chooseUploadType" />
</template>

<script setup>
	import { computed, reactive, ref, toRefs } from "vue";
	import { onShareAppMessage, onShow, onLoad } from "@dcloudio/uni-app";
	import { getcurrentPageOption } from "@/utils/common.js"
	import dayjs from '@/utils/dayjs.min.js';
	import FcqCorp from '@/components/corp.vue';
	import SharePopup from '@/components/sharePopup/sharePopup.vue';
	import CustomIcon from "@/components/custom-icon/custom-icon.vue";
	
	
	import OBSupload from '@/OBS/obsUpload.js';
	import { useUserStore } from '@/stores/user.js'
	import Api from './api.js'
	
	const defaultAvatar = '/static/default-avatar.png'
	
	
	const { statusBar: { height, top } } = getApp().globalData
	const barHeight = `${height + 10}px`
	const statusTop = `${top}px`
	
	const user = useUserStore()
	const { userInfo } = toRefs(user.store)
	const backShow = ref(true)
	
	const needSharePicUrl = ref(true)
	// const height = statusBar.height
	// const top = statusBar.top
	
	const sharePopupRef = ref(null)
	const signData = reactive({
		format: '',
		mainImgSrc: '',
		word: '',
		time: dayjs().format('YYYY.MM.DD'),
		cumulativeDay: 10, // 累计签到
		consecutiveDay: 1, // 连续签到
	})
	const cropData = reactive({ // 裁剪数据
		src: '', // 裁剪图片地址
		movableWidth: 310,
		movableHeight: 370,
		canvasWidth: 310,
		canvasHeight: 370,
	})
	
	const tabNavs = ref([
		{value: 1, label: '换版式'},
		{value: 2, label: '换图片'},
		{value: 3, label: '换文字'},
	])
	const tabValue = ref(1)
	
	const tabClick = (val) => {
		dataSource.pageNum = 1
		tabValue.value = val
	}
	
	const imgList = ref([])
	
	const formatList = ref([])
	
	const wordList = ref([]) // 鸡汤文
	
	
	const customShow = ref(false) // 自定义文字
	const customText = ref('')
	const wordLength = ref(0)
	const setSignDay = (val) => {
		signData.cumulativeDay = val.signTotalDays
		signData.consecutiveDay = val.signSustainedDays
	}
	
	const dataSource = reactive({
		imgList: [],
		flag: true,
		pageNum: 1,
		pageSize: 12,
		total: 0
	})
	
	const userQRCode = ref('')
	const getQrCode = () => { // 获取二维码
		if (userQRCode.value) return
		Api.getQRCode({}).then(res => {
			console.log(res)
			userQRCode.value = res.data
		})
	}
	
	const getFormatList = () => { // 获取版式
		Api.getShareTemplates({
			pageNum: dataSource.pageNum,
			pageSize: dataSource.pageSize
		}).then(res => {
			console.log(res)
			formatList.value = res.rows
		})
	}
	
	const getImgList = () => { // 获取背景图
		Api.getSignPicSettingPage({
			pageNum: dataSource.pageNum,
			pageSize: dataSource.pageSize
		}).then(res => {
			console.log(res)
			if (res.code == 200) {
				dataSource.imgList = dataSource.imgList.concat(res.rows)
				dataSource.total = res.total
				if (!signData.mainImgSrc) signData.mainImgSrc = res.rows[0]
				if (dataSource.imgList.length >= dataSource.total) dataSource.flag = false
			}
		})
	}
	
	const scrolltolower = () => {
		if (tabValue.value != 2) return
		if (dataSource.flag) {
			dataSource.pageNum ++
			getImgList()
		}
	}
	
	const wordIndex = ref(0)
	const getWordList = () => { // 获取心语签文字
		Api.getSignWordSettingList({
			pageNum: 1,
			pageSize: 12
		}).then(res => {
			console.log(res)
			wordList.value = res.data
			if (!signData.word) {
				signData.word = res.data[0]?res.data[0]:'梦想不是一蹴而就'
			} else {
				let index = res.data.indexOf(signData.word)
				wordIndex.value = index >= 0 ? index : 0
			}
		})
	}
	
	
	const chooseFormat = (e) => { // 换版式
		if (e.target.dataset.format) {
			signData.format = e.target.dataset.format
		}
	}
	
	const chooseImg = (e) => { // 换图片
		needSharePicUrl.value = true
		if (e.target.dataset.src) {
			signData.mainImgSrc = e.target.dataset.src
		}
	}
	const wordChange = (e) => {
		let _index = e.detail.value[0]
		signData.word = wordList.value[_index]
	}
	const customWord = () => { // 自定义鸡汤文
		customShow.value = true
	}
	const closeCustom = () => {
		customText.value = ''
		wordLength.value = 0
		customShow.value = false
	}
	const fieldChange = (e) => {
		customText.value = e.detail.value
		if (e.detail.value) {
			wordLength.value = e.detail.value.length
		} else {
			wordLength.value = 0
		}
	}
	const customSubmit = () => {
		if (customText.value) {
			console.log(customText.value)
			signData.word = customText.value
			// customShow.value = false
			closeCustom()
		} else {
			
		}
	}
	const randomFn = () => { // 随机一张
		const _length = dataSource.imgList.length - 1
		const _index = Math.round(Math.random()*_length)
		signData.mainImgSrc = dataSource.imgList[_index]
	}
	const chooseUploadType = () => {
		needSharePicUrl.value = false
		uni.chooseImage({
			count: 1,
			sizeType: ['original', 'compressed'],
			sourceType: ['album', 'camera'],
			success: (chooseres) => {
				cropData.src = chooseres.tempFilePaths[0]
				uni.getImageInfo({
					src: chooseres.tempFilePaths[0],
					success: (imgres) => {
						console.log(imgres.width, imgres.height)
						const aspectRatio = imgres.width/imgres.height
						if (aspectRatio >= 1) {
							cropData.canvasHeight = 370
							cropData.movableHeight = 370
							cropData.movableWidth = imgres.width * (370/imgres.height)
							cropData.canvasWidth = imgres.width * (370/imgres.height)
						} else {
							cropData.canvasWidth = 310
							cropData.movableWidth = 310
							cropData.canvasHeight = imgres.height * (310/imgres.width)
							cropData.movableHeight = imgres.height * (310/imgres.width)
						}
					}
				})
			}
		})
	}
	const movableScale = (val) => {
		console.log(val)
		cropData.canvasWidth = val.width
		cropData.canvasHeight = val.height
	}
	const cropSave = (val) => {
		console.log('$$$$$$$$$$$$$$$$', val)
		signData.mainImgSrc = val.cut_src
		cropData.src = ''
	}
	const corpClose = () => {
		cropData.src = ''
	}
	const openShare = () => { // f分享弹窗
		sharePopupRef.value.openShare()
	}
	const saveImage = () => {
		sharePopupRef.value.exportSave()
	}
	const uploadObs = () => {
		const filePath = sharePopupRef.value.getUploadImgUrl()
		console.log(2222, filePath)
		OBSupload(filePath, 'sign', (e) => {
			console.log(e)
			Api.signShare({
				templateId: signData.format,
				shareText: signData.word,
				sharePicUrl: needSharePicUrl.value ? signData.mainImgSrc : '',
				shareFinalPicUrl: e
			}).then(res => {
				console.log(res)
			})
		})
	}
	
	const showShareToast = ref(false)
	onShareAppMessage(() => {
		uploadObs()
		showShareToast.value = true
		return {
			title: signData.word,
			path: `/pages/index/index?invite=${userInfo.value.userAccount.userId}&inviteType=3`,
			imageUrl: signData.mainImgSrc
		}
	})
	const goback = () => {
		if (backShow.value) {
			uni.navigateBack()
		} else {
			uni.switchTab({
				url: '/pages/index/index'
			})
		}
	}
	onLoad(() => {
		uni.hideShareMenu()
		let routes = getCurrentPages()
		console.log(routes.length)
		if (routes.length > 1) {
			backShow.value = true
		} else {
			backShow.value = false
		}
		const options = getcurrentPageOption()
		console.log(options)
		// signData.mainImgSrc = signData.mainImgSrc ? signData.mainImgSrc : options.mainImgSrc
		// signData.format = signData.format ? signData.format : options.format ? options.format: '1'
		// signData.word = signData.word ? signData.word : options.word
		signData.mainImgSrc = options.mainImgSrc
		signData.format = options.format? options.format : '1'
		signData.word = options.word
		getQrCode()
		getFormatList()
		getImgList()
		getWordList()
	})
	onShow(() => {
		if (showShareToast.value) {
			uni.showToast({
				title: '分享成功',
				icon: 'none',
				duration: 2000,
				success: () => {
					showShareToast.value = false
					sharePopupRef.value.closeShare()
				}
			})
		}
	})
</script>

<style lang="scss">
	@import "./index.scss";
	.sign-index-page{
		padding-top: v-bind('statusTop');
		.goback{
			position: fixed;
			z-index: 999;
			top: v-bind('statusTop');
			left: 20rpx;
			width: 48rpx;
			height: 48rpx;
			border-radius: 50%;
			background-color: #fff;
			box-shadow: 0px 3rpx 8rpx 0px rgba(0, 0, 0, 0.16);
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
</style>