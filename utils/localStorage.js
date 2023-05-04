class LocalStorage {
	get(key) {
		return uni.getStorageSync(key)
	}
	set(key, value) {
		uni.setStorageSync(key, value);
	}
	remove(key) {
		uni.removeStorageSync(key)
	}
}


export default new LocalStorage()