/**
 * 标签相关接口
 */
import request from '@/utils/request'

// 获取页面上所有的标签
export const getTags = () => request({
	method: 'GET',
	url: '/tags'
})
