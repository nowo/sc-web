<template>
    <LayoutUser>
        <div h40px>
            <el-breadcrumb :separator-icon="ArrowRight">
                <el-breadcrumb-item>
                    账户管理
                </el-breadcrumb-item>
                <el-breadcrumb-item>账户资料</el-breadcrumb-item>
                <el-breadcrumb-item>修改手机号码</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-button>
            <NuxtLink to="/user/Account">
                返回
            </NuxtLink>
        </el-button>
        <div>
            <el-steps :space="200" :active="defData.step" style="margin: 50px 200px;">
                <el-step title="短信验证" />
                <el-step title="更换手机号" />
                <el-step title="完成" />
            </el-steps>
            <el-form v-if="defData.step === 1" ref="formRef" label-width="250px" :rules="rules" :model="form"
                style="max-width: 600px">
                <el-form-item prop="phone" label="手机号码：">
                    <el-input v-model="form.phone" placeholder="请输入当前手机号" />
                </el-form-item>
                <el-form-item prop="vali_code" label="验证码：">
                    <el-col :span="15">
                        <el-input v-model.trim="form.vali_code" type="text" maxlength="4" placeholder="请输入验证码" clearable
                            tabindex="3" @keyup.enter="onClick" />
                    </el-col>
                    <el-col :span="1" />
                    <el-col :span="8">
                        <el-button class="w100%" @click="getValidCodeClick">
                            {{ defData.vali_code }}
                        </el-button>
                    </el-col>
                </el-form-item>
                <el-form-item prop="sms_code" label="短信验证码：">
                    <el-col :span="15">
                        <el-input v-model.trim="form.sms_code" type="text" placeholder="请输入短信验证码" clearable tabindex="3" />
                    </el-col>
                    <el-col :span="1" />
                    <el-col :span="8">
                        <el-button v-if="defData.sendCode" class="w100%" @click="getSmsCodeClick">
                            获取验证码
                        </el-button>
                        <el-button v-else class="w100%">
                            {{ defData.time }}秒
                        </el-button>
                    </el-col>
                </el-form-item>
                <el-form-item>
                    <el-button class="mt-20px w400px" @click="onClick">
                        验证进入下一步
                    </el-button>
                </el-form-item>
            </el-form>
            <el-form v-else-if="defData.step === 2" ref="formRef" label-width="250px" :rules="rules" :model="form"
                style="max-width: 600px">
                <el-form-item prop="phone" label="新手机号：">
                    <el-input v-model="form.new_phone" placeholder="请输入新手机号" />
                </el-form-item>
                <el-form-item prop="sms_code" label="短信验证码：">
                    <el-col :span="15">
                        <el-input v-model.trim="form.new_code" type="text" placeholder="请输入短信验证码" clearable tabindex="3" />
                    </el-col>
                    <el-col :span="1" />
                    <el-col :span="8">
                        <el-button v-if="defData.sendCode" class="w100%" @click="getNewCodeClick">
                            获取验证码
                        </el-button>
                        <el-button v-else class="w100%">
                            {{ defData.time }}秒
                        </el-button>
                    </el-col>
                </el-form-item>
                <el-form-item>
                    <el-button class="mt-20px w400px" @click="onEditClick">
                        提交
                    </el-button>
                </el-form-item>
            </el-form>
            <div v-else style="font-size: xx-large;margin: 40px 350px;">
                完成
            </div>
        </div>
    </LayoutUser>
</template>

<script setup lang="ts">
import { ArrowRight } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { LoginApi } from '~/api/login'
import { AccountApi } from '~/api/user/account'

const userState = useUserState()

const defData = reactive({
    step: 1,
    vali_code: '1234', // 验证码
    session_id: '',
    time: 0, // 验证码倒计时时间
    sendCode: true, // true：发送验证码 false:倒计时
    phone: '',
})
const formRef = ref<FormInstance>()
const form = reactive({
    phone: '',
    new_phone: '',
    sms_code: '', // 短信验证码
    new_code: '',
    vali_code: '', // 验证码
})

