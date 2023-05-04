import request from '@/utils/request.js'
 
const getSignWordSettingList = (params) => request.get('/user/sign/getSignWordSettingList', params)

export default {
	getSignWordSettingList
}