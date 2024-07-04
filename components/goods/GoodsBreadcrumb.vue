<!-- 面包屑导航 -->
<script lang="ts" setup>
interface BreadcrumbItemType {
    id: number
    name: string
}

const props = defineProps<{
    cid?: number | '' // 商品分类id
    name?: string // 商品名称，如果有商品的话
}>()

// 商品分类
const goodsState = useGoodsState()
const goodsClass = await goodsState.getGoodsClass()

// 设置商品导航菜单
const breadcrumbList = computed(() => {
    const list: BreadcrumbItemType[] = []
    if (props.cid) {
        const arr = findParentsNode(goodsClass.value, props.cid, 'cat_id')
        arr.forEach((item) => {
            list.push({
                id: item.cat_id,
                name: item.cat_name,
            })
        })
    }
    if (props.name) list.push({ id: 0, name: props.name })

    return list
})
</script>

<template>
    <el-breadcrumb class="breadcrumb-box">
        <el-breadcrumb-item :to="{ path: '/' }">
            首页
        </el-breadcrumb-item>
        <el-breadcrumb-item v-for="(item, index) in breadcrumbList" :key="item.id">
            <span v-if="index + 1 === breadcrumbList?.length">{{ item.name }}</span>
            <NuxtLink v-else :to="linkGoodsList({ query: { cid: item.id }, url: true })">
                {{ item.name }}
            </NuxtLink>
        </el-breadcrumb-item>
    </el-breadcrumb>
</template>

<style lang="scss" scoped></style>
