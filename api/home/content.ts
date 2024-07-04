/**
 * 内容中心对应api
 */
export const ContentApi = {

    /**
     * 底部文章导航
     * @param {string} data.type 类型  1底部导航 2文章分类 3视频分类
     */
    getList: (data: { type: 1 | 2 | 3 }) => useHttp<HomeApi_GetArticleResponse[]>('/api/index/get_article', { ...data, a: 2 }, { method: 'post' }),

    /**
     * 获取文章信息
     * @param {string} data.id
     */
    getInfo: (data: { id: number }) => useHttp<ContentApi_GetInfoResponse>('/api/index/get_article_info', data, { method: 'post' }),

}

//
