import request from '@/utils/request.js'

const setUserAvatar = (params) => request.post('/user/user/updateAvatar', params)
const setUserBirthday = (params) => request.post('/user/user/updateBirthday', params)
const setUserGender = (params) => request.post('/user/user/updateSex', params)
const setUserUserName = (params) => request.post('/user/user/updateUserName', params)
const getUserInfo = () => request.get('/user/user/getInfo')
const canCurrentMonthEditUsername = () => request.post('/user/user/canChangeUserName')
const loginOut = () => request.post('/user/user/logout')


export default {
	setUserAvatar,
	setUserUserName,
	setUserBirthday,
	setUserGender,
	getUserInfo,
	canCurrentMonthEditUsername,
	loginOut,
}