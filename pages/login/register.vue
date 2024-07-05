<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { LoginApi } from '~/api/login'

const route = useRoute()

const userState = useUserState()

definePageMeta({
    layout: 'login',
})

// 获取商城信息
const useSystem = useSystemState()

const defData = reactive({
    time: 0, // 验证码倒计时时间
    sendCode: true, // true：发送验证码 false:倒计时
    type: 1, // 1：工游记网站服务协议，2：工游记隐私政策
    agreement: '', // 工游记网站服务协议
    policy: '', // 工游记隐私政策
    visible: false, //
})

const comData = computed(() => {
    let dat = {
        title: '工游记网站服务协议',
    }
    if (defData.type === 2) {
        dat = {
            title: '工游记隐私政策',
        }
    }
    return dat
})

const formRef = ref<FormInstance>()

const form = reactive({
    validate_code: '',
    password: '',
    phone: '',
    agree: false,
    // loading: true,
})

const rules = reactive<FormRules>({
    phone: [
        { required: true, whitespace: true, message: '必填项不能为空', trigger: 'blur' },
        { required: true, pattern: /^1(3\d|4[014-9]|5[0-35-9]|6[2567]|7[0-8]|8\d|9[0-35-9])\d{8}$/, message: '填写正确的手机号格式', trigger: 'blur' },
    ],
    validate_code: [
        { required: true, message: '请输入验证码', trigger: 'blur' },
    ],
})

const infoData = async () => {
    const systemInfo = await useSystem.getSystemInfo()
    if (systemInfo.value) {
        defData.policy = systemInfo.value.policy
        defData.agreement = systemInfo.value.agreement
    }
}
infoData()

// 打开网站服务协议
const openWeb = async () => {
    defData.type = 1
    defData.visible = true
}
// 打开网站服务协议
const openPolicy = async () => {
    defData.type = 2
    defData.visible = true
}
// 关闭弹窗
const onClose = () => {
    defData.visible = false
}
// 获取短信验证码
const getCodeClick = async () => {
    if (!form.phone) ElMessage.warning('请先输入手机号码')

    const data: LoginApi_validateCode = {
        type: 1,
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

// 注册
const onClick = async () => {
    const isVerify = await useFormVerify(formRef.value)
    if (!isVerify) return
    if (form.agree === false) return ElMessage.warning('请阅读并同意《工游记网站服务协议》《工游记隐私政策》')
    const data: LoginApi_Login = {
        type: 3,
        phone: form.phone,
        validate_code: form.validate_code,
    }
    if (route.query.id) data.share_id = Number(route.query.id)
    if (route.query.salesman_id) data.salesman_id = Number(route.query.salesman_id)

    const { data: res } = await LoginApi.Login(data)
    if (res.value?.code !== 200) return ElMessage.error(res.value?.msg)
    ElMessage.success('注册成功')
    userState.setToken(res.value.data.token)
    return navigateTo('/user/account')
}
</script>

<template>
    <div class="container">
        <div style="height: 650px;background-color: white;margin: 10px 0;">
            <div class="pr5px pt5px text-right">
                已有账号，去<NuxtLink to="/login">
                    登录
                </NuxtLink>
            </div>
            <div class="w100% flex justify-center">
                <div style="width: 600px;margin-top: 50px;">
                    <div style="font-size: xx-large;margin: 40px;text-align: center;">
                        欢迎您注册工游记
                    </div>
                    <el-form ref="formRef" label-width="130px" :rules="rules" :model="form" style="max-width: 500px"
                        size="large">
                        <el-form-item prop="phone" label="手机号码：">
                            <el-input v-model="form.phone" placeholder="请输入手机号" />
                        </el-form-item>
                        <el-form-item prop="validate_code" label="验证码：">
                            <el-col :span="15">
                                <el-input v-model.trim="form.validate_code" type="text" placeholder="请输入短信验证码" clearable
                                    tabindex="3" />
                            </el-col>
                            <el-col :span="1" />
                            <el-col :span="8">
                                <el-button v-if="defData.sendCode" class="w100%" @click="getCodeClick">
                                    获取验证码
                                </el-button>
                                <el-button v-else class="w100%">
                                    {{ defData.time }}秒
                                </el-button>
                            </el-col>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="danger" class="mt-20px w400px" @click="onClick">
                                注册
                            </el-button>
                        </el-form-item>
                        <el-form-item label-width="97px">
                            <el-checkbox v-model="form.agree" label="我已阅读并同意" />
                            <el-button-group>
                                <el-button type="text" style="padding:0px" @click="openWeb">
                                    《工游记网站服务协议》
                                </el-button>
                                <el-button type="text" style="padding:0px" @click="openPolicy">
                                    《工游记隐私政策》
                                </el-button>
                            </el-button-group>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </div>
        <client-only>
            <el-dialog v-model="defData.visible" auto-height width="680px" :draggable="true" :title="comData.title"
                @close="onClose">
                <div v-if="defData.type === 1">
                    <p v-html="defData.agreement" />
                </div>
                <div v-else>
                    <p v-html="defData.policy" />
                </div>
            </el-dialog>
        </client-only>
    </div>

</template>

<style scoped></style>
