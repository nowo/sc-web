/**
 * 问答列表 - 商品页 请求参数
 */
declare interface InterListApi_getList {
  is_paging: number //是否分页 1：分页，0：不分页
  page: number //分页页码，数字类型
  pagesize: number //每页数量
  goods_id: number //商品id
}


/**
 * 问答列表 - 商品页 响应数据
 */
declare interface InterListApi_getListResponse {
  "lists": {
    "question_id": number, //问答id
    "goods_id": number, //商品id
    "user_id": number, //用户id
    "type": 1 | 2, //类型 1问 2答
    "q_id": number, //回答提问的id，type为2填写，type为1默认0
    "content": string, //内容
    "add_time": string, //添加时间
    "is_show": 1, //是否显示 0否 1是
    "goods_name": string, //商品名称
    "user_name": string, //用户名称
    "answer_lists": InterListApi_getListChildren[]
  }[]
  total: number
}

declare interface InterListApi_getListChildren {
  "question_id": number, // 问答id
  "goods_id": number, // 商品id
  "user_id": number, // 用户id
  "type": 1 | 2, // 类型 1问 2答
  "q_id": number, //回答提问的id，type为2填写，type为1默认0
  "content": string, //内容
  "add_time": string,//添加时间
  "is_show": 0 | 1, //是否显示 0否 1是
  "user_name": string //用户名称
}


/**
 * 问答列表 个人中心 请求参数
 */
declare interface InterListApi_getUserList {
  is_paging?: number //是否分页 1：分页，0：不分页
  page?: number //分页页码，数字类型
  page_size?: number //每页数量
  // user_id: number
  type?: 1 | 2 //问答列表
  question_id?: number //问题id
}

/**
 * 问答列表 个人中心 响应数据
 */
declare interface InterListApi_getUserListResponse {
  "lists": {
    "question_id": number, //问答id
    "goods_id": number, //商品id
    "goods_sn": string, //商品编号
    "user_id": number, //用户id
    "type": 1 | 2, //类型 1问 2答
    "q_id": number, //回答提问的id，type为2填写，type为1默认0
    "content": string, //内容
    "add_time": string, //添加时间
    "is_show": 1 | 0, //是否显示 0否 1是
    "goods_name": string, //商品名称
    "user_name": string, //用户名称
    "answer_lists": InterListApi_getUserListChildren[]
  }[]
  total: number
}

declare interface InterListApi_getUserListChildren {
  "question_id": number, // 问答id
  "goods_id": number, // 商品id
  "user_id": number, // 用户id
  "type": 1 | 2, // 类型 1问 2答
  "q_id": number, //回答提问的id，type为2填写，type为1默认0
  "content": string, //内容
  "add_time": string,//添加时间
  "is_show": 0 | 1, //是否显示 0否 1是
  "user_name": string //用户名称
}

/**
 * 问答列表 添加 请求参数
 */
declare interface InterListApi_addList {
  goods_id: number //商品id
  type: 1 | 2 //类型 1问 2答
  q_id: number //回答提问的id，type为2填写，type为1默认0
  content: string //内容
}

/**
 * 问答列表 个人中心 删除
 */
declare interface InterListApi_delList {
  question_id: number
}