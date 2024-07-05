<script setup lang="ts">
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

// import '@unocss/reset/tailwind.css'
// import '~/assets/scss/default.scss'
import '~/assets/scss/app.scss'

const locale = ref(zhCn)

// 提示框
const messageConfig = reactive({
    max: 1,
})

// 获取商城信息
const { systemStatus, getSystemInfo } = useSystemState()
const systemInfo = await getSystemInfo()

useHead({
    title: systemInfo.value?.shop_title,
    meta: [
        { name: 'keywords', content: systemInfo.value?.seo_keywords },
        { name: 'description', content: systemInfo.value?.shop_describe },
    ],
    link: [
        { rel: 'icon', type: 'image/x-icon', href: systemInfo.value?.ico_img || '' },
    ],
})
</script>

<template>
    <el-config-provider :locale="locale" :message="messageConfig">
        <VitePwaManifest />
        <BaseClose v-if="systemStatus.is_close" />
        <NuxtLayout v-else>
            <NuxtPage />
        </NuxtLayout>
    </el-config-provider>
</template>

<style lang="scss">
html,
body,
#__nuxt {
    // height: 100vh;
    margin: 0;
    padding: 0;
    // background: $bgColor;
}

html.dark {
    background: #333;
    color: white;
}

.layout-enter-active,
.layout-leave-active {
    transition: all 0.4s;
}

.layout-enter-from,
.layout-leave-to {
    // filter: grayscale(1);
    zoom: 1;
    // transform:scale(1.2);
    // opacity: 0;
}
</style>
