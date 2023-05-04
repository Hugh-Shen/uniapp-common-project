import { Bucket } from "@/config/default.js"

//指定OBS服务相关信息：AK，SK，EndPoint
var Configuration = {
	AccessKeyId: 'MH8ERDPNACDVJ6BPGZQ4', //AK
	SecretKey: 'x0CMn8Ny0kHoQueXewb47Wi8XcTa6Ra4nLAJR6ij', //SK
	EndPoint: `https://${Bucket}.obs.cn-south-1.myhuaweicloud.com/`, //上传文件的路径
	Bucket: Bucket, // 桶名称
};


export default Configuration;
