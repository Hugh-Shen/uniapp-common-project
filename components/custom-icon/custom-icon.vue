<template>
	<view
		:class="['icon', 'icon-' + type]"
		:style="{color: color,'font-size': fontSize,'background': background, ...resetStyle}"
		@click="onClick()">
	</view>
</template>

<script>
	export default {
		props: {
			/**
			 * 图标类型
			 */
			type: String,
			/**
			 * 图标颜色
			 */
			color: String,
			/**
			 * 图标背景颜色
			 */
			background: String,
			/**
			 * 图标大小
			 */
			size: {
				type: [Number, String],
				default: 24,
			},
			resetStyle: {
				type: Object,
				default: () => ({})
			},
		},
		computed: {
			fontSize() {
				var size = Number(this.size)
				size = isNaN(size) ? 24 : size
				return `${size}px`
			}
		},
		methods: {
			onClick() {
				this.$emit('click')
			}
		}
	}
</script>

<style>
	@import "@/static/iconfont.css";
</style>
