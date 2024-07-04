<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { LeaveWordApi } from '~/api/user/leaveWord'

const defData = reactive({
    skeleton: true,
    typeList: [
        {
            value: 1,
            label: '建议',
        },
        {
            value: 2,
            label: '投诉',
        },
        {
            value: 3,
            label: '商品',
        },
        {
            value: 4,
            label: '其他',
        },
        {
            value: 5,
            label: '店铺投诉',
        },
        {
            value: 6,
            label: '订单问题',
        },
    ],
    visible: false,
    btnLoading: false,
})
const formRef = ref<FormInstance>()
const form = reactive({
    content: '',
    type: '',
})

// 规则
const rules = reactive<FormRules>({
    content: [
        { required: true, whitespace: true, message: '必填项不能为空', trigger: 'blur' },
    ],
    type: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
})

type TableDataItem = LeaveWordApi_GetListResponse['lists'][0]
const tableData = reactive<BaseTableDataType<TableDataItem>>({
    data: [],
    tableHeader: [
        { property: 'type', label: '类型', width: 120, align: 'center', slot: true },
        { property: 'content', label: '留言内容', minWidth: 150 },
        { property: 'add_time', label: '留言时间', width: 160, slot: true },
        { property: 'is_reply', label: '是否回复', width: 85, align: 'center', slot: true },
        { property: 'reply_content', label: '回复内容', width: 175 },
        { property: 'reply_time', label: '回复时间', width: 160, align: 'center', slot: true },
        // { property: 'operate', label: '操作', width: 100, align: 'center', slot: true, fixed: 'right' },
    ],
    pagination: {
        ...PAGINATION,
    },
})

const initTableData = async () => {
    const data: LeaveWordApi_GetList = {
        is_paging: 1,
        page: tableData.pagination.page,
        page_size: tableData.pagination.page_size,
    }
    const res = await LeaveWordApi.getList(data)
    await wait(10)
    defData.skeleton = false
    if (res.data.value?.code !== 200) return ElMessage.error(res.data.value?.msg)

    tableData.data = res.data.value.data.lists
    tableData.pagination.total = res.data.value.data.total
}
initTableData()

// 新增  确定
const onClick = async () => {
    const isRun = await useFormVerify(formRef.value)
    if (!isRun) return false
    const data: LeaveWordApi_Add = {
        type: Number(form.type),
        content: form.content,
    }
    const res = await LeaveWordApi.add(data)
    if (res.data.value?.code !== 200) return ElMessage.error(res.data.value?.msg)
    ElMessage.success('新增成功')
    initTableData()
    defData.visible = false
}

// 关闭弹窗
const onClose = () => {
    defData.visible = false
    formRef.value?.resetFields()
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
            <el-breadcrumb>
                <el-breadcrumb-item>
                    账户管理
                </el-breadcrumb-item>
                <el-breadcrumb-item>我的留言</el-breadcrumb-item>
            </el-breadcrumb>
            <div class="my15px">
                <el-button type="primary" @click="defData.visible = true">
                    新增留言
                </el-button>
            </div>

            <CoTable v-model:page="tableData.pagination" v-model:table-header="tableData.tableHeader" :data="tableData.data"
                auto-height scrollbar-always-on border @update:page="onHandleCurrentChange">
                <template #type="{ scopes }">
                    <el-tag v-if="scopes.row.type === 1">
                        建议
                    </el-tag>
                    <el-tag v-else-if="scopes.row.type === 2">
                        投诉
                    </el-tag>
                    <el-tag v-else-if="scopes.row.type === 3">
                        商品
                    </el-tag>
                    <el-tag v-else-if="scopes.row.type === 4">
                        其他
                    </el-tag>
                    <el-tag v-else-if="scopes.row.type === 5">
                        店铺投诉
                    </el-tag>
                    <el-tag v-else>
                        订单问题
                    </el-tag>
                </template>
                <template #is_reply="{ scopes }">
                    <el-tag v-if="scopes.row.is_reply" type="success">
                        是
                    </el-tag>
                    <el-tag v-else type="info">
                        否
                    </el-tag>
                </template>
                <template #add_time="{ scopes }">
                    {{ formatTime(scopes.row.add_time) }}
                </template>
                <template #reply_time="{ scopes }">
                    {{ scopes.row.reply_time ? formatTime(scopes.row.reply_time) : '-' }}
                </template>
            </CoTable>

            <CoDialog v-model:visible="defData.visible" :loading="defData.btnLoading" auto-height hidden title="新增留言"
                width="680px" @close="onClose" @cancel="onClose" @confirm="onClick">
                <el-form ref="formRef" label-width="130px" :rules="rules" :model="form" style="max-width: 500px">
                    <el-form-item label="留言类型：" prop="type">
                        <el-select v-model="form.type" placeholder="请选择">
                            <el-option v-for="item in defData.typeList" :key="item.value" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="content" label="留言：">
                        <el-input v-model="form.content" placeholder="请输入留言" />
                    </el-form-item>
                </el-form>
            </CoDialog>
        </el-skeleton>
    </LayoutUser>
</template>

<style scoped></style>
