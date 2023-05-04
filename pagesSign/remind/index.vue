<template>
	<view class="remind">
		<Guidance :show="showGuidance && !isHasSub" @close="() => user.setShowGuidance(false)" />
		<view :class="(showGuidance && !isHasSub) ? 'mt-20' : ''">
			<Remind
				:enabled="signSeeting.enabled"
				:pushTime="signSeeting.pushTime"
				@confirm="handleSelectDate"
				@switch="switchRemind"
			/>
		</view>
	</view>
</template>

<script setup>
	import { nextTick, onBeforeMount, ref, toRefs, toRaw } from "vue"
	import { onShow } from "@dcloudio/uni-app"
	import { useUserStore } from '@/stores/user.js'
	import Remind from "./components/Remind.vue"
	import Guidance from "@/components/guidance/guidance.vue"
	import api from "./api.js"
	
	/* 数据请求 */
	const setSignNotice = (params) => {
		api.setSignNotice(params).then(({ data, msg }) => {
			uni.showToast({
				title: msg || '操作成功',
				mask: true,
			})
		})
	}
	const getSignNoticeSetting = () => {
		api.getSignNoticeSetting().then(({ data }) => {
			signSeeting.value = data || {
				enabled: false,
				pushTime: '',
			}
		})
	}
	const hasSubWxApp = () => {
		api.hasSubWxApp().then(({ data }) => {
			isHasSub.value = data
		})
	}
	
	const user = useUserStore()
	const { showGuidance } = toRefs(user.store)
	const signSeeting = ref({
		enabled: false,
		pushTime: '',
	})
	const isHasSub = ref(true)
	
	const isOpenRemind = (val) => {
		if (signSeeting.value.pushTime) {
			setSignNotice({
				...signSeeting.value,
				enabled: val,
			})
		}
	}
	const switchRemind = (val) => {
		signSeeting.value.enabled = val
		isOpenRemind(val)
	}
	const handleSelectDate = (val) => {
		signSeeting.value.pushTime = val
		setSignNotice({
			...signSeeting.value,
			pushTime: val,
		})
	}
	
	onBeforeMount(() => {
		getSignNoticeSetting()
	})
	onShow(() => {
		if (showGuidance.value) {
			hasSubWxApp()
		}
	})
</script>

<style lang="scss" scoped>
 .remind {
	 padding: 20rpx 24rpx 0;
 }
</style>