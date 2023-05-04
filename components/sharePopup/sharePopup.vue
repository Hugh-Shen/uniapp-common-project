<template>
	<van-popup :show="shareShow" round custom-style="background-color: transparent;">
		<view class="share-box mb-100">
			<slot name="header"></slot>
			<view class="share-img-box mb-20">
				<view :class="['sign-content', 'mb-0', `style-${props.format}`]">
					<image class="main-img" :src="props.mainImgSrc" mode="aspectFill"></image>
					<view class="user-box">
						<image :src="userAvatar" mode="aspectFill"></image>
						<view class="info">
							<view class="name">我是{{userName}}</view>
							<view class="text">邀你加入方程圈<br/>一起签到领橙汁</view>
						</view>
					</view>
					<view class="sing-word">
						<view class="text-1">{{props.word}}</view>
						<view class="text-2">{{props.time}}</view>
					</view>
					<view class="time-box">
						<view class="time-day">{{props.time.substring(8,10)}}</view>
						<view class="time-month">{{props.time.substring(0,7)}}</view>
					</view>
					<view class="sign-in">
						<view class="box-1">
							<view class="text-1">{{textInfo.text_6}}<text>天</text></view>
							<view class="text-2">累计签到</view>
						</view>
						<view class="line"></view>
						<view class="box-2">
							<view class="text-1">{{textInfo.text_9}}<text>天</text></view>
							<view class="text-2">连续签到</view>
						</view>
					</view>
					<view class="block"></view>
					<image class="qr-code" :src="userQRCode"></image>
				</view>
			</view>
			<slot name="footer"></slot>
			<van-icon class="close-icon" name="close" size="64rpx" @click="closeShare"/>
		</view>
	</van-popup>
	<canvas class="share-canvas" type="2d" id="shareCanvas"></canvas>
</template>

