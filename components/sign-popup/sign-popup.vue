<template>
	<SharePopup
		ref="sharePopupRef"
		:format="signData.format"
		:mainImgSrc="signData.mainImgSrc"
		:word="signData.word"
		:time="signData.time"
	>
		<template v-slot:header>
			<view v-if="props.showHeader" class="fcq-share-header">
				<text>恭喜获得</text>
				<image class="drop" :src="drop"></image>
				<text class="number">x{{props.integral}}</text>
				<text>橙汁</text>
			</view>
		</template>
		<template v-slot:footer>
			<view class="fcq-share-tips">为你生成今日签到海报，快去分享吧~</view>
			<view class="fcq-share-handle-box">
				<view class="btn edit-btn" @click="editImage">编辑海报</view>
				<button class="btn share-btn" open-type="share">分享</button>
			</view>
		</template>
	</SharePopup>
</template>

<script setup>
	import { nextTick, reactive, ref, toRef, toRefs } from "vue"
	import { onShow } from '@dcloudio/uni-app'
	import SharePopup from '@/components/sharePopup/sharePopup.vue'
	import drop from '@/static/drop-shape-active.png'
	import dayjs from '@/utils/dayjs.min.js'
	import { SIGN_IMG_LIST } from "@/config/default.js"
	import { useUserStore } from '@/stores/user.js'
	import Api from './api.js'
	
	const props = defineProps({
		showHeader: {
			type: Boolean,
			defalut: true
		},
		integral: {
			type: Number,
			defalut: 5
		}
	})
	
	const user = useUserStore()
	// const { userInfo } = toRefs(user.store)
	const sharePopupRef = ref(null)
	const signData = reactive({
		format: Math.round(Math.random()*5)+1, // 版式（1到6）
		mainImgSrc: SIGN_IMG_LIST[Math.round(Math.random()*(SIGN_IMG_LIST.length - 1))],
		word: '',
		time: dayjs().format('YYYY.MM.DD'),
	})
	
	const shareData = () => {
		// console.log(userInfo)
		return {
			title: signData.word,
			path: `/pages/index/index?invite=${user.store.userInfo.userAccount.userId}&inviteType=3`,
			imageUrl: signData.mainImgSrc
		}
	}
	const editImage = () => {
		uni.navigateTo({
			url: `/pagesWordSign/index?mainImgSrc=${signData.mainImgSrc}&format=${signData.format}&word=${signData.word}`
		})
	}
	
	const getWordList = () => {
		Api.getSignWordSettingList({}).then(res => {
			signData.word = res.data[Math.round(Math.random()*(res.data.length - 1))]
		})
	}
	
	onShow(() => {
		if (user.store.token) {
			getWordList()
		}
	})
	
	defineExpose({
		sharePopupRef,
		share: toRef(sharePopupRef, 'value'),
		shareData
	})
</script>

<style lang="scss" scoped>
	.fcq-share-tips{
		text-align: center;
		color: #009EBA;
		font-size: 24rpx;
		line-height: 24rpx;
		margin-bottom: 20rpx;
	}
	.fcq-share-header{
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 28rpx;
		margin-bottom: 10rpx;
		.drop{
			width: 25rpx;
			height: 28rpx;
			margin: 0rpx 10rpx;
		}
		.number{
			font-size: 36rpx;
			color: $uni-color-primary;
			margin-right: 8rpx;
		}
	}
	.fcq-share-handle-box{
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0rpx 30rpx;
		.btn{
			width: 288rpx;
			height: 72rpx;
			text-align: center;
			line-height: 70rpx;
			font-size: 28rpx;
			border-radius: 36rpx;
			border: 1rpx solid $uni-color-primary;
			&.edit-btn{
				color: $uni-color-primary;
				background-color: #fff;
			}
			&.share-btn{
				color: #fff;
				background-color: $uni-color-primary;
			}
		}
	}
</style>