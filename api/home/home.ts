/**
 * 首页模块对应api
 */
export const HomeApi = {
    /**
     * 获取菜单导航
     * @returns
     */
    getNav: () => useHttp<HomeApi_GetNavResponse[]>('/api/index/nav_lists', '', { method: 'get' }),

    /**
     * 获取轮播图
     * @param {number} data.position_id 广告图位置
     * @returns
     */
    getBanner: (data: { position_id: number }) => useHttp<HomeApi_GetBannerResponse>('/api/index/banner_lists', data, { method: 'post' }),

    /**
     * 获取楼层
     * @returns
     */
    getFloor: () => useHttp<HomeApi_GetFloorResponse[]>('/api/index/storey_lists', '', { method: 'get' }),

    /**
     * 精选商品
     * @returns
     */
    getNewGoods: () => useHttp<HomeApi_GetNewsGoodsResponse>('/api/index/goods_lists', '', { method: 'get' }),

    /**
     * 底部文章导航
     * @param {string} data.type 类型  1底部导航 2文章分类 3视频分类
     */
    getArticle: (data: { type: 1 | 2 | 3 }) => useHttp<HomeApi_GetArticleResponse[]>('/api/index/get_article', data, { method: 'post' }),

}
