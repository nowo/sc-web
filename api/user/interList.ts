/**
 * 问答列表Api
 */
export const InterListApi = {
    /**
    *问答列表 - 商品页
    * @returns
    */
    getList: (data: InterListApi_getList) => useHttp<InterListApi_getListResponse>('/api/goods_detail/question_lists', data, { method: 'post' }),
    /**
     * 问答列表 - 商品页添加
     */
    addList: (data: InterListApi_addList) => useHttp('/api/goods_detail/question_add', data, { method: 'post' }),
    /**
     * 问答列表 - 个人中心
     */
    getUserList: (data: InterListApi_getUserList) => useHttp<InterListApi_getUserListResponse>('/api/mall_user/get_goods_question', data, { method: 'post' }),
    /**
     * 问答列表 -个人中心 删除
     */
    delList: (data: InterListApi_delList) => useHttp('/api/mall_user/del_goods_question', data, { method: 'post' }),
}
