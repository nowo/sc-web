<script setup lang="ts">
import { UserAddressModel } from '#components'

import { UserAddressApi } from '~/api/user/address'

const modelRef = ref<InstanceType<typeof UserAddressModel>>()

const defData = reactive({
    skeleton: true, // 骨架屏

})

type TableDataItem = UserAddressApi_GetListResponse
const tableData = reactive<BaseTableDataType<TableDataItem>>({
    data: [],
    tableHeader: [
        { property: 'contacts', label: '收件人', width: 140 },
        { property: 'phone', label: '联系电话', width: 130 },
        { property: 'province', label: '收件地址', minWidth: 150, slot: true },
        { property: 'email', label: '邮箱地址', width: 150 },
        { property: 'is_default', label: '默认地址', width: 85, align: 'center', slot: true },
        { property: 'is_bill_address', label: '默认发票', width: 85, align: 'center', slot: true },
        { property: 'operate', label: '操作', width: 100, align: 'center', slot: true, fixed: 'right' },
    ],
    pagination: {
        ...PAGINATION,
    },
})

const { data: address, refresh } = await UserAddressApi.getList() // 获取所有地址列表
// await wait(100)
// defData.skeleton = false // 完成屏幕骨架屏操作后，骨架屏展示页面内容。
// const addressList = ref(address.value?.data)

watch(() => address.value?.data, () => {
    tableData.data = address.value?.data || []
    // tableData.pagination.total = address.value?.total || 0
}, { immediate: true })

// 地址信息拼接
const setAddressText = (row: UserAddressApi_GetListResponse) => {
    return setArrayTextName([row.province, row.city, row.area, row.address], '  ')
}

// 新增地址
const onAdd = async () => {
    modelRef.value?.onOpenDialog()
}

// 修改地址
const onEdit = (row: UserAddressApi_GetListResponse) => {
    modelRef.value?.onOpenDialog(row)
}

// 删除地址
const onDel = (row: UserAddressApi_GetListResponse) => {
    if (!row.address_id) return false
    ElMessageBox.confirm('此操作将永久删除该条内容，是否继续?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        buttonSize: 'default',
    }).then(async () => {
        const { data: del } = await UserAddressApi.del({
            address_id: row.address_id,
        })
        if (del.value?.code !== 200) {
            ElMessage.error(del.value?.msg)
            return false
        }
        ElMessage.success('删除成功')
        refresh()
    }).catch(() => { })
}

// 新增、修改更新列表
const getAddress = () => {
    refresh()
}

// 分页跳转
const onHandleCurrentChange = () => {
    refresh()
}

onMounted(() => {
    defData.skeleton = false // 完成屏幕骨架屏操作后，骨架屏展示页面内容。
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
                <el-breadcrumb-item>
                    地址管理
                </el-breadcrumb-item>
            </el-breadcrumb>
            <div class="my15px">
                <el-button type="primary" @click="onAdd">
                    新增地址
                </el-button>
            </div>

            <CoTable v-model:page="tableData.pagination" v-model:table-header="tableData.tableHeader" :data="tableData.data"
                auto-height scrollbar-always-on border @update:page="onHandleCurrentChange">
                <template #province="{ scopes }">
                    {{ setAddressText(scopes.row) }}
                </template>
                <template #is_default="{ scopes }">
                    <el-tag v-if="scopes.row.is_default" type="success" size="small">
                        是
                    </el-tag>
                    <el-tag v-else type="info" size="small">
                        否
                    </el-tag>
                </template>
                <template #is_bill_address="{ scopes }">
                    <el-tag v-if="scopes.row.is_bill_address" type="success" size="small">
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
            <UserAddressModel ref="modelRef" @update="getAddress" />
        </el-skeleton>
    </LayoutUser>
</template>

<style scoped></style>
