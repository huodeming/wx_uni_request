class Request {
	constructor(options = {}) {
		// 请求的根路径
		this.baseUrl = options.baseUrl || ''
		// 请求的 url 地址
		this.url = options.url || ''
		// 请求url 是否需要带上baseUrl,正则验证,如果是http或https协议或是双斜线开始的url,就不拼接 
		this.urlPattern = /^(https?\:\/\/|\/\/)/
		// 请求方式
		this.method = 'GET'
		// 请求的参数对象
		this.data = null
		// header 请求头
		this.header = options.header || {}
		this.beforeRequest = null
		this.afterRequest = null
	}

	get(url, data = {}) {
		this.method = 'GET'
		this.url = this.urlPattern.test(url) ? url : this.baseUrl + url
		this.data = data
		return this._()
	}

	post(url, data = {}) {
		this.method = 'POST'
		this.url = this.urlPattern.test(url) ? url : this.baseUrl + url
		this.data = data
		return this._()
	}

	put(url, data = {}) {
		this.method = 'PUT'
		this.url = this.urlPattern.test(url) ? url : this.baseUrl + url
		this.data = data
		return this._()
	}

	delete(url, data = {}) {
		this.method = 'DELETE'
		this.url = this.urlPattern.test(url) ? url : this.baseUrl + url
		this.data = data
		return this._()
	}

	_() {
		// 清空 header 对象
		this.header = {}
		// 请求之前做一些事
		this.beforeRequest && typeof this.beforeRequest === 'function' && this.beforeRequest(this)
		// 发起请求
		return new Promise((resolve, reject) => {
			let weixin = wx
			// 适配 uniapp
			if ('undefined' !== typeof uni) {
				weixin = uni
			}
			weixin.request({
				url: this.url,
				method: this.method,
				data: this.data,
				header: this.header,
				success: (res) => {
					// 执行响应拦截器,拿到处理后的request响应结果
					if (this.afterRequest && typeof this.afterRequest === 'function') {
						res = this.afterRequest(res)
					}
					resolve(res) // 返回成功的数据
				},
				fail: (err) => {
					// 执行响应拦截器
					this.afterRequest && typeof this.afterRequest === 'function' && this.afterRequest(res)
					reject(err) // 返回失败的数据
				}
			})
		})
	}
}

export const $http = new Request()