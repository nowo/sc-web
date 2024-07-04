<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { AccountApi } from '~/api/user/account'
import { LoginApi } from '~/api/login'

const userState = useUserState()
const user = await userState.getUserInfo()
const route = useRoute()

const defData = reactive({
    type: 1, // 1个人信息 2修改个人信息
    user_name: '',
    phone: '',
    email: '',
    headImgUrl: 'https://goyojo.oss-cn-shenzhen.aliyuncs.com/20230420/202304201450139203.gif',
    openid: '',
    nickname: '',
    email_status: 0,
    visible: false,
    btnLoading: false,
})

const formRef = ref<FormInstance>()
const form = reactive({
    user_name: '',
    phone: '',
    email: '',
    headImgUrl: '',
    confirm_password: '',
    password: '',
    loading: false,
})

// 规则
const rules = reactive<FormRules>({
    user_name: [
        { required: true, whitespace: true, message: '必填项不能为空', trigger: 'blur' },
        { min: 2, max: 16, message: '最少2个,最多16个字符', trigger: 'blur' },
    ],
    email: [
        { required: true, pattern: /^([a-z0-9]+[_|.]?)*[a-z0-9]@([a-z0-9]+[_|.]?)*[a-z0-9]\.[a-z]{2,3}$/i, message: '填写正确的邮箱格式', trigger: 'blur' },
    ],
})

// 获取用户信息
const initData = async () => {
    if (user.value) {
        defData.user_name = user.value.user_name
        defData.email = user.value.email
        defData.phone = user.value.phone
        defData.openid = user.value.openid
        defData.nickname = user.value.nickname
        defData.email_status = user.value.email_status
        if (user.value.headimgurl) defData.headImgUrl = user.value.headimgurl
    }
}

// 修改用户信息
const editClick = () => {
    defData.type = 2
    form.headImgUrl = defData.headImgUrl
    form.user_name = defData.user_name
    form.phone = defData.phone
    form.email = defData.email
}

// 修改用户信息 确定
const onClick = async () => {
    const data: AccountApi_editInfo = {
        user_name: form.user_name,
        headimgurl: form.headImgUrl,
    }
    const res = await AccountApi.editInfo(data)
    if (res.data.value?.code !== 200) return ElMessage.error(res.data.value?.msg)
    ElMessage.success('修改成功')
    userState.getUserInfo(true)
    defData.user_name = data.user_name
    defData.headImgUrl = data.headimgurl
    defData.type = 1
}

// 微信扫码登录 打开微信二维码图片
const weChat = ref()
const getWeChat = async () => {
    const data: LoginApi_getChat = {
        qrcode_type: 2,
    }
    const { data: res } = await LoginApi.getWeChat(data)

    if (res.value?.code !== 200) return ElMessage.error(res.value?.msg)
    weChat.value = res.value?.data.url
}

// 获取OpenId
const getOpenId = async () => {
    if (!route.query.code) return
    // ElMessageBox.confirm('此操作将绑定微信，是否继续?', '提示', {
    //     confirmButtonText: '确认',
    //     cancelButtonText: '取消',
    //     type: 'warning',
    //     buttonSize: 'default',
    // }).then(async () => {
    const user = await userState.getUserInfo()
    console.log('user.value :>> ', user.value)
    if (user.value) {
        const code: LoginApi_getOpenid = {
            code: route.query.code as string,
            user_id: user.value.user_id,
        }
        const { data: codeId } = await LoginApi.getOpenid(code)
        console.log('codeId.value :>> ', codeId.value)
        if (codeId.value?.code !== 200) {
            ElMessage.error(codeId.value?.msg)
        } else {
            ElMessage.success('绑定成功')
            navigateTo('http://scdev.goyojo.com/user/account')
        }
        initData()
    }
    // }).catch(() => { })
}
getOpenId()

// 解绑微信
const delWeChat = () => {
    ElMessageBox.confirm('此操作将解绑微信，是否继续?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        buttonSize: 'default',
    }).then(async () => {
        const res = await AccountApi.del_openid()
        if (res.data.value?.code !== 200) ElMessage.error(res.data.value?.msg)
        ElMessage.success('解绑成功')
        initData()
    }).catch(() => { })
}

// 发送激活邮件
const sendEmail = async () => {
    form.loading = true
    const data: AccountApi_sendEmail = {
        email: defData.email,
    }
    const res = await AccountApi.sendEmail(data)
    form.loading = false
    if (res.data.value?.code !== 200) ElMessage.error(res.data.value?.msg)
    ElMessage.success('发送成功，请前往邮箱激活')
}

