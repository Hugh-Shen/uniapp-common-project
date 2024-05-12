// 保存相册
export const savePhotosAlbum = ({ tempFilePath }) => {
	uni.saveImageToPhotosAlbum({
		filePath: tempFilePath,
		success : (_res1) => {
			uni.showToast({
				title: '保存成功',
				duration: 1000,
			});
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
}

// 图片输出比例
const outputPictrue = (res, scale = 1) => {
	return {
		quality: 0,
		x: 0,
		y: 0,
		width: res.width * scale,
		height: res.height * scale,
		destWidth: res.width * 3, //输出的图片的宽度
		destHeight: res.height * 3, //输出的图片的高度
		fileType: 'png',
	}
}

const drawRoundedRect = (ctx, x, y, width, height, radius) => {
	ctx.fillStyle = 'transparent'
	
	ctx.moveTo(x + radius, y)
	ctx.lineTo(x + width - radius, y)
	ctx.arc(x + width - radius, y + radius, radius, -Math.PI/2, 0)
	ctx.lineTo(x + width, y + height - radius)
	ctx.arc(x + width - radius, y + height - radius, radius, 0, Math.PI/2)
	ctx.lineTo(x + radius, y + height)
	ctx.arc(x + radius, y + height - radius, radius, Math.PI/2, Math.PI)
	ctx.lineTo(x, y + radius)
	ctx.arc(x + radius, y + radius, radius, Math.PI, -Math.PI/2)
	
	ctx.fill()
	ctx.closePath()
	ctx.clip()
}


class CreatePoster {
	constructor (element, instance, callback) {
		this.canvasName = element
		
		const query = instance ? uni.createSelectorQuery().in(instance) : uni.createSelectorQuery()
		
		query.select(element)
			.fields({ node: true, size: true })
			.exec((res) => {
				const canvas = res[0].node
				const ctx = canvas.getContext('2d')
				const dpr = uni.getSystemInfoSync().pixelRatio
				canvas.width = res[0].width * dpr
				canvas.height = res[0].height * dpr
				ctx.scale(dpr, dpr)
				
				// 标记 canvas
				this._canvas = res[0]
				
				// 重置绘图面板
				ctx.fillStyle = '#fff'
				ctx.fillRect(0, 0, res[0].width, res[0].height)
				
				
				callback({
					drawImage: (options = {}) => {
						return this.drawImage(ctx, canvas, options)
					},
					fillText: (text, options = {}) => {
						return this.fillText(ctx, text, options)
					},
					strokeRect: (options = {}) => {
						return this.strokeRect(ctx, options)
					},
					strokeLine: (options = {}) => {
						return this.strokeLine(ctx, options)
					}
				}, res[0])
			})
	}
	// 绘制图片
	drawImage = async (ctx, element, options = {}) => {
		return new Promise((reslove) => {
			const { picture, width, height, x = 0, y = 0, round = false, radius = 0 } = options
			const img = element.createImage()
			
			img.src = picture
			
			// img.setAttribute("crossOrigin",'Anonymous')
			// 如果是 Boolean 认定为圆形图片
			img.onload = () => {
				if (round) {
					ctx.save()
					ctx.beginPath()
					
					if (round === 'border') {						
						drawRoundedRect(ctx, x, y, width, height, radius)
					} else {
						ctx.arc(width / 2 + x, height / 2 + y, width / 2, 0, Math.PI * 2, false)
						ctx.clip()
					}
				}
				
				ctx.drawImage(img, x, y, width, height)
				
				if (round) {
					ctx.restore()
				}
				reslove()
			}
		})
	}
	// 绘制文字
	fillText = (ctx, text, options = {}) => {
		const { fontSize = 14, color = 'black', x = 0, y = 0, bold = false } = options
		
		ctx.font = bold ? `normal ${bold} ${fontSize}px sans-serif` : `normal ${fontSize}px sans-serif`
		ctx.fillStyle = color
		ctx.fillText(text, x, y)
	}
	// 绘制矩形
	strokeRect = async (ctx, options) => {
		return new Promise((resolve, reject) => {
			const initOptions = {
				x: 0,
				y: 0,
				width: 50,
				height: 30,
				color: 'black',
				round: [0],
			}
			const { x, y, width, height, color, round } = { ...initOptions, ...options }
			
			ctx.fillStyle = color
			ctx.roundRect(x, y, width, height, round)
			ctx.closePath()
			ctx.fill()
			
			resolve()
		})
	}
	// 绘制线
	strokeLine = async (ctx, options) => {
		const { x = 0, y = 0, endX = 0, endY = 0, color = '#D4D4D4', width = 1 } = options
		
		ctx.lineWidth = width
		ctx.strokeStyle = color
		ctx.beginPath()
		ctx.moveTo(x, y)
		ctx.lineTo(endX, endY)
		ctx.stroke()
	}
	// 保存图片
	canvasTransformImg = async (callback, save = true) => {
		const dpr = uni.getSystemInfoSync().pixelRatio
		const options = outputPictrue(this._canvas)
		callback = typeof callback === 'function' ? callback : () => {}
		
		
		uni.canvasToTempFilePath({
			canvasId: this.canvasName,
			canvas: this._canvas.node,
			x: 0,
			y: 0,
			width: 200 * dpr,
			height: 200 * dpr,
			destWidth: 200 * dpr,
			destHeight: 200 * dpr,
			...options,
			success(res) {
				if (save) {
					savePhotosAlbum(res)
				}
				
				callback(res)
			},
			fail(res) {
				console.error(res)
			}
		})
	}
}



export default CreatePoster