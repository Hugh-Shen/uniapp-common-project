import { defineStore } from 'pinia'
import { reactive } from "vue"

export const useUserStore = defineStore('address', () => {
	const store = reactive({
		currentSelectedAddress: null,
		defaultAddress: null,
	})
	
	const setCurrentSelectedAddress = (data) => {
		store.currentSelectedAddress = data
	}

	const setDefaultAddress = (data) => {
		store.defaultAddress = data
	}
	
	return {
		store,
		setCurrentSelectedAddress,
		setDefaultAddress,
	}
})