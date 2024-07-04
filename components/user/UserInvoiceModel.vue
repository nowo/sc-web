<!-- 新增、修改发票 -->
<template>
    <!-- auto-height -->
    <CoDialog v-model:visible="defData.visible" :loading="defData.btnLoading" auto-height hidden :title="comData.title"
        width="680px" @close="onClose" @cancel="onClose" @confirm="onConfirm">
        <el-form ref="formRef" :model="form.data" :label-width="130" :rules="rules">
            <el-row>
                <el-col :xs="24" :sm="16" :md="16" :lg="16" :xl="16">
                    <el-form-item prop="enterprise_name" label="企业名称：">
                        <el-input v-model="form.data.enterprise_name" placeholder="请输入企业名称" maxlength="40" clearable />
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="16" :md="16" :lg="16" :xl="16">
                    <el-form-item prop="enterprise_email" label="企业邮箱：">
                        <el-input v-model="form.data.enterprise_email" type="email" placeholder="请输入企业邮箱" maxlength="40"
                            clearable />
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <el-form-item prop="type" label="发票类型：">
                        <el-radio-group v-model="form.data.type">
                            <el-radio :label="1" border>
                                增值税专用发票
                            </el-radio>
                            <el-radio :label="2" border>
                                普通发票
                            </el-radio>
                            <el-radio :label="3" border>
                                电子普通发票
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="16" :md="16" :lg="16" :xl="16">
                    <el-form-item prop="tax_no" label="纳税人识别号：">
                        <el-input v-model="form.data.tax_no" placeholder="请输入纳税人识别号" clearable />
                    </el-form-item>
                </el-col>
                <template v-if="form.data.type === 1">
                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                        <el-form-item prop="logon_tel" label="注册电话：">
                            <el-input v-model="form.data.logon_tel" placeholder="请输入注册电话" maxlength="20" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="22" :md="22" :lg="22" :xl="22">
                        <el-form-item prop="logon_addr" label="注册地址：">
                            <el-input v-model="form.data.logon_addr" placeholder="请输入注册地址" maxlength="100" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="22" :md="22" :lg="22" :xl="22">
                        <el-form-item prop="bank" label="开户银行：">
                            <el-input v-model="form.data.bank" placeholder="请输入开户银行" maxlength="20" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="22" :md="22" :lg="22" :xl="22">
                        <el-form-item prop="bank_account" label="开户账号：">
                            <el-input v-model="form.data.bank_account" placeholder="请输入开户账号" maxlength="20" clearable />
                        </el-form-item>
                    </el-col>
                </template>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <el-form-item v-if="defData.type === 2" prop="is_default" label="设为默认：">
                        <el-radio-group v-model="form.data.is_default">
                            <el-radio :label="0">
                                否
                            </el-radio>
                            <el-radio :label="1">
                                是
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </CoDialog>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'

import { UserInvoiceApi } from '~/api/user/invoice'

const emits = defineEmits<{
    (event: 'update', params: UserInvoiceApi_Edit): void
}>()
const formRef = ref<FormInstance>()

const defData = reactive({
    visible: false, // 是否显示窗口，默认为false。
    ready: false, // 内容是否加载完成
    btnLoading: false,
    type: 1, // 1：新增，2：修改

})

// 表单数据
const form = reactive({
    data: {
        enterprise_name: '', // 企业名称
        type: '' as '' | 1 | 2 | 3, // 类型1：增值税专用发票 2：普通发票 3：电子普通发票
        enterprise_email: '', // 企业邮箱
        tax_no: '', // 纳税人识别号
        logon_tel: '', // 注册电话
        logon_addr: '', // 注册地址
        bank: '', // 开户银行
        bank_account: '', // 开户账号
        is_default: 0, //
        bill_header_id: '' as '' | number,
    },
})

const comData = computed(() => {
    let dat = {
        title: '新增发票抬头',
    }
    if (defData.type === 2) {
        dat = {
            title: '修改发票抬头',
        }
    }
    return dat
})

const rules = reactive<FormRules>({
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

// 打开弹窗
const onOpenDialog = (row?: UserInvoiceApi_getListResponse) => {
    if (row) { // 修改
        defData.type = 2
        form.data.bill_header_id = row.bill_header_id
        form.data.enterprise_name = row.enterprise_name
        form.data.enterprise_email = row.enterprise_email
        form.data.type = row.type
        form.data.tax_no = row.tax_no
        form.data.logon_tel = row.logon_tel
        form.data.logon_addr = row.logon_addr
        form.data.bank_account = row.bank_account
        form.data.bank = row.bank
        form.data.is_default = row.is_default
    } else {
        defData.type = 1
        form.data.enterprise_name = ''
        form.data.enterprise_email = ''
        form.data.type = ''
        form.data.tax_no = ''
        form.data.logon_tel = ''
        form.data.logon_addr = ''
        form.data.bank_account = ''
    }

    defData.visible = true
}

// 关闭弹窗
const onClose = () => {
    defData.visible = false
    formRef.value?.resetFields()
}

// 确认
const onConfirm = async () => {
    const isRun = await useFormVerify(formRef.value)
    if (!isRun) return false

    const params: UserInvoiceApi_Add = {
        enterprise_name: form.data.enterprise_name.trim(),
        enterprise_email: form.data.enterprise_email.trim(),
        type: form.data.type as 1 | 2 | 3,
        tax_no: form.data.tax_no.trim(),
        logon_tel: form.data.logon_tel,
        logon_addr: form.data.logon_addr.trim(),
        bank: form.data.bank.trim(),
        bank_account: form.data.bank_account.trim(),
    }
    if (defData.type === 1) { // 新增
        defData.btnLoading = true
        const { data: res } = await UserInvoiceApi.add(params)
        // console.log(res)
        defData.btnLoading = false
        if (res.value?.code === 200) {
            ElMessage.success('添加成功')
            emits('update', {
                ...params,
                bill_header_id: res.value?.data?.bill_header_id || Date.now(),
                is_default: 0,
            })
            onClose()
        } else {
            ElMessage.error(res.value?.msg)
        }
    } else if (defData.type === 2) { // 修改
        const edit: UserInvoiceApi_Edit = {
            ...params,
            is_default: form.data.is_default as 0 | 1,
            bill_header_id: Number(form.data.bill_header_id),
        }
        defData.btnLoading = true
        const { data } = await UserInvoiceApi.edit(edit)
        defData.btnLoading = false
        if (data.value?.code === 200) {
            ElMessage.success('修改成功')
            emits('update', edit)
            onClose()
        } else {
            ElMessage.error(data.value?.msg)
        }
    }
}

defineExpose({
    onOpenDialog,
})
</script>

<style lang="scss" scoped></style>
