


/**
 * 获取商品收藏、商品浏览历史记录 - 请求参数
 */
declare interface RecordApi_GetList {
    is_paging?: number //是否分页 1：分页，0：不分页
    page?: number //分页页码，数字类型
    page_size?: number //每页数量
    // user_id?: number;  // 用户id
    type: 1 | 2  //1收藏，2最近浏览
}


/**
 * 获取商品收藏、商品浏览历史记录 - 响应数据
 */
declare interface RecordApi_GetListResponse {
    "lists": {
        "id": number, //记录ID
        // "user_id": number, //用户id
        "goods_id": number, //商品id
        goods_sn: string,
        "is_collect": 1 | 1, //是否收藏 1是 0否
        "collect_time": string, //收藏时间
        "is_recent": 0 | 1, //是否最近浏览 1是 0否
        "recent_time": string, //最近浏览时间
        "user_name": string, //用户名
        "goods_name": string //商品名称
        "goods_img": string //商品图片
        "purchase_price": number
        "shop_price": number
        "gross_margin": number
        "grade_num": number
    }[],
    total: number,
}

/**
 * 添加商品收藏、商品浏览历史记录 - 请求参数
 */
declare interface RecordApi_Add {
    // user_id: number;  // 用户id
    goods_id: number;  // 商品id
    type: 1 | 2  //1收藏，2最近浏览
}

/**
 * 删除商品收藏、商品浏览历史记录 - 请求参数
 */
declare interface RecordApi_Del extends Omit<RecordApi_Add, 'goods_id'> {
    goods_ids: string;  // 商品id，多个以英文逗号分隔
    // user_id:number; //
    type: 1 | 2 //1收藏，2最近浏览
}


