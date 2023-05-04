
export const HOST_URL = process.env.config[process.env.name].VITE_BASE_URL
export const Bucket = process.env.config[process.env.name].VITE_BUCKET


export const GENDER = [
	{
		label: '男',
		value: 0,
	},
	{
		label: '女',
		value: 1,
	},
	// {
	// 	label: '保密',
	// 	value: 2,
	// },
]

export const GENDER_TEXT = ['男', '女']

export const INTEGRAL_TYPE = new Map([
	[100, '新用户注册'],
	[101, '邀请好友注册'],
	[200, '签到'],
	[201, '好友首次签到'],
	[301, '积分兑换'],
	[303, '积分部分兑换'],
	[400, '客服增减'],
])

export const SIGN_IMG_LIST = [
	'https://hr-community-new-test.obs.cn-south-1.myhuaweicloud.com/obs/user/sign/bg_pic/scene_01.jpg',
	'https://hr-community-new-test.obs.cn-south-1.myhuaweicloud.com/obs/user/sign/bg_pic/scene_02.jpg',
	'https://hr-community-new-test.obs.cn-south-1.myhuaweicloud.com/obs/user/sign/bg_pic/scene_03.jpg',
	'https://hr-community-new-test.obs.cn-south-1.myhuaweicloud.com/obs/user/sign/bg_pic/scene_04.jpg',
	'https://hr-community-new-test.obs.cn-south-1.myhuaweicloud.com/obs/user/sign/bg_pic/scene_05.jpg',
	'https://hr-community-new-test.obs.cn-south-1.myhuaweicloud.com/obs/user/sign/bg_pic/scene_06.jpg',
	'https://hr-community-new-test.obs.cn-south-1.myhuaweicloud.com/obs/user/sign/bg_pic/scene_07.jpg',
	'https://hr-community-new-test.obs.cn-south-1.myhuaweicloud.com/obs/user/sign/bg_pic/animal_01.jpg',
	'https://hr-community-new-test.obs.cn-south-1.myhuaweicloud.com/obs/user/sign/bg_pic/animal_02.jpg',
	'https://hr-community-new-test.obs.cn-south-1.myhuaweicloud.com/obs/user/sign/bg_pic/animal_03.jpg',
	'https://hr-community-new-test.obs.cn-south-1.myhuaweicloud.com/obs/user/sign/bg_pic/animal_04.jpg',
	'https://hr-community-new-test.obs.cn-south-1.myhuaweicloud.com/obs/user/sign/bg_pic/animal_05.jpg',
	'https://hr-community-new-test.obs.cn-south-1.myhuaweicloud.com/obs/user/sign/bg_pic/animal_06.jpg',
	'https://hr-community-new-test.obs.cn-south-1.myhuaweicloud.com/obs/user/sign/bg_pic/animal_07.jpg',
	'https://hr-community-new-test.obs.cn-south-1.myhuaweicloud.com/obs/user/sign/bg_pic/animal_08.jpg',
	'https://hr-community-new-test.obs.cn-south-1.myhuaweicloud.com/obs/user/sign/bg_pic/animal_09.jpg',
	'https://hr-community-new-test.obs.cn-south-1.myhuaweicloud.com/obs/user/sign/bg_pic/animal_10.jpg',
	'https://hr-community-new-test.obs.cn-south-1.myhuaweicloud.com/obs/user/sign/bg_pic/animal_11.jpg',
	'https://hr-community-new-test.obs.cn-south-1.myhuaweicloud.com/obs/user/sign/bg_pic/animal_12.jpg',
	'https://hr-community-new-test.obs.cn-south-1.myhuaweicloud.com/obs/user/sign/bg_pic/animal_13.jpg',
	'https://hr-community-new-test.obs.cn-south-1.myhuaweicloud.com/obs/user/sign/bg_pic/animal_14.jpg',
	'https://hr-community-new-test.obs.cn-south-1.myhuaweicloud.com/obs/user/sign/bg_pic/animal_15.jpg',
	'https://hr-community-new-test.obs.cn-south-1.myhuaweicloud.com/obs/user/sign/bg_pic/animal_16.jpg',
	'https://hr-community-new-test.obs.cn-south-1.myhuaweicloud.com/obs/user/sign/bg_pic/animal_17.jpg',
	'https://hr-community-new-prod.obs.cn-south-1.myhuaweicloud.com/obs/user/sign/bg_pic/ac_01.jpg',
	'https://hr-community-new-prod.obs.cn-south-1.myhuaweicloud.com/obs/user/sign/bg_pic/ac_02.jpg',
	'https://hr-community-new-prod.obs.cn-south-1.myhuaweicloud.com/obs/user/sign/bg_pic/ac_03.jpg',
	'https://hr-community-new-prod.obs.cn-south-1.myhuaweicloud.com/obs/user/sign/bg_pic/ac_04.jpg',
	'https://hr-community-new-prod.obs.cn-south-1.myhuaweicloud.com/obs/user/sign/bg_pic/ac_05.jpg',
	'https://hr-community-new-prod.obs.cn-south-1.myhuaweicloud.com/obs/user/sign/bg_pic/ac_06.jpg',
	'https://hr-community-new-prod.obs.cn-south-1.myhuaweicloud.com/obs/user/sign/bg_pic/ac_07.jpg',
	'https://hr-community-new-prod.obs.cn-south-1.myhuaweicloud.com/obs/user/sign/bg_pic/ac_08.jpg',
	'https://hr-community-new-prod.obs.cn-south-1.myhuaweicloud.com/obs/user/sign/bg_pic/ac_09.jpg',
	'https://hr-community-new-prod.obs.cn-south-1.myhuaweicloud.com/obs/user/sign/bg_pic/ac_10.jpg',
	'https://hr-community-new-prod.obs.cn-south-1.myhuaweicloud.com/obs/user/sign/bg_pic/ac_11.jpg',
]

export const CITY_LIST = ['北京', '上海', '天津', '重庆']


export const contact_info = { // 客服信息
	phone: '19537482450'
}

export const TABBAR_PATH = [ // tabbar页面路由
	'pages/index/index',
	'pages/mine/index'
]

export const GUIDE_STEP = 0 // 已读指引步骤

