<script setup lang="ts">
import { UserInvoiceModel } from '#components'
import { UserInvoiceApi } from '~/api/user/invoice'

const modelRef = ref<InstanceType<typeof UserInvoiceModel>>()
const defData = reactive({
    tableData: [] as UserInvoiceApi_getListResponse[],
    skeleton: true,

})

type TableDataItem = UserInvoiceApi_getListResponse
const tableData = reactive<BaseTableDataType<TableDataItem>>({
    data: [],
    tableHeader: [
        { property: 'enterprise_name', label: '发票抬头', minWidth: 150 },
        { property: 'enterprise_email', label: '企业邮箱', minWidth: 120 },
        { property: 'tax_no', label: '纳税人识别号', minWidth: 100 },
        { property: 'type', label: '发票类型', width: 120, align: 'center', slot: true },
        { property: 'is_default', label: '默认地址', width: 85, align: 'center', slot: true },
        { property: 'operate', label: '操作', width: 100, align: 'center', slot: true, fixed: 'right' },
    ],
    pagination: {
        ...PAGINATION,
    },
})

// 获取发票列表
const initTableData = async () => {
    const res = await UserInvoiceApi.getList()

    if (res.data.value?.code !== 200) return ElMessage.error(res.data.value?.msg)

    defData.tableData = res.data.value.data
    tableData.data = res.data.value.data
}
initTableData()

// 新增
const onAdd = async () => {
    modelRef.value?.onOpenDialog()
}
// 修改发票
const onEdit = (row: UserInvoiceApi_getListResponse) => {
    modelRef.value?.onOpenDialog(row)
}
// 更新列表
const getInvoice = () => {
    initTableData()
}
// 删除发票
const onDel = (row: UserInvoiceApi_getListResponse) => {
    if (!row.bill_header_id) return false
    ElMessageBox.confirm('此操作将永久删除该条内容，是否继续?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        buttonSize: 'default',
    }).then(async () => {
        const { data: del } = await UserInvoiceApi.del({
            bill_header_id: row.bill_header_id,
        })
        if (del.value?.code !== 200) {
            ElMessage.error(del.value?.msg)
            return false
        }
        ElMessage.success('删除成功')
        getInvoice()
    }).catch(() => { })
}

// 是否默认
// const onDefault = async (row: UserInvoiceApi_getListResponse) => {
//     const { data: def } = await UserInvoiceApi.default({
//         bill_header_id: row.bill_header_id,
//     })
//     if (def.value?.code !== 200) {
//         ElMessage.error(def.value?.msg)
//         return false
//     }
//     ElMessage.success('更改成功')
//     getInvoice()
// }



// 分页跳转
const onHandleCurrentChange = () => {
    initTableData()
}

onMounted(() => {
    defData.skeleton = false // 骨架屏展示页面内容。
})

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
                    账户管理
                </el-breadcrumb-item>
                <el-breadcrumb-item>发票抬头管理</el-breadcrumb-item>
            </el-breadcrumb>
            <div class="my15px">
                <el-button type="primary" @click="onAdd">
                    新增发票抬头
                </el-button>
            </div>
            <CoTable v-model:page="tableData.pagination" v-model:table-header="tableData.tableHeader" :data="tableData.data"
                auto-height scrollbar-always-on border @update:page="onHandleCurrentChange">
                <template #type="{ scopes }">
                    <el-tag v-if="scopes.row.type === 1" type="success">
                        增值税务发票
                    </el-tag>
                    <el-tag v-else-if="scopes.row.type === 2" type="danger">
                        普通发票
                    </el-tag>
                    <el-tag v-else type="danger">
                        普通电子发票
                    </el-tag>
                </template>
                <template #is_default="{ scopes }">
                    <el-tag v-if="scopes.row.is_default" type="success" size="small">
                        是
                    </el-tag>
                    <el-tag v-else type="info" size="small">
                        否
                    </el-tag>
                </template>
                <template #operate="{ scopes }">
                    <el-button type="primary" link size="small" @click="onEdit(scopes.row)">
                        修改
                    </el-button>
                    <el-button type="primary" link size="small" @click="onDel(scopes.row)">
                        删除
                    </el-button>
                </template>
            </CoTable>

            <UserInvoiceModel ref="modelRef" @update="getInvoice" />
        </el-skeleton>
    </LayoutUser>
</template>

<style scoped></style>
