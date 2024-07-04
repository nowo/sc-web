/**
 * 企业认证 请求参数
 */
declare interface EnterpriseApi_attest {
  enterprise_name: string //企业名称
  enterprise_code: string //企业信用代码
  enterprise_account: string //企业账号
  enterprise_contacts: string  //企业联系人
  contacts_post: string  //企业联系人职务
  contacts_phone: string  //企业联系人职务
  contacts_email: string  //企业联系人邮箱
  enterprise_industry: string  //所属行业
  enterprise_capital: number  //注册资金
  enterprise_address: string  //企业地址
  enterprise_remark: string  //企业备注
  enterprise_file: string //企业认证上传资料
  user_id: number  //用户id
}

/**
 * 企业查询 响应数据
 */
declare interface EnterPriseApi_infoResponse {
  "attest_status": 0 | 1 | 2 | 3 //认证状态：0未认证，1已认证，2审核中，3未通过
  "enterprise_name": string,
  "enterprise_code": string,
  "failed_remark": string, 
  "enterprise_account": string,
  "enterprise_contacts": string,
  "contacts_post": string,
  "contacts_phone": string,
  "contacts_email": string,
  "enterprise_industry": string,
  "enterprise_capital": number, //注册资金
  "enterprise_address": string,
  "enterprise_remark": string,
  "enterprise_file": string
}