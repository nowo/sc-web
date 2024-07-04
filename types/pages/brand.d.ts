/**
 * 品牌列表 请求参数
 */
declare interface BrandApi_GetList {
    is_paging: number // 是否分页 1分页 0不分页
    page: number // 分页页码
    page_size: number // 每页数量
}

/**
 * 品牌列表 响应数据
 */
declare interface BrandApi_GetListResponse {
    lists: {
        brand_id: number // 品牌id
        brand_name: string // 品牌名称
        brand_logo: string // 品牌logo
    }[]
    total: number // 总条数

}
