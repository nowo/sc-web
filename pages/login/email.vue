<template>
    <div class="container">
        <div style="border: 1px solid #50585e;height: 650px;display:flex;justify-content: center;">
            <div style="width: 600px;margin-top: 50px;">
                <div style="font-size: xx-large;margin: 40px;text-align: center;">
                    欢迎您激活邮箱
                </div>
                <div style="text-align: center;">
                    {{ defData.message }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { AccountApi } from '~/api/user/account'

const defData = reactive({
    message: '激活成功',
})
const route = useRoute()

// 获取
const getOpenId = async () => {
    const code: AccountApi_VerifyEmail = {
        code: route.query.code as string,
        email: route.query.email as string,
    }
    const { data: codeId } = await AccountApi.VerifyEmail(code)
    if (codeId.value?.code !== 200) defData.message = codeId.value?.msg as string
}
getOpenId()
definePageMeta({
    layout: 'login',
})
</script>

<style scoped></style>
