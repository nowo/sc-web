<script lang="ts" setup>
import { InterListApi } from '~/api/user/interList'

const props = defineProps<{
    type: 1 | 2
}>()

const defData = reactive({
    visible: false, // 是否显示窗口，默认为false。
    btnLoading: false,
    title: '',
    replyData: [] as InterListApi_getUserListChildren[],
})

type TableDataItem = InterListApi_getUserListResponse['lists'][0]
const tableData = reactive<BaseTableDataType<TableDataItem>>({
    data: [],
    tableHeader: [
        // { property: 'q_id', label: '', slot: true, type: 'expand' },
        { property: 'type', label: '类型', width: 90, slot: true, align: 'center' },
        { property: 'goods_name', label: '商品名称', minWidth: 130, slot: true },
        { property: 'content', label: '提问内容', minWidth: 150, slotHeader: true },
        { property: 'add_time', label: '时间', width: 160, slot: true },
        { property: 'operate', label: '操作', width: 75, align: 'center', slot: true, fixed: 'right' },
    ],
    pagination: {
        ...PAGINATION,
    },
})

const index = tableData.tableHeader.findIndex(item => item.property === 'q_id')
if (props.type === 1) {
    // if (index < 0) tableData.tableHeader.unshift({ property: 'q_id', label: '', width: 35, slot: true, type: 'expand' })
    if (index < 0) tableData.tableHeader.splice(index, 0, { property: 'q_id', label: '回复', width: 85, slot: true, align: 'center' })
} else {
    if (index >= 0) tableData.tableHeader.splice(index, 1)
}

// 初始化数据
const initTableData = async () => {
    const data: InterListApi_getUserList = {
        is_paging: 1,
        page: tableData.pagination.page,
        page_size: tableData.pagination.page_size,
        type: props.type as 1 | 2,
    }
    const { data: res } = await InterListApi.getUserList(data)
    await wait(200)
    if (res.value?.code !== 200) return ElMessage.error(res.value?.msg)

    tableData.data = res.value.data.lists
    tableData.pagination.total = res.value.data.total
}
initTableData()

const openView = (row: TableDataItem) => {
    defData.title = `${row.content}`
    defData.replyData = row.answer_lists

    defData.visible = true
}
const changeToStar = (str: string) => {
    const len1 = 1
    const len2 = 1
    const strLen = str.length
    str = `${str.slice(0, len1)}***${str.slice(strLen - len2)}`
    return str
}

// 删除
const onDelete = (row: TableDataItem) => {
    let txt = '确定要删除该条商品提问吗？'
    if (props.type === 2) txt = '确定要删除该条问题回答吗？'

    ElMessageBox.confirm(txt, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(async () => {
        const { data } = await InterListApi.delList({ question_id: row.question_id })
        if (data.value?.code !== 200) return ElMessage.error(data.value?.msg)
        initTableData()
        ElMessage.success('删除成功')
    }).catch(() => {
    })
}

// 分页跳转
const onHandleCurrentChange = () => {
    initTableData()
}

// 关闭弹窗
const onClose = () => {
    defData.visible = false
}

// 确认
const onConfirm = async () => {
    onClose()
}
</script>

<template>
    <div class="min-h300px">
        <CoTable v-model:page="tableData.pagination" v-model:table-header="tableData.tableHeader" :data="tableData.data"
            auto-height scrollbar-always-on @update:page="onHandleCurrentChange">
            <template #contentHeader>
                {{ props.type === 1 ? '提问' : '回答' }}
            </template>
            <template #q_id="{ scopes }">
                <el-button v-if="scopes.row.answer_lists?.length" type="warning" link size="small"
                    @click="openView(scopes.row)">
                    查看({{ scopes.row.answer_lists.length }})
                </el-button>
                <el-text v-else type="info" size="small">
                    暂无回复
                </el-text>
            </template>

            <template #goods_name="{ scopes }">
                <NuxtLink :to="`/goods/${scopes.row.goods_sn}`" class="hover:c-#d7231e" target="_blank">
                    {{ scopes.row.goods_name }}
                </NuxtLink>
            </template>
            <template #type="{ scopes }">
                我的{{ scopes.row.type === 1 ? '提问' : '回答' }}
            </template>
            <template #add_time="{ scopes }">
                {{ formatTime(scopes.row.add_time) }}
            </template>
            <template #operate="{ scopes }">
                <el-button type="primary" link size="small" @click="onDelete(scopes.row)">
                    删除
                </el-button>
            </template>
        </CoTable>
        <CoDialog v-model:visible="defData.visible" :loading="defData.btnLoading" auto-height hidden :title="defData.title"
            :draggable="defData.replyData.length > 10 ? false : true" width="680px" @close="onClose" @cancel="onClose"
            @confirm="onConfirm">
            <ul class="pr10px">
                <li v-for="item in defData.replyData" :key="item.question_id"
                    class="flex b-b-1px b-b-#eee b-b-dashed py5px">
                    <b class="w25px c-green">答:</b>
                    <div class="flex-1">
                        {{ item.content }}
                    </div>
                    <div class="w170px text-right">
                        <span class="text-12px font-100"> {{ changeToStar(item.user_name) }}
                            {{ formatTime(item.add_time) }}</span>
                    </div>
                </li>
            </ul>
        </CoDialog>
    </div>
</template>

<style lang="scss" scoped></style>
