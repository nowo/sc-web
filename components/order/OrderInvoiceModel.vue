<!-- 新增、修改退货 -->
<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import { UserInvoiceApi } from '~/api/user/invoice'
import { UserAddressApi } from '~/api/user/address'
import { OrderInvoiceApi } from '~/api/goods/order'

const emits = defineEmits<{
    // (event: 'update'): void
    update: []
}>()
const formRef = ref<FormInstance>()
const billInfo = ref<OrderInvoiceApi_GetListItem>()

const defData = reactive({
    visible: false, // 是否显示窗口，默认为false。
    ready: false, // 内容是否加载完成
    type: 1, // 1：新增，2：修改 3 查看
    btnLoading: false,

    activeName: '1',
    invoiceList: [] as UserInvoiceApi_getListResponse[], // 所有发票列表
    addressList: [] as UserAddressApi_GetListResponse[], // 用户地址列表
    operateList: { //     审核状态 0未审核 1审核通过 2审核不通过 3已邮寄 4已电子邮寄 5已完成
        0: '未审核',
        1: '审核通过',
        2: '审核不通过',
        3: '已邮寄',
        4: '已电子邮寄',
        5: '已完成',
    },

})

// 表单数据
const form = reactive({
    data: {
        order_no: '', // 订单编号
        bill_id: 0, // id

        invoice_id: '' as '' | number, // 选择的发票id
        address_id: '' as '' | number, // 收票地址id

        type: '' as '' | 1 | 2 | 3, // 类型 1：增值税专用发票，2：普通发票， 3：电子普通发票
        enterprise_name: '', // 企业名称
        enterprise_email: '', // 企业邮箱 123456@qq.com
        tax_no: '', // 纳税人识别号（普票可填，增票必填）
        logon_addr: '', // 注册地址（增票必填）深圳市光明区云智科技园18楼
        logon_tel: '', // 注册电话（增票必填）    0755 - 1234567
        bank: '', // 开户银行（增票必填）    工商银行
        bank_account: '', // 开户账户（增票必填）    888877779999
    },

})
const rules = reactive<FormRules>({
    name: [
        { required: true, whitespace: true, message: '必填项不能为空', trigger: 'blur' },
    ],
    address_id: [
        { required: true, message: '请选择收货地址', trigger: 'blur' },
    ],
    describe: [
        { required: true, whitespace: true, message: '请输入问题描述', trigger: 'blur' },
    ],
    invoice_id: [
        { required: true, message: '请选择发票', trigger: 'blur' },
    ],
    enterprise_name: [
        { required: true, whitespace: true, message: '必填项不能为空', trigger: 'blur' },
    ],
    enterprise_email: [
        { required: true, whitespace: true, type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' },
    ],
    type: [
        { required: true, message: '必填项不能为空', trigger: 'blur' },
    ],
    tax_no: [
        { required: true, whitespace: true, message: '必填项不能为空', trigger: 'blur' },
        { min: 15, max: 20, message: '长度在15~20个字符' },
    ],
    logon_tel: [
        { required: true, whitespace: true, message: '必填项不能为空', trigger: 'blur' },
        // { required: true, pattern: /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/, message: '请输入正确的手机号码', trigger: 'blur' },
        // { required: true, pattern: /^(((\d{3,4}-)?[0-9]{7,8})|(1(3|4|5|6|7|8|9)\d{9}))$/, message: '填写正确的手机号格式', trigger: 'blur' },
    ],
    logon_addr: [
        { required: true, whitespace: true, message: '必填项不能为空', trigger: 'blur' },
    ],
    bank: [
        { required: true, whitespace: true, message: '必填项不能为空', trigger: 'blur' },
    ],
    bank_account: [
        { required: true, whitespace: true, message: '必填项不能为空', trigger: 'blur' },
    ],
})

const comData = computed(() => {
    const dat = {
        title: '新增发票申请',
    }
    if (defData.type === 2) {
        dat.title = '修改发票信息'
    }
    if (defData.type === 3) {
        dat.title = '查看发票信息'
    }
    return dat
})

// 增值税发票
const invoiceData = computed(() => {
    const obj: Record<1 | 2 | 3, UserInvoiceApi_getListResponse[]> = {
        1: [],
        2: [],
        3: [],
    }
    defData.invoiceList.forEach((item) => {
        if (!obj[item.type]) {
            obj[item.type] = []
        }
        obj[item.type].push(item)
    })

    return obj
})

// 收票地址
const fullAddress = computed(() => {
    if (!billInfo.value) return ''
    const { province, city, area, address } = billInfo.value.bill_address
    return province + city + area + address
})

// 获取初始信息
const initDefaultData = async () => {
    if (defData.ready) return false

    // 获取发票抬头列表、地址
    const [res1, res2] = await Promise.all([
        UserInvoiceApi.getList(),
        UserAddressApi.getList(),
    ])

    if (res1 && res1.data.value?.code === 200) {
        const data = res1.data.value?.data
        defData.invoiceList = data || []
    }

    if (res2 && res2.data.value?.code === 200) {
        const data = res2.data.value?.data
        defData.addressList = data || []
    }

    defData.ready = true
}

// 地址信息拼接
const setAddressText = (row: UserAddressApi_GetListResponse) => {
    return setArrayTextName([row.province, row.city, row.area, row.address], '  ')
}

type OpenDialogParams = {
    order_no: string
} | OrderInvoiceApi_GetListItem

// 打开弹窗
const onOpenDialog = async (params: OpenDialogParams, type: 1 | 2 | 3) => {
    form.data.order_no = params.order_no || ''
    defData.type = type

    initDefaultData()
    if (type === 1) { // 新增
        // initDefaultData()
    } else if (type === 2 || type === 3) { // 修改
        const dat = params as OrderInvoiceApi_GetListItem
        billInfo.value = dat

        form.data.bill_id = dat.bill_id
        // form.data.invoice_id = dat.invoice_id
        form.data.address_id = dat.address_id
        form.data.type = dat.type

        form.data.enterprise_name = dat.enterprise_name
        form.data.enterprise_email = dat.enterprise_email
        form.data.tax_no = dat.tax_no
        form.data.logon_addr = dat.logon_addr
        form.data.logon_tel = dat.logon_tel
        form.data.bank = dat.bank
        form.data.bank_account = dat.bank_account
    }

    defData.visible = true
}
// 关闭弹窗
const onClose = () => {
    defData.visible = false
    formRef.value?.resetFields()

    form.data = {
        order_no: '', // 订单编号
        bill_id: 0, // id

        invoice_id: '', // 选择的发票id
        address_id: '', // 收票地址id

        type: '', // 类型 1：增值税专用发票，2：普通发票， 3：电子普通发票
        enterprise_name: '', // 企业名称
        enterprise_email: '', // 企业邮箱 123456@qq.com
        tax_no: '', // 纳税人识别号（普票可填，增票必填）
        logon_addr: '', // 注册地址（增票必填）深圳市光明区云智科技园18楼
        logon_tel: '', // 注册电话（增票必填）    0755 - 1234567
        bank: '', // 开户银行（增票必填）    工商银行
        bank_account: '', // 开户账户（增票必填）    888877779999
    }
}

// 确认
const onConfirm = async () => {
    // if (!defData.multipleSelect.length) return ElMessage.warning('请先选择需要退换的商品')

    const isRun = await useFormVerify(formRef.value)
    if (!isRun) return false

    const params: OrderInvoiceApi_Add = {
        order_no: form.data.order_no,
        address_id: form.data.address_id as number,
        type: form.data.type as number,
        enterprise_name: form.data.enterprise_name?.trim() ?? '',
        enterprise_email: form.data.enterprise_email?.trim() ?? '',
        tax_no: form.data.tax_no?.trim() ?? '',
    }

    if (defData.type === 1) { // 新增
        const node = defData.invoiceList.find(item => item.bill_header_id === form.data.invoice_id)
        if (!node) return

        if (node.type === 1) {
            params.type = node.type
            params.enterprise_name = node.enterprise_name
            params.enterprise_email = node.enterprise_email
            params.tax_no = node.tax_no
            params.logon_addr = node.logon_addr
            params.logon_tel = node.logon_tel
            params.bank = node.bank
            params.bank_account = node.bank_account
        }

        defData.btnLoading = true
        const { data, error } = await OrderInvoiceApi.add(params)
        defData.btnLoading = false
        if (error.value) return
        // console.log('data :>> ', data)
        if (data.value?.code !== 200) return ElMessage.error(data.value?.msg)

        ElMessage.success('提交成功')
        emits('update') // 更新列表
    } else if (defData.type === 2) { // 修改
        if (params.type === 1) {
            params.logon_addr = form.data.logon_addr?.trim() ?? ''
            params.logon_tel = form.data.logon_tel?.trim() ?? ''
            params.bank = form.data.bank?.trim() ?? ''
            params.bank_account = form.data.bank_account?.trim() ?? ''
        }
        const edit: OrderInvoiceApi_Edit = {
            ...params,
            bill_id: form.data.bill_id,
        }

        defData.btnLoading = true
        const { data, error } = await OrderInvoiceApi.edit(edit)
        defData.btnLoading = false
        if (error.value) return
        // console.log('data :>> ', data)
        if (data.value?.code !== 200) return ElMessage.error(data.value?.msg)

        ElMessage.success('修改成功')
        emits('update') // 更新列表
    }

    onClose()
}

defineExpose({
    onOpenDialog,
})
</script>

<template>
    <CoDialog v-model:visible="defData.visible" :loading="defData.btnLoading" auto-height hidden :title="comData.title"
        width="800px" @close="onClose" @cancel="onClose" @confirm="onConfirm">
        <el-form ref="formRef" :model="form.data" :label-width="112" :rules="rules" class="form-box"
            :label-position="defData.type === 1 ? 'top' : 'right'">
            <el-row v-if="defData.type === 1">
                <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                    <!-- <el-form-item prop="order_no" label="订单编号:">
                        <b>{{ form.data.order_no }}</b>
                    </el-form-item> -->
                    <div class="mb15px">
                        订单编号: {{ form.data.order_no }}
                    </div>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <el-form-item prop="invoice_id" label="发票选择:" label-width="auto">
                        <el-radio-group v-model="form.data.invoice_id" class="w100%">
                            <el-tabs v-model="defData.activeName" class="invoice-tabs" tab-position="left">
                                <el-tab-pane v-for="(item, index) in invoiceData" :key="index" :label="INVOICE_DATA[index]"
                                    :name="index" lazy>
                                    <el-radio v-for="sub in item" :key="sub.bill_header_id" :label="sub.bill_header_id">
                                        <span>抬头：{{ sub.header }}</span>
                                        <span class="mx10px opacity90">email：{{ sub.enterprise_email }} </span>
                                        <!-- <em v-if="item.is_default" class="mx5px fw400 opacity70">默认地址</em> -->
                                    </el-radio>
                                </el-tab-pane>
                            </el-tabs>
                        </el-radio-group>
                    </el-form-item>
                </el-col>

                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <el-form-item prop="address_id" label="收票地址:">
                        <el-radio-group v-model="form.data.address_id" class="address-radio">
                            <el-radio v-for="item in defData.addressList" :key="item.address_id" :label="item.address_id">
                                <span>{{ setAddressText(item) }}</span>
                                <span class="mx5px opacity90">（{{ item.contacts }} 收）</span>
                                <span class="mx5px">{{ item.phone }}</span>
                                <em v-if="item.is_default" class="mx5px fw400 opacity70">默认地址</em>
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row v-else-if="defData.type === 2">
                <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                    <el-form-item prop="order_no" label="订单编号:">
                        <b>{{ form.data.order_no }}</b>
                    </el-form-item>
                </el-col>
                <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                    <el-form-item prop="order_no" label="申请时间:">
                        {{ billInfo?.add_time ? formatTime(billInfo?.add_time) : '--' }}
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="-mt10px">
                    <el-form-item label="操作状态:">
                        <el-tag type="success" size="large">
                            {{ defData.operateList[billInfo?.verify_status || 0] }}
                        </el-tag>
                        <div v-if="billInfo?.failed_remark" class="ml10px">
                            审核原因: {{ billInfo?.failed_remark }}
                        </div>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="16" :md="16" :lg="16" :xl="16">
                    <el-form-item prop="enterprise_name" label="企业名称:">
                        <el-input v-model="form.data.enterprise_name" placeholder="请输入企业名称" maxlength="40" clearable />
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="16" :md="16" :lg="16" :xl="16">
                    <el-form-item prop="enterprise_email" label="企业邮箱:">
                        <el-input v-model="form.data.enterprise_email" type="email" placeholder="请输入企业邮箱" maxlength="40"
                            clearable />
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <el-form-item prop="type" label="发票类型:">
                        <el-radio-group v-model="form.data.type">
                            <el-radio v-for="(item, index) in INVOICE_DATA" :key="index" :label="Number(index)" border>
                                {{ item }}
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="16" :md="16" :lg="16" :xl="16">
                    <el-form-item prop="tax_no" label="纳税人识别号:">
                        <el-input v-model="form.data.tax_no" placeholder="请输入纳税人识别号" clearable />
                    </el-form-item>
                </el-col>
                <template v-if="form.data.type === 1">
                    <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                        <el-form-item prop="logon_tel" label="注册电话:">
                            <el-input v-model="form.data.logon_tel" placeholder="请输入注册电话" maxlength="20" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                        <el-form-item prop="logon_addr" label="注册地址:">
                            <el-input v-model="form.data.logon_addr" placeholder="请输入注册地址" maxlength="100" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                        <el-form-item prop="bank" label="开户银行:">
                            <el-input v-model="form.data.bank" placeholder="请输入开户银行" maxlength="20" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                        <el-form-item prop="bank_account" label="开户账号:">
                            <el-input v-model="form.data.bank_account" placeholder="请输入开户账号" maxlength="20" clearable />
                        </el-form-item>
                    </el-col>
                </template>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <el-form-item prop="address_id" label="收票地址:">
                        <el-radio-group v-model="form.data.address_id" class="address-radio">
                            <el-radio v-for="item in defData.addressList" :key="item.address_id" :label="item.address_id">
                                <span>{{ setAddressText(item) }}</span>
                                <span class="mx5px opacity90">（{{ item.contacts }} 收）</span>
                                <span class="mx5px">{{ item.phone }}</span>
                                <em v-if="item.is_default" class="mx5px fw400 opacity70">默认地址</em>
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row v-else-if="defData.type === 3">
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <el-form-item label="操作状态:">
                        <el-tag type="success" size="large">
                            {{ defData.operateList[billInfo?.verify_status || 0] }}
                        </el-tag>
                        <div v-if="billInfo?.failed_remark && billInfo?.verify_status === 2" class="ml10px">
                            审核原因: {{ billInfo?.failed_remark }}
                        </div>
                    </el-form-item>
                    <el-descriptions title="" :column="2" border>
                        <el-descriptions-item label="订单编号:" label-class-name="lab-wid">
                            {{ billInfo?.order_no }}
                        </el-descriptions-item>
                        <!-- <el-descriptions-item label="审核状态:">
                            <el-tag v-if="billInfo?.verify_status === 1">审核通过</el-tag>
                            <el-tag v-else-if="billInfo?.verify_status === 2" type="info">审核不通过</el-tag>
                            <el-tag v-else type="" effect="plain">未审核</el-tag>
                        </el-descriptions-item>
                        <el-descriptions-item label="原因:">{{ billInfo?.failed_remark }}</el-descriptions-item> -->
                        <el-descriptions-item label="申请时间:">
                            {{ billInfo?.add_time ? formatTime(billInfo?.add_time) : '--' }}
                        </el-descriptions-item>
                        <!-- <el-descriptions-item label="审核时间:">
                            {{ billInfo?.check_time ? formatTime(billInfo?.check_time)
                                : '--'
                            }}
                        </el-descriptions-item>
                        <el-descriptions-item label="审核人员:">
                            {{ billInfo?.realname }}
                        </el-descriptions-item> -->
                        <el-descriptions-item label="联系人:" label-class-name="lab-wid">
                            {{ billInfo?.bill_address.contacts }}
                        </el-descriptions-item>
                        <el-descriptions-item label="联系方式:" label-class-name="lab-wid">
                            {{ billInfo?.bill_address.phone }}
                        </el-descriptions-item>
                        <el-descriptions-item label="收货地址:" :span="2">
                            {{ fullAddress }}
                        </el-descriptions-item>
                        <el-descriptions-item label="物流公司:" label-class-name="lab-wid">
                            {{ billInfo?.express_name }}
                        </el-descriptions-item>
                        <el-descriptions-item label="物流单号:" label-class-name="lab-wid">
                            {{ billInfo?.express_no }}
                        </el-descriptions-item>
                        <el-descriptions-item label="" :span="2">
                            <div class="pt10px">
                                <!--  -->
                            </div>
                        </el-descriptions-item>
                        <el-descriptions-item label="发票抬头:" label-class-name="lab-wid">
                            {{ billInfo?.header }}
                        </el-descriptions-item>
                        <el-descriptions-item label="电子邮箱:" label-class-name="lab-wid">
                            {{ billInfo?.enterprise_email }}
                        </el-descriptions-item>
                        <el-descriptions-item label="开票类型:">
                            <el-tag :type="billInfo?.type === 1 ? 'danger' : billInfo?.type === 2 ? 'success' : 'warning'">
                                {{ INVOICE_DATA[billInfo?.type as 1] }}
                            </el-tag>
                        </el-descriptions-item>
                        <el-descriptions-item label="纳税人识别号:">
                            {{ billInfo?.tax_no }}
                        </el-descriptions-item>
                        <template v-if="billInfo?.type === 1">
                            <el-descriptions-item label="注册电话:">
                                {{ billInfo?.logon_tel }}
                            </el-descriptions-item>
                            <el-descriptions-item label="注册地址:">
                                {{ billInfo?.logon_addr }}
                            </el-descriptions-item>
                            <el-descriptions-item label="开户银行:">
                                {{ billInfo?.bank }}
                            </el-descriptions-item>
                            <el-descriptions-item label="开户账号:">
                                {{ billInfo?.bank_account }}
                            </el-descriptions-item>
                        </template>
                    </el-descriptions>
                </el-col>
            </el-row>
        </el-form>
    </CoDialog>
</template>

<style lang="scss" scoped>
.invoice-tabs,
.address-radio {

    --el-tabs-header-height: 32px;
    width: 100%;

    :deep(.el-radio) {
        width: 100%;
        padding: 0 10px;
        border: 1px solid transparent;
        margin-right: 0;
        display: flex;

        &:hover {
            background-color: var(--el-color-primary-light-9);
        }

        &.is-checked {
            border-color: var(--el-color-primary);
        }
    }
}

.form-box {
    :deep(.el-textarea__inner) {
        max-height: 120px;
    }

    :deep(.el-descriptions__body) {
        .lab-wid {
            width: 120px;
        }
    }

}
</style>
