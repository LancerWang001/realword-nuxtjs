/**
 * 验证是否未登录的中间件
 */
export default function ({ store, redirect }) {
	// 如果已经登录过了，返回到主页
	if (store.state.user) return redirect('/')
}
