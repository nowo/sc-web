<template>
    <div class="login-page flex items-center justify-center">
        <div class="login">
            <div class="text-center text-20px font-bold mb20px color-#333">
                账号登录
            </div>

            <el-form ref="formRef" label-width="auto" :rules="rules" :model="form" size="large">
                <el-form-item prop="phone">
                    <el-input v-model="form.phone" placeholder="请输入手机号">
                        <template #prefix>
                            <i class=" i-ep-user">
                            </i>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item v-if="defData.type === 1" prop="password">
                    <el-input v-model="form.password" placeholder="请输入密码" show-password>
                        <template #prefix>
                            <i class=" i-ep-lock">
                            </i>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item v-else prop="validate_code">
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
                    <el-button class="w100% mt10px" :loading="form.loading"  type="primary" plain @click="onClick">
                        {{ defData.type !== 3 ? '登 录' : '进入工游记' }}
                    </el-button>
                </el-form-item>
            </el-form>
            <div class="flex justify-between mt-10px">
                <NuxtLink to="/login/register">
                    立即注册
                </NuxtLink>
                <NuxtLink to="/login/forgotPassword">
                    忘记密码?
                </NuxtLink>
            </div>

        </div>
    </div>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'

// import Big from 'big.js'
import { LoginApi } from '~/api/login'

const userState = useUserState()

definePageMeta({
    layout: 'login',
})

const route = useRoute()
const defData = reactive({
    type: 1, // 1账户登录 2验证码登录 3微信扫码未注册之后登录 4二维码页面
    time: 0, // 验证码倒计时时间
    sendCode: true, // true：发送验证码 false:倒计时
    nickname: '', //
    openid: '', //
    unionid: '', //
    headimgurl: '', //
})
const form = reactive({
    phone: '',
    password: '',
    loading: false,
    validate_code: '',
})

const rules = reactive<FormRules>({
    phone: [
        { required: true, whitespace: true, message: '必填项不能为空', trigger: 'blur' },
        { required: true, pattern: /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/, message: '请输入正确的手机号码', trigger: 'blur' },
    ],
    password: [
        { required: true, message: '请输入登录密码', trigger: 'blur' },
        { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' },
    ],
    validate_code: [
        { required: true, message: '请输入验证码', trigger: 'blur' },
    ],
})
const formRef = ref<FormInstance>()

// 登录
const onClick = async () => {
    // console.log('0.1+0.2 :>> ', 0.1 + 0.2) // 0.3
    // const num = Big(0.1).plus(0.2)
    // console.log('Big(0.7).plus(x).plus(y)  :>> ', num, num.toNumber()) // )

    const isVerify = await useFormVerify(formRef.value)
    if (!isVerify) return
    form.loading = true
    if (defData.type === 1) { // 账号登录
        const data: LoginApi_Login = {
            type: 1,
            phone: form.phone,
            password: form.password,

        }
        const { data: res } = await LoginApi.Login(data)
        form.loading = false
        if (res.value?.code !== 200) return ElMessage.error(res.value?.msg)
        ElMessage.success('登录成功')
        userState.setToken(res.value.data.token)
        return navigateTo('/')
    } else if (defData.type === 3) { // 微信扫码未绑定账号登录
        const info: LoginApi_Login = {
            type: 4,
            phone: form.phone,
            validate_code: form.validate_code,
            nickname: defData.nickname,
            openid: defData.openid,
            unionid: defData.unionid,
            headimgurl: defData.headimgurl,
        }
        if (route.query.id) info.share_id = Number(route.query.id)
        if (route.query.salesman_id) info.salesman_id = Number(route.query.salesman_id)
        const res = await LoginApi.Login(info)
        form.loading = false
        if (res.data.value?.code !== 200) return ElMessage.error(res.data.value?.msg)
        userState.setToken(res.data.value.data.token)
        return navigateTo('/')
    } else { // 验证码登录
        const data: LoginApi_Login = {
            type: 2,
            phone: form.phone,
            validate_code: form.validate_code,
        }
        if (route.query.id) data.share_id = Number(route.query.id)
        if (route.query.salesman_id) data.salesman_id = Number(route.query.salesman_id)

        const { data: res } = await LoginApi.Login(data)
        form.loading = false
        if (res.value?.code !== 200) return ElMessage.error(res.value?.msg)
        ElMessage.success('登录成功')
        userState.setToken(res.value.data.token)
        return navigateTo('/')
    }
}

// 点击验证码登录
const validateClick = () => {
    defData.type = 2
}
// 点击账号登录
const loginClick = () => {
    defData.type = 1
}

// 获取短信验证码
const getCodeClick = async () => {
    if (!form.phone) ElMessage.error('请先输入手机号码')
    const data: LoginApi_validateCode = {
        type: 2,
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

// 微信扫码登录
const weChat = ref()
const weChatLogin = async () => {
    const data: LoginApi_getChat = {
        qrcode_type: 1,
    }
    const { data: res } = await LoginApi.getWeChat(data)

    if (res.value?.code !== 200) return ElMessage.error(res.value?.msg)
    weChat.value = res.value?.data.url

    defData.type = 4
}

// 获取OpenId
const getOpenId = async () => {
    if (!route.query.code) return
    const code: LoginApi_getOpenid = {
        code: route.query.code as string,
    }
    const { data: codeId } = await LoginApi.getOpenid(code)
    if (codeId.value?.data.status === 1) { // 已注册用户
        userState.setToken(codeId.value.data.token)
        return navigateTo('/')
    } else { // 未注册用户
        defData.type = 3
        if (codeId.value) {
            defData.nickname = codeId.value.data.openid_info.nickname
            defData.openid = codeId.value.data.openid_info.openid
            defData.unionid = codeId.value.data.openid_info.unionid
            defData.headimgurl = codeId.value.data.openid_info.headimgurl
        }
    }
}
getOpenId()
</script>

<style lang="scss" scoped>

.login-page {
    width: 100%;
    height: 700px;
    background-image: url('assets/images/login-bg.png');
    background-size: cover;
    // background-repeat: no-repeat;
    background-position: center;
}

.login {
    width: 370px;
    background-color: rgb(255, 255, 255);
    border-radius: 5px;
    margin-top: -115px;
    padding: 40px 35px;
}

</style>
