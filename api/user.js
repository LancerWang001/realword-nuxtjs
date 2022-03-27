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

// 订阅用户
export const followUser = (username) => request({
	method: 'POST',
	url: `/profiles/${username}/follow`
})

// 取消订阅用户
export const unFollowUser = (username) => request({
	method: 'DELETE',
	url: `/profiles/${username}/follow`
})
