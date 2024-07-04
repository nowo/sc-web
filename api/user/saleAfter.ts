/**
 * 售后管理Api
 */
export const SaleAfterApi = {

    /**
     * 售后列表
     * @returns
     */
    getList: () => useHttp<SaleAfterApi_GetListResponse>('/api/mall_user/get_after_sales_list', '', { method: 'post' }),

    /**
     * 售后详情
     * @returns
     */
    info: (data: SaleAfterApi_Info) => useHttp<SaleAfterApi_InfoResponse>('/api/mall_user/get_after_sales_info', data, { method: 'post' }),

    /**
     * 售后 -- 获取商品类型
     * @returns
     */
    type: () => useHttp<SaleAfterApi_TypeResponse[]>('/api/mall_user/get_goods_type', '', { method: 'post' }),

    /**
     * 安装、维护申请
     * @returns
     */
    add: (data: SaleAfterApi_Add) => useHttp('/api/mall_user/add_after_sales', data, { method: 'post' }),

    /**
     * 售后--搜索商品
     * @returns
     */
    search: (data: SaleAfterApi_Search) => useHttp<SaleAfterApi_SearchResponse>('/api/common/goods_search', data, { method: 'post' }),

}
