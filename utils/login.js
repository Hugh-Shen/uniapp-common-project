 import request from '@/utils/request.js'
 
 export const loginProvider = () => {
	return new Promise((resolve, reject) => {
		uni.getProvider({
			service: 'oauth',
			success: (res) => {
				resolve(res)
			},
			fail: (err) => {
				reject(err)
			},
		})
	})
}

export const miniProgram = async () => {
	const { errMsg, provider, service } = await loginProvider()
	return new Promise((resovle, reject) => {
		uni.login({
			provider: provider[0] || '',
			success: async ({ code }) => {
				const { data } = await request.post('/user/applet/code2Session', {
					code,
				})
				resovle(data)
			}
		})
	})
}

export const getSystemInfo = async () => {
	return new Promise((resovle, reject) => {
		uni.getSystemInfo({
			success: async (info) => {
				const { uniPlatform } = info
				
				switch(true) {
					case (['mp-weixin'].includes(uniPlatform)):
						const params = await miniProgram()
						resovle(params)
					break
				}
			},
		})
	})
}
