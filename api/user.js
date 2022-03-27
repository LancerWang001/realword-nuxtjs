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

// 获取当前用户信息
export const getUser = () => request({
	method: 'GET',
	url: '/user'
})

// 修改当前用户信息
export const updateUser = (user) => request({
	method: 'PUT',
	url: '/user',
	data: { user }
})
