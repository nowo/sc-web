/**
 *个人中心 企业用户
 */
export const EnterpriseApi = {
    // 企业认证
    attest: (data: EnterpriseApi_attest) => useHttp('/api/mall_user/enterprise_attest', data, { method: 'post' }),
    // 企业查询
    info: (data: { user_id: number }) => useHttp<EnterPriseApi_infoResponse>('/api/mall_user/enterprise_info', data, { method: 'post' }),
}