// 修改邮箱
const editPwd = async () => {
    const isVerify = await useFormVerify(formRef.value)
    if (!isVerify) return
    const data: AccountApi_editEmail = {
        email: form.email,
    }
    const { data: res } = await AccountApi.editEmail(data)
    if (res.value?.code !== 200) return ElMessage.error(res.value?.msg)
    ElMessage.success('修改成功')
    defData.email = form.email
    defData.visible = false
}

// 关闭弹窗
const onClose = () => {
    defData.visible = false
    formRef.value?.resetFields()
}

onBeforeMount(() => {
    initData()
})

definePageMeta({
    layout: 'home',
    middleware: 'auth',
})
</script>

<template>
    <LayoutUser>
        <client-only>
            <div h40px>
                <el-breadcrumb>
                    <el-breadcrumb-item>
                        账户管理
                    </el-breadcrumb-item>
                    <el-breadcrumb-item>账户资料</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <!-- ***********个人信息*************************************** -->
            <div v-if="defData.type === 1">
                <div style="font-weight: bold">
                    个人信息
                </div>
                <div style="margin:15px 0px;font-size: 14px;">
                    头像： <el-image class="h100px w100px" :src="defData.headImgUrl" />
                </div>
                <div style="margin:15px 0px;font-size: 14px;">
                    我的用户名：{{ defData.user_name }}
                </div>
                <el-button type="danger" ml20 mt5 @click="editClick">
                    修改
                </el-button>
            </div>
            <div v-else>
                <p>修改信息</p>
                <el-form ref="formRef" :model="form" label-width="130px" class="pt15px" :rules="rules">
                    <el-row>
                        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                            <el-form-item prop="headimgurl" label="头像：">
                                <CoUpload v-model="form.headImgUrl" />
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="20" :md="18" :lg="14" :xl="14">
                            <el-form-item prop="user_name" label="我的用户名：">
                                <el-input v-model="form.user_name" clearable />
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                            <el-form-item>
                                <el-button type="primary" @click="onClick">
                                    确定
                                </el-button>
                                <el-button @click="defData.type = 1">
                                    返回
                                </el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <!-- ***********账户安全**************************************** -->
            <div class="safe mt40px">
                <div>登录密码：联网账号存在被盗风险，建议定期更改密码以保护账户安全</div>
                <div class="safe-click">
                    <NuxtLink to="/user/components/editPwd">
                        修改
                    </NuxtLink>
                </div>
            </div>
            <div class="safe">
                <div>绑定手机：您已绑定手机：{{ defData.phone }}，若手机丢失或停用，请及时更换</div>
                <div class="safe-click">
                    <NuxtLink to="/user/components/editPhone">
                        换绑
                    </NuxtLink>
                </div>
            </div>
            <div class="safe">
                <div>绑定微信： {{ defData.nickname ? '已绑定' : '暂无绑定' }}{{ defData.nickname }}</div>
                <div class="safe-click">
                    <div v-if="defData.nickname" @click="delWeChat">
                        解绑
                    </div>
                    <div v-else>
                        <NuxtLink :to="weChat" @click="getWeChat">
                            绑定
                        </NuxtLink>
                    </div>
                </div>
            </div>
            <div class="safe">
                <div>
                    绑定邮箱：{{ defData.email ? '您已绑定邮箱' : '暂未绑定' }}{{ defData.email }}
                    <el-button v-if="defData.email && defData.email_status === 0" :loading="form.loading"
                        @click="sendEmail">
                        去激活
                    </el-button>
                </div>
                <div class="safe-click" @click="defData.visible = true">
                    修改
                </div>
            </div>
        </client-only>
        <CoDialog v-model:visible="defData.visible" :loading="defData.btnLoading" auto-height hidden title="修改邮箱"
            width="680px" @close="onClose" @cancel="onClose" @confirm="editPwd">
            <el-form ref="formRef" label-width="130px" :rules="rules" :model="form" style="max-width: 500px">
                <el-row>
                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                        <el-form-item prop="email" label="邮箱">
                            <el-input v-model="form.email" placeholder="请输入邮箱" />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </CoDialog>
    </LayoutUser>
</template>

<style scoped>
.avatar-upload.avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
}

/* 账户安全 */
.safe {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    margin-left: 5px;
    font-size: 15px;
}

.safe-click {
    color: rgb(75, 138, 248);
}

.safe-click:hover {
    color: var(--el-color-primary);
    cursor: pointer
}
</style>
