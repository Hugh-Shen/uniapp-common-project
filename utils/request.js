import { HOST_URL } from "@/config/default.js"
import { navigationToSpecifiedPage } from "@/utils/common.js"
import localStorage from '@/utils/localStorage.js'
import { useUserStore } from '@/stores/user.js'


const user = useUserStore()
const TIMEOUT = 10000
let whetherTimeout = false
const HEADER = {
	'content-type': 'application/json',
}

class Request {
	async get(url, data) {
		return this.request({
			method: 'GET',
			url,
			data,
		})
	}
	
	async post(url, data) {
		return this.request({
			method: 'POST',
			url,
			data,
		})
	}
	
	async delete(url, data) {
		return this.request({
			method: 'DELETE',
			url,
			data,
		})
	}
	
	async uploadFile(url, file) {
		return new Promise((resovle, reject) => {
			uni.uploadFile({
				url: HOST_URL + options.url,
				filePath: file,
				name: 'file',
				success: (uploadFileRes) => {
					if(uploadFileRes.statusCode === 200) {
					  resolve(JSON.parse(uploadFileRes.data));
					} else {
					  reject(uploadFileRes)
					}
				},
				fail: (err) => {
					reject(err)
				}
			})
		})
	}
	
	async request (options) {
		let headerParams = HEADER
		
		const token = uni.getStorageSync('token')
		
		if (token) {
			headerParams = {
				...HEADER,
				authorization: token,
			}
		}
		
		return new Promise((resolve, reject) => {
			uni.request({
				url: HOST_URL + options.url,
				method: options.method || 'GET',
				header: headerParams,
				data: options.data,
				dataType: 'json',
				timeout: TIMEOUT,
				success: ({ statusCode, message = '操作失败', data = {} }) => {
					if (data.code !== 200) {
						uni.showToast({
							title: data.msg || message,
							icon: 'none',
							duration: 3000,
						})
					}
					if (data.code === 401) {
						localStorage.remove('token')
						user.setToken('')
						return navigationToSpecifiedPage('/pages/login/index')
					}
					resolve(data)
				},
				fail: err => {
					// 弱网状态 -> 超时
					if (err.errMsg === 'request:fail timeout' && !whetherTimeout) {
						whetherTimeout = true
						navigationToSpecifiedPage('/pages/timeout/index')
					}
					
					reject(err)
				},
			})
		})
	}
}

const request = new Request()

export default request
