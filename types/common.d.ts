/**
 * useHttp 请求接口数据类型
 */
declare type RequestDataType<T = Record<string, any>> = '' | { (): T } | T
// type RequestDataType<T = any> = '' | { (): T } | T

/**
 * useHttp 响应接口数据类型
 */
declare interface ResponseDataType<T = any> {
    code: number
    data: T
    msg: string
}

/**
 * useHttp 响应接口数据类型
 */
declare interface ResponseCodeMsg {
    code: number
    msg?: string
}

/**
 * 上传头像 请求参数
 */
declare interface CommonApi_upload {
    image: file // 图片信息
    type?: image // 上传类型：image=>图片（默认）
    token?: string
}

/**
 * 上传头像 响应数据
 */
declare interface CommonApi_UploadResponse {
    src: string // 图片地址
}

/**
 * 商城信息 - 响应数据
 */
declare interface CommonApi_GetSystemResponse {
    shop_name: '工游记' // 商城名称
    shop_title: '11111' // 商城标题
    shop_describe: '11111111111111' // 商城描述
    shop_status: '1' // 关闭网站
    status_cause: '' // 关闭原因
    shop_logo: 'https://goyojo.oss-cn-shenzhen.aliyuncs.com/20230331/202303310908227125.png?x-oss-process=image/quality,Q_50' // 商城logo地址
    user_promulgate: '' // 用户中心公布
    shop_promulgate: '' // 商城公布
    logon_status: '1' // 注册状态
    icp: 'ICP备案证书号3.20' // icp备案证书号
    watermark_file: '' // 水印文件
    watermark_seat: '1' // 水印位置
    watermark_pellucidity: '50' // 水印透明度
    matrixing_scale: '4' // 工游豆换算比例
    pay_scale: '2' // 工游豆支付比例
    give: '2' // 会员注册赠送工游豆
    tacit_img: '' // 商城默认图片
    is_legumes: '1' // 是否使用工游豆
    is_coupon: '1' // 是否使用优惠券
    is_short: '1' // 是否使用缺货处理
    is_bill: '1' // 是否开票
    user_id: '12333' // 用户id
    api_key: '54544' // API Key
    company_code: '1101' // 物流公司编号
    is_recom: '1' // 推荐设置
    recom_type: '2' // 推荐注册分成
    recom_give: '10' // 注册分成数
    recom_level: '100' // 等级分成上限
    recom_inte: '20' // 订单分成百分比
    recom_money: '10' // 现金分成百分比
    footer_content: string // 底部内容 可以是HTML或者其他格式
    sale_tel: string // 售后电话
    work_time: string // 工作时间
    wx_code: string // 微信二维码
    copyright: string // 版权信息
    filings: string // 备案号 '粤ICP备18004771号-1'
    filings_url: string // 备案链接 'http://www.baidu.com'
    ico_img: string // 网站ico图标
    small_logo: string // 小图logo
    seo_keywords: string // Seo关键词 可以是任意大写字符串 不需要加逗号 或者空
    hot: string // 热门搜索
    policy: string //
    agreement: string //
}

/**
 * 地区列表 - 获取所有地址 - 响应数据
 */
declare interface CommonApi_GetAllRegionItem {
    codeid: number
    parentid: number // 父级id 第一层默认0
    cityName: string
    pid_arr: number[]
    children: CommonApi_GetAllRegionItem[]
}
