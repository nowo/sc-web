/**
 * 用户地址相关Api
 */
export const UserAddressApi = {

    /**
     * 用户地址 - 列表
     * @returns
     */
    getList: () => useHttp<UserAddressApi_GetListResponse[]>('/api/mall/get_address_list', '', { method: 'get' }),

    /**
     * 用户地址 - 新增
     * @returns
     */
    add: (data: UserAddressApi_Add) => useHttp('/api/mall/add_address', data, { method: 'post' }),

    /**
     * 用户地址 - 修改
     * @returns
     */
    edit: (data: UserAddressApi_Edit) => useHttp('/api/mall/edit_address', data, { method: 'post' }),

    /**
     * 用户地址 - 删除
     * @param data address_id: number - 地址id
     * @returns
     */
    del: (data: { address_id: number }) => useHttp('/api/mall/del_address', data, { method: 'post' }),

}
