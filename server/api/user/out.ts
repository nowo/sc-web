/**
 * 退出登录
 */
export default defineEventHandler((event) => {
    const token = getCookie(event, 'admin_token')
    // Increase counter cookie by 1
    setCookie(event, 'admin_token', '')

    return { code: 200, token }
})
