/**
 * 个人中心 我的优惠券Api
 */
export const CouponApi = {
    // 我的优惠券
    geList: (data: CouponApi_getList) => useHttp<CouponApi_getListResponse>('/api/mall/get_coupon_list', data, { method: 'post' }),
    // 优惠券列表
    allList: () => useHttp<CouponApi_allListResponse>('/api/index/get_coupon_list', '', { method: 'post' }),
    // 领取优惠券
    addList: (data: CouponApi_addList) => useHttp('/api/mall/add_coupon', data, { method: 'post' }),
    // 删除优惠券
    delList: (data: CouponApi_delList) => useHttp('/api/mall/del_user_coupon', data, { method: 'post' }),
}

/**
 *个人中心 我的工游豆
 */
export const BeansApi = {
    // 我的工游豆
    geList: (data: BeansApi_getList) => useHttp<BeansApi_getListResponse>('/api/mall/get_user_peas', data, { method: 'post' }),
}
