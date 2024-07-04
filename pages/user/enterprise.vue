<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { EnterpriseApi } from '~/api/user/enterprise'

const formRef = ref<FormInstance>()
const userState = useUserState()
const activeName = ref('first')
const testUrl = 'https://5b0988e595225.cdn.sohucs.com/images/20171111/d2d60e489c3e4517ac2780c0058a7ef0.jpeg'
const defData = reactive({
    download: {
        label: '下载',
        name: '企业客户账号申请表模板',
        url: '/certification.docx',
    },
    user_id: 0,
    attest_status: 0,
    enterprise_name: '',
    visible: false,
    skeleton: true,
})

const userStatus = async () => {
    const user = await userState.getUserInfo()
    if (user.value) {
        defData.user_id = user.value.user_id
        defData.attest_status = user.value.attest_status
        defData.enterprise_name = user.value.enterprise_name
    } else {
        return ElMessage.error('请先登录')
    }
    await wait(10)
    defData.skeleton = false
}
userStatus()

// 表单数据
const form = reactive({
    enterprise_name: '',
    enterprise_code: '',
    enterprise_account: '',
    enterprise_contacts: '',
    contacts_post: '',
    contacts_phone: '',
    contacts_email: '',
    enterprise_industry: '',
    enterprise_capital: 0,
    enterprise_address: '',
    enterprise_remark: '',
    enterprise_file: '',
    failed_remark: '',
})
const rules = reactive<FormRules>({
    enterprise_name: [
        { required: true, whitespace: true, message: '必填项不能为空', trigger: 'blur' },
    ],
    enterprise_code: [
        { required: true, message: '必填项不能为空', trigger: 'blur' },
    ],
    enterprise_account: [
        { required: true, message: '必填项不能为空', trigger: 'blur' },
    ],
    enterprise_contacts: [
        { required: true, message: '必填项不能为空', trigger: 'blur' },
    ],
    contacts_phone: [
        { required: true, whitespace: true, message: '必填项不能为空', trigger: 'blur' },
        { required: true, pattern: /^1(3\d|4[014-9]|5[0-35-9]|6[2567]|7[0-8]|8\d|9[0-35-9])\d{8}$/, message: '请输入正确的手机号码', trigger: 'blur' },
    ],
    enterprise_address: [
        { required: true, message: '必填项不能为空', trigger: 'blur' },
    ],
    enterprise_industry: [
        { required: true, message: '必填项不能为空', trigger: 'blur' },
    ],
    enterprise_file: [
        { required: true, message: '必填项不能为空', trigger: 'blur' },
    ],

})

// 确定
const onSubmit = async () => {
    const isVerify = await useFormVerify(formRef.value)
    if (!isVerify) return
    // if (!isRun) return ElMessage.error('请填写完整')
    const data: EnterpriseApi_attest = {
        enterprise_name: form.enterprise_name,
        enterprise_code: form.enterprise_code,
        enterprise_account: form.enterprise_account,
        enterprise_contacts: form.enterprise_contacts,
        contacts_post: form.contacts_post,
        contacts_phone: form.contacts_phone,
        contacts_email: form.contacts_email,
        enterprise_industry: form.enterprise_industry,
        enterprise_capital: Number(form.enterprise_capital),
        enterprise_address: form.enterprise_address,
        enterprise_remark: form.enterprise_remark,
        enterprise_file: form.enterprise_file,
        user_id: Number(defData.user_id),
    }
    const { data: res } = await EnterpriseApi.attest(data)
    if (res.value?.code !== 200) return ElMessage.error(res.value?.msg)
    ElMessage.success('提交成功')
    defData.visible = false
    userStatus()
}

//  打开弹窗
const onOpenDialog = async () => {
    const { data: res } = await EnterpriseApi.info({ user_id: defData.user_id })
    if (res.value?.data) {
        form.enterprise_name = res.value?.data.enterprise_name
        form.enterprise_code = res.value?.data.enterprise_code
        form.enterprise_account = res.value?.data.enterprise_account
        form.enterprise_contacts = res.value?.data.enterprise_contacts
        form.contacts_post = res.value?.data.contacts_post
        form.contacts_phone = res.value?.data.contacts_phone
        form.contacts_email = res.value?.data.contacts_email
        form.enterprise_industry = res.value?.data.enterprise_industry
        form.enterprise_capital = res.value?.data.enterprise_capital
        form.enterprise_address = res.value?.data.enterprise_address
        form.enterprise_remark = res.value?.data.enterprise_remark
        form.enterprise_file = res.value?.data.enterprise_file
        form.failed_remark = res.value?.data.failed_remark
    }
    defData.visible = true
}

