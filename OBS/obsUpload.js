// 引入配置文件
import config from './Configuration.js';
// 引入policy编码计算方法
import getPolicyEncode from './getPolicy.js';
// 引入签名计算方法
import getSignature from './GetSignature.js';

const OBSupload = (filePath, path = 'sign', callback) => {  // path --->  avatar:头像相关图片，sign: 签到相关图片
	if (!filePath) {
		uni.showToast({
			title: '文件不能为空',
			icon: 'none',
		});
	} else {
		const times = new Date().getTime();
		const fileName = times + '.jpg'; // 指定上传到OBS桶中的对象名    

		const OBSPolicy = { // 设定policy内容，policy规则定义可参考步骤3中的超链接签名计算规则文档
			"expiration": "2099-12-31T12:00:00.000Z",
			"conditions": [{
					"bucket": config.Bucket
				}, // 桶名要和配置文件中endpoint中的桶名保持一致
				// { "x-obs-security-token": config.SecurityToken } // 如果是临时访问秘钥鉴权，必须设置该值
				{
					'key': `fcq-mini/${path}/${fileName}`
				}
			]
		}

		const policyEncoded = getPolicyEncode(OBSPolicy); // 计算base64编码后的policy
		const signature = getSignature(policyEncoded, config.SecretKey); // 计算signature

		uni.uploadFile({
			url: config.EndPoint,
			filePath: filePath,
			name: 'file',
			header: {
				'content-type': 'multipart/form-data; boundary=-9431149156168',
			},
			formData: {
				// 从配置文件中获取到的AK信息、计算得到的编码后policy及signature信息
				'AccessKeyID': config.AccessKeyId,
				'policy': policyEncoded,
				'signature': signature,
				'key': `fcq-mini/${path}/${fileName}`,
				// "x-obs-security-token": config.SecurityToken, // 如果是临时访问秘钥鉴权，必须设置该值
			},

			success: function(res) {
				console.log(res.statusCode); //打印响应状态码
				if (res.statusCode == '204') {
					let obs_img_url = `${config.EndPoint}/fcq-mini/${path}/${fileName}`
					callback(obs_img_url, `fcq-mini/${path}/${fileName}`)
					// uni.showToast({
					// 	title: 'Uploaded successfully',
					// 	icon: 'Success'
					// });
				} else {
					uni.showToast({
						title: '上传失败',
						icon: 'Fail'
					});
				}
			},
			fail: function(e) {
				uni.showToast({
					title: '上传失败',
					icon: 'Fail'
				})
				callback(null)
			}
		})

	}
}

export default OBSupload;
