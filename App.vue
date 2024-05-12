<script>
	export default {
		globalData: {
			statusBar: {
				top: 0,
				height: 0,
				width: 0
			},
		},
		onLaunch: function(options) {
			uni.getSystemInfo({
				success: (e) => {
					const statusBarHeight = e.statusBarHeight

					// 胶囊高度
					const menu = uni.getMenuButtonBoundingClientRect()
					this.globalData.statusBar.top = menu.top
					this.globalData.statusBar.height = menu.height
					this.globalData.statusBar.width = menu.width
				},
			})
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/* 图片存在空白边距 */
	image {
		display:block;
	}
	/* ios 底部边距 */
	.root {
		width: 100vw;
		height: 100vh;
		padding-bottom: calc(0rpx + constant(safe-area-inset-bottom));
		padding-bottom: env(safe-area-inset-bottom);
		font-size: 24rpx;
	}
	/* vant 公用样式 */
	@import "/wxcomponents/vant/common/index.wxss";
</style>
