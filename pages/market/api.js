import request from '@/utils/request.js'

const getCategory = (params) => request.get('/goods/market/category/getCategoryLeft', params)
const getCategoryChildren = (params) => request.get('/goods/market/category/getCategoryRight', params)
const getSlideInDatagram = (params) => request.get('/goods/market/material/getAdCycleList', params)
const getDataDatagramList = (params) => request.post('/goods/market/material/getList', params)

/* 商品 */
const getAdCycleListProduct = (params) => request.get('/goods/market/product/getAdCycleList', params) // 好货轮播
const getMarketProductList = (params) => request.get('/goods/market/product/getMarketProductList', params) // 好货列表


export default {
	getCategory,
	getCategoryChildren,
	getSlideInDatagram,
	getDataDatagramList,
	getAdCycleListProduct,
	getMarketProductList,
}