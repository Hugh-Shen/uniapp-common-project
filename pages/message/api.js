import request from '@/utils/request.js'
 
const getInnerNoticeSummaryList = (params) => request.get('/user/notice/getInnerNoticeSummaryList', params);
const hasSubWxApp = () => request.get('/user/notice/hasSubWxApp')


export default {
	getInnerNoticeSummaryList,
	hasSubWxApp,
}