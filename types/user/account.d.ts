/**
 * 个人中心--账户资料 响应数据
 */
declare interface AccountApi_userInfoResponse {
    user_id: number // 用户id
    user_name: string // 用户名
    phone: string // 联系电话
    email: string // 电子邮箱，比如 example@qq.com
    add_time: string // 注册时间
    last_login: string // 登录时间
    last_ip: string // ip
    level_id: number // 等级id
    openid: string // openid
    unionid: string // unionid
    headimgurl: string // 头像
    peas: number // 工游豆
    attest_status: 0 | 1 | 2 | 3 // 企业 认证状态：0未认证，1已认证，2审核中，3未通过
    type: 1 | 2 // 用户类型 1：普通用户，2：企业用户
    enterprise_name: string // 企业名称
    set_time: string
    nickname: string // 微信昵称
    email_status: 0 | 1 // 是否激活邮箱 0未激活 1已激活
}

/**
 * 个人中心 -- 编辑用户 请求参数
 */
declare interface AccountApi_editInfo {
    user_name: string // 用户名
    headimgurl: string // 头像
}

/**
 * 个人中心 -- 修改密码 请求参数
 */
declare interface AccountApi_editPwd {
    // token: string
    password: string // 密码
    confirm_password: string // 确认密码
}

/**
 * 个人中心 修改手机号 请求数据
 */
declare interface AccountApi_editPhone {
    phone: string // 手机号
    sms_code: string // 短信验证
    // token:string //
}

/**
 * 个人中心 修改邮箱 请求数据
 */
declare interface AccountApi_editEmail {
    email: string // 电子邮箱，比如 example@qq.com
    // token:string //
}

/**
 * 个人中心 发送激活邮箱 请求参数
 */
declare interface AccountApi_sendEmail {
    email: string // 电子邮箱，比如 example@qq.com
}

/**
 * 个人中心 激活验证邮箱 请求参数
 */
declare interface AccountApi_VerifyEmail {
    email: string // 电子邮箱，比如 example@qq.com
    code: string // 提交密码验证码
}
