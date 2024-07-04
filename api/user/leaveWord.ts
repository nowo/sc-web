/**
 * 个人中心 留言Api
 */
export const LeaveWordApi = {

    /**
     * 获取留言列表
     * @returns
     */
    getList: (data: LeaveWordApi_GetList) => useHttp<LeaveWordApi_GetListResponse>('/api/mall_user/comment_lists', data, { method: 'post' }),

    /**
     * 添加留言
     * @returns
     */
    add: (data: LeaveWordApi_Add) => useHttp('/api/mall_user/add_comment', data, { method: 'post' }),

}
