/**
 * 个人中心 我的优惠券 请求参数
 */
declare interface CouponApi_getList {
  is_status: 1 | 2 | 3 | 4 //状态 1未使用 2使用中 3已使用 4已过期
}

/**
 * 个人中心 我的优惠券 响应数据
 */
declare interface CouponApi_getListResponse {
  /**
   * 优惠券列表
   */
  "lists": {
    "id": number, //记录ID
    "coupon_id": number, //优惠券ID
    "is_status": 1 | 3 | 4, //使用状态 1未使用 3已使用 4已过期
    "add_time": string, //创建时间
    "start_time": string, //开始时间
    "end_time": string, //结束时间
    "coupon_name": string, //优惠券名称
    "type": 1 | 2, //类型 通用券 2品类券
    "par_value": string, //面值
    "img_url": string //图片理解
  }[]
  "total": number
}

/**
 * 展示优惠券 请求参数
 */
declare interface CouponApi_allList {
  // user_id: number //用户id
}

/**
 * 展示优惠券 响应数据
 */
declare interface CouponApi_allListResponse {
  "current_list": {
    "coupon_id": number, //优惠券id
    "coupon_name": string, //名称
    "par_value": string, //面值
    "img_url": string, //图片路径
    "is_term": 1 | 2, //有限期类型 1天数 2时间段
    "term_time": string, //时间段
    "type": 1 | 2 //类型 1通用券 2品类券
    "use_coupon": 0 | 1 //是否领取 0未领取 1已领取
  }[],
  "category_list": {
    "coupon_id": number, //优惠券id
    "coupon_name": string, //名称
    "par_value": string, //面值
    "img_url": string, //图片路径
    "is_term": 1 | 2, //有限期类型 1天数 2时间段
    "term_time": string, //时间段
    "type": 1 | 2 //类型 1通用券 2品类券
    "use_coupon": 0 | 1 //是否领取 0未领取 1已领取
  }[],

}

/**
 * 领取优惠券 请求数据
 */
declare interface CouponApi_addList {
  user_id: number //用户id
  coupon_id: number //优惠券id
}

/**
 * 删除优惠券 请求参数
 */
declare interface CouponApi_delList {
  id: number
}

/**
 * 我的工游豆 请求参数
 */
declare interface BeansApi_getList {
  page?: number //分页页码
  page_size?: number //每页数量
  type?: 0 | 1 | 2 //类型 1收入 2支出 0显示全部
}

/**
 * 我的工游豆 响应数据
 */
declare interface BeansApi_getListResponse {
  "lists": {
    "peas": number, //收入支出工游豆
    "remarks": string, //来源、用途
    "create_at": string, //时间
    "type": 1 | 2 //类型 1收入 2支出
  }[]
  "total": number //总条数
  "peas": number //总的工游豆
}