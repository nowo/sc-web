/**
 * 用户地址 - 获取列表 - 响应数据
 */
declare interface UserAddressApi_GetListResponse {
    address_id: number // 地址ID    5
    contacts: string // 联系人    "张三"
    phone: string // 联系电话     "1388888888"
    email: string // 电子邮箱，比如 example@qq.com
    province: string // 省份    "广东省"
    city: string // 城市    "深圳市"
    area: string // 地区      "光明区"
    address: string // 详细     "楼村75号"
    is_default: 0 | 1 // 是否默认 0不是  1是
    is_bill_address: 0 | 1 // 是否发票地址：0否，1是
    // "user_id": number //用户id
}

/**
 * 用户地址 - 新增 - 请求参数
 */
declare interface UserAddressApi_Add {
    contacts: string // 联系人      示例值:张三
    phone: string // 联系电话      示例值:13888888888
    email: string // 电子邮箱，比如 example@qq.com      示例值:
    province: string // 省份      示例值:广东省
    city: string // 城市      示例值:深圳市
    area: string // 地区      示例值:光明区
    address: string // 详细地址      示例值:楼村75号
    is_default: 0 | 1 // 是否默认 0不是  1是      示例值:1
    is_bill_address: 0 | 1 // 是否默认发票地址 1是 0否      示例值:0
}

/**
 * 用户地址 - 修改 - 请求参数
 */
declare interface UserAddressApi_Edit extends UserAddressApi_Add {
    address_id: number // 地址ID或更新的地址ID

}
