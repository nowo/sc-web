<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import { LoginApi } from '~/api/login'

const emits = defineEmits<{
    (event: 'update'): void
}>()

const userState = useUserState()
// 获取商城信息
const useSystem = useSystemState()
const systemInfo = await useSystem.getSystemInfo()

const defData = reactive({
    type: 1, // 1账户登录 2验证码登录 3微信扫码之后注册 4二维码
    time: 0, // 验证码倒计时时间
    sendCode: true, // true：发送验证码 false:倒计时
    visibleRead: false, // 是否显示读取验证码图片功能 0不显示 1显示读取图片 2显示
    readType: 1, // 1:服务协议 2:隐私政策
    btnLoading: false,
})
const form = reactive({
    phone: '',
    password: '',
    loading: false,
    validate_code: '',
    read: [] as string[], // 是否同意隐私政策
})

const rules = reactive<FormRules>({
    phone: [
        { required: true, whitespace: true, message: '必填项不能为空', trigger: 'blur' },
        { required: true, pattern: /^1(3\d|4[014-9]|5[0-35-9]|6[2567]|7[0-8]|8\d|9[0-35-9])\d{8}$/, message: '请输入正确的手机号码', trigger: 'blur' },
    ],
    password: [
        { required: true, whitespace: true, message: '请输入登录密码', trigger: 'blur' },
        { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' },
    ],
    validate_code: [
        { required: true, whitespace: true, message: '请输入验证码', trigger: 'blur' },
    ],
    read: [
        { required: true, type: 'array', message: '请仔细阅读服务协议和隐私政策并勾选同意', trigger: 'blur' },
    ],
})
const formRef = ref<FormInstance>()

const readData = computed(() => {
    const dat = {
        title: '工游记网站服务协议',
        content: systemInfo.value?.agreement || '',
    }

    if (defData.readType === 2) {
        dat.title = '工游记隐私政策'
        dat.content = systemInfo.value?.policy || ''
    }
    return dat
})

/**
 * 切换登录方式
 * @param type 1账户登录 2验证码登录 3微信扫码之后注册 4二维码
 */
const setLoginType = (type: 1 | 2 | 3 | 4) => {
    defData.type = type
}

// 查看隐私、政策
const onOpenRead = (type: 1 | 2) => {
    defData.readType = type
    nextTick(() => {
        defData.visibleRead = true
    })
}

// 获取短信验证码
const getCodeClick = async () => {
    formRef.value?.validateField(['phone'])
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

// 登录
const onLogin = async () => {
    const isRun = await useFormVerify(formRef.value)
    if (!isRun) return false

    const data: LoginApi_Login = {
        type: 1,
        phone: form.phone?.trim() ?? '',
        password: form.password?.trim() ?? '',
        validate_code: form.validate_code?.trim() ?? '',
    }

    if (defData.type === 1) { // 账号登录
        delete data.validate_code
    } else { // 验证码登录
        data.type = 2
        delete data.password
    }
    defData.btnLoading = true
    const { data: res, error } = await LoginApi.Login(data)
    defData.btnLoading = false
    if (error.value) return
    if (res.value?.code !== 200) return ElMessage.error(res.value?.msg)
    ElMessage.success('登录成功')
    userState.setToken(res.value.data.token)

    emits('update')
}
</script>

<template>
    <div class="login-box">
        <div class="login-tle">
            <span :class="defData.type === 1 ? 'on' : ''" @click="setLoginType(1)">账号登录</span>
            <el-divider direction="vertical" />
            <span :class="defData.type === 2 ? 'on' : ''" @click="setLoginType(2)">验证码登录</span>
        </div>
        <el-form ref="formRef" label-width="auto" :model="form" :rules="rules" size="large">
            <el-form-item prop="phone">
                <el-input v-model="form.phone" placeholder="请输入手机号" tabindex="1">
                    <template #prefix>
                        <i class="i-ep-user" />
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item v-if="defData.type === 1" prop="password">
                <el-input v-model="form.password" placeholder="请输入密码" show-password tabindex="2">
                    <template #prefix>
                        <i class="i-ep-lock" />
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item v-else prop="validate_code" class="h40px">
                <el-col :span="15">
                    <el-input v-model.trim="form.validate_code" type="text" placeholder="请输入短信验证码" clearable tabindex="3">
                        <template #prefix>
                            <i class="i-ep-message" />
                        </template>
                    </el-input>
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
            <el-form-item prop="read" size="small">
                <el-checkbox-group v-model="form.read">
                    <el-checkbox label="我已阅读并同意" name="1" />
                </el-checkbox-group>
                <el-link type="primary" style="--el-link-font-size:12px;" @click="onOpenRead(1)">
                    《工游记网站服务协议》
                </el-link>
                <el-link type="primary" style="--el-link-font-size:12px;" @click="onOpenRead(2)">
                    《工游记隐私政策》
                </el-link>
            </el-form-item>

            <el-form-item>
                <el-button class="w100%" :loading="defData.btnLoading" @click="onLogin">
                    {{ defData.type === 1 ? '登 录' : '进入工游记' }}
                </el-button>
                <NuxtLink to="/login/forgotPassword" target="_blank">
                    忘记密码?
                </NuxtLink>
            </el-form-item>
        </el-form>
        <ClientOnly>
            <el-dialog v-model="defData.visibleRead" auto-height width="1000px" :draggable="true" :title="readData.title"
                destroy-on-close>
                <div v-html="readData.content" />
            </el-dialog>
        </ClientOnly>
    </div>
</template>

<style lang="scss">
.login-box {
    width: 400px;
    padding: 30px;
    margin: 0 auto;
}

.login-tle {
    text-align: center;
    font-size: 20px;
    padding-bottom: 30px;

    >span {
        cursor: pointer;
        margin: 0 5px;
    }

    .on {
        color: var(--el-color-primary);
    }
}
</style>
