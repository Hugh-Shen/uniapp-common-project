import { ref, computed, reactive } from "vue";


export default function useFileFormat(){
	// .bmp，.jpg，.jpeg，.png，.doc，.docx，.xls，.xlsx，.xlsm，.xlt，.et，.ett，.ppt，.pptx，.pdf，.wps
	const fileSuffix = ref([
		{suffix: 'bmp', url: '/static/filesuffix/BMP.png'},
		{suffix: 'jpg', url: '/static/filesuffix/JPG.png'},
		{suffix: 'jpeg', url: '/static/filesuffix/JPEG.png'},
		{suffix: 'png', url: '/static/filesuffix/PNG.png'},
		{suffix: 'doc', url: '/static/filesuffix/DOC.png'},
		{suffix: 'docx', url: '/static/filesuffix/DOCX.png'},
		{suffix: 'xls', url: '/static/filesuffix/XLS.png'},
		{suffix: 'xlsx', url: '/static/filesuffix/XLSX.png'},
		{suffix: 'xlsm', url: '/static/filesuffix/XLSM.png'},
		{suffix: 'xlt', url: '/static/filesuffix/XLT.png'},
		{suffix: 'et', url: '/static/filesuffix/ET.png'},
		{suffix: 'ett', url: '/static/filesuffix/ETT.png'},
		{suffix: 'ppt', url: '/static/filesuffix/PPT.png'},
		{suffix: 'pptx', url: '/static/filesuffix/PPTX.png'},
		{suffix: 'pdf', url: '/static/filesuffix/PDF.png'},
		{suffix: 'wps', url: '/static/filesuffix/WPS.png'}
	])
	const setFileFormat = computed(() => {
		return (suffix) => {
			let obj = fileSuffix.value.find(item => item.suffix === suffix)
			return obj?.url || ''
		}
	})
	
	const setImgUrl_100 = computed(() => {
		return (url) => {
			if (url) {
				return url + '?x-image-process=image/resize,w_100,limit_1/sharpen,100'
			} else {
				return '/static/default-goods-pic.png'
			}
		}
	})
	
	return {
		setFileFormat,
		setImgUrl_100
	}
}
