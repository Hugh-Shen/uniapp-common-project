<template>
	<view class="cut-page">

		<canvas class="myCanvas" type="2d" id="myCanvas"
			:style="`width: ${props.canvasWidth}px;height:${props.canvasHeight}px`"></canvas>
		<movable-area :style="`width:${props.width}px;height:${props.height}px`">
			<movable-view class="max" direction="all" scale :scale-min="1" :scale-max="4" :animation="false"
				@change="movableChange" :style="`width: ${props.movableWidth}px;height:${props.movableHeight}px`"
				@scale="movableScale">
				<image class="test-img" id="test_img" :src="props.src" mode="widthFix"></image>
			</movable-view>
		</movable-area>
		<view :class="['movable-fb', props.type == 'circle'?'circle':'www']" :style="`width:${props.width}px;height:${props.height}px`">
			<!-- <view class="movable-content"></view> -->
			<view class="style top"></view>
			<view class="style right"></view>
			<view class="style bottom"></view>
			<view class="style left"></view>
			<view class="tips">拖动图片可调整位置，双指可进行缩放哦</view>
		</view>
		
		<view class="crop-handle-box">
			<view class="btn" @click="close">取消</view>
			<view class="btn" @click="change">换一张</view>
			<view class="btn" @click="save">确定</view>
		</view>
	</view>
</template>

<script setup>
	import {
		reactive,
		ref,
		getCurrentInstance
	} from "vue";
	const { statusBar } = getApp().globalData
	const height = statusBar.height
	const top = statusBar.top
	const instance = getCurrentInstance(); // 获取组件实例
	const props = defineProps({
		src: {
			type: String,
			defaule: '', // 裁剪图片地址
		},
		width: {
			type: Number,
			default: 310,
		},
		height: {
			type: Number,
			default: 370,
		},
		movableWidth: {
			type: Number,
			default: 310,
		},
		movableHeight: {
			type: Number,
			default: 370,
		},
		canvasWidth: {
			type: Number,
			default: 310,
		},
		canvasHeight: {
			type: Number,
			default: 370,
		},
		type: {
			type: String,
			default: 'square',
		}
	})
	let imgCanvas = null
	const emits = defineEmits(['onMovableScale', 'onSave', 'onClose', 'onChange'])
	const cropData = reactive({
		x: 0,
		y: 0,
		scale: 1,
	})
	const movableChange = (e) => {
		cropData.x = e.detail.x
		cropData.y = e.detail.y
	}
	const movableScale = (e) => {
		cropData.x = e.detail.x
		cropData.y = e.detail.y
		cropData.scale = e.detail.scale
		// cropData.canvasWidth = cropData.movableWidth*e.detail.scale
		// cropData.canvasHeight = cropData.movableHeight*e.detail.scale
		emits('onMovableScale', {
			width: props.movableWidth * e.detail.scale,
			height: props.movableHeight * e.detail.scale
		})
	}
	const save = () => {
		uni.showLoading({
			title: '照片上传中'
		})
		const query = uni.createSelectorQuery().in(instance)
		console.log(query)
		query.select('#myCanvas').fields({
			node: true,
			size: true
		}).exec(res => {
			console.log(res)
			const canvas = res[0].node;
			imgCanvas = canvas
			console.log(canvas)
			const ctx = canvas.getContext('2d'); //getContext返回Canvas 的绘图上下文
			const dpr = 2; //比例我这里是设置的1，一般设置1就可以了
			canvas.width = props.canvasWidth * dpr;
			canvas.height = props.canvasHeight * dpr;
			ctx.scale(dpr, dpr);
			const img = canvas.createImage()
			img.src = props.src
			img.onload = () => {
				// ctx.drawImage(img, 0, 0, 340, rect[0].height);
				ctx.drawImage(img, 0, 0, props.canvasWidth, props.canvasHeight);
				// ctx.draw();
			}
			
			setTimeout(() => {
				uni.canvasToTempFilePath({
					quality: 1,
					canvas: canvas,
					x: Math.abs(cropData.x),
					y: Math.abs(cropData.y),
					width: props.width,
					height: props.height,
					fileType: 'png',
					success: function(res) {
						uni.hideLoading()
						emits('onSave', {
							cut_src: res.tempFilePath
						})
					},
					fail: function(res) {
						console.log("保存失败", res);
					}
				})
			}, 1000)
		})
	}
	const close = () => {
		emits('onClose')
	}
	const change = () => {
		emits('onChange')
	}
</script>

<style lang="scss" scoped>
	.cut-page {
		padding-top: v-bind('top');
		padding-bottom: env(safe-area-inset-bottom);
		width: 100%;
		height: 100vh;
		overflow: hidden;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 999;
		background-color: rgba(51,51,51,0.7);
		.movable-fb{
			box-sizing: content-box;
			// width: 310px;
			// height: 370px;
			// background-color: rgba(51,51,51,0.7);
			z-index: 99;
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			box-shadow: rgba(51,51,51,0.7) 0rpx 0rpx 0rpx 3000rpx;
			pointer-events: none;
			&.circle{
				border-radius: 50%;
				border: 7rpx solid #fff;
				.style{
					display: none;
				}
			}
			.style {
				position: absolute;
				width: 78rpx;
				height: 78rpx;
				&.top{
					border-top: 7rpx solid #fff;
					border-left: 7rpx solid #fff;
					top: -9rpx;
					left: -9rpx;
				}
				&.right{
					border-top: 7rpx solid #fff;
					border-right: 7rpx solid #fff;
					top: -9rpx;
					right: -9rpx;
				}
				&.bottom{
					border-bottom: 7rpx solid #fff;
					border-right: 7rpx solid #fff;
					bottom: -9rpx;
					right: -9rpx;
				}
				&.left{
					border-bottom: 7rpx solid #fff;
					border-left: 7rpx solid #fff;
					bottom: -9rpx;
					left: -9rpx;
				}
			}
			.tips{
				color: #fff;
				position: absolute;
				bottom: -60rpx;
				left: 0;
				width: 100%;
				text-align: center;
			}
		}
		movable-area {
			// width: 310px;
			// height: 370px;
			background-color: #ccc;
			// overflow: hidden;
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
		}

		movable-view {
			display: flex;
			align-items: center;
			justify-content: center;
			color: #fff;
		}

		.max {
			width: 310px;
		}

		.test-img {
			width: 100%;
		}

		.cut_img {
			width: 310px;
			height: 370rpx;
		}

		.myCanvas {
			// display: none;
			position: absolute;
			top: 99999px;
			left: 9999px;
		}
		.crop-handle-box{
			position: fixed;
			bottom: 120rpx;
			left: 0;
			width: 100%;
			z-index: 109;
			color: #fff;
			display: flex;
			align-items: center;
			justify-content: space-around;
			.btn{
				font-size: 30rpx;
				padding-bottom: 4rpx;
				border-bottom: 1px solid #fff;
			}
		}
	}
</style>
