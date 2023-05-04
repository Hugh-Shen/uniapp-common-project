import request from '@/utils/request.js'

const isTodaySign = () => request.get('/user/sign/hasSignToday')
const sign = () => request.post('/user/sign/sign')
const weekSign = () => request.get('/user/sign/getWeekSignRecord')
const monthSign = (params) => request.get('/user/sign/getMonthSignRecord', params)
const getUserInfo = () => request.get('/user/user/getInfo')
const defaultWeekSign = () => request.get('/user/sign/getDefaultWeekSignRecord')
const defaultMonthSign = (params) => request.get('/user/sign/getDefaultMonthSignRecord', params)

export default {
	isTodaySign,
	sign,
	weekSign,
	monthSign,
	getUserInfo,
	defaultWeekSign,
	defaultMonthSign,
}