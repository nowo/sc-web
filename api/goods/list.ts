/**
 * 商品对应api
 */
export const GoodsApi = {
    /**
     * 获取首页显示的商品分类
     * @returns
     */
    getIndexClass: () => useHttp<GoodsApi_GetClassResponse[]>('/api/index/goods_category_lists', '', { method: 'get' }),

    /**
     * 商品 -- 获取商品分类
     * @returns
     */
    getClass: () => useHttp<GoodsApi_GetClass[]>('/api/mall_user/get_goods_type', '', { method: 'get' }),

    /**
     * 商品搜索补全
     * @returns
     */
    searchKeyword: (data: { keyword: string }) => useHttp<GoodsApi_SearchResponse>('/api/goods_lists/search', data, { method: 'post' }),

    /**
     * 商品列表页面
     * @returns
     */
    getList: (data: GoodsApi_GetList) => useHttp<GoodsApi_GetListResponse>('/api/goods_lists/index', data, { method: 'post' }),

    /**
     * 获取商品信息
     * @returns
     */
    getInfo: (data: { goods_sn: string }) => useHttp<GoodsApi_GetInfoResponse>('/api/goods_detail/index', data, { method: 'post' }),

    /**
     * 获取购物车商品
     * @returns
     */
    getCartList: () => useHttp<GoodsApi_GetCartListResponse>('/api/mall/cart_list', '', { method: 'get' }),

    /**
     * 加入购物车操作 - 检查是否允许加入购物车中的商品，并根据条
     * @returns
     */
    addCart: (data: { goods_id: number; goods_number: number }) => useHttp('/api/mall/add_cart', data, { method: 'post' }),

    /**
     * 修改购物车商品数量 id:购物车id   number:商品修改数量
     * @returns
     */
    editNum: (data: { id: number; number: number }) => useHttp<{ 'number': number; 'goods_number': number }>('/api/mall/add_sub_cart', data, { method: 'post' }),

    /**
     * 首页获取购物车商品数量
     * @returns
     */
    cartNum: () => useHttp<{ 'number': number }>('/api/mall/get_goods_number', '', { method: 'get' }),

    /**
     * 删除购物车商品 id 可多个删除  使用,拼接
     * @returns
     */
    delCart: (data: { id: string }) => useHttp('/api/mall/del_cart', data, { method: 'post' }),

}
