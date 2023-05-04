import request from '@/utils/request.js'

const setSignNotice = (params) => request.post('/user/sign/setSignNotice', params)
const getSignNoticeSetting = () => request.get('/user/sign/getSignNoticeSetting')
const hasSubWxApp = () => request.get('/user/notice/hasSubWxApp')


export default {
	setSignNotice,
	getSignNoticeSetting,
	hasSubWxApp,
}