<script setup lang="ts">
import QRCode from 'qrcode'
import { RecommendApi } from '~/api/user/recommend'

const defData = reactive({
    tableData: [] as RecommendApi_getListResponse[],
    shareCode: '', // 分享二维码
    shareLink: '', // 分享的链接地址
})

type TableDataItem = RecommendApi_getListResponse
const tableData = reactive<BaseTableDataType<TableDataItem>>({
    data: [],
    tableHeader: [
        { property: 'user_name', label: '分享成功用户', width: 160 },
        { property: 'run_info', label: '操作信息', minWidth: 160 },
        { property: 'add_time', label: '添加时间', width: 160 },
        // { property: 'operate', label: '操作', width: 100, align: 'center', slot: true, fixed: 'right' },
    ],
    pagination: {
        ...PAGINATION,
    },
})

const userState = useUserState()
const onShare = async () => {
    const user = await userState.getUserInfo()
    if (user.value) {
        defData.shareLink = `${location.origin}/login/register?id=${user.value.user_id}`
        if (!defData.shareCode) {
            defData.shareCode = await QRCode.toDataURL(defData.shareLink)
        }
    } else {
        ElMessage.error('请先登录')
    }
}
onShare()

// 复制链接地址或二维码
const onCopy = async () => {
    try {
        await navigator.clipboard.writeText(defData.shareLink)
        ElMessage.success('复制成功')
    } catch (err) {
        const e = document.createElement('textarea')
        document.body.appendChild(e)
        e.innerHTML = defData.shareLink
        e.select()
        if (document.execCommand('copy')) {
            document.execCommand('copy')
        }
        document.body.removeChild(e)
        ElMessage.success('复制成功')
    }
}

const initTableData = async () => {
    const { data: res } = await RecommendApi.geList()
    if (res.value?.code !== 200) return ElMessage.error(res.value?.msg)
    defData.tableData = res.value?.data
}
initTableData()

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
        <el-breadcrumb>
            <el-breadcrumb-item>
                账户管理
            </el-breadcrumb-item>
            <el-breadcrumb-item>推荐管理</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="mt25px w450px">
            <div style="font-weight: bold">
                推荐分享
            </div>
            <el-form class="mt20px" label-position="top">
                <el-form-item label="复制链接分享给好友，可获得工游豆">
                    <el-input v-model="defData.shareLink" class="pr12px w70%!" disabled />
                    <el-button type="primary" class="w30%" @click="onCopy()">
                        复制地址
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
        <div style="font-weight: bold">
            分享记录
        </div>
        <CoTable v-model:page="tableData.pagination" v-model:table-header="tableData.tableHeader" :data="tableData.data"
            auto-height scrollbar-always-on border @update:page="onHandleCurrentChange">
            <!-- <template #is_default="{ scopes }">
                <el-tag v-if="scopes.row.is_default" type="success" size="small">
                    是
                </el-tag>
                <el-tag v-else type="info" size="small">
                    否
                </el-tag>
            </template> -->
        </CoTable>
    </LayoutUser>
</template>

<style scoped></style>
