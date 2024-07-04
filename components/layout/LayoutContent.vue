<script lang="ts" setup>
import { ContentApi } from '~/api/home/content'

const { type = 1 } = defineProps<{ type?: 1 | 2 | 3 }>()
// const route = useRoute()
// console.log(route)
const activeIndex = useRouteQuery('id')

const defData = reactive({
    helpList: [] as HomeApi_GetArticleResponse[], // 帮助列表数据
    articleList: [] as HomeApi_GetArticleResponse[], // 文章列表数据
    videoList: [] as HomeApi_GetArticleResponse[], // 视频列表数据

    menuList: [] as HomeApi_GetArticleResponse[], // 菜单使用的数据
    ready: false,
})

const comData = computed(() => {
    let dat = {
        title: '',
        url: '',
    }

    if (type === 1) {
        dat = { title: '帮助中心', url: '/content/help' }
    } else if (type === 2) {
        dat = { title: '内容中心', url: '/content/list' }
    } else if (type === 3) {
        dat = { title: '视频中心', url: '/content/video' }
    }
    return dat
})

const openList = computed(() => {
    return defData.menuList.filter(item => item.children?.length > 0).map(opt => opt.id.toString())
})

// 初始化默认数据
const initDefaultData = async () => {
    // console.log('type :>> ', type)
    // 有数据时不请求接口
    if (type === 1 && defData.helpList.length) return defData.menuList = defData.helpList
    if (type === 2 && defData.articleList.length) return defData.menuList = defData.articleList
    if (type === 3 && defData.videoList.length) return defData.menuList = defData.videoList

    const { data } = await ContentApi.getList({ type })
    if (data.value?.code !== 200) return ElMessage.error(data.value?.msg)

    // console.log('data.value.data :>> ', data.value.data)
    if (type === 1) {
        defData.helpList = data.value.data
        defData.menuList = data.value.data
    } else if (type === 2) {
        defData.articleList = data.value.data
        defData.menuList = data.value.data
    } else if (type === 3) {
        defData.videoList = data.value.data
        defData.menuList = data.value.data
    }
}

initDefaultData()

watch(() => defData.menuList, () => {
    defData.ready = true
})
</script>

<template>
    <div class="layout-content">
        <div class="container">
            <el-skeleton :loading="!defData.ready">
                <el-container class="layout-box">
                    <el-aside class="left">
                        <div class="l-tle">
                            {{ comData.title }}
                        </div>
                        <el-divider border-style="dotted" class="m0!" />
                        <el-menu v-if="CLIENT" class="menu-list" :default-active="activeIndex"
                            :default-openeds="openList">
                            <LayoutContentMenu :list="defData.menuList" :url="comData.url" />
                        </el-menu>
                    </el-aside>
                    <el-main class="right min-h500px">
                        <slot />
                    </el-main>
                </el-container>
                <template #template>
                    <el-container class="layout-box">
                        <el-aside class="left">
                            <div class="l-tle">
                                <el-skeleton-item />
                            </div>
                            <el-divider border-style="dotted" class="m0!" />
                            <div class="px20px">
                                <el-skeleton-item class="mt20px" />
                                <el-skeleton-item class="my10px" />
                                <el-skeleton-item class="my10px" />
                                <el-skeleton-item class="my10px" />
                                <el-skeleton-item class="my10px" />
                            </div>
                        </el-aside>
                        <el-main class="right min-h600px">
                            <el-skeleton />
                        </el-main>
                    </el-container>
                </template>
            </el-skeleton>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.layout-box {

    padding: 20px 0;

    .l-tle {
        font-weight: bold;
        font-size: 18px;
        padding: 15px 20px;
    }

    .left {
        width: var(--m-aside-width);
        margin-right: 10px;
        background-color: var(--el-color-white);
    }

    .right {
        background-color: var(--el-color-white);

    }

}

.menu-list {
    --el-menu-item-height: 46px;
    --el-menu-sub-item-height: calc(var(--el-menu-item-height) - 6px);
    width: var(--m-aside-width);
    border-right: 0;
}
</style>
