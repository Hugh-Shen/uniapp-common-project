<template>
	<view class="home root">
		<nav-bar>
			<view class="">hello</view>
		</nav-bar>
	</view>
</template>

<script setup>
	import { reactive, ref, nextTick, toRef, toRefs, toRaw, onBeforeMount } from 'vue'
	import { onLoad, onShow, onShareAppMessage } from '@dcloudio/uni-app'
	import { useUserStore } from '@/stores/user.js'
	import { navigationToSpecifiedPage } from "@/utils/common.js"
	
	
</script>

<style lang="scss">
	.home {
		
	}
</style>
