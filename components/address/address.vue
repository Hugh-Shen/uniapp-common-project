<template>
	<van-overlay :show="show" @click="onClickHide" z-index="999">
		<view class="address">
			<view class="address-content">
				<view class="title">
					<text>所在地区</text>
					<view class="icon" @click="onClose">
						<custom-icon type="zhifushibai" color="#D8D8D8" size="15" />
					</view>
				</view>
				<view class="header">
					<view class="header-list">
						<view class="ellipsis"
							v-for="(item, index) in addressRender"
							:key="index"
							@click="setCurrentActive(index)"
						>
							{{ item.name }}
						</view>
					</view>
					<view class="line"></view>
				</view>
				<scroll-view class="scroll" scroll-y="true" >
					<view class="scroll-container"
						v-show="currentActive === (index + 1)"
						v-for="(item, index) in addressList"
						:key="index"
					>
						<view class="scroll-item">
							<view
								class=""
								v-for="val in addressList[index]"
								:key="val.id"
								@click="handleSelect(val)"
							>
								{{ val.name}}
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
	</van-overlay>
</template>

<script setup>
	import { computed, watch, reactive, ref, toRaw } from 'vue'
	import api from './api.js'

	
	/* 数据请求 */
	const getAddress = (params) => {
		return api.getAddress(params).then(({ data }) => {
			addressList[currentActive.value - 1] = data
			return { data }
		})
	}
	const getAddressDetails = (params) => api.getAddressDetails(params)
	
	const props = defineProps({
		show: {
			type: Boolean,
			default: false,
		},
		renderInput: {
			type: Array,
			default: () => [],
		},
	})
	
	const emit = defineEmits(['confirm', 'close'])
	
	const show = ref(false)
	const currentActive = ref(1)
	const addressData = reactive({
		province: { name: '请选择' },
		city: '',
		area: '',
		street: '',
	})
	const addressList = reactive([])
	
	const addressRender = computed(() => Object.values(addressData).filter((key) => key))
	const lineTransForm = computed(() => {
		const num = (currentActive.value * 60) - 30 - (30 / 2) + 24 
		return num
	})
	const line = computed(() => lineTransForm.value + 'px') 
	
	watch(() => props.show, (cur, pre) => {
		show.value = cur
	})
	watch(() => props.renderInput, (cur, pre) => {
		const list = cur.filter(item => item)
		if (list.length) {
			handleRenderInputFn(list)
		}
	}, { immediate: true })
	
	
	const processDataFn = (data, list) => {
		const { proviceList, cityList, areaList, streetList } = data
		const _map = Object.keys(data)
		const _name = {
			proviceList: 'province',
			cityList: 'city',
			areaList: 'area',
			streetList: 'street'
		}
		
		let index = 0
		for (const i of list) { // list -> 地址 id 集合
			if (data[_map[index]].length) {
				const find = data[_map[index]].find(item => item.code === i)
				addressData[_name[_map[index]]] = find
				addressList[index] = data[_map[index]]
			}
			index++
		}
	}
	const handleRenderInputFn = async (list) => {
		if (Array.isArray(list) && list.length) {
			const arr = list.reduce((pre, next) => pre + `${next},`, '')
			const parmas = { idList: arr.slice(0, arr.length - 2)}
			
			getAddressDetails(parmas).then(({ data }) => {
				processDataFn(data, list)
			})
		}
	}
	const onClickHide = () => {}
	const setCurrentActive = (index) => {
		currentActive.value = index + 1
	}
	const onClose = () => {
		emit('close')
		show.value = false
	}
	const resetPloy = () => {
		const _map = Object.keys(addressData)
		let count = addressList.length
		while(count > currentActive.value) {
			addressData[_map[count]] = ''
			delete addressList[count - 1]
			count--
		}
	}
	const handleSelect = async (val) => {
		const map = {
			1: 'province',
			2: 'city',
			3: 'area',
			4: 'street',
		}
		
		addressData[map[currentActive.value]] = val
		resetPloy()
		
		if (val.isLeaf === 0) {
			currentActive.value = currentActive.value + 1
			const { data } = await getAddress(val.code)
			
			if (Array.isArray(data) && data.length) {
				addressData[map[currentActive.value]] = { name: '请选择' }
			}
		} else {
			// 没有下级数据了
			const val = toRaw(addressData)
			emit('confirm', val)
			show.value = false
		}
	}
	
	getAddress()
</script>

<style lang="scss" scoped>
	$transForm: v-bind('line');
	.address {
		height: 100%;
		position: relative;
		&-content {
			position: absolute;
			left: 0;
			bottom: 0;
			width: 100%;
			height: 70%;
			background-color: #fff;
			border-radius: 32rpx 32rpx 0 0;
			.title {
				height: 110rpx;
				line-height: 110rpx;
				text-align: center;
				font-size: 36rpx;
				position: relative;
				.icon {
					position: absolute;
					right: 24rpx;
					top: -12rpx;
				}
			}
			.header {
				position: relative;
				height: 60rpx;
				&-list {
					display: flex;
					padding: 0 24rpx;
					& > view {
						width: 120rpx;
						text-align: center;
					}
				}
				.line {
					position: absolute;
					left: $transForm;
					bottom: 10rpx;
					width: 48rpx;
					height: 1px;
					background-color: $uni-color-theme;
					transform: translateX(-50%);
				}
			}
			.scroll {
				height: calc(100% - 170rpx);
				padding-bottom: 80rpx;
				position: relative;
				&-container {
					position: absolute;
					padding: 0 24rpx;
					.scroll-item {
						height: 108rpx;
						line-height: 108rpx;
					}
				}
			}
		}
	}
</style>