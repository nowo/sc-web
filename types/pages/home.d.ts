/**
 * 获取banner轮播图 - 响应数据
 */
declare interface HomeApi_GetBannerResponse extends ListTotal {
    lists: HomeApi_GetBannerItem[]
}
declare interface HomeApi_GetBannerItem {
    ad_id: 1 // 广告图id
    position_id: 1 // 广告图位置id
    media_type: 1 // 媒介类型：1图片，2视频
    ad_name: '广告1' // 广告名称
    ad_img: ''
    ad_link: 'https://www.baidu.com/' // 广告链接
    start_time: 1678334400 // 开始时间
    end_time: 1685246400 // 结束时间
    // "click_count": 0, //点击数
    enabled: 1 // 是否开启；0否，1是
    position_name: '首页顶部banner' // 广告图位置名称
}

/**
 * 获取导航菜单 - 响应数据
 */
declare interface HomeApi_GetNavResponse {
    nav_id: 2
    nav_name: '折扣专区'
    nav_url: 'https://www.baidu.com/'
    sort: 10,
    is_blank:0|1, // 是否新窗口打开：0否，1是
}

/**
 * 精选商品 - 响应数据
 */
declare interface HomeApi_GetNewsGoodsResponse {
    lists: {
        goods_id: 256
        goods_sn: string // 商品编号
        goods_name: '艾斯瑞 冷热冲击试验箱 ASR-100D 100L   -60-150水冷3厢'
        goods_img: string
        purchase_price: '0.00'
        shop_price: '0.00'
    }[]
    total: 1

}

/**
 * 获取楼层商品 - 响应数据
 */
declare interface HomeApi_GetFloorResponse {
    storey_id: 1
    storey_name: '1f'
    storey_img: 'https://goyojo.oss-cn-shenzhen.aliyuncs.com/20230104/202301040927291851.jpg?x-oss-process=image/quality,Q_50'
    sort: 1
    brand_lists: HomeApi_GetFloorBrand[]
    cat_lists: HomeApi_GetFloorCate[]
    class_lists: HomeApi_GetFloorClass[]
}
// 品牌
declare interface HomeApi_GetFloorBrand {
    brand_id: 1
    brand_name: '红钐'
    brand_logo: ''
}
// 品牌
declare interface HomeApi_GetFloorCate {
    cat_id: 1
    cat_name: '物性测试仪器'
}
// 商品标签
declare interface HomeApi_GetFloorClass {
    class_id: 1
    class_name: '段路器'
    goods_lists: HomeApi_GetFloorGoods[]
}
// 商品
declare interface HomeApi_GetFloorGoods {
    goods_id: 11
    goods_sn: string
    goods_name: '红钐 热封仪 HS-RF'
    goods_img: ''
    purchase_price: '0.00'
    shop_price: '0.00'
}

/**
 *
 */
declare interface HomeApi_GetArticleResponse {
    id: number // 记录ID    5
    pid: number // 父级ID   默认0
    name: '关于我们' // 导航名称
    //   "children": {
    //     "id": 8, //文章ID
    //     "name": "关于我们" //文章标题
    //   }[],
    children: HomeApi_GetArticleResponse[]
}
