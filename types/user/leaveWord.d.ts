/**
 * 个人中心 留言 列表 --请求参数
 */
declare interface LeaveWordApi_GetList {
    is_paging: 0 | 1 //是否分页 1分页 0不分页
    page: number //分页页码 
    page_size: number //每页数量
}

/**
 * 个人中心 留言 列表 --响应数据
 */
declare interface LeaveWordApi_GetListResponse {
    "lists": {
        "type": number, //类型 1建议 2投诉 3商品 4其他 5店铺投诉 6订单问题
        "content": string, //内容
        "add_time": string, //添加时间
        "is_reply": 1 | 0, //是否回复  0否 1是
        "reply_content": string, //回复内容
        "reply_time": string //回复时间
    }[]
    total: number
}

/**
 * 留言--添加 请求参数
 */
declare interface LeaveWordApi_Add {
    type: number //类型 1建议 2投诉 3商品 4其他 5店铺投诉 6订单问题
    content: string //内容
}

