/**
 * 获取商品分类 - 响应数据
 */
declare interface GoodsApi_GetClassResponse {

    id: number // id 2
    cat_ids: string // 商品分类id列表或逗号分隔的字符串  "1271,1275"

    custom_name: string // 名称 "设备1/设备2"
    icon: string // "iconfont icon-home_00"
    sort: number // 1
    is_show: 0 | 1 // 1
    lists: GoodsApi_GetClass[]

}

/**
 * 获取商品分类 - 响应数据
 */
declare interface GoodsApi_GetClass {
    cat_id: number // 分类id     46
    pid: number // 上级分类id   0
    cat_code: ''
    cat_name: string //  行业专用仪器
    sort: 0
    pid_arr: number[]
    children: GoodsApi_GetClass[]
}

/**
 * 商品搜索补全列表 - 响应数据
 */
declare interface GoodsApi_SearchResponse {
    brand_lists: GoodsApi_SearchResponseItem[]
    cate_lists: GoodsApi_SearchResponseItem[]
    goods_lists: GoodsApi_SearchResponseItem[]
}

interface GoodsApi_SearchResponseItem {
    name: string // 名称
    id: number // id
}

/**
 * 获取商品列表 - 请求参数
 */
declare interface GoodsApi_GetList extends ListPage {
    keyword?: string // 搜索关键字 AA00256
    cat_id?: number // 分类id
    brand_id?: number // 品牌id
    sale_number?: 'asc' | 'desc'// 销量 asc表示升序 desc表示降序
    shop_price?: 'asc' | 'desc'// 本店价 asc表示升序 desc表示降序
    goods_number?: '' | 1 | 0 // 库存，空表示所有，1表示有库存，0表示没库存
    price_interval?: string // 价格区间  100-1000
}

/**
 * 获取商品列表 - 响应数据
 */
declare interface GoodsApi_GetListResponse {
    goods: {
        lists: GoodsApi_GetListItem[]
        total: number
    }
    category: {
        position: GoodsApi_GetListItemCate[]
        lists: GoodsApi_GetListItemCate[]
    }
    brand: GoodsApi_GetListItemBrand[]
}

// 商品数据
declare interface GoodsApi_GetListItem {
    goods_sn: string // 品牌编号  AA00256
    goods_id: 1
    goods_name: '红钐 按键寿命试验机 HSL-TA4 四工位'
    goods_img: string
    goods_code: 'HSL-TA4'
    shop_price: 0.15
    is_best: 0
    is_new: 0
    is_hot: 0
    cat_id: 3
    brand_id: 1
    cat_name: '按键寿命试验机'
    brand_name: '红钐'
    is_collect: 1 | 0 // 是否被您所在店铺收藏 0=否 1=是
}
// 商品分类
declare interface GoodsApi_GetListItemCate {
    cat_id: 1
    cat_name: '物性测试仪器'
}
// 商品品牌
declare interface GoodsApi_GetListItemBrand {
    brand_id: 508
    brand_name: 'GE'
}

/**
 * 获取购物车商品列表 - 响应数据
 */
declare interface GoodsApi_GetCartListResponse {
    goods_list: {
        id: 4 // 记录ID
        user_id: 1 // 用户ID
        goods_id: 3 // 商品id
        goods_sn: string // 商品编号
        goods_number: number // 数量    4
        create_time: '2023-03-30 14:17:36' // 添加时间
        goods_name: '红钐 按键寿命试验机 HSL-TA3 三工位' // 商品名称
        goods_code: 'HSL-TA3' // 商品型号
        shop_price: '0.00' // 原价
        goods_img: string // 商品图片
        goods_weight: '0.00' // 商品重量
        unit: '台' // 单位
    }[]
}

/**
 * 商品详情 - 响应数据
 */
declare interface GoodsApi_GetInfoResponse {
    goods_info: GoodsApi_GoodsInfoData
    photo_lists: {
        photo_url: 'https://images.yumishe.cn/20220625/202208200259163777.jpg' // 相册url
        sort: 2 // 排序
    }[] // 相册列表
    link_lists: {
        goods_id: 49 // id
        goods_sn: string // id
        goods_name: '红钐 可勃取样器 HSZ-KBQ' // 名称
        goods_img: '' // 主图
        shop_price: '0.00' // 本店价
    }[] // 商品关联列表
    brand_name:string,  // 品牌名称
    cat_name:string,  // 分类名称
}

declare interface GoodsApi_GoodsInfoData {
    goods_id: 1 // 商品id
    goods_name: '红钐 按键寿命试验机 HSL-TA4 四工位' // 商品名称
    goods_img: string // 商品主图
    goods_sn: 'AA00001' // 商品编号
    goods_code: 'HSL-TA4' // 商品型号
    shop_price: '10.00' // 本店价
    is_best: 0 // 是否精品
    is_new: 1 // 是否新品
    is_hot: 0 // 是否热销
    is_sale: 0 | 1 // 是否上架
    cat_id: 1322 // 分类id
    brand_id: 1 // 品牌id
    is_collect: 0 | 1 // 是否收藏 1是 0否
    goods_desc: string
    web_title: string // seo标题
    web_keywords: string // seo关键字
    web_desc: string // seo描述
    coupon_list: {
        coupon_id: 26
        coupon_name: '618大促销'
        par_value: '10.00'
        is_threshold: 1
        lowest: 1
    }[] // 优惠券
    unit:string,    // 单位
    // goods_weight: number // 商品重量
    brand_name?:string,  // 品牌名称
    cat_name?:string,  // 分类名称
}

// 页面 ///////////////////////////////////////////////////////
/**
 * 商品页面参数
 */
declare interface GoodsListParams {
    query: GoodsListParamsQuery // 参数
    relate?: boolean // 是否携带浏览器地址上的参数
    url?: boolean // 返回地址的形式
}

declare interface GoodsListParamsQuery {
    keyword?: string // 关键字
    cid?: string | number // 商品分类id   类别
    bid?: string | number // 商品品牌id
}

/**
 * 商品详情页面参数
 */
declare interface GoodsDetailParamsQuery {
    id: number // 商品id
}

/**
 * 商品搜索框列表数据格式
 */
declare interface GoodsSearchItem {
    id: number // 商品id、分类id、品牌id
    value: string // ...名称
    type: 1 | 2 | 3 // 1:分类，2：品牌，3：商品
    history?: 0 | 1 // 1:浏览器缓存读取
}
