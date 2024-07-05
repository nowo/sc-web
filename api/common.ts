
/**
 * 获取商城信息
 * @returns
 */
export const requestSystemInfo = () => useHttp<CommonApi_GetSystemResponse>('/api/index/setup_info', '', {
    method: 'get',
})


/**
 * 上传图片
 * @param data FormData { image: File; type?: 'image' }
 * @returns
 */
export const requestUploadFile = (data: RequestDataType<FormData>) => useHttp<CommonApi_UploadResponse>('/api/mall/upload_image', data, {
    method: 'post',
})


/**
 * 地区列表-- 获取全部地区数据
 */
export const requestRegionList = () => useHttp<CommonApi_GetAllRegionItem[]>('/api/index/get_address', '', {
    method: 'get',
})
