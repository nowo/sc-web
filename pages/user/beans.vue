<script setup lang="ts">
import { BeansApi } from '~/api/user/coupon'

const defData = reactive({
    tableData: [] as BeansApi_getListResponse['lists'],
    pears: '' as unknown as number,
    skeleton: true,
    page: 1,
    pageSize: 10,
    total: 10,
})

const initTableData = async () => {
    const data: BeansApi_getList = {
        type: 0,
        page: defData.page,
        page_size: defData.pageSize,
    }
    const { data: res } = await BeansApi.geList(data)
    await wait(10)
    defData.skeleton = false
    if (res.value?.code !== 200) return ElMessage.error(res.value?.msg)
    defData.tableData = res.value?.data.lists
    defData.total = res.value?.data.total
    defData.pears = res.value?.data.peas
}

// 分页数量点击
const onHandleSizeChange = () => {
    initTableData()
}

initTableData()
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

            <div h40px>
                <el-breadcrumb>
                    <el-breadcrumb-item>
                        订单中心
                    </el-breadcrumb-item>
                    <el-breadcrumb-item>我的工游豆</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <div style="margin-bottom: 20px; color: var(--el-color-primary);">
                我的工游豆：{{ defData.pears }}
            </div>
            <div>
                <!-- <el-table :data="defData.tableData" style="width: 100%" border>
                    <el-table-column prop="create_at" label="时间" width="200px" align="center" />
                    <el-table-column prop="type" label="类型" width="180px" align="center">
                        <template #default="scopes">
                            <el-tag v-if="scopes.row.type === 1">
                                收入
                            </el-tag>
                            <el-tag v-else type="info">
                                支出
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="peas" label="工游豆" width="200px" align="center" />
                    <el-table-column prop="remarks" label="备注（工游豆来源、用途)" min-width="200px" align="center" />
                </el-table> -->
            </div>
            <div class="goods-pagination mt10px">
                <el-pagination v-model:current-page="defData.page" v-model:page-size="defData.pageSize" small background
                    layout=" prev, pager, next,total, jumper" :total="defData.total" @size-change="onHandleSizeChange"
                    @current-change="onHandleSizeChange" />
            </div>
        </el-skeleton>
    </LayoutUser>
</template>

<style scoped></style>
