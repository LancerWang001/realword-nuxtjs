/**
 * 文章相关接口
 */
import request from '@/utils/request'

// 获取公共的文章列表
export const getArticles = (params) => request({
	method: 'GET',
	url: '/articles',
	params
})

// 获取当前用户喜欢的文章列表
export const getYourArticles = (params) => request({
	method: 'GET',
	url: '/articles/feed',
	params,
})

// 添加点赞
export const addFavorite = (slug) => request({
	method: 'POST',
	url: `/articles/${slug}/favorite`
})

// 取消点赞
export const deleteFavorite = (slug) => request({
	method: 'DELETE',
	url: `/articles/${slug}/favorite`
})

// 获取文章详情
export const getArticle = (slug) => request({
	method: 'GET',
	url: `/articles/${slug}`
})

// 获取文章评论
export const getComments = (slug) => request({
	method: 'GET',
	url: `/articles/${slug}/comments`
})

// 添加评论
export const addComment = (slug, comment) => request({
	method: 'POST',
	url: `/articles/${slug}/comments`,
	data: { comment: { body: comment } }
})

// 删除评论
export const delComment = (slug, id) => request({
	method: 'DELETE',
	url: `/articles/${slug}/comments/${id}`
})
