import localStorage from '@/utils/localStorage.js'

const pages = [
	'/pages/index/index',
	'/pages/market/index',
	'/pages/activity/index',
	'/pages/mine/index',
	'/pages/timeout/index',
	'/pagesMessage/contact/index',
	'/pagesMine/aboutUs/index',
	'/pagesProtocol/use/index',
	'/pagesProtocol/privacy/index',
	'/pagesMarket/list/index',
	'/pagesMarket/datagramDetail/index',
	'/pagesMarket/specialProjectList/index',
	'/pagesActivity/details/index',
]

export const navigationToSpecifiedPage = (params = {}) => {
	// 判断是否登录
	const token = localStorage.get('token')
	const isString = typeof params === 'string'
	const _url = isString ? params : params.url || ''
	
	// 不带参数的路径
	 const ind =_url.indexOf('?')
	 const pathWithoutParameters = ind < 0 ? _url : _url.slice(0, ind)
	
	const _pages = getCurrentPages()
	const {
		route,
		options,
	} = _pages[_pages.length - 1]

	// 如果没有登录，并且不在路由白名单
	if (!token && !pages.includes(pathWithoutParameters)) {
		const _val = Object.keys(options)
		let opt = ''
		// 如果携带参数
		if (_val.length) {
			opt = _val.reduce((pre, next, index) => pre + `&${next}=${options[next]}`, '')
		}
		uni.navigateTo({
			url: `/pages/login/index?replace=/${route}` + opt,
		})
		return
	}

	if (isString) {
		uni.navigateTo({
			url: params
		})
		return
	}

	uni.navigateTo(params)
}

// 过滤参数
export const returnExcludeParameter = (exclude = []) => {
	const options = getcurrentPageOption()
	const keys = Object.keys(options)
	let _opt = []
		
	if (keys) {
		for (const key of keys) {
			if (!exclude.includes(key)) {
				let val = `${key}=${options[key]}`
					_opt.push(val)
			}
		}
	}
	return _opt
}

export const navigationToMain = (params) => {
	if (typeof params === 'string') {
		uni.switchTab({
			url: params
		})
		return
	}
	uni.switchTab(params)
}

export const splitFn = (str, chars = '-') => {
	return Array.isArray(str) ? str.join().split(chars) : str.split(chars)
}

export const getcurrentPageOption = () => {
	const pages = getCurrentPages()
	const curret = pages[pages.length - 1]
	
	return curret.options || {}
}

export const throttle = (fn, timer) => {
	let content, args;
	let previous = 0
	return (e) => {
		content = this
		args = arguments
		let now = +new Date()
		if (now - previous > timer) {
			fn.apply(content, [e, ...args])
			previous = now
		}
	}
}

export const getElement = (selector, proxy) => {
		return new Promise((resolve, reject) => {
			const query = uni.createSelectorQuery().in(proxy)
			query.select(selector).boundingClientRect(e => {
				resolve(e)
			}).exec()
		})
	}

export const downloadFormat = (val = 0) => {
	const num = +val
	if (num < 10000) {
		return num
	}
	const _val = num / 10000
	
	return _val >= 1.1 ? `${(_val).toFixed(1)}万` : `${Math.floor(_val)}万`
}

export const saveFileFn = (url) => {
	uni.downloadFile({
		url,
		success: ({ tempFilePath }) => {
			uni.openDocument({
				filePath: tempFilePath,
				showMenu:true,
			})
		}
	})
}

export const shareFileFn = (params = {}) => {
	uni.downloadFile({
		url: params.url,
		success: ({ tempFilePath }) => {
			wx.shareFileMessage({
				...params,
				filePath: tempFilePath,
				success: () => {
					console.log('share success')
				},
			})
		}
	})
}

// 支付
export const payMethod = (options, callback) => {
	uni.getProvider({
		service: 'payment',
		success: (res) => {
			const { provider } = res
			uni.requestPayment({
				...options,
				provider: provider[0],
				success: callback,
				fail: callback,
			})
		},
	})
}
