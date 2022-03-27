import request from '@/utils/request'

// 用户登录
export const login = (data) => request({
	method: 'POST',
	url: '/users/login',
	data
})

// 用户注册
export const register = (data) => request({
	method: 'POST',
	url: '/users',
	data
})
