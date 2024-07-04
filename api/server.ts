export const useApiServer = {
    /**
     * 获取商品列表
     * @returns
     */
    getGoodsList: (data: GoodsApi_GetList) => useFetch<{ data: GoodsApi_GetListResponse } & ResponseCodeMsg>('/api/main/goods', {
        method: 'post',
        body: data,
    }),

    // 获取底部导航
    getNavList: (data: { type: number }) => useFetch<{ data: HomeApi_GetArticleResponse[] } & ResponseCodeMsg>('/api/main/nav', {
        method: 'post',
        body: data,
    }),

}
