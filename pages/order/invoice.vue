<!-- 订单发票列表 -->
<template>
    <LayoutUser>
        <el-skeleton :loading="defData.skeleton" animated>
            <template #template>
                <div class="min-h500px">
                    <el-skeleton class="mb20px" />
                    <el-skeleton :rows="5" />
                </div>
            </template>
            <el-breadcrumb class="mb15px">
                <el-breadcrumb-item>
                    订单中心
                </el-breadcrumb-item>
                <el-breadcrumb-item>订单发票列表</el-breadcrumb-item>
            </el-breadcrumb>

            <CoTable v-model:page="tableData.pagination" v-model:table-header="tableData.tableHeader" class="table-box"
                :data="tableData.data" auto-height scrollbar-always-on border @update:page="onHandleCurrentChange">
                <template #add_time="{ scopes }">
                    {{ formatTime(scopes.row.add_time) }}
                </template>
                <template #type="{ scopes }">
                    <el-tag :type="scopes.row.type === 1 ? 'danger' : scopes.row.type === 2 ? 'success' : 'warning'">
                        {{ INVOICE_DATA[scopes.row.type as '1'] }}
                    </el-tag>
                </template>
                <template #verify_status="{ scopes }">
                    <div class="text-13px">
                        {{ defData.operateList[scopes.row.verify_status as '1'] }}
                    </div>
                </template>
                <!-- <template #failed_remark="{ scopes }">
                    <div class="text-13px">
                        {{ scopes.row.verify_status !== 5 ? scopes.row.failed_remark : '' }}
                    </div>
                </template> -->

                <template #operate="{ scopes }">
                    <el-button v-if="scopes.row.verify_status === 0 || scopes.row.verify_status === 2" type="primary"
                        size="small" link @click="onDetail(scopes.row, 2)">
                        修改
                    </el-button>
                    <el-button v-else size="small" link @click="onDetail(scopes.row, 3)">
                        查看
                    </el-button>
                </template>
            </CoTable>
            <OrderInvoiceModel ref="modelRef" @update="updateTableData" />
        </el-skeleton>
    </LayoutUser>
</template>

<script setup lang="ts">
import { OrderInvoiceModel } from '#components'
import { OrderInvoiceApi } from '~/api/goods/order'

definePageMeta({
    layout: 'home',
    middleware: 'auth',
})

// 订单编号
const order_no = useRouteQuery('order_no')

const modelRef = ref<InstanceType<typeof OrderInvoiceModel>>()

const defData = reactive({
    skeleton: true, // 显示骨架屏
    operateList: { //     审核状态 0未审核 1审核通过 2审核不通过 3已邮寄 4已电子邮寄 5已完成
        0: '未审核',
        1: '审核通过',
        2: '审核不通过',
        3: '已邮寄',
        4: '已电子邮寄',
        5: '已完成',
    },
    typeList: {
        ...INVOICE_DATA,
    },
})

type TableDataItem = OrderInvoiceApi_GetListResponse['lists'][0]
const tableData = reactive<BaseTableDataType<TableDataItem>>({
    data: [],
    tableHeader: [
        { property: 'order_no', label: '订单编号', minWidth: 200, className: 'goods-list-row', showOverflowTooltip: false },
        { property: 'header', label: '发票抬头', width: 160, showOverflowTooltip: false },
        { property: 'type', label: '发票类型', width: 120, align: 'center', slot: true },
        { property: 'add_time', label: '申请时间', width: 160, slot: true },
        { property: 'verify_status', label: '状态', width: 100, align: 'center', slot: true },
        // { property: 'failed_remark', label: '审核原因', width: 130, slot: true },
        { property: 'operate', label: '操作', width: 100, align: 'center', slot: true, fixed: 'right' },
    ],
    pagination: {
        ...PAGINATION,
    },
})

const initTableData = async () => {
    const params: OrderInvoiceApi_GetList = {
        is_paging: 1,
        page: tableData.pagination.page,
        page_size: tableData.pagination.page_size,
    }

    const loading = useElLoading()

    const { data: res, error } = await OrderInvoiceApi.getList(params)
    await wait(100)
    // console.log(res)
    loading?.close()
    if (error.value) return
    defData.skeleton = false

    if (res.value?.code === 200) {
        tableData.data = res.value.data.lists
        tableData.pagination.total = res.value.data.total
    }
}

const onDetail = (row: TableDataItem, type: 1 | 2 | 3) => {
    modelRef.value?.onOpenDialog(row, type)
}

// 分页切换
const onHandleCurrentChange = () => {
    initTableData()
}

// 更新列表
const updateTableData = () => {
    initTableData()
}
// onBeforeMount(()=>{
//     // searchData
// })
initTableData()
</script>

<style  lang="scss" scoped>
.table-box {

    :deep(.el-table__body) {
        td.el-table__cell {
            font-size: 13px;
        }
    }
}
</style>
