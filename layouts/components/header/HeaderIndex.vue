<script lang="ts" setup>
import HeaderClassify from './HeaderClassify.vue'
import HeaderMenu from './HeaderMenu.vue'

import HeaderBanner from './HeaderBanner.vue'
import HeaderUser from './HeaderUser.vue'

// import HeaderBanner2 from './HeaderBanner2.vue'

const route = useRoute()

const isIndex = computed(() => {
    return route.path === '/'
})
const defData = reactive({
    activeList: [] as HomeApi_GetBannerItem[],
})

// 获取活动专区广告
const { data: banner, error } = await useFetch<{ data: HomeApi_GetBannerResponse } & ResponseCodeMsg>('/api/main/banner', {
    method: 'post',
    body: {
        position_id: 3,
    },
})
if (!error.value && banner.value?.code === 200) {
    defData.activeList = banner.value.data.lists
}
</script>

<template>
    <div class="nav-banner" :class="isIndex ? 'index' : ''">
        <div class="nav">
            <div class="flex container">
                <div class="left-box">
                    <HeaderClassify />
                </div>
                <HeaderMenu />
            </div>
        </div>
        <div v-if="isIndex" class="banner">
            <div class="h100% flex container">
                <div class="left-box">
                    <!-- 占位 -->
                </div>
                <div class="swp">
                    <!-- <suspense> -->
                    <HeaderBanner />
                    <!-- <HeaderBanner2 /> -->
                    <!-- </suspense> -->
                </div>
                <div class="right">
                    <HeaderUser />
                </div>
            </div>
        </div>
        <div v-if="isIndex && defData.activeList.length" class="market">
            <div class="grid container">
                <NuxtLink v-for="item in defData.activeList" :key="item.ad_id" :to="item.ad_link" target="_blank">
                    <CoImage class="h150px w100% block!" :src="item.ad_img" fit="cover" :alt="item.ad_name" />
                </NuxtLink>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.nav-banner {
    // --banner-left-width: 230px;
    // --banner-right-width: 230px;
    --banner-left-width: var(--m-aside-width, 230px);
    --banner-right-width: 230px;
    --banner-width: 720px;
    --banner-height: 400px;
    position: relative;

    &::after {
        content: '';
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 2px;
        background-color: var(--el-color-primary);
    }

    &.index {
        &::after {
            content: none;
        }

        :deep(.goods-class-child) {
            display: block !important;
            box-shadow: none !important;
        }

    }

    .left-box {
        width: var(--banner-left-width);
        position: relative;
        // background: var(--el-color-primary);
        // background: var(--el-color-white);
    }

    .swp {
        width: var(--banner-width);
        height: 100%;
        padding: 0 6px;
    }

    .right {
        width: var(--banner-right-width);
        height: 100%;
        background-color: var(--el-color-white);
    }

    .nav {
        position: relative;
        z-index: 15;
    }

    .banner {
        height: var(--banner-height);
    }
}

.market {
    --m-gap-width: 8px;
    --m-card-number: 4;
    padding: var(--m-gap-width) 0;

    .grid {
        gap: var(--m-gap-width);
        grid-template-columns: repeat(4, 1fr);
    }
}
</style>
