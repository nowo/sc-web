/**
 * 售后管理--列表--请求参数
 */
declare interface SaleAfterApi_GetListResponse {
    "lists": {
        "id": number, //记录ID
        "type": number, //类型 1
        "contacts": string, //
        "phone": string, //联系电话
        "province": string, //省份
        "city": string, //城市
        "area": string, //地区
        "address": string, //详细地址
        "goods_type": string, //详细地址
        "goods_type_txt": string, //商品类型
        "goods_code": string, //商品型号
        "describe": string, //需求详细描述
        "ask_date": string, //上门预约时间
        "des_img": string,
        "des_type": string,
        "add_time": string,
        "create_ta": string,
        "status": number,
        "user_id": number,
        "accept_id": number,
        "admin_name": string,
        "accept_name": string,
    }[],
    "total": number
}


/**
 * 售后详情 -- 请求参数
 */
declare interface SaleAfterApi_Info {
    id: number //记录id
}

/**
 * 售后详情 -- 响应数据
 */
declare interface SaleAfterApi_InfoResponse {
    "id": number, //记录ID
    "type": number, //单据类型 1安装申请 2维护申请
    "contacts": string, //联系人名称
    "phone": string, //联系电话
    "province": string, //省份
    "city": string, //城市
    "area": string, //地区
    "address": string, //详细地址
    "goods_type": string, //商品类型ID
    "goods_type_txt": string, //商品类型
    "goods_code": string, //商品型号
    "describe": string, //需求详细描述
    "ask_date": string, //上门预约时间
    "confirm_time": string, //确定上门时间
    "des_img": string, //上传图片
    "des_type": string, //文件类型 图片img 视频video
    "add_time": string, //接单时间
    "create_ta": string, //创建时间
    "status": number, //状态 0未接单 1已接单
    "user_id": number, //制单人id
    "user_name": string, //制单人名称
    "accept_id": number, //接单人id
    "accept_name": string, //接单人名称
    "date": string, //日期
    "time": string //时间
}

/**
 * 售后--获取商品类型   响应数据
 */
declare interface SaleAfterApi_TypeResponse {
    "cat_id": number,
    "pid": number,
    "cat_code": string,
    "cat_name": string,
    "sort": number, //排序
    "pid_arr": [],
    "children": SaleAfterApi_TypeResponse[],
}

/**
 * 安装、维护申请 请求参数
 */
declare interface SaleAfterApi_Add {
    phone: string //联系电话
    validate_code: string //验证码
    contacts: string //联系人
    province: string //省份
    city: string //城市
    area: string //地区
    address: string //详细地址
    goods_type: number //商品类型
    goods_type_txt: string //商品类型名称
    goods_code: string //商品型号
    describe: string //需求详细描述
    ask_date: string //预约上门时间
    type: 1 | 2 //类型 1安装申请 2维护申请
    des_vivo: string // 视频路径（多个||分开）
    des_img: string //图片路径（多个||分开）
}

/**
 * 售后--搜索商品 请求参数
 */
declare interface SaleAfterApi_Search {
    keyword: string //搜索关键字
}

/**
 * 售后 -- 搜索商品 响应数据
 */
declare interface SaleAfterApi_SearchResponse {
    "list": {
        "goods_id": number, //商品ID
        "goods_name": string, //商品名称
        "goods_code": string, //型号
        "cat_id": number, //商品类型ID
        "cat_name": string //商品类型名称
    }[],
}