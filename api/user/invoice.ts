/**
 * 抬头管理Api
 */
export const UserInvoiceApi = {

    /**
     * 发票抬头 - 列表
     * @returns
     */
    getList: (data?: UserInvoiceApi_getList) => useHttp<UserInvoiceApi_getListResponse[]>('/api/mall_user/bill_header_lists', data, { method: 'post' }),

    /**
     * 发票抬头 - 新增
     * @returns
     */
    add: (data: UserInvoiceApi_Add) => useHttp('/api/mall_user/bill_header_add', data, { method: 'post' }),
    /**
     * 发票抬头 - 修改
     * @returns
     */
    edit: (data: UserInvoiceApi_Edit) => useHttp('/api/mall_user/bill_header_edit', data, { method: 'post' }),
    /**
     * 发票抬头 - 删除
     * @returns
     */
    del: (data: { bill_header_id: number }) => useHttp('/api/mall_user/bill_header_del', data, { method: 'post' }),
    /**
     * 发票抬头 - 设为默认
     * @returns
     */
    default: (data: { bill_header_id: number }) => useHttp('/api/mall_user/bill_header_default', data, { method: 'post' }),
    /**
     * 发票抬头 - 下单添加发票
     * @returns
     */
    addBill: (data: UserInvoiceApi_AddBill) => useHttp('/api/mall_user/bill_add', data, { method: 'post' }),
}
