/**
 * 个人中心 账户资料Api
 */
export const AccountApi = {
    // 用户信息
    // userInfo: () => useHttp<AccountApi_userInfoResponse>('/api/mall/get_user_info', '', { method: 'get' }),
    // 用户信息 -- 编辑
    editInfo: (data: RequestDataType<AccountApi_editInfo>) => useHttp('/api/mall/edit_user', data, { method: 'post' }),
    // 用户信息 -- 修改密码
    editPwd: (data: RequestDataType<AccountApi_editPwd>) => useHttp('/api/mall/edit_pwd', data, { method: 'post' }),
    // 用户信息 -- 解绑微信
    del_openid: () => useHttp('/api/mall/del_openid', '', { method: 'post' }),
    // 用户信息 -- 修改手机号
    editPhone: (data: RequestDataType<AccountApi_editPhone>) => useHttp('/api/mall/edit_phone', data, { method: 'post' }),
    // 用户信息 -- 修改邮箱
    editEmail: (data: RequestDataType<AccountApi_editEmail>) => useHttp('/api/mall/edit_email', data, { method: 'post' }),
    // 用户信息 -- 发送激活邮箱
    sendEmail: (data: RequestDataType<AccountApi_sendEmail>) => useHttp('/api/mall/activ_email', data, { method: 'post' }),
    // 用户信息 -- 激活验证邮箱
    VerifyEmail: (data: RequestDataType<AccountApi_VerifyEmail>) => useHttp('/api/index/verify_email', data, { method: 'post' }),

}


export const requestUserInfo=() => useHttp<AccountApi_userInfoResponse>('/api/mall/get_user_info', '', { method: 'get' })