<script setup>
	import { reactive, ref, computed, getCurrentInstance, toRefs } from "vue"
	import { onShow } from "@dcloudio/uni-app";
	import dayjs from '@/utils/dayjs.min.js'
	import localStorage from "@/utils/localStorage.js"
	import { useUserStore } from '@/stores/user.js'
	import Api from './api.js'
	
	// const defaultData = reactive({
	// 	imgList: [
	// 		'https://hr-community-new-test.obs.cn-south-1.myhuaweicloud.com/obs/user/sign/bg_pic/animal_01.jpg',
	// 		'https://hr-community-new-test.obs.cn-south-1.myhuaweicloud.com/obs/user/sign/bg_pic/animal_02.jpg',
	// 		'https://hr-community-new-test.obs.cn-south-1.myhuaweicloud.com/obs/user/sign/bg_pic/animal_03.jpg',
	// 	],
	// 	format: 2
	// })
	const props = defineProps({
		mainImgSrc: { // 主图
			type: String,
			default: ''
		},
		word: { // 鸡汤文
			type: String,
			default: ''
		},
		time: { // 签到时间
			type: String,
			defalut: dayjs().format('YYYY.MM.DD')
		},
		format: { // 模板，版式
			type: [Number, String],
			defalut: '1'
		},
	})
	
	const emits = defineEmits(['onSetDay'])
	
	const user = useUserStore()
	// const { userInfo } = toRefs(user.store)
	// console.log('^^^^', user.store.userInfo.avatar)
	const shareShow = ref(false)
	const defaultAvatar = '/static/default-avatar.png'
	const userAvatar = computed(() => user.store.userInfo.avatar ? user.store.userInfo.avatar : defaultAvatar)
	const userName = computed(() => user.store.userInfo.userName)
	// const userQRCode = computed(() => user.store.userInfo.appletQRCode)
	const userQRCode = ref('')
	// const userInfo = reactive({
	// 	avatar: '../../static/logo.png',
	// 	name: '方橙君',
	// 	// avatar: computed(() => user.avatar),
	// 	// name: computed(() => user.userName),
	// })
	
	const textInfo = reactive({
		text_1: `我是${userName.value}`,
		// text_1: `我是`,
		text_2: '邀你加入方程圈',
		text_3: '一起签到领橙汁',
		text_4: props.word,
		text_5: props.time,
		text_6: '1',
		text_7: '天',
		text_8: '累计签到',
		text_9: '1',
		text_10: '天',
		text_11: '连续签到',
	})
	
	let shareCanvas = null
	const openShare = () => {
		getMySignInfo()
		getQrCode()
		shareShow.value = true
		if (!shareCanvas) {
			setImg(false)
		}
	}
	
	const exportSave = () => {
		uni.showLoading({
			title: '正在生成图片'
		})
		Api.getQRCode({}).then(res => {
			console.log(res)
			userQRCode.value = res.data
			if (!shareCanvas) {
				setImg(true)
			} else {
				saveImg()
			}
		})
	}
	
	const getMySignInfo = () => {
		Api.getMySignInfo({}).then(res => {
			if (res.code == 200) {
				textInfo.text_6 = res.data.signTotalDays
				textInfo.text_9 = res.data.signSustainedDays
			}
			emits('onSetDay', res.data)
		})
	}
	
	const getQrCode = () => {
		if (userQRCode.value) return
		Api.getQRCode({}).then(res => {
			console.log(res)
			userQRCode.value = res.data
		})
	}
	
	onShow(() => {
		const token = localStorage.get('token')
		if (token) {
			getMySignInfo()
		}
	})
	
	const uploadImgUrl = ref('')
	const setUploadImgUrl = () => {
		uni.canvasToTempFilePath({
			quality: 1,
			canvas: shareCanvas,
			x: 0,
			y: 0,
			width: 310,
			height: 370,
			fileType: 'jpg',
			success: (_res) => {
				uploadImgUrl.value = _res.tempFilePath
			},
			fail: (_res) => {
				console.log('^^^^^^^^^^')
			}
		})
		// return uploadImgUrl.value
	}
	const getUploadImgUrl = () => {
		return uploadImgUrl.value
	}
	
	const closeShare = () => {
		shareShow.value = false
		shareCanvas = null
	}
	const instance = getCurrentInstance(); // 获取组件实例
	const setImg = (needSave) => {
		console.log('**********', props.mainImgSrc)
		const query = uni.createSelectorQuery().in(instance)
		console.log(query)
		query.select('#shareCanvas').fields({
			node: true,
			size: true
		}).exec(res => {
			console.log(res)
			const canvas = res[0].node;
			shareCanvas = canvas
			const ctx = canvas.getContext('2d'); //getContext返回Canvas 的绘图上下文
			// const dpr = 3; //比例我这里是设置的1，一般设置1就可以了
			const dpr = uni.getSystemInfoSync().pixelRatio;
			canvas.width =res[0].width * dpr;
			canvas.height = res[0].height * dpr;
			ctx.scale(dpr, dpr);
			switch (props.format){
				case '1':
					canvasDraw_1(canvas, ctx).then(_pres => {
						return drawCode(canvas, ctx)
					}).then(res => {
						
						if (needSave) {
							saveImg()
						} else {
							setUploadImgUrl()
						}
					})
					break;
				case '2':
					canvasDraw_2(canvas, ctx).then(_pres => {
						return drawCode(canvas, ctx)
					}).then(res => {
						
						if (needSave) {
							saveImg()
						} else {
							setUploadImgUrl()
						}
					})
					break;
				case '3':
					canvasDraw_3(canvas, ctx).then(_pres => {
						return drawCode(canvas, ctx)
					}).then(res => {
						if (needSave) {
							saveImg()
						} else {
							setUploadImgUrl()
						}
					})
					break;
				case '4':
					canvasDraw_4(canvas, ctx).then(_pres => {
						return drawCode(canvas, ctx)
					}).then(res => {
						if (needSave) {
							saveImg()
						} else {
							setUploadImgUrl()
						}
					})
					break;
				case '5':
					canvasDraw_5(canvas, ctx).then(_pres => {
						return drawCode(canvas, ctx, 240, 300)
					}).then(res => {
						if (needSave) {
							saveImg()
						} else {
							setUploadImgUrl()
						}
					})
					break;
				case '6':
					canvasDraw_6(canvas, ctx).then(_pres => {
						return drawCode(canvas, ctx, 255, 310, 40, 40)
					}).then(res => {
						if (needSave) {
							saveImg()
						} else {
							setUploadImgUrl()
						}
					})
					break;
				default:
					break;
			}
			
		})
	}
	
	const canvasDraw_1 = (canvas, ctx) => {
		return new Promise(res => {
			const img = canvas.createImage()
			img.src = props.mainImgSrc
			img.onload = () => {
				ctx.drawImage(img, 0, 0, 310, 370);
				const avatar = canvas.createImage();
				avatar.src = userAvatar.value
				avatar.onload = () => {
					// ctx.drawImage(avatar, 10, 10, 30, 30);
					// circleImgTwo(ctx, avatar, 10, 10, 30, 30, 15);
					ctx.font = 'normal bold 8px sans-serif';
					ctx.fillStyle = "#fff";
					ctx.strokeStyle='rgba(0,0,0,0.8)';
					ctx.strokeText(textInfo.text_1, 45, 20);
					ctx.fillText(textInfo.text_1, 45, 20)
					
					ctx.font = 'normal 7px sans-serif';
					ctx.fillStyle = "#fff";
					ctx.strokeText(textInfo.text_2, 45, 30)
					ctx.fillText(textInfo.text_2, 45, 30)
					ctx.strokeText(textInfo.text_3, 45, 38)
					ctx.fillText(textInfo.text_3, 45, 38)
					
					
					ctx.font = 'normal bold 14px sans-serif';
					ctx.fillStyle = "#fff";
					ctx.textAlign = 'center';
					ctx.strokeText(props.word, (310/2), 90);
					ctx.fillText(props.word, (310/2), 90)
					
					
					ctx.font = 'normal 12px sans-serif';
					ctx.fillStyle = "#fff";
					ctx.textAlign = 'center';
					ctx.strokeText(textInfo.text_5, (310/2), 106)
					ctx.fillText(textInfo.text_5, (310/2), 106)
					
					ctx.font = 'normal 18px sans-serif';
					ctx.fillStyle = "#fff";
					ctx.textAlign = 'left';
					ctx.strokeText(textInfo.text_6, 10, 294)
					ctx.fillText(textInfo.text_6, 10, 294)
					
					ctx.font = 'normal 10px sans-serif';
					ctx.fillStyle = "#fff";
					let text_6_length = (textInfo.text_6+'').length
					let x_7 = 12 + text_6_length*10
					ctx.strokeText(textInfo.text_7, x_7, 292)
					ctx.fillText(textInfo.text_7, x_7, 292)
					
					ctx.font = 'normal 10px sans-serif';
					ctx.fillStyle = "#fff";
					ctx.strokeText(textInfo.text_8, 10, 304)
					ctx.fillText(textInfo.text_8, 10, 304)
					
					
					ctx.font = 'normal 18px sans-serif';
					ctx.fillStyle = "#fff";
					ctx.textAlign = 'left';
					ctx.strokeText(textInfo.text_9, 10, 340)
					ctx.fillText(textInfo.text_9, 10, 340)
					
					ctx.font = 'normal 10px sans-serif';
					ctx.fillStyle = "#fff";
					let text_9_length = (textInfo.text_9+'').length
					let x_10 = 12 + text_9_length*10
					ctx.strokeText(textInfo.text_10, x_10, 338)
					ctx.fillText(textInfo.text_10, x_10, 338)
					
					ctx.font = 'normal 10px sans-serif';
					ctx.fillStyle = "#fff";
					ctx.strokeText(textInfo.text_11, 10, 350)
					ctx.fillText(textInfo.text_11, 10, 350)
					
					ctx.strokeStyle='#fff';
					ctx.beginPath();
					ctx.moveTo(14, 315);
					ctx.lineTo(44, 315);
					ctx.stroke()
					circleImgTwo(ctx, avatar, 10, 10, 30, 30, 15)
					setTimeout(() => {
						res(true)
					}, 100);
				}
			}
		})
	}
	
	const canvasDraw_2 = (canvas, ctx) => {
		return new Promise(res => {
			const img = canvas.createImage()
			img.src = props.mainImgSrc
			img.onload = () => {
				ctx.drawImage(img, 0, 0, 310, 370);
				const avatar = canvas.createImage();
				avatar.src = userAvatar.value
				avatar.onload = () => {
					// ctx.drawImage(avatar, 10, 296, 30, 30);
					circleImgTwo(ctx, avatar, 10, 296, 30, 30, 15)
					ctx.font = 'normal bold 8px sans-serif';
					ctx.fillStyle = "#fff";
					ctx.strokeStyle='rgba(0,0,0,0.8)';
					// ctx.shadowColor = 'rgba(0,0,0,0.8)';
					// ctx.shadowOffsetX = 0.5;
					// ctx.shadowOffsetY = 0.5;
					ctx.strokeText(textInfo.text_1, 45, 306);
					ctx.fillText(textInfo.text_1, 45, 306)
					
					ctx.font = 'normal 7px sans-serif';
					ctx.fillStyle = "#fff";
					ctx.strokeText(textInfo.text_2, 45, 316)
					ctx.fillText(textInfo.text_2, 45, 316)
					ctx.strokeText(textInfo.text_3, 45, 324)
					ctx.fillText(textInfo.text_3, 45, 324)
					
					ctx.font = 'normal bold 14px sans-serif';
					ctx.fillStyle = "#fff";
					// ctx.textAlign = 'center';
					ctx.strokeText(props.word, 10, 26);
					ctx.fillText(props.word, 10, 26)
					
					// ctx.font = 'normal 12px sans-serif';
					// ctx.fillStyle = "#fff";
					// ctx.textAlign = 'center';
					// ctx.strokeText(text_5, (310/2), 106)
					// ctx.fillText(text_5, (310/2), 106)
					
					ctx.font = 'normal 18px sans-serif';
					ctx.fillStyle = "#fff";
					ctx.textAlign = 'left';
					ctx.strokeText(textInfo.text_6, 10, 346)
					ctx.fillText(textInfo.text_6, 10, 346)
					
					ctx.font = 'normal 10px sans-serif';
					ctx.fillStyle = "#fff";
					let text_6_length = (textInfo.text_6+'').length
					let x_7 = 12 + text_6_length*10
					ctx.strokeText(textInfo.text_7, x_7, 345)
					ctx.fillText(textInfo.text_7, x_7, 345)
					
					ctx.font = 'normal 10px sans-serif';
					ctx.fillStyle = "#fff";
					ctx.strokeText(textInfo.text_8, 10, 360)
					ctx.fillText(textInfo.text_8, 10, 360)
					
					ctx.font = 'normal 18px sans-serif';
					ctx.fillStyle = "#fff";
					ctx.textAlign = 'left';
					ctx.strokeText(textInfo.text_9, 80, 346)
					ctx.fillText(textInfo.text_9, 80, 346)
					
					ctx.font = 'normal 10px sans-serif';
					ctx.fillStyle = "#fff";
					let text_9_length = (textInfo.text_9+'').length
					let x_10 = 82 + text_9_length*10
					ctx.strokeText(textInfo.text_10, x_10, 345)
					ctx.fillText(textInfo.text_10, x_10, 345)
					
					ctx.font = 'normal 10px sans-serif';
					ctx.fillStyle = "#fff";
					ctx.strokeText(textInfo.text_11, 80, 360)
					ctx.fillText(textInfo.text_11, 80, 360)
					
					ctx.strokeStyle='#fff';
					ctx.beginPath();
					ctx.moveTo(67, 336);
					ctx.lineTo(67, 360);
					ctx.stroke()
					// circleImgTwo(ctx, avatar, 10, 296, 30, 30, 15)
					setTimeout(() => {
						res(true)
					}, 100);
				}
			}
		})
	}
	
	const canvasDraw_3 = (canvas, ctx) => {
		return new Promise(res => {
			const img = canvas.createImage()
			img.src = props.mainImgSrc
			img.onload = () => {
				ctx.drawImage(img, 0, 0, 310, 370);
				const avatar = canvas.createImage();
				avatar.src = userAvatar.value
				avatar.onload = () => {
					// ctx.drawImage(avatar, 10, 330, 30, 30);
					circleImgTwo(ctx, avatar, 10, 330, 30, 30, 15)
					
					ctx.font = 'normal bold 8px sans-serif';
					ctx.fillStyle = "#fff";
					ctx.strokeStyle='rgba(0,0,0,0.8)';
					ctx.strokeText(textInfo.text_1, 45, 340);
					ctx.fillText(textInfo.text_1, 45, 340)
					
					ctx.font = 'normal 7px sans-serif';
					ctx.fillStyle = "#fff";
					ctx.strokeText(textInfo.text_2, 45, 350)
					ctx.fillText(textInfo.text_2, 45, 350)
					ctx.strokeText(textInfo.text_3, 45, 358)
					ctx.fillText(textInfo.text_3, 45, 358)
					
					ctx.font = 'normal bold 14px sans-serif';
					ctx.fillStyle = "#fff";
					// ctx.textAlign = 'center';
					ctx.strokeText(props.word, 10, 300);
					ctx.fillText(props.word, 10, 300)
					
					ctx.font = 'normal 24px sans-serif';
					ctx.fillStyle = "#fff";
					ctx.strokeText(textInfo.text_5.substring(8,10), 10, 153)
					ctx.fillText(textInfo.text_5.substring(8,10), 10, 153)
					
					ctx.font = 'normal 10px sans-serif';
					ctx.fillStyle = "#fff";
					ctx.strokeText(textInfo.text_5.substring(0,7), 10, 165)
					ctx.fillText(textInfo.text_5.substring(0,7), 10, 165)
					
					ctx.font = 'normal 18px sans-serif';
					ctx.fillStyle = "#fff";
					ctx.textAlign = 'left';
					ctx.strokeText(textInfo.text_6, 10, 192)
					ctx.fillText(textInfo.text_6, 10, 192)
					
					ctx.font = 'normal 10px sans-serif';
					ctx.fillStyle = "#fff";
					let text_6_length = (textInfo.text_6+'').length
					let x_7 = 12 + text_6_length*10
					ctx.strokeText(textInfo.text_7, x_7, 190)
					ctx.fillText(textInfo.text_7, x_7, 190)
					
					ctx.font = 'normal 10px sans-serif';
					ctx.fillStyle = "#fff";
					ctx.strokeText(textInfo.text_8, 10, 204)
					ctx.fillText(textInfo.text_8, 10, 204)
					
					
					ctx.font = 'normal 18px sans-serif';
					ctx.fillStyle = "#fff";
					ctx.textAlign = 'left';
					ctx.strokeText(textInfo.text_9, 10, 240)
					ctx.fillText(textInfo.text_9, 10, 240)
					
					ctx.font = 'normal 10px sans-serif';
					ctx.fillStyle = "#fff";
					let text_9_length = (textInfo.text_9+'').length
					let x_10 = 12 + text_9_length*10
					ctx.strokeText(textInfo.text_10, x_10, 238)
					ctx.fillText(textInfo.text_10, x_10, 238)
					
					ctx.font = 'normal 10px sans-serif';
					ctx.fillStyle = "#fff";
					ctx.strokeText(textInfo.text_11, 10, 252)
					ctx.fillText(textInfo.text_11, 10, 252)
					
					ctx.strokeStyle='#fff';
					ctx.beginPath();
					ctx.moveTo(10, 216);
					ctx.lineTo(40, 216);
					ctx.stroke()
					// circleImgTwo(ctx, avatar, 10, 330, 30, 30, 15)
					setTimeout(() => {
						res(true)
					}, 100);
				}
			}
		})
	}
	
	const canvasDraw_4 = (canvas, ctx) => {
		return new Promise(res => {
			const img = canvas.createImage()
			img.src = props.mainImgSrc
			img.onload = () => {
				ctx.drawImage(img, 0, 0, 310, 370);
				ctx.fillStyle = '#fff';
				ctx.fillRect(0, 270, 310, 100);
				const avatar = canvas.createImage();
				avatar.src = userAvatar.value
				avatar.onload = () => {
					// ctx.drawImage(avatar, 10, 322, 30, 30);
					circleImgTwo(ctx, avatar, 10, 322, 30, 30, 15)
					
					ctx.strokeStyle='rgba(0,0,0,0.8)';
					ctx.font = 'normal bold 24px sans-serif';
					ctx.fillStyle = "#fff";
					ctx.strokeText(textInfo.text_5.substring(8,10), 270, 30)
					ctx.fillText(textInfo.text_5.substring(8,10), 270, 30)
					
					ctx.font = 'normal 10px sans-serif';
					ctx.fillStyle = "#fff";
					ctx.strokeText(textInfo.text_5.substring(0,7), 260, 42)
					ctx.fillText(textInfo.text_5.substring(0,7), 260, 42)
					
					ctx.font = 'normal bold 8px sans-serif';
					ctx.fillStyle = "#333";
					ctx.strokeStyle='rgba(0,0,0,0)';
					ctx.strokeText(textInfo.text_1, 45, 332);
					ctx.fillText(textInfo.text_1, 45, 332)
					
					ctx.font = 'normal 7px sans-serif';
					ctx.fillStyle = "#333";
					ctx.strokeText(textInfo.text_2, 45, 342)
					ctx.fillText(textInfo.text_2, 45, 342)
					ctx.strokeText(textInfo.text_3, 45, 350)
					ctx.fillText(textInfo.text_3, 45, 350)
					
					ctx.font = 'normal bold 14px sans-serif';
					ctx.fillStyle = "#666";
					// ctx.textAlign = 'center';
					ctx.strokeText(props.word, 10, 300);
					ctx.fillText(props.word, 10, 300)
					
					
					ctx.font = 'normal bold 14px sans-serif';
					ctx.fillStyle = "#333";
					ctx.textAlign = 'left';
					ctx.strokeText(textInfo.text_6, 142, 338)
					ctx.fillText(textInfo.text_6, 142, 338)
					
					ctx.font = 'normal 10px sans-serif';
					ctx.fillStyle = "#333";
					let text_6_length = (textInfo.text_6+'').length
					let x_7 = 141 + text_6_length*10
					ctx.strokeText(textInfo.text_7, x_7, 337)
					ctx.fillText(textInfo.text_7, x_7, 337)
					// ctx.fillText(textInfo.text_7, 174, 337)
					
					ctx.font = 'normal 10px sans-serif';
					ctx.fillStyle = "#333";
					ctx.strokeText(textInfo.text_8, 142, 352)
					ctx.fillText(textInfo.text_8, 142, 352)
					
					ctx.font = 'normal bold 14px sans-serif';
					ctx.fillStyle = "#333";
					ctx.textAlign = 'left';
					ctx.strokeText(textInfo.text_9, 200, 338)
					ctx.fillText(textInfo.text_9, 200, 338)
					
					ctx.font = 'normal 10px sans-serif';
					ctx.fillStyle = "#333";
					let text_9_length = (textInfo.text_9+'').length
					let x_10 = 200 + text_9_length*10
					ctx.strokeText(textInfo.text_10, x_10, 337)
					ctx.fillText(textInfo.text_10, x_10, 337)
					
					ctx.font = 'normal 10px sans-serif';
					ctx.fillStyle = "#333";
					ctx.strokeText(textInfo.text_11, 200, 352)
					ctx.fillText(textInfo.text_11, 200, 352)
					
					ctx.strokeStyle='#333';
					ctx.beginPath();
					ctx.moveTo(192, 328);
					ctx.lineTo(192, 352);
					ctx.stroke()
					// circleImgTwo(ctx, avatar, 10, 322, 30, 30, 15)
					setTimeout(() => {
						res(true)
					}, 100);
				}
			}
		})
	}
	
	const canvasDraw_5 = (canvas, ctx) => {
		return new Promise(res => {
			const img = canvas.createImage()
			img.src = props.mainImgSrc
			img.onload = () => {
				ctx.drawImage(img, 0, 0, 310, 370);
				// ctx.fillStyle = '#fff';
				// ctx.fillRect(0, 270, 310, 100);
				const avatar = canvas.createImage();
				avatar.src = userAvatar.value
				avatar.onload = () => {
					drawRoundedRectangle(ctx, -30, 20, 370, 380, 50, 'rgba(0,0,0,1)', false);
					// ctx.drawImage(avatar, 10, 10, 40, 40);
					circleImgTwo(ctx, avatar, 10, 10, 40, 40, 20)
					ctx.lineWidth = 1;
					
					ctx.strokeStyle='rgba(0,0,0,0)';
					ctx.font = 'normal bold 24px sans-serif';
					ctx.fillStyle = "#333";
					ctx.strokeText(textInfo.text_5.substring(8,10), 272, 30)
					ctx.fillText(textInfo.text_5.substring(8,10), 272, 30)
					
					ctx.font = 'normal 12px sans-serif';
					ctx.fillStyle = "#333";
					ctx.strokeText(textInfo.text_5.substring(0,7), 257, 46)
					ctx.fillText(textInfo.text_5.substring(0,7), 257, 46)
					
					ctx.font = 'normal bold 10px sans-serif';
					ctx.fillStyle = "#333";
					ctx.strokeText(textInfo.text_1, 55, 22);
					ctx.fillText(textInfo.text_1, 55, 22)
					
					ctx.font = 'normal 8px sans-serif';
					ctx.fillStyle = "#333";
					ctx.strokeText(textInfo.text_2, 55, 34)
					ctx.fillText(textInfo.text_2, 55, 34)
					ctx.strokeText(textInfo.text_3, 55, 44)
					ctx.fillText(textInfo.text_3, 55, 44)
					
					ctx.font = 'normal bold 13px sans-serif';
					ctx.strokeStyle='rgba(0,0,0,0.8)';
					ctx.fillStyle = "#fff";
					// ctx.textAlign = 'center';
					ctx.strokeText(props.word, 20, 85);
					ctx.fillText(props.word, 20, 85)
					
					
					ctx.font = 'normal 18px sans-serif';
					ctx.fillStyle = "#fff";
					ctx.textAlign = 'left';
					ctx.strokeText(textInfo.text_6, 20, 336)
					ctx.fillText(textInfo.text_6, 20, 336)
					
					ctx.font = 'normal 10px sans-serif';
					ctx.fillStyle = "#fff";
					let text_6_length = (textInfo.text_6+'').length
					let x_7 = 22 + text_6_length*10
					ctx.strokeText(textInfo.text_7, x_7, 335)
					ctx.fillText(textInfo.text_7, x_7, 335)
					
					ctx.font = 'normal 10px sans-serif';
					ctx.fillStyle = "#fff";
					ctx.strokeText(textInfo.text_8, 20, 350)
					ctx.fillText(textInfo.text_8, 20, 350)
					
					ctx.font = 'normal 18px sans-serif';
					ctx.fillStyle = "#fff";
					ctx.textAlign = 'left';
					ctx.strokeText(textInfo.text_9, 90, 336)
					ctx.fillText(textInfo.text_9, 90, 336)
					
					ctx.font = 'normal 10px sans-serif';
					ctx.fillStyle = "#fff";
					let text_9_length = (textInfo.text_9+'').length
					let x_10 = 92 + text_9_length*10
					ctx.strokeText(textInfo.text_10, x_10, 335)
					ctx.fillText(textInfo.text_10, x_10, 335)
					
					ctx.font = 'normal 10px sans-serif';
					ctx.fillStyle = "#fff";
					ctx.strokeText(textInfo.text_11, 90, 350)
					ctx.fillText(textInfo.text_11, 90, 350)
					
					ctx.strokeStyle='#fff';
					ctx.beginPath();
					ctx.moveTo(77, 326);
					ctx.lineTo(77, 350);
					ctx.stroke()
					// circleImgTwo(ctx, avatar, 10, 10, 40, 40, 20)
					setTimeout(() => {
						res(true)
					}, 100);
				}
			}
		})
	}
	
	const canvasDraw_6 = (canvas, ctx) => {
		return new Promise(res => {
			const img = canvas.createImage()
			img.src = props.mainImgSrc
			img.onload = () => {
				ctx.drawImage(img, 0, 0, 310, 370);
				// ctx.fillStyle = '#fff';
				// ctx.fillRect(0, 270, 310, 100);
				const avatar = canvas.createImage();
				avatar.src = userAvatar.value
				avatar.onload = () => {
					drawRoundedRectangle(ctx, 10, 305, 290, 50, 8, 'rgba(255,255,255,0.7)');
					// ctx.drawImage(avatar, 20, 315, 30, 30);
					circleImgTwo(ctx, avatar, 15, 315, 30, 30, 15)
					ctx.lineWidth = 1;
					
					ctx.strokeStyle='rgba(0,0,0,0.8)';
					ctx.font = 'normal bold 24px sans-serif';
					ctx.fillStyle = "#fff";
					ctx.strokeText(textInfo.text_5.substring(8,10), 270, 30)
					ctx.fillText(textInfo.text_5.substring(8,10), 270, 30)
					
					ctx.font = 'normal 10px sans-serif';
					ctx.fillStyle = "#fff";
					ctx.strokeText(textInfo.text_5.substring(0,7), 260, 42)
					ctx.fillText(textInfo.text_5.substring(0,7), 260, 42)
					
					ctx.font = 'normal bold 14px sans-serif';
					ctx.fillStyle = "#fff";
					// ctx.textAlign = 'center';
					let word_length = props.word.length
					let word_y = 24
					ctx.strokeText(props.word.substring(0,16), 10, word_y);
					ctx.fillText(props.word.substring(0,16), 10, word_y)
					
					ctx.font = 'normal bold 14px sans-serif';
					ctx.fillStyle = "#fff";
					word_y = 24 + parseInt(word_length/16)*16
					ctx.strokeText(props.word.substring(16,word_length), 10, word_y);
					ctx.fillText(props.word.substring(16,word_length), 10, word_y)
					
					ctx.font = 'normal bold 8px sans-serif';
					ctx.fillStyle = "#333";
					ctx.strokeStyle='rgba(0,0,0,0)';
					ctx.strokeText(textInfo.text_1, 55, 325);
					ctx.fillText(textInfo.text_1, 55, 325)
					
					ctx.font = 'normal 7px sans-serif';
					ctx.fillStyle = "#333";
					ctx.strokeText(textInfo.text_2, 55, 335)
					ctx.fillText(textInfo.text_2, 55, 335)
					ctx.strokeText(textInfo.text_3, 55, 343)
					ctx.fillText(textInfo.text_3, 55, 343)
					
					
					ctx.font = 'normal bold 12px sans-serif';
					ctx.fillStyle = "#333";
					ctx.textAlign = 'left';
					ctx.strokeText(textInfo.text_6, 157, 328)
					ctx.fillText(textInfo.text_6, 157, 328)
					
					ctx.font = 'normal 8px sans-serif';
					ctx.fillStyle = "#333";
					let text_6_length = (textInfo.text_6+'').length
					let x_7 = 158 + text_6_length*8
					ctx.strokeText(textInfo.text_7, x_7, 327)
					ctx.fillText(textInfo.text_7, x_7, 327)
					
					ctx.font = 'normal 8px sans-serif';
					ctx.fillStyle = "#333";
					ctx.strokeText(textInfo.text_8, 157, 340)
					ctx.fillText(textInfo.text_8, 157, 340)
					
					ctx.font = 'normal bold 12px sans-serif';
					ctx.fillStyle = "#333";
					ctx.textAlign = 'left';
					ctx.strokeText(textInfo.text_9, 210, 328)
					ctx.fillText(textInfo.text_9, 210, 328)
					
					ctx.font = 'normal 8px sans-serif';
					ctx.fillStyle = "#333";
					let text_9_length = (textInfo.text_9+'').length
					let x_10 = 211 + text_9_length*8
					ctx.strokeText(textInfo.text_10, x_10, 327)
					ctx.fillText(textInfo.text_10, x_10, 327)
					
					ctx.font = 'normal 8px sans-serif';
					ctx.fillStyle = "#333";
					ctx.strokeText(textInfo.text_11, 210, 340)
					ctx.fillText(textInfo.text_11, 210, 340)
					
					ctx.strokeStyle='rgba(0,0,0,0.5)';
					ctx.beginPath();
					ctx.moveTo(199, 318);
					ctx.lineTo(199, 340);
					ctx.stroke()
					setTimeout(() => {
						res(true)
					}, 100);
				}
			}
		})
	}
	
	const drawRoundedRectangle = (ctx, x, y, width, height, r, color, fill = true) => {
		ctx.beginPath();
		ctx.moveTo(x + r, y);
		ctx.lineTo(x + width - r, y);
		ctx.arc(x + width - r, y + r, r, Math.PI * 1.5, Math.PI * 2);
		ctx.lineTo(x + width, y + height - r);
		ctx.arc(x + width - r, y + height - r, r, 0, Math.PI * 0.5);
		ctx.lineTo(x + r, y + height);
		ctx.arc(x + r, y + height - r, r, Math.PI * 0.5, Math.PI);
		ctx.lineTo(x, y + r);
		ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5);
		if (fill) {
			ctx.fillStyle = color;//矩形填充颜色
			ctx.fill();
		} else {
			ctx.lineWidth = 80;
			ctx.strokeStyle = "#FFF";
			ctx.stroke();
		}
	}
	
	const circleImgTwo = (ctx, img, x, y, w, h, r) => {
		ctx.save();
		if (w < 2 * r) r = w / 2;
		if (h < 2 * r) r = h / 2;
		ctx.beginPath();
		ctx.moveTo(x + r, y);
		ctx.arcTo(x + w, y, x + w, y + h, r);
		ctx.arcTo(x + w, y + h, x, y + h, r);
		ctx.arcTo(x, y + h, x, y, r);
		ctx.arcTo(x, y, x + w, y, r);
		ctx.closePath();
		ctx.strokeStyle = 'rgba(255,255,255,.6)'; // 设置绘制圆形边框的颜色
		ctx.stroke();
		ctx.clip();
		ctx.drawImage(img, x, y, w, h);
		ctx.restore()
	}
	
	const drawCode = (canvas, ctx, x = 250, y = 310, w = 50, h = 50) => {
		return new Promise(res => {
			const code = canvas.createImage()
			code.src = userQRCode.value
			code.onload = () => {
				// ctx.drawImage(code, x, y, w, h);
				circleImgTwo(ctx, code, x, y, w, h, 4)
				setTimeout(() => {
					res(true)
				}, 100);
			}
		})
	}
	
	const saveImg = () => {
		uni.showLoading({
			title: '正在生成图片'
		})
		uni.canvasToTempFilePath({
			quality: 1,
			canvas: shareCanvas,
			x: 0,
			y: 0,
			width: 310,
			height: 370,
			// destWidth: 310, //输出的图片的宽度 
			// destHeight: 370, //输出的图片的高度
			fileType: 'jpg',
			success: (_res) => {
				uploadImgUrl.value = _res.tempFilePath
				uni.hideLoading()
				uni.saveImageToPhotosAlbum({
					filePath: _res.tempFilePath,
					success : (_res1) => {
						uni.showToast({
							title: '保存成功',
							duration: 1000,
						});
						// closeShare()
						shareCanvas = null
					},
					fail: () => {
						uni.showModal({
							title: '提示',
							content: '需要您授权保存相册',
							showCancel: false,
							success(res) {
								if (res.confirm) {
									uni.openSetting({
										success(settingdata) {
											if (settingdata.authSetting['scope.writePhotosAlbum']) {
												uni.showModal({
													title: '提示',
													content: '获取权限成功,再次保存图片即可成功',
													showCancel: false,
												})
											} else {
												uni.showModal({
													title: '提示',
													content: '获取权限失败，无法保存到相册',
													showCancel: false
												})
											}
										}
									})
								}
							}
						})
					}
				})
			},
			fail: (_res) => {
				console.log('^^^^^^^^^^')
			}
		})
	}
	defineExpose({
		openShare,
		closeShare,
		exportSave,
		getUploadImgUrl
	})
</script>

<style lang="scss" scoped>
	.share-canvas{
		width: 310px;
		height: 370px;
		position: fixed;
		top: 9999px;
		right: -9999px;
	}
	.share-box{
		width: 660rpx;
		// height: 878rpx;
		padding-bottom: 20rpx;
		background-color: #fff;
		padding-top: 20rpx;
		position: relative;
		border-radius: 16rpx;
		.share-img-box{
			width: 620rpx;
			height: 740rpx;
			margin: 0rpx auto;
			border-radius: 16rpx;
			// overflow: hidden;
		}
		.share-img{
			width: 620rpx;
			height: 740rpx;
			margin: 0rpx auto;
		}
		.close-icon{
			position: absolute;
			bottom: -100rpx;
			left: 50%;
			color: #fff;
			transform: translate(-50%, 0);
		}
	}
</style>