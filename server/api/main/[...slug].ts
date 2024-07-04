import { createRouter, defineEventHandler, useBase } from 'h3'

const router = createRouter()

/**
 * 获取轮播图、活动广告
 */
router.use('/banner', defineEventHandler(async (event) => {
    const res = await useServerFetch<ResponseDataType<HomeApi_GetBannerResponse>>(event, '/api/index/banner_lists')

    return res
}))

/**
 * 获取底部导航
 */
router.use('/nav', defineEventHandler(async (event) => {
    const res = await useServerFetch<ResponseDataType<HomeApi_GetArticleResponse[]>>(event, '/api/index/get_article')

    return res
}))

/**
 * 商品列表
 */
router.use('/goods', defineEventHandler(async (event) => {
    const res = await useServerFetch<ResponseDataType<HomeApi_GetArticleResponse[]>>(event, '/api/goods_lists/index')

    return res
}))

export default useBase('/api/main', router.handler)
