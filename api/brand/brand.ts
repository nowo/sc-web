/**
 * 品牌列表Api
 */
export const BrandApi = {

    /**
     * 品牌列表 - 列表
     * @returns
     */
    getList: (data: BrandApi_GetList) => useHttp<BrandApi_GetListResponse>('/api/brand/index', data, { method: 'post' }),
}
