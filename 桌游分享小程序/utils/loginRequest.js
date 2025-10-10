// 登录请求工具类
// 自动携带 getWxCode 登录后获得的 res 信息到请求头 token 字段

let token = '';

// 设置 token（getWxCode 登录后获得的 res）
export function setToken(t) {
	token = t;
}

// 发送请求，自动携带 token 到请求头
export default function loginRequest(url, data = {}, method = 'GET') {
	return new Promise((resolve, reject) => {
		let header = { token };
		if (method.toUpperCase() === 'POST') {
			header['Content-Type'] = 'application/json';
		}
		wx.request({
			url: 'http://localhost:8322' + url,
			data: method.toUpperCase() === 'POST' ? JSON.stringify(data) : data,
			method,
			header,
			success: (res) => {
				resolve(res.data);
			},
			fail: (err) => {
				reject(err);
			}
		});
	});
}
