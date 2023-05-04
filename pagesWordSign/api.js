import request from '@/utils/request.js'
 
const getShareTemplates = (params) => request.get('/user/sign/getShareTemplates', params);
const getSignPicSettingPage = (params) => request.get('/user/sign/getSignPicSettingPage', params);
const getSignWordSettingList = (params) => request.get('/user/sign/getSignWordSettingList', params);
const signShare = (params) => request.post('/user/sign/share', params);
const getQRCode = (params) => request.post('/user/user/getQRCode', params);

export default {
	getShareTemplates,
	getSignPicSettingPage,
	getSignWordSettingList,
	signShare,
	getQRCode
}