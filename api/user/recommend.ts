/**
 *个人中心 我的推荐
 */
export const RecommendApi = {
    // 我的推荐
    geList: () => useHttp<RecommendApi_getListResponse[]>('/api/mall/get_user_recom', '', { method: 'post' }),
}
