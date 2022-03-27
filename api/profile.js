/**
 * 账号相关接口
 */
import request from '@/utils/request'

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

// 获取用户信息
export const getProfile = (username) => request({
  method: 'GET',
  url: `/profiles/${username}`
})
