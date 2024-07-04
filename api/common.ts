export const CommonApi = {
    getList: (data: RequestDataType<{ page: number, pageSize: string }>) => useHttp<{ data: { total: number } }>('/api/mall/get_wechat_url', data, { method: 'post' }),

    /**
     * 上传图片
     * @param data FormData { image: File; type?: 'image' }
     * @returns
     */
    upload: (data: RequestDataType<FormData>) => useHttp<CommonApi_UploadResponse>('/api/mall/upload_image', data, {
        method: 'post',
    }),

    /**
     * 获取商城信息
     * @returns
     */
    getSystem: () => useHttp<CommonApi_GetSystemResponse>('/api/index/setup_info', '', {
        method: 'get',
    }),

    /**
     * 地区列表-- 获取全部地区数据
     */
    getAllRegion: () => useHttp<CommonApi_GetAllRegionItem[]>('/api/index/get_address', '', {
        method: 'get',
    }),
}
