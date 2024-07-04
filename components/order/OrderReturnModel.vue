<!-- 新增、修改退货 -->
<template>
    <CoDialog v-model:visible="defData.visible" :loading="defData.btnLoading" auto-height hidden :title="comData.title"
        width="800px" @close="onClose" @cancel="onClose" @confirm="onConfirm">
        <el-form ref="formRef" :model="form.data" :label-width="100" :rules="rules">
            <el-row>
                <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                    <el-form-item prop="order_no" label="订单编号:">
                        <b>{{ form.data.order_no }}</b>
                    </el-form-item>
                </el-col>
                <el-table :data="defData.tableData" class="return-table mb15px" border
                    @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="50" align="center" />
                    <el-table-column label="商品信息" min-width="160" property="goods_name">
                        <template #default="{ row }">
                            <div class="flex items-center">
                                <CoImage class="h50px w50px" :src="row.goods_img" />
                                <div class="flex-1 pl8px">
                                    <NuxtLink :to="`/goods/${row.goods_sn}`" target="_blank" class="goods-name">
                                        {{ row.goods_name }}
                                    </NuxtLink>
                                    <div class="text-12px">
                                        <span class="mr8px">价格：￥{{ row.meet_price }}</span>
                                        <span>数量：{{ row.goods_number }}</span>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="退换数量" width="150" property="return_number" align="center">
                        <template #default="{ row }">
                            <el-input-number v-model="row.return_number" :min="1" :max="row.goods_number" class="w100%!" />
                        </template>
                    </el-table-column>
                    <el-table-column label="商品总金额" width="150" property="total" align="center">
                        <template #default="{ row }">
                            {{ formatNumber(row.return_number * row.meet_price) }}
                        </template>
                    </el-table-column>
                </el-table>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <el-form-item prop="type" label="类型:">
                        <el-radio-group v-model="form.data.type">
                            <el-radio :label="1">
                                退货/退款
                            </el-radio>
                            <el-radio :label="2">
                                换货
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="22" :md="22" :lg="22" :xl="22">
                    <el-form-item prop="reason_id" label="退换理由：">
                        <el-select v-model="form.data.reason_id">
                            <el-option v-for="item in defData.reasonList" :key="item.id" :label="item.reason_name"
                                :value="item.id" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="22" :md="22" :lg="22" :xl="22">
                    <el-form-item prop="describe" label="问题描述:">
                        <el-input v-model="form.data.describe" type="textarea" resize="none" :rows="3" maxlength="80"
                            clearable show-word-limit />
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="22" :md="22" :lg="22" :xl="22">
                    <el-form-item prop="img" label="图片:">
                        <CoUpload v-model="form.data.img" />
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </CoDialog>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import { OrderReturnApi } from '~/api/goods/order'
import { orderReasonState } from '~/composables/state/reason'

const emits = defineEmits<{
    // (event: 'update'): void
    'update': []
}>()
const formRef = ref<FormInstance>()

const orderReason = orderReasonState()

// 初始化 原因
const getReason = async () => {
    const reasonList = await orderReason.getReasonInfo()
    defData.reasonList = reasonList.value
}

const defData = reactive({
    visible: false, // 是否显示窗口，默认为false。
    ready: false, // 内容是否加载完成
    type: 1, // 1：新增，2：修改
    btnLoading: false,
    reasonList: [] as OrderReturnApi_reasonResponse['lists'],
    tableData: [] as OrderReturnApi_GetListResponse[],
    multipleSelect: [] as OrderReturnApi_GetListResponse[], //

})

// 表单数据
const form = reactive({
    data: {
        id: 0, // 地址id
        type: '' as '' | 1 | 2, // 类型 1退货 2换货
        describe: '', // 描述
        img: '', // 图片地址
        order_no: '', // 订单编号
        reason_id: '', // 退换货理由
    },

})
const rules = reactive<FormRules>({
    name: [
        { required: true, whitespace: true, message: '必填项不能为空', trigger: 'blur' },
    ],
    type: [
        { required: true, message: '请选择退换类型', trigger: 'blur' },
    ],
    describe: [
        { required: true, whitespace: true, message: '请输入问题描述', trigger: 'blur' },
    ],
    img: [
        // { required: true, message: '必填项不能为空', trigger: 'blur' },
    ],
})

const comData = computed(() => {
    let dat = {
        title: '新增退换货',
    }
    if (defData.type === 2) {
        dat = {
            title: '退换货信息',
        }
    }
    return dat
})

const initTableData = async () => {
    const main_order_no = form.data.order_no
    if (!main_order_no) return ElMessage.error('请先输入订单编号')
    const { data: res } = await OrderReturnApi.getList({ main_order_no })

    if (res.value?.code !== 200) return ElMessage.error(res.value?.msg)

    defData.tableData = res.value.data.map((item) => {
        return {
            ...item,
            return_number: item.goods_number,
        }
    })
}

// table多选
const handleSelectionChange = (val: OrderReturnApi_GetListResponse[]) => {
    defData.multipleSelect = val
}

// 打开弹窗
const onOpenDialog = async (params: OrderReturnOpen) => {
    defData.type = 1
    form.data.order_no = params.order_no.trim() ?? '' // 订单编号不能为空或重复的情况
    if (!form.data.order_no) return
    await initTableData()
    // await initDefaultData()
    getReason()
    defData.visible = true
}
// 关闭弹窗
const onClose = () => {
    defData.visible = false
    formRef.value?.resetFields()
}

// 确认
const onConfirm = async () => {
    if (!defData.multipleSelect.length) return ElMessage.error('请先选择需要退换的商品')

    const isRun = await useFormVerify(formRef.value)
    if (!isRun) return false

    // [{"id":1,"goods_id":1,"goods_number":2,'main_order_no':M20230412102104894540,"order_no": "C20230412102104404443"}]
    const goodsArr = defData.multipleSelect.map((item) => {
        return {
            id: item.id,
            goods_id: item.goods_id,
            goods_number: item.return_number,
            main_order_no: item.main_order_no,
            order_no: item.order_no,
        }
    })

    const params: OrderReturnApi_Add = {
        goods_info: JSON.stringify(goodsArr),
        type: form.data.type as 1 | 2,
        describe: form.data.describe?.trim() ?? '',
        main_order_no: form.data.order_no,
        img_url: form.data.img,
        reason_id: Number(form.data.reason_id),
    }

    defData.btnLoading = true
    const { data, error } = await OrderReturnApi.add(params)
    defData.btnLoading = false
    if (error.value) return
    // console.log('data :>> ', data)
    if (data.value?.code === 200) {
        ElMessage.success('添加成功')
        emits('update') // 更新列表
        onClose()
    } else {
        ElMessage.error(data.value?.msg)
    }
}

defineExpose({
    onOpenDialog,
})
</script>

<style lang="scss" scoped>
.return-table {
    .goods-name {
        font-weight: bold;

        &:hover {
            color: var(--el-color-primary);
        }
    }
}
</style>
