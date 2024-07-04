/**
 * 退出登录
 */
import { defineEventHandler } from 'h3'
import { useServerFetch } from '../../utils'

// const config = useRuntimeConfig()
// const baseURL = config.public.apiBaseUrl

export default defineEventHandler(async (event) => {
    // const method = getMethod(event)
    // const params = getQuery(event)

    // const headers = getHeaders(event)
    // const authorization = headers.Authorization || getCookie(event, 'auth._token.local')

    // const url = event.req.url as string

    // const body = method === 'GET' ? undefined : await readBody(event)

    // return await $fetch(url, {
    //     headers: {
    //         'Content-Type': headers['content-type'] as string,
    //         'Authorization': authorization as string,
    //     },
    //     baseURL,
    //     method,
    //     params,
    //     body,
    // })
    // const res = await useServerFetch(event, '/api/index/nav_lists')
    const res = await useServerFetch<AccountApi_userInfoResponse>(event, '/api/mall/get_user_info')

    console.log('res :>> ', res) // eslint-disable-line no-console

    return res
})
