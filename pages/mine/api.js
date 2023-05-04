import request from '@/utils/request.js'

const getUserInfo = () => request.get('/user/user/getInfo')
const canChangeUserName = () => request.post('/user/user/canChangeUserName')


export default {
	getUserInfo,
	canChangeUserName
}