// 规则
const rules = reactive<FormRules>({
    phone: [
        { required: true, whitespace: true, message: '必填项不能为空', trigger: 'blur' },
        { required: true, pattern: /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/, message: '请输入正确的手机号码', trigger: 'blur' },
    ],
    sms_code: [
        { required: true, message: '请输入短信验证码', trigger: 'blur' },
    ],
    vali_code: [
        { required: true, message: '请输入验证码', trigger: 'blur' },
    ],
    define_password: [
        { required: true, whitespace: true, message: '必填项不能为空', trigger: 'blur' },
        { pattern: /^[^\u4E00-\u9FA5 ]{6,16}$/, message: '不含有中文和空格,至少6位,最多16位', trigger: 'blur' },
    ],
})

// 获取当前手机号
const NowPhone = async () => {
    const user = await userState.getUserInfo()
    if (user.value) {
        defData.phone = user.value.phone
        form.phone = defData.phone
    }
}
NowPhone()

// 获取短信验证码 step1
const getSmsCodeClick = async () => {
    if (!form.phone) ElMessage.error('请先输入手机号码')
    const data: LoginApi_validateCode = {
        type: 4,
        phone: form.phone,
    }
    const { data: res } = await LoginApi.validateCode(data)
    if (res.value?.code !== 200) return ElMessage.error(res.value?.msg)
    ElMessage.success('发送成功')
    defData.sendCode = false
    defData.time = 60
    const times = setInterval(() => {
        defData.time--
        if (defData.time <= 0) {
            defData.sendCode = true
            clearInterval(times)
        }
    }, 1000)
}

// 获取验证码 step1
const getValidCodeClick = async () => {
    const { data: res } = await LoginApi.getCode()
    if (res.value?.code !== 200) return ElMessage.error(res.value?.msg)
    defData.session_id = res.value.data.session_id
    defData.vali_code = res.value.data.validate_code
}
getValidCodeClick()

//  验证进入下一步 step1
const onClick = async () => {
    const isRun = await formRef.value?.validate((valid, _fields) => !!valid)
    if (!isRun) return
    const data: LoginApi_submitIde = {
        vali_code: form.vali_code,
        sms_code: form.sms_code,
        phone: defData.phone,
        session_id: defData.session_id,
        plate_type: 1,
    }
    const { data: res } = await LoginApi.submitIde(data)
    if (res.value?.code !== 200) return ElMessage.error(res.value?.msg)
    ElMessage.success('身份验证成功')
    defData.step = 2
}

// 获取短信验证码 step2
const getNewCodeClick = async () => {
    if (!form.new_phone) ElMessage.error('请先输入手机号码')
    const data: LoginApi_validateCode = {
        type: 4,
        phone: form.new_phone,
    }
    const { data: res } = await LoginApi.validateCode(data)
    if (res.value?.code !== 200) return ElMessage.error(res.value?.msg)
    ElMessage.success('发送成功')
    defData.sendCode = false
    defData.time = 60
    const times = setInterval(() => {
        defData.time--
        if (defData.time <= 0) {
            defData.sendCode = true
            clearInterval(times)
        }
    }, 1000)
}

// 提交 step2
const onEditClick = async () => {
    if (!form.new_phone || !form.new_code) return ElMessage.error('必填项不能为空')
    if (form.new_phone === defData.phone) return ElMessage.error('新手机号与当前手机号不能相同')

    const data: AccountApi_editPhone = {
        phone: form.new_phone,
        sms_code: form.new_code,
    }
    const { data: res } = await AccountApi.editPhone(data)
    if (res.value?.code !== 200) return ElMessage.error(res.value?.msg)
    ElMessage.success('修改成功')
    defData.step = 3
}

definePageMeta({
    layout: 'home',
    middleware: 'auth',
})
</script>

<style scoped></style>
