const cookieParser = process.server ? require('cookieparser') : undefined

// 在服务端渲染期间运行的都是同一个实例
// 为了防止数据冲突，务必要把 state 定义成一个函数，返回对应的数据对象
export const state = () => ({
	// 当前登录用户的登录状态
	user: null
})

export const mutations = {
	setUser (state, data) {
		state.user = data
	}
}

export const actions = {
	// nuxtServerInit 是一个特殊的 action 方法
	// 这个 action 会在服务端渲染期间自动调用
	// 作用：初始化容器数据，传递数据给客户端
	nuxtServerInit ({ commit }, { req }) {
		let user = null
		if (req.headers.cookie) {
			// 使用 cookieparser 把 cookie 字符串转为 Javascript 对象
			const parsed = cookieParser.parse(req.headers.cookie)
			console.log(parsed)
			try {
				user = JSON.parse(parsed.user)
			} catch {
				// No valid cookie found
			}
			// 提交 mutation 修改 state 状态
			commit('setUser', user)
		}
	}
}
