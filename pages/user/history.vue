<script setup lang="ts">
import { RecordApi } from '~/api/user/record'

const userState = useUserState()

const defData = reactive({
    skeleton: true,
})

type TableDataItem = RecordApi_GetListResponse['lists'][0]
const tableData = reactive<BaseTableDataType<TableDataItem>>({
    data: [],
    tableHeader: [
        { property: 'goods_name', label: '商品名称', minWidth: 180, slot: true },
        { property: 'shop_price', label: '价格', width: 120, align: 'center' },
        { property: 'recent_time', label: '浏览时间', width: 160, slot: true },
        { property: 'operate', label: '操作', width: 100, align: 'center', slot: true, fixed: 'right' },
    ],
    pagination: {
        ...PAGINATION,
    },
})

const initTableData = async () => {
    const data: RecordApi_GetList = {
        type: 2,
        is_paging: 1,
        page: tableData.pagination.page,
        page_size: tableData.pagination.page_size,
    }
    const res = await RecordApi.getList(data)
    await wait(10)
    defData.skeleton = false// 让每个页面都要加载数据，防止溢出错误。 这会释放页面
    if (res.data.value?.code !== 200) return ElMessage.error(res.data.value?.msg)

    tableData.data = res.data.value?.data.lists.map((item) => {
        item.goods_img = setGoodsOssImg(item.goods_img, 60)
        return item
    })
    tableData.pagination.total = res.data.value.data.total
}
initTableData()

// 删除
const onRemove = async (row: any) => {
    ElMessageBox.confirm('确定要删除该条历史记录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(async () => {
        const user = await userState.getUserInfo()
        if (user.value) {
            const data: RecordApi_Del = {
                type: 2,
                goods_ids: row.goods_id,
            }

            const res = await RecordApi.del(data)
            if (res.data.value?.code !== 200) {
                ElMessage.error(res.data.value?.msg)
                return false
            }
            ElMessage.success('删除成功')
            initTableData() // 重新加载列表
        }
    })
}

// 分页跳转
const onHandleCurrentChange = () => {
    initTableData()
}

definePageMeta({
    layout: 'home',
    middleware: 'auth',
})
</script>

<template>
    <LayoutUser>
        <el-skeleton :loading="defData.skeleton" animated>
            <template #template>
                <div class="pb20px">
                    <el-skeleton-item class="w20%!" />
                </div>
                <div class="min-h500px">
                    <el-skeleton :rows="5" />
                </div>
            </template>

            <el-breadcrumb class="mb20px">
                <el-breadcrumb-item>
                    我关注的
                </el-breadcrumb-item>
                <el-breadcrumb-item>浏览历史</el-breadcrumb-item>
            </el-breadcrumb>

            <CoTable v-model:page="tableData.pagination" v-model:table-header="tableData.tableHeader" :data="tableData.data"
                auto-height scrollbar-always-on border @update:page="onHandleCurrentChange">
                <template #goods_name="{ scopes }">
                    <div class="flex items-center">
                        <co-image class="h50px w50px" :src="scopes.row.goods_img" :icon-size="24" />
                        <div class="pl10px">
                            <NuxtLink :to="`/goods/${scopes.row.goods_sn}`" class="hover:c-#d7231e" target="_blank">
                                {{ scopes.row.goods_name }}
                            </NuxtLink>
                        </div>
                    </div>
                </template>
                <template #recent_time="{ scopes }">
                    {{ formatTime(scopes.row.recent_time) }}
                </template>
                <template #operate="{ scopes }">
                    <el-button type="primary" link size="small" @click="onRemove(scopes.row)">
                        删除
                    </el-button>
                </template>
            </CoTable>
        </el-skeleton>
    </LayoutUser>
</template>

<style lang="scss" scoped></style>
