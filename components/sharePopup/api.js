import request from '@/utils/request.js'
 
const getMySignInfo = (params) => request.get('/user/sign/getMySignInfo', params);
const getQRCode = (params) => request.post('/user/user/getQRCode', params);
const getSignWordSettingList = (params) => request.get('/user/sign/getSignWordSettingList', params)

export default {
	getMySignInfo,
	getQRCode,
	getSignWordSettingList
}