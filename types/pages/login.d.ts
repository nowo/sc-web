/**
 * 登录 请求数据
 */
declare interface LoginApi_Login {
    type: 1 | 2 | 3 | 4 // 类型：1账户登录 2验证码登录 3注册 4微信扫码绑定手机号
    phone: string // 手机号(都传)
    password?: string // 密码（类型为1传）
    validate_code?: string // 验证码 （类型为2，3，4传）
    nickname?: string // 微信昵称（类型为4传）
    openid?: string // 微信openid(类型为4传)
    unionid?: string // 微信unionid(类型为4传)
    headimgurl?: string // 微信头像（类型为4传）
    share_id?: number // 推荐人id （类型为2，3，4传）
    salesman_id?: number // 业务员id
}

/**
 * 登录 响应数据
 */
declare interface LoginApi_LoginResponse {
    token: string // 用户登录凭证
}

/**
 * 登录页--短信验证码登录 发送短信验证码 请求数据
 */
declare interface LoginApi_validateCode {
    phone: string // 手机号
    type: 1 | 2 | 3 | 4 | 5 | 6// 类型：1注册 2登录 3找回 4修改手机号 5审核通知(前端不能使用) 6其他短信验证码
}

/**
 * 找回密码--提交身份验证 请求数据
 */
declare interface LoginApi_submitIde {
    phone: string // 联系电话
    vali_code: string // 验证码
    session_id: string
    sms_code: string // 短信验证码
    plate_type: 1 | 2 // 1PC 2小程序
}

/**
 * 找回密码--提交身份验证 响应数据
 */
declare interface LoginApi_submitIdeResponse {
    code: string // 填写密码验证码
}

/**
 * 找回密码--验证码 响应数据
 */
declare interface LoginApi_getCodeResponse {
    [x: string]: any
    session_id: string // 会话id
    validate_code: string // 验证码
}

/**
 * 找回密码--提交密码 请求数据
 */
declare interface LoginApi_submitPas {
    phone?: string // 联系电话
    code?: string // 填写密码验证码
    password: string // 密码
    define_password: string // 确认密码
}

/**
 * 获取微信二维码路径 - 请求参数
 */
declare interface LoginApi_getChat {
    qrcode_type: 1 | 2 // 类型 1跳登录页 2跳个人中心页
}

/**
 * 获取微信二维码路径 - 响应数据
 */
declare interface LoginApi_GetWeChatResponse {
    appid: 'wx4847f76d5c8781e5'
    scope: 'snsapi_login'
    redirect_uri: 'http%3A%2F%2Fscdev.goyojo.com%2Findex.html'
    state: 'STATE#wechat_redirect'
    style: 'black'
    href: ''
    url: 'https://open.weixin.qq.com/connect/qrconnect?appid=wx4847f76d5c8781e5&redirect_uri=http%3A%2F%2Fscdev.goyojo.com%2Findex.html&response_type=code&scope=snsapi_login&state=STATE#wechat_redirect'
    result: string
}

/**
 * 微信获取openid 请求数据
 */
declare interface LoginApi_getOpenid {
    code: string
    user_id?: number // 用户ID（跳个人中心页传）
}
/**
 * 微信获取openID 响应参数
 */
declare interface LoginApi_getOpenidResponse {
    openid_info: {
        openid: 'oF3PcsnsrMiJzEwalZZbAfWQpxCI'
        nickname: 'NICKNAME'
        sex: '1'
        province: 'PROVINCE' // 省份
        city: 'CITY' // 城市
        country: 'COUNTRY'
        headimgurl: 'http://wx.qlogo.cn/mmopen/g3MonUZtNHkdmzicIlibx6iaFqAc56vxLSUfpb6n5WKSYVY0ChQKkiaJSgQ1dZuTOgvLLrhJbERQQ4eMsv84eavHiaiceqxibJxCfHe/46'
        unionid: 'o6_bmasdasdsad6_2sgVt7hMZOPfL'
    }
    status: 0 | 1 // 是否存在 0不存在 1存在
    token: string // 管理员登录凭证
}
