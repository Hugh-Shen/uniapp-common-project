import request from '@/utils/request.js'

const getAddress = (id = 0) => request.get(`/user/logistics/${id}/children`)
const getAddressDetails = (params) => request.get(`/user/logistics/logisticsList`, params)


export default {
	getAddress,
	getAddressDetails,
}