import { ref, computed, reactive } from "vue";
import dayjs from '@/utils/dayjs.min.js';

export default function useTimes(){
	const timeRange = reactive({
		range_1: 86400000, // 24小时内：显示为：时分，如：20:45
		range_2: 172800000, // 48小时内：显示为：昨天
		range_3: 604800000, // 48小时-7天内：显示为：星期x，如：星期一;7天后：显示为年月日，如：2022/10/23
	})
	const setTimes = computed(() => {
		return (time) => {
			let targetTime = dayjs(time).format('YYYY-MM-DD')
			let UNIX = dayjs().valueOf() - dayjs(targetTime).valueOf();
			let str = ''
			if (UNIX < timeRange.range_1) {
				str = dayjs(time).format('HH:mm')
			} else if (UNIX >= timeRange.range_1 && UNIX < timeRange.range_2) {
				str = '昨天'
			} else if (UNIX >= timeRange.range_2 && UNIX < timeRange.range_3) {
				let dayMark = dayjs(time).day()
				switch(dayMark){
					case 1:
						dayMark = "一";
						break;
					case 2:
						dayMark = "二";
						break;
					case 3:
						dayMark = "三";
						break;
					case 4:
						dayMark = "四";
						break;
					case 5:
						dayMark = "五";
						break;
					case 6:
						dayMark = "六";
						break;
					case 0:
						dayMark = "日";
						break;
				}
				str = '星期' + dayMark
			} else {
				str = dayjs(time).format('YYYY/MM/DD')
			}
			return str
		}
	})
	return {
		setTimes
	}
}
