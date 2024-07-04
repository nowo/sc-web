<script setup lang="ts">
import { ArrowRight } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { AccountApi } from '~/api/user/account'

const formRef = ref<FormInstance>()
const form = reactive({
    user_name: '',
    phone: '',
    email: '',
    headimgurl: '',
    confirm_password: '',
    password: '',
})

// 规则
const rules = reactive<FormRules>({
    password: [
        { required: true, whitespace: true, message: '必填项不能为空', trigger: 'blur' },
        { pattern: /^[^\u4E00-\u9FA5 ]{6,16}$/, message: '不含有中文和空格,至少6位,最多16位', trigger: 'blur' },
    ],
    confirm_password: [
        { required: true, whitespace: true, message: '必填项不能为空', trigger: 'blur' },
        { pattern: /^[^\u4E00-\u9FA5 ]{6,16}$/, message: '不含有中文和空格,至少6位,最多16位', trigger: 'blur' },
    ],
})

// 修改密码
const editPwd = async () => {
    const isVerify = await useFormVerify(formRef.value)
    if (!isVerify) return
    if (form.confirm_password !== form.password) return ElMessage.error('密码不一致')

    const data: AccountApi_editPwd = {
        password: form.password,
        confirm_password: form.confirm_password,
    }
    const { data: res } = await AccountApi.editPwd(data)
    if (res.value?.code !== 200) return ElMessage.error(res.value?.msg)
    ElMessage.success('修改成功')
    return navigateTo('/user/Account')
}

definePageMeta({
    layout: 'home',
    middleware: 'auth',
})
</script>

<template>
    <LayoutUser>
        <div h40px>
            <el-breadcrumb :separator-icon="ArrowRight">
                <el-breadcrumb-item>
                    账户管理
                </el-breadcrumb-item>
                <el-breadcrumb-item>账户资料</el-breadcrumb-item>
                <el-breadcrumb-item>修改密码</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-form ref="formRef" label-width="130px" :rules="rules" :model="form" style="max-width: 500px">
            <el-row>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <el-form-item prop="password" label="新密码">
                        <el-input v-model="form.password" placeholder="请输入新密码" show-password />
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <el-form-item prop="confirm_password" label="确认密码">
                        <el-input v-model="form.confirm_password" placeholder="请输入新密码" show-password />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                <el-form-item>
                    <el-button @click="editPwd">
                        确定
                    </el-button>
                    <el-button>
                        <NuxtLink to="/user/Account">
                            返回
                        </NuxtLink>
                    </el-button>
                </el-form-item>
            </el-col>
        </el-form>
    </LayoutUser>
</template>

<style scoped></style>
