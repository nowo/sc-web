/**
 * 商品收藏、浏览历史相关Api
 */
export const RecordApi = {

    /**
     * 获取商品收藏、添加浏览记录列表
     * @returns
     */
    getList: (data: RecordApi_GetList) => useHttp<RecordApi_GetListResponse>('/api/mall_user/get_goods_record', data, { method: 'post' }),

    /**
     * 添加收藏、添加浏览记录
     * @returns
     */
    add: (data: RecordApi_Add) => useHttp('/api/mall_user/add_goods_record', data, { method: 'post' }),

    /**
     * 删除收藏、添加浏览记录
     * @returns
     */
    del: (data: RecordApi_Del) => useHttp('/api/mall_user/clear_goods_record', data, { method: 'post' }),

}
