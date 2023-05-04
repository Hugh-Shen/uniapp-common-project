import request from '@/utils/request.js'
 
const getProOrderList = (params) => request.get('/goods/market/order/product/pageQuery', params); // 商品订单
const getMatOrderList = (params) => request.post('/goods/market/order/material/pageQuery', params); // 资料包订单
const getProOrderDetail = (params) => request.get(`/goods/market/order/product/getOrderDetail`, params); // 商品订单详情
const getMatOrderDetail = (orderNo) => request.get(`/goods/market/order/material/${orderNo}`); //  资料包订单详情
const downloadFile = (params = {}) => request.get(`/goods/market/order/material/download/${params.id}/${params.orderNo}`) // 资料下载
const getActivityList = (params = {}) => request.post(`/goods/market/order/activity/pageQuery`, params) // 活动订单
const getActivityDetail = (orderNo) => request.get(`/goods/market/order/activity/${orderNo}`) // 活动订单详情接口
const activityPay = (params) => request.post(`/goods/market/order/activity/pay`, params) // 活动订单支付

export default {
	getProOrderList,
	getMatOrderList,
	getMatOrderDetail,
	getProOrderDetail,
	downloadFile,
	getActivityList,
	getActivityDetail,
	activityPay
}