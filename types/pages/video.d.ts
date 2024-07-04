/**
 * 视频内容Api 请求参数
 */
declare interface VideoApi_GetList {
    id: number //记录id
}

/**
 * 视频内容 响应数据
 */
declare interface VideoApi_GetListResponse {
    "id": number, //记录ID
    "title": string,
    "article_id": number, //文章ID
    "is_vital": number,
    "is_show": number,
    "is_recom": number,
    "is_sift": number,
    "sift_img": string, //精选背景图路径
    "author": string,
    "email": string, //电子邮箱，比如 example@qq.com
    "keywords": string,
    "describe": string,
    "out_url": string, //外部链接
    "file": string, //上传文件
    "content": string,
    "browse_num": number, //浏览次数
    "add_time": string,
    "article_type": number,
    "pid": number,
    "name": string, //客户名称
    "sort": number, //排序
    "file_type": 1 | 2 //类型 1文章 2视频
}

/**
 * 视频列表--请求参数
 */
declare interface VideoApi_GetVideoList {
    id: number //记录id
    page: number //分页页码，数字类型
    page_size: number //每页数量
}

/**
 * 视频列表 响应数据
 */
declare interface VideoApi_GetVideoListResponse {
    "lists": {
        "id": number, //记录ID
        "title": string,
        "article_id": number, //文章ID
        "is_vital": number,
        "is_show": number,
        "is_recom": number,
        "is_sift": number,
        "sift_img": string, //精选背景图路径
        "author": string,
        "email": string, //电子邮箱，比如 example@qq.com
        "keywords": string,
        "describe": string,
        "out_url": string, //外部链接
        "file": string, //上传文件
        "content": string,
        "browse_num": number, //浏览次数
        "add_time": string
    }[],
    "total": number //总条数
}