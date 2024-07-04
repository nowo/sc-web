/**
 * 视频内容Api
 */
export const VideoApi = {

    /**
     * 视频内容 - 列表
     * @returns
     */
    getList: (data: VideoApi_GetList) => useHttp<VideoApi_GetListResponse>('/api/index/get_video_info', data, { method: 'post' }),
    /**
     * 视频列表
     * @returns
     */
    getVideoList: (data: VideoApi_GetVideoList) => useHttp<VideoApi_GetVideoListResponse>('/api/index/get_video_list', data, { method: 'post' }),
}
