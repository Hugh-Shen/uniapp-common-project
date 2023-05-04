import request from '@/utils/request.js'
 
const parseInfo = (params) => request.post('/user/applet/phone', params)
const parseInfoNew = (params) => request.post('/user/applet/phoneNew', params)
const getUserInfo = (params) => request.get('/user/user/getInfo', params)
const canChangeUserName = () => request.post('/user/user/canChangeUserName')
const setUserUserName = (params) => request.post('/user/user/updateUserName', params)

export default {
	parseInfo,
	parseInfoNew,
	getUserInfo,
	canChangeUserName,
	setUserUserName
}