<!-- 帮助中心 -->
<template>
    <div>
        <BaseError v-if="defData.error" />
        <LayoutContent v-else :type="1">
            <div class="text-box">
                <div class="text-tle min-h20px">
                    {{ textInfo?.name }}
                </div>
                <div class="text-content" v-html="textInfo?.content" />
            </div>
        </LayoutContent>
    </div>
</template>

<script lang="ts" setup>
import { ContentApi } from '~/api/home/content'

const id = useRouteQuery('id')

const textInfo = ref<ContentApi_GetInfoResponse>()
const defData = reactive({
    error: false,
})

const initDefaultData = async () => {
    if (!(/^\d+$/.test(id.value))) return defData.error = true

    const { data, error } = await ContentApi.getInfo({ id: Number(id.value) })

    if (error.value) defData.error = true

    if (data.value?.code !== 200) return ElMessage.error(data.value?.msg)
    defData.error = false
    textInfo.value = data.value.data
}

watch(() => id.value, () => {
    if (process.client) document.documentElement.scrollTop = 0
    initDefaultData()
}, { immediate: true })

definePageMeta({
    layout: 'home',
    // validate: async (route) => {
    //     console.log('route :>> ', route)
    //     // const nuxtApp = useNuxtApp()
    //     return /^\d+$/.test(route.query.id as string)
    // },
})
</script>

<style lang="scss" scoped>
.text-box {

    .text-tle {
        border-bottom: 1px solid rgba(0, 0, 0, .1);
        font-size: 24px;
        color: rgba(0, 0, 0, .85);
        padding-bottom: 5px;
        margin-bottom: 10px;
    }
}
</style>