definePageMeta({
    layout: 'home',
    middleware: 'auth',
})
</script>

<template>
    <!-- <ClientOnly> -->
    <LayoutUser>
        <el-skeleton :loading="defData.skeleton" animated>
            <div h40px>
                <el-breadcrumb>
                    <el-breadcrumb-item>
                        企业管理
                    </el-breadcrumb-item>
                    <el-breadcrumb-item>企业用户</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <div v-if="CLIENT">
                <div style="margin-bottom: 20px; color: var(--el-color-primary);">
                    认证状态：
                    <span v-if="defData.attest_status === 0">
                        未认证
                    </span>
                    <span v-else-if="defData.attest_status === 1">
                        已认证，（{{ defData.enterprise_name }}）
                    </span>
                    <span v-else-if="defData.attest_status === 2">
                        正在审核中...
                    </span>
                    <span v-else>
                        未通过，请重新提交认证
                    </span>
                </div>
                <el-button v-if="defData.attest_status === 0 || defData.attest_status === 3" mb13px type="danger"
                    @click="onOpenDialog">
                    成为企业用户
                </el-button>
                <el-image class="h490px w900px" :src="testUrl" />

                <lazy-el-dialog v-model="defData.visible" title="成为企业用户" :draggable="true" width="600px"
                    style="text-align: center;">
                    <el-form ref="formRef" :model="form" :rules="rules" label-width="140px">
                        <el-tabs v-model="activeName" class="demo-tabs">
                            <el-tab-pane label="上传" name="first">
                                <el-form-item v-if="defData.attest_status === 3" label="未通过原因：">
                                    <div style="color: var(--el-color-primary);">
                                        {{ form.failed_remark }}
                                    </div>
                                </el-form-item>
                                <el-form-item label="模板下载：" prop="download">
                                    <a :href="defData.download.url" :download="defData.download.name">{{
                                        defData.download.label
                                    }}</a>
                                    <span style="color: var(--el-color-primary);"> (请下载模板打印，盖章后拍照上传认证图片)</span>
                                </el-form-item>
                                <el-form-item prop="enterprise_file" label="认证图片：">
                                    <CoUpload v-model="form.enterprise_file" />
                                </el-form-item>
                            </el-tab-pane>
                            <el-tab-pane label="企业认证" name="second">
                                <el-form-item prop="enterprise_name" label="企业名称：">
                                    <el-input v-model="form.enterprise_name" clearable />
                                </el-form-item>
                                <el-form-item prop="enterprise_code" label="企业信用代码：">
                                    <el-input v-model="form.enterprise_code" clearable />
                                </el-form-item>
                                <el-form-item prop="enterprise_account" label="企业账号：">
                                    <el-input v-model="form.enterprise_account" clearable />
                                </el-form-item>
                                <el-form-item prop="enterprise_contacts" label="企业联系人：">
                                    <el-input v-model="form.enterprise_contacts" clearable />
                                </el-form-item>
                                <el-form-item prop="contacts_post" label="联系人职务：">
                                    <el-input v-model="form.contacts_post" clearable />
                                </el-form-item>
                                <el-form-item prop="contacts_phone" label="联系人电话：">
                                    <el-input v-model="form.contacts_phone" clearable />
                                </el-form-item>
                                <el-form-item prop="contacts_email" label="联系人邮箱：">
                                    <el-input v-model="form.contacts_email" clearable />
                                </el-form-item>
                                <el-form-item prop="enterprise_industry" label="所属行业：">
                                    <el-input v-model="form.enterprise_industry" />
                                </el-form-item>
                                <el-form-item prop="enterprise_capital" label="注册资金：">
                                    <el-input-number v-model="form.enterprise_capital" :min="0" :max="10 ** 14"
                                        :precision="0" /><span class="ml5px">万</span>
                                </el-form-item>
                                <el-form-item prop="enterprise_address" label="企业地址：">
                                    <el-input v-model="form.enterprise_address" clearable />
                                </el-form-item>
                                <el-form-item prop="enterprise_remark" label="企业备注：">
                                    <el-input v-model="form.enterprise_remark" clearable />
                                </el-form-item>
                            </el-tab-pane>
                        </el-tabs>
                    </el-form>
                    <template #footer>
                        <span class="dialog-footer">
                            <el-button @click="defData.visible = false">取消</el-button>
                            <el-button @click="onSubmit">
                                提交
                            </el-button>
                        </span>
                    </template>
                </lazy-el-dialog>
            </div>
        </el-skeleton>
    </LayoutUser>
    <!-- </ClientOnly> -->
</template>

<style scoped>
.el-input {
    width: 300px
}
</style>
