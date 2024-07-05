<script setup lang="ts">
import type { ElTable } from 'element-plus'
import { RecordApi } from '~/api/user/record'

const tableRef = ref<InstanceType<typeof ElTable>>()

const defData = reactive({
    tableData: [] as RecordApi_GetListResponse['lists'],
    page: 1,
    total: 10,
    pageSize: 10,
    skeleton: true,
})

const initTableData = async () => {
    const data: RecordApi_GetList = {
        type: 1,
        is_paging: 1,
        page: defData.page,
        page_size: defData.pageSize,
    }
    const res = await RecordApi.getList(data)
    await wait(10)
    defData.skeleton = false
    if (res.data.value?.code !== 200) return ElMessage.error(res.data.value?.msg)
    defData.tableData = res.data.value?.data.lists.map((item) => {
        item.goods_img = setGoodsOssImg(item.goods_img, 60)
        return item
    })
    defData.total = res.data.value.data.total
}
initTableData()

// 删除
const onRemove = (row: any) => {
    ElMessageBox.confirm('此操作将永久删除该条内容，是否继续?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        buttonSize: 'default',
    }).then(async () => {
        const data: RecordApi_Del = {
            type: 1,
            goods_ids: row.goods_id,
        }
        const res = await RecordApi.del(data)
        if (res.data.value?.code !== 200) {
            ElMessage.error(res.data.value?.msg)
            return false
        }
        ElMessage.success('删除成功')
        initTableData() // 重新加载列表
    }).catch(() => { })
}

// 分页数量点击
const onHandleSizeChange = () => {
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
            <el-breadcrumb>
                <el-breadcrumb-item>
                    我关注的
                </el-breadcrumb-item>
                <el-breadcrumb-item>我的收藏</el-breadcrumb-item>
            </el-breadcrumb>

            <el-table ref="tableRef" :data="defData.tableData" class="mt25px" border>
                <el-table-column prop="goods_name" label="商品名称" min-width="180">
                    <template #default="{ row }">
                        <div class="flex  items-center">
                            <div class="goods_img">
                                <el-image class="h50px w50px" :src="row.goods_img" />
                            </div>
                            <div class="pl10px">
                                <NuxtLink :to="`/goods/${row.goods_sn}`" target="_blank">
                                    {{ row.goods_name }}
                                </NuxtLink>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <!-- <el-table-column prop="shop_price" label="价格" width="120" align="center">
                    <template #default="{ row }">
                        <div class="shop_price">
                            {{ row.shop_price }}
                        </div>
                    </template>
                </el-table-column> -->
                <el-table-column prop="collect_time" label="收藏时间" width="170px">
                    <template #default="{ row }">
                        {{ formatTime(row.collect_time) }}
                    </template>
                </el-table-column>
                <el-table-column prop="operate" label="操作" width="100" align="center">
                    <template #default="{ row }">
                        <el-button type="primary" link @click="onRemove(row)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="goods-pagination mt10px">
                <el-pagination v-model:current-page="defData.page" v-model:page-size="defData.pageSize" size="small"
                    background layout=" prev, pager, next,total, jumper" :total="defData.total"
                    @size-change="onHandleSizeChange" @current-change="onHandleSizeChange" />
            </div>
        </el-skeleton>
    </LayoutUser>
</template>

<style scoped></style>
