import request from '@/utils/request.js'

const getActivityList = (params) => request.post('/goods/market/activity/getList', params)
const getAdCycleList = (params) => request.get('/goods/market/activity/getAdCycleList', params)

export default {
	getActivityList,
	getAdCycleList,
}