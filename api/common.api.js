import request from '@/utils/request.js'

const getCurrentStep = () => request.get('/user/coverRead/getCurrentStep')
const coverReadIncrStep = () => request.post('/user/coverRead/incrStep')
const getAdCycleList = (params) => request.get('/goods/market/activity/getAdCycleList') // 广告类型： 1商品，2资料包，3活动，4签到页，5我的

export default {
	getCurrentStep,
	coverReadIncrStep,
	getAdCycleList
}