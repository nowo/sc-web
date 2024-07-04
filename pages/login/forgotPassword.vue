<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import { LoginApi } from '~/api/login'

definePageMeta({
    layout: 'login',
})

const defData = reactive({
    step: 1,
    vali_code: '1234', // 验证码
    session_id: '',
    time: 0, // 验证码倒计时时间
    sendCode: true, // true：发送验证码 false:倒计时
    phone: '',
    code: '',
})

const formRef = ref<FormInstance>()

const form = reactive({
    sms_code: '', // 短信验证码
    password: '', // 新密码
    phone: '',
    vali_code: '', // 验证码
    define_password: '', // 确认新密码
})

const rules = reactive<FormRules>({
    phone: [
        { required: true, whitespace: true, message: '必填项不能为空', trigger: 'blur' },
        { required: true, pattern: /^1(3\d|4[014-9]|5[0-35-9]|6[2567]|7[0-8]|8\d|9[0-35-9])\d{8}$/, message: '请输入正确的手机号码', trigger: 'blur' },
    ],
    password: [
        { required: true, whitespace: true, message: '必填项不能为空', trigger: 'blur' },
        { pattern: /^[^\u4E00-\u9FA5 ]{6,16}$/, message: '不含有中文和空格,至少6位,最多16位', trigger: 'blur' },
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

// 获取短信验证码 step1
const getSmsCodeClick = async () => {
    if (!form.phone) ElMessage.error('请先输入手机号码')
    const data: LoginApi_validateCode = {
        type: 3,
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

// 重置密码 step1
const onClick = async () => {
    const isVerify = await useFormVerify(formRef.value)
    if (!isVerify) return
    const data: LoginApi_submitIde = {
        vali_code: form.vali_code,
        sms_code: form.sms_code,
        phone: form.phone,
        session_id: defData.session_id,
        plate_type: 1,
    }
    const { data: res } = await LoginApi.submitIde(data)
    if (res.value?.code !== 200) return ElMessage.error(res.value?.msg)
    ElMessage.success('身份验证成功')
    defData.phone = form.phone // 暂存step1 手机号
    defData.code = res.value.data.code // 暂存step1 验证码
    defData.step = 2
}

// 修改 step2
const onEditClick = async () => {
    const isVerify = await useFormVerify(formRef.value)
    if (!isVerify) return
    if (form.define_password !== form.password) return ElMessage.error('密码不一致')
    const data: LoginApi_submitPas = {
        code: defData.code,
        phone: defData.phone,
        password: form.password,
        define_password: form.define_password,
    }
    const { data: res } = await LoginApi.submitPas(data)
    if (res.value?.code !== 200) return ElMessage.error(res.value?.msg)
    ElMessage.success('修改成功')
    defData.step = 3
}
</script>

<template>
    <div class="container">
        <div style="height: 650px;background-color: white;margin: 10px 0;">
            <div class="pr5px pt5px text-right">
                <NuxtLink to="/login">
                    已有账号，去登录
                </NuxtLink>
            </div>
            <div class="w100% flex justify-center">
                <div style="width: 600px;margin-top: 50px">
                    <el-steps :space="200" :active="defData.step" class="mb-70px ml130px">
                        <el-step title="身份验证" />
                        <el-step title="修改密码" />
                        <el-step title="完成" />
                    </el-steps>
                    <el-form v-if="defData.step === 1" ref="formRef" label-width="130px" :rules="rules" :model="form"
                        style="max-width: 500px" size="large">
                        <el-form-item prop="phone" label="手机号码：">
                            <el-input v-model="form.phone" placeholder="请输入手机号" />
                        </el-form-item>
                        <el-form-item prop="vali_code" label="验证码：">
                            <el-col :span="15">
                                <el-input v-model.trim="form.vali_code" type="text" maxlength="4" placeholder="请输入验证码"
                                    clearable tabindex="3" @keyup.enter="onClick" />
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
                                <el-input v-model.trim="form.sms_code" type="text" placeholder="请输入短信验证码" clearable
                                    tabindex="3" />
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
                            <el-button type="danger" class="mt-20px w400px" @click="onClick">
                                下一步重置密码
                            </el-button>
                        </el-form-item>
                    </el-form>
                    <el-form v-else-if="defData.step === 2" ref="formRef" label-width="130px" :rules="rules" :model="form"
                        style="max-width: 500px" size="large">
                        <el-form-item prop="password" label="新密码">
                            <el-input v-model="form.password" placeholder="请输入新密码" show-password />
                        </el-form-item>
                        <el-form-item prop="define_password" label="确认密码">
                            <el-input v-model="form.define_password" placeholder="请输入新密码" show-password />
                        </el-form-item>
                        <el-form-item>
                            <el-button type="danger" class="mt-20px w400px" @click="onEditClick">
                                修改
                            </el-button>
                        </el-form-item>
                    </el-form>
                    <div v-else style="font-size: xx-large;margin: 40px 150px;">
                        恭喜，密码修改成功,去
                        <NuxtLink to="/login" style="color: red;">
                            登录
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
