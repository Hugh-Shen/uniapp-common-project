<template>
	<van-popup
		round
	  :show="showVal"
	  position="bottom"
	  @close.stop="onClose"
	>
		<view class="container">
			<template>
				<picker-view
					v-if="type === 'default'"
					:value="pickerVal"
					immediate-change
					@change.stop="handleChangeToPicker"
				>
					<picker-view-column>
					  <view class="picker-item"
							v-for="(item,index) in list" 
							:key="index"
						>
							{{ item.label }}
						</view>
					</picker-view-column>
				</picker-view>
				<view v-else>
					<picker-view indicator-style="height: 50px;" style="width: 100%; height: 300px;" :value="initDate" @change="dateChange">
						<picker-view-column>
							<view v-for="item in years" :key="years" style="line-height: 50px; text-align: center;">{{item}}年</view>
						</picker-view-column>
						<picker-view-column>
							<view v-for="item in months" :key="months" style="line-height: 50px; text-align: center;">{{item}}月</view>
						</picker-view-column>
						<picker-view-column>
							<view v-for="item in days" :key="days" style="line-height: 50px; text-align: center;">{{item}}日</view>
						</picker-view-column>
					</picker-view>
				</view>
			</template>
			<view class="footer">
				<view class="btn-container">
					<van-button
						type="default"
						round
						color="#FF9933"
						plain
						:custom-style="customStyle"
						@click.stop="onClose"
					>
						取消
					</van-button>
					<van-button type="default" color="#FF9933" round :custom-style="customStyle + 'margin-left: 70rpx;'" @click.stop="save">确认</van-button>
				</view>
			</view>
		</view>
	</van-popup>
</template>

<script setup>
	import { computed, ref, toRaw, reactive } from "vue"
	import dayjs from "@/utils/dayjs.min.js"
	
	const d = new Date();
	
	const customStyle = 'height: 35px;width: 232rpx;'
	const dateList = ['date', 'time']
	const minDate = dayjs('1900-01-01').toDate().getTime()
	const maxDate = new Date().getTime()
	
	const props = defineProps({
		show: {
			type: Boolean,
			default: false,
		},
		type: {
			type: String,
			default: 'default',
			validator(value) {
				return ['date', 'time', 'default'].includes(value)
			}
		},
		value: {
			type: [Number, Array],
			default: ({ type }) => type === 'default' ? [] : new Date().getTime(),
		},
		list: {
			type: Array,
			default: () => [],
		}
	})
	const emit = defineEmits(['onClose', 'onSave'])
	
	const time = ref(props.value)
	const pickerVal = ref(props.value)
	const showVal = ref(props.show)
	
	
	const handleChangeToPicker = ({ detail }) => {
		pickerVal.value = detail.value
	}
	const onClose = () => {
		showVal.value = false
		emit('onClose')
	}
	const save = (e) => {
		const params = { type: props.type, } 
		if (props.type === 'default') {
			params.value = {
				picker: toRaw(pickerVal.value),
			}
		} else {
			params.value = {
				date: dateVal.value,
			}
		}
		showVal.value = false
		emit('onSave', params)
	}
	
	const date = new Date()
	const selectDate = reactive({
		year: '',
		months: '',
		day: ''
	})
	const dateVal = ref(dayjs().format('YYYY-MM-DD'))
	const years = computed(() => {
		let arr = []
		for (let i = 1940; i <= date.getFullYear(); i++) {
			arr.push(i)
		}
		return arr
	})
	const months = computed(() => {
		let arr = []
		let j = 12
		if (selectDate.year == dayjs().format('YYYY')) {
			j = dayjs().month() + 1
		}
		for (let i = 1; i <= j; i++) {
			arr.push(i)
		}
		return arr
	})
	const days = computed(() => {
		let arr = []
		let j = 31
		if (selectDate.year == dayjs().format('YYYY') && selectDate.months == dayjs().month() + 1) {
			j = d.getDate()
		}
		for (let i = 1; i <= j; i++) {
			arr.push(i)
		}
		return arr
	})
	
	const initDate = ref([years.value.length - 2, 1, 1])
	
	const dateChange = (e) => {
		let value = e.detail.value
		selectDate.year = years.value[value[0]]+''
		selectDate.months = months.value[value[1]]
		dateVal.value = `${years.value[value[0]]}-${months.value[value[1]]}-${days.value[value[2]]}`
	}
	
</script>

<style lang="scss" scoped>
	.container {
		width: 100vw;
		padding: 70rpx 50rpx 85rpx;
		picker-view {
			height: 300rpx;
			.picker-item {
				display: flex;
				justify-content: center;
				line-height: 34px;
			}
		}
		.footer {
			padding-top: 20rpx;
			.btn-container {
				display: flex;
				justify-content: center;
				height: 70rpx;
			}
		}
	}
</style>