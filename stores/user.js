import { defineStore } from 'pinia'
import { reactive } from "vue"
import localStorage from '@/utils/localStorage.js'

export const useUserStore = defineStore('user', () => {
	const store = reactive({
		token: localStorage.get('token') || '',
		userInfo: {},
		inviteData: {},
		showGuidance: true,
		award: null,
	})
	
	const setUserInfoData = (data) => {
		store.userInfo = data
	}
	
	const setToken = (token) => {
		store.token = token
	}
	
	const setInviteData = (data) => {
		store.inviteData = data
	}
	
	const setShowGuidance = (data) => {
		store.showGuidance = data
	}
	
	const setAward = (data) => {
		store.award = data
	}
	
	return {
		store,
		setUserInfoData,
		setToken,
		setInviteData,
		setShowGuidance,
		setAward,
	}
})