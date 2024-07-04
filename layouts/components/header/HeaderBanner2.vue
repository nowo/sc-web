<!-- 轮播图 swiper v10.0.4 -->

<script lang="ts" setup>
import { register } from 'swiper/element/bundle'

register()

const onProgress = (e: any) => {
    // const [swiper, progress] = e.detail
    // console.log(progress)
}

const onSlideChange = (e: any) => {
    // console.log('slide changed')
}

const defData = reactive({
    bannerList: [] as HomeApi_GetBannerItem[],
})

// 获取轮播图
const { data: banner, error } = await useFetch<{ data: HomeApi_GetBannerResponse } & ResponseCodeMsg>('/api/main/banner', {
    method: 'post',
    body: {
        position_id: 1,
    },
})
if (!error.value && banner.value?.code === 200) {
    defData.bannerList = banner.value.data.lists
}
</script>

<template>
    <swiper-container v-if="CLIENT" class="swp-banner" :slides-per-view="1" :centered-slides="true" :pagination="true"
        :loop="true" :autoplay="{ delay: 6000,
                                  disableOnInteraction: false }" :speed="1500" effect="fade" @progress="onProgress"
        @slidechange="onSlideChange">
        <!-- <swiper-slide>Slide 1</swiper-slide>
        <swiper-slide>Slide 2</swiper-slide>
        <swiper-slide>Slide 3</swiper-slide> -->
        <swiper-slide v-for="item in defData.bannerList" :key="item.ad_id">
            <NuxtLink :to="item.ad_link">
                <img class="im" :src="item.ad_img" alt="">
            </NuxtLink>
        </swiper-slide>
    </swiper-container>
</template>

<style lang="scss" scoped>
.swp-banner {
    // background-color: #fff;
    width: 100%;
    --swiper-navigation-size: 32px;
    --swiper-theme-color: var(--el-color-primary);
    --swiper-pagination-bullet-inactive-color: var(--el-color-white);
    // --swiper-pagination-color: var(--el-color-primary);
    --swiper-pagination-bullet-inactive-opacity: 0.7;

    .im {
        width: 100%;
        height: var(--banner-height);
        object-fit: cover;
    }
}
</style>
