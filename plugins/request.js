/**
 * 拦截 request 的插件
 */
import request from "@/utils/request";

export default ({ store }) => {
	// 请求拦截器
	request.interceptors.request.use((config) => {
		// 设置 token
		const { user } = store.state;
		if (user?.token) {
			config.headers.Authorization = `Token ${user.token}`;
		}
		return config;
	}, (error) => {
		return Promise.reject(error);
	})

	// 响应拦截器
}
