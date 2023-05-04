import { ref, computed, watch } from 'vue'
import { splitFn } from '@/utils/common.js'
import dayjs from '@/utils/dayjs.min.js'



const useTime = (sourceData = {}) => {
	const time = ref('1993')

	const setTime = () => {
		if (Object.prototype.toString.call(sourceData) === '[object Object]') {
			const { beginTime, endTime } = sourceData
			
			// 是否同一天
			const sameDay = dayjs(beginTime).isSame(endTime, 'day')
			
			if (sameDay) {
				time.value = `${dayjs(beginTime).format('MM-DD HH:mm')}~${dayjs(endTime).format('HH:mm')}`
			} else {
				const sameMonth = dayjs(beginTime).isSame(endTime, 'month')
				const sameYear = dayjs(beginTime).isSame(endTime, 'year')
				if (!sameYear) {
					time.value = `${dayjs(beginTime).format('MM-DD HH:mm')}~${dayjs(endTime).format('YYYY-MM-DD HH:mm')}`
					return
				}
				
				time.value = `${dayjs(beginTime).format('MM-DD HH:mm')}~${dayjs(endTime).format('MM-DD HH:mm')}`
			}
		}
	}
	
	
	watch(() => sourceData, (cur, pre) => {
		setTime()
	}, { immediate: true, deep: true })
	return time.value
}

export default useTime
