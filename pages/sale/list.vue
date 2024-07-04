<script setup lang="ts">
import { SaleAfterApi } from '~/api/user/saleAfter'

const infoData = ref<SaleAfterApi_InfoResponse>()

const defData = reactive({
    activeName: 'first',
    tableData: [] as SaleAfterApi_GetListResponse['lists'],
    visible: false,
    id: 0,
})

const initTableData = async () => {
    const { data: res } = await SaleAfterApi.getList()
    if (res.value?.code !== 200) return ElMessage.error(res.value?.msg)
    defData.tableData = res.value.data.lists
    // defData.total = res.value.data.total
}
initTableData()

// 查看
const onDetail = async (row: any) => {
    defData.id = row.id
    const data: SaleAfterApi_Info = {
        id: Number(defData.id),
    }
    const { data: res } = await SaleAfterApi.info(data)

    // if (res.value?.code !== 200) return ElMessage.error(res.value?.msg)
    if (res.value) {
        infoData.value = res.value.data
    }

    defData.visible = true
}

// 分页数量点击
// const onHandleSizeChange = () => {
//     initTableData()
// }

definePageMeta({
    layout: 'home',
    middleware: 'auth',
})
</script>

<template>
    <LayoutSaleAfter>
        <el-breadcrumb>
            <el-breadcrumb-item>
                售后申请
            </el-breadcrumb-item>
            <el-breadcrumb-item>售后信息</el-breadcrumb-item>
        </el-breadcrumb>
        <div v-if="defData.tableData.length === 0">
            <el-empty description="没有售后信息" class="h500px" />
        </div>
        <el-table v-else :data="defData.tableData" class="mt18px min-h500px">
            <el-table-column prop="type" label="类型" width="120" show-overflow-tooltip align="center">
                <template #default="scopes">
                    {{ scopes.row.type === 1 ? '安装申请' : '维修申请' }}
                </template>
            </el-table-column>
            <el-table-column prop="ask_date" label="上门预约时间" width="180" show-overflow-tooltip align="center">
                <template #default="scopes">
                    {{ formatTime(scopes.row.ask_date) }}
                </template>
            </el-table-column>
            <el-table-column prop="phone" label="联系电话" width="120" show-overflow-tooltip align="center" />
            <el-table-column prop="goods_code" label="商品型号" width="100" show-overflow-tooltip align="center" />
            <el-table-column prop="goods_type_txt" label="商品类型" width="150" show-overflow-tooltip align="center" />
            <el-table-column prop="describe" label="需求描述" min-width="80" show-overflow-tooltip align="center" />
            <el-table-column prop="operate" width="60" align="center" show-overflow-tooltip fixed="right">
                <template #default="{ row }">
                    <el-button type="primary" link size="small" @click="onDetail(row)">
                        查看
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- <div class="goods-pagination">
            <el-pagination v-model:current-page="defData.page" v-model:page-size="defData.pageSize" small background
                layout=" prev, pager, next,total, jumper" :total="defData.total" @size-change="onHandleSizeChange"
                @current-change="onHandleSizeChange" />
        </div> -->
        <ClientOnly>
        <el-dialog v-model="defData.visible" auto-height width="800px" :draggable="true"
            :title="infoData?.type === 1 ? '安装申请' : '维修申请'" destroy-on-close>
            <el-descriptions :column="2">
                <el-descriptions-item label="申请人：">
                    {{ infoData?.contacts }}
                </el-descriptions-item>
                <el-descriptions-item label="上门预约时间：">
                    {{ infoData?.ask_date }}
                </el-descriptions-item>
                <el-descriptions-item label="申请人电话：">
                    {{ infoData?.phone }}
                </el-descriptions-item>
                <el-descriptions-item label="上门工作人员：">
                    {{ infoData?.accept_name ? infoData?.accept_name : '接单中~' }}
                </el-descriptions-item>
                <el-descriptions-item label="地址：">
                    {{ infoData?.province }} {{ infoData?.city }} {{ infoData?.area }} {{ infoData?.address }}
                </el-descriptions-item>
                <el-descriptions-item label="需求描述：">
                    {{ infoData?.describe }}
                </el-descriptions-item>

                <!-- <el-descriptions-item label="上传图片：">
                    {{ defData.infoData.des_img }}
                </el-descriptions-item> -->
            </el-descriptions>
        </el-dialog>
    </ClientOnly>
    </LayoutSaleAfter>
</template>

<style scoped>
.demo-tabs>.el-tabs__content {
    padding-top: 0px;
    color: #6b778c;
    font-size: 32px;
    font-weight: 600;
}

.goods-pagination {
    padding: 20px 0;
    --el-pagination-button-bg-color: var(--el-color-white);
    /* :deep(.el-pagination) {
    --el-pagination-button-bg-color: var(--el-color-white);
    justify-content: center;
    --el-disabled-bg-color: var(--el-border-color);
  } */
}
</style>
