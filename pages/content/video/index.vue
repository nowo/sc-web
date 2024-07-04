<!-- 视频中心 -->
<template>
    <LayoutContent :type="3">
        <div v-if="defData.type === 1">
            <div v-if="defData.videoList.length === 0">
                <el-empty description="暂无数据" />
            </div>
            <div v-else>
                <el-space wrap>
                    <div v-for="item in defData.videoList" :key="item.id" :data="defData">
                        <img :src="item.sift_img" h160px w280px style="cursor: pointer;" @click="OpenContent(item.id)">
                        <div style="font-size: 12px;margin-top: 10px;text-align: center;">
                            {{ item.title }}
                        </div>
                    </div>
                </el-space>
            </div>
            <div class="goods-pagination" mt25px>
                <el-pagination v-model:current-page="defData.page" v-model:page-size="defData.pageSize" small background
                    layout=" prev, pager, next,total, jumper" :total="defData.total" @size-change="onHandleSizeChange"
                    @current-change="onHandleSizeChange" />
            </div>
        </div>
        <div v-else>
            <el-button @click="defData.type = 1">
                返回
            </el-button>
            <div style="font-size: 30px;text-align: center;">
                {{ contentInfo?.title }}
            </div>
            <div>添加时间：{{ contentInfo?.add_time }}</div>
            <div>作者：{{ contentInfo?.author }}</div>
            <div class="text-content" v-html="contentInfo?.content" />
            <div>浏览次数：{{ contentInfo?.browse_num }}</div>
        </div>
    </LayoutContent>
</template>

<script lang="ts" setup>
import { VideoApi } from '~/api/brand/video'

definePageMeta({
    layout: 'home',
})

const contentInfo = ref<VideoApi_GetListResponse>()

const defData = reactive({
    videoList: [] as VideoApi_GetVideoListResponse['lists'],
    error: false,
    page: 1,
    total: 0,
    pageSize: 9,
    type: 1,
    id: 38,
})

const id = useRouteQuery('id')

// 获取视频列表
const initData = async () => {
    if (process.client) document.documentElement.scrollTop = 0
    // if (!(/^\d+$/.test(id.value))) return defData.error = true
    const param: VideoApi_GetVideoList = {
        id: Number(id.value),
        page: defData.page,
        page_size: defData.pageSize,
    }
    if (!param.id) param.id = 38
    const { data, error } = await VideoApi.getVideoList(param)
    if (error.value) defData.error = true
    if (data.value?.code !== 200) return ElMessage.error(data.value?.msg)
    defData.videoList = data.value.data.lists
    defData.total = data.value.data.total
}
initData()

// 获取视频内容列表
const OpenContent = async (id: number) => {
    defData.type = 2
    defData.id = id
    const { data, error } = await VideoApi.getList({ id: defData.id })
    if (error.value) defData.error = true
    if (data.value?.code !== 200) return ElMessage.error(data.value?.msg)
    contentInfo.value = data.value.data
}

// 分页数量点击
const onHandleSizeChange = () => {
    initData()
}

watch(() => id.value, () => {
    // if (process.client) document.documentElement.scrollTop = 0
    defData.type = 1
    initData()
}, { immediate: true })
</script>
