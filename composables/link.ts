/**
 * 进入商品页面方法
 */
export const linkGoodsList = (params: GoodsListParams): string => {
    const url = '/goods/list'
    const route = useRoute()
    const query = route.query as GoodsListParamsQuery

    const data = params.query
    if (params.relate) { // 获取
        // console.log('Number.isNaN(Number(query.cid)) :>> ', Number.isNaN(Number(query.cid)))
        // keyword不存在params对象里面时,并且路由里面存在keyword字段时
        if (!('keyword' in params.query) && 'keyword' in query) data.keyword = query.keyword

        // c不存在params对象里面时,并且路由里面存在数字类型cid时
        if (!('cid' in params.query) && !Number.isNaN(Number(query.cid))) {
            data.cid = Number(query.cid)
        }

        // c不存在params对象里面时,并且路由里面存在数字类型cid时
        if (!('bid' in params.query) && 'bid' in query) data.bid = query.bid
    }

    // 返回地址的形式, /goods/list?cid=1
    if (params.url) {
        const list = Object.keys(data).map(i => `${i}=${encodeURIComponent(data[i as keyof GoodsListParamsQuery] || '')}`)
        return list.length > 0 ? `${url}?${list.join('&')}` : url
    } else {
        navigateTo({
            path: url,
            query: data as any,
        })

        return ''
    }

    // return navigateTo({
    //   path: '/goods/list',
    //   query: {
    //     page: 1,
    //     sort: 'asc',
    //   },
    // })
}

/**
 * 进入商品页面方法
 */
export const linkGoodsDetail = (params: { query: GoodsDetailParamsQuery; url: boolean }) => {
    const url = '/goods/detail'

    const data = params.query

    // console.log('data :>> ', data)

    // 返回地址的形式, /goods/list?cid=1
    if (params.url) {
        const list = Object.keys(data).map(i => `${i}=${encodeURIComponent(data[i as keyof GoodsDetailParamsQuery] || '')}`)
        return list.length > 0 ? `${url}?${list.join('&')}` : url
    } else {
        return navigateTo({
            path: url,
            query: data as any,
        })
    }

    // return navigateTo({
    //   path: '/goods/list',
    //   query: {
    //     page: 1,
    //     sort: 'asc',
    //   },
    // })
}
