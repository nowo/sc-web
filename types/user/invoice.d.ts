/**
 * 抬头管理 -- 列表 请求参数
 */
declare interface UserInvoiceApi_getList {
    type?: number //类型1增值税专用发票 2普通发票 3电子普通发票 
    is_default?: number //是否默认 0不是 1是
}

/**
 * 抬头管理 -- 列表 响应参数
 */
declare interface UserInvoiceApi_getListResponse {
    "bill_header_id": number
    "type": 1 | 2 | 3, //类型 1：增值税专用发票，2：普通发票， 3：电子普通发票
    "header": string, //发票抬头
    "enterprise_name": string, //企业名称
    "enterprise_email": string, //企业邮箱
    "tax_no": string, //纳税人识别号
    "logon_addr": string, //注册地址
    "logon_tel": string, //注册电话
    "bank": string, //开户银行
    "bank_account": string, //开户账户
    "is_default": 0 | 1 //是否默认 0不是 1是
}

/**
 * 抬头管理 --新增 请求参数
 */
declare interface UserInvoiceApi_Add {
    enterprise_name: string //企业名称
    enterprise_email: string //企业邮箱
    type: 1 | 2 | 3 //类型1：增值税专用发票 2：普通发票 3：电子普通发票
    tax_no: string //纳税人识别号（普票可填，增票必填）
    logon_tel: string //注册电话（增票必填）
    logon_addr: string //注册地址（增票必填）
    bank: string //开户银行（增票必填）
    bank_account: string//开户账号（增票必填）
}

/**
 * 抬头管理 --修改 请求参数
 */
declare interface UserInvoiceApi_Edit {
    bill_header_id: number //发票抬头id
    enterprise_name: string //企业名称
    enterprise_email: string //企业邮箱
    type: 1 | 2 | 3 //类型1：增值税专用发票 2：普通发票 3：电子普通发票
    tax_no: string //纳税人识别号（普票可填，增票必填）
    logon_tel: string //注册电话（增票必填）
    logon_addr: string //注册地址（增票必填）
    bank: string //开户银行（增票必填）
    bank_account: string//开户账号（增票必填）
    is_default: 0 | 1 // 是否默认 0不是 1是
}

/**
 * 抬头管理 --下单添加发票 请求参数
 */
declare interface UserInvoiceApi_AddBill {
    address_id: number //添加收票地址返回id
    enterprise_name: string //企业名称
    enterprise_email: string //企业邮箱
    type: 1 | 2 | 3 //类型1：增值税专用发票 2：普通发票 3：电子普通发票
    tax_no: string //纳税人识别号（普票可填，增票必填）
    logon_tel: string //注册电话（增票必填）
    logon_addr: string //注册地址（增票必填）
    bank: string //开户银行（增票必填）
    bank_account: string//开户账号（增票必填）
}



