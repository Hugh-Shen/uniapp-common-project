<template>
	<web-view
		:webview-styles="webviewStyles"
		:src="url"
	></web-view>
</template>

<script setup>
	import { ref } from "vue"
	
	const url = 'https://mp.weixin.qq.com/s?__biz=Mzg2Mzg5NDg4NQ==&mid=2247483661&idx=1&sn=e249fcca98cf2ccecb84f769a7f2fa7e&chksm=ce70ed07f907641133d6fe2e6038dfe33b01580c77c132147f0ef7239e7f06feee75a3432d81#rd'
	
	const webviewStyles = ref({})
</script>

<style>
</style>