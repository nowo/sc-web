<template>
    <template v-for="item in list" :key="item.id">
        <el-sub-menu v-if="item.children?.length > 0" :index="`${item.id}`">
            <template #title>
                {{ item.name }}
            </template>
            <LayoutContentMenu :list="item.children" :url="url" />
        </el-sub-menu>
        <el-menu-item v-else :index="`${item.id}`" @click="onMenuLink(item)">
            {{ item.name }}
        </el-menu-item>
    </template>
</template>

<script lang="ts" setup>
// 菜单使用的数据
const { list = [], url = '' } = defineProps<{ list: HomeApi_GetArticleResponse[]; url: string }>()

// const setRouteUrl = (id: number) => {
//     return `${url}?id=${id}`
// }

const onMenuLink = (row: HomeApi_GetArticleResponse) => {
    navigateTo({
        path: url,
        query: {
            id: row.id,
        },
    })
}
</script>

<style lang="scss" scoped></style>
