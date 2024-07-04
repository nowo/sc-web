<template>
    <div class="container">
        <div ref="goodsBestRef" />
        <client-only>
            <div v-if="goodsList.length" class="goods-best">
                <div class="goods-best-tle">
                    <div class="lt">
                        新品优选<sub>明星产品，趋势热销</sub>
                    </div>
                    <NuxtLink :to="linkGoodsList({ query: {}, url: true })">
                        <el-button link>
                            更多
                            <i class="i-ep-arrow-right" />
                        </el-button>
                    </NuxtLink>
                </div>
                <div class="goods-best-list">
                    <NuxtLink v-for="item in goodsList" :key="item.goods_id" class="v1 goods-link"
                        :to="`/goods/${item.goods_sn}`">
                        <CoImage class="h150px w150px" :src="item.goods_img" loading="lazy" :alt="item.goods_name" />
                        <h3 class="tle hov-name">
                            {{ item.goods_name }}
                        </h3>
                        <!-- <div class="price">
                            <span>惊爆价</span>
                            <em>￥{{ item.shop_price }}</em>
                        </div> -->
                    </NuxtLink>
                </div>
            </div>
        </client-only>
        <div ref="floorRef" class="floor-box">
            <div v-for="(item, index) in floorList" :id="`fl${item.storey_id}`" :key="item.storey_id" class="floor-item">
                <div class="left" :style="`background-image: url(${item.storey_img || ''});`">
                    <h3 class="tle">
                        {{ item.storey_name }}
                    </h3>
                    <ul class="class-list">
                        <li v-for="sub in item.cat_lists.slice(0, 10)" :key="sub.cat_id">
                            <NuxtLink :to="linkGoodsList({ query: { cid: sub.cat_id }, url: true })">
                                <el-button round size="small">
                                    {{ sub.cat_name }}
                                </el-button>
                            </NuxtLink>
                        </li>
                    </ul>
                </div>
                <div class="right">
                    <el-tabs v-model="floorActive[item.storey_id]" class="tabs-box"
                        :class="item.class_lists.length <= 1 ? 'one-tab' : ''">
                        <el-tab-pane v-for="(sub, i) in item.class_lists" :key="sub.class_id" :label="sub.class_name"
                            :name="`${index}-${i}`" lazy>
                            <ul class="goods-list">
                                <li v-for="son in sub.goods_lists.slice(0, 10)" :key="son.goods_id">
                                    <NuxtLink class="goods-link v2" :to="`/goods/${son.goods_sn}`" target="_blank">
                                        <CoImage class="hov-img w100% pb100%" :src="setGoodsOssImg(son.goods_img, 200)"
                                            loading="lazy" :alt="son.goods_name" />
                                        <h3 class="hov-name goods-name">
                                            {{ son.goods_name }}
                                        </h3>
                                        <!-- <div class="color-primary truncate">
                                            <span class="text-14px">￥</span>
                                            <span class="font-bold">{{ son.shop_price }}</span>
                                        </div> -->
                                    </NuxtLink>
                                </li>
                            </ul>
                        </el-tab-pane>
                    </el-tabs>
                </div>
                <div class="brand-list">
                    <NuxtLink v-for="sub in item.brand_lists.slice(0, 8)" :key="sub.brand_id"
                        :to="linkGoodsList({ query: { bid: sub.brand_id }, url: true })">
                        <CoImage class="w100% pb45% block!" :src="sub.brand_logo" style="--el-color-info-light-9:#282828;"
                            :icon-size="28" :alt="sub.brand_name" />
                    </NuxtLink>
                </div>
            </div>
        </div>
        <Transition v-if="defData.ready" name="slide">
            <div v-show="(!navVisible && floorVisible)" class="floor-nav">
                <a v-for="item in floorList" :key="item.storey_id" :href="`#fl${item.storey_id}`">
                    {{ item.storey_name }}
                </a>
            </div>
        </Transition>
    </div>
</template>

<script lang="ts" setup>
import { HomeApi } from '~/api/home/home'

interface TabActiveType {
    [k: string]: string | number
}

const defData = reactive({
    // active: {} as TabActiveType, // 楼层对应tab切换选中项
    ready: false, // 楼层是否加载完成
})

const goodsBestRef = ref(null)
const navVisible = useElementVisibility(goodsBestRef)

const floorRef = ref(null)
const floorVisible = useElementVisibility(floorRef)
// const { x, y } = useWindowScroll()

// 获取楼层
const { data: floor } = await HomeApi.getFloor()
const floorList = computed(() => floor.value?.data || [])

const floorActive = computed(() => {
    const active: TabActiveType = {}
    floor.value?.data.forEach((item, index) => {
        active[item.storey_id] = `${index}-0`
    })
    return active
})

// 新品商品
const { data: goods } = await HomeApi.getNewGoods()

// 只显示前五个（下标0开始，截取5个）
const goodsList = computed(() => {
    const list = goods.value?.data.lists.slice(0, 5).map((item) => {
        item.goods_img = setGoodsOssImg(item.goods_img, 200)
        return item
    })
    return list || []
})

onMounted(async () => {
    await wait(1000)
    defData.ready = true
})
</script>

<style lang="scss" scoped>
:global(html) {
    // 设置平滑滚动
    scroll-behavior: smooth;
}

.goods-best {
    background-color: var(--el-color-white);
    padding: 20px;
    margin-bottom: 30px;
}

.goods-best-tle {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 15px;

    .lt {
        font-weight: bold;
        font-size: 22px;
        color: var(--el-text-color-regular);

        sub {
            margin-left: 5px;
            font-weight: normal;
        }
    }
}

.goods-best-list {
    display: grid;
    gap: 25px;
    grid-template-columns: repeat(5, 1fr);
    padding: 10px;

    .price {
        margin: 5px 0;

        span {
            border-radius: 3px;
            color: #6f472e;
            background-color: #fff0dc;
            padding: 3px 10px 3px 5px;
            font-size: 12px;
        }

        em {
            display: inline-block;
            margin-left: -10px;
            background: var(--el-color-primary);
            color: var(--el-color-white);
            padding: 3px 10px;
            border-radius: 3px;
            -webkit-clip-path: polygon(15% 0%, 100% 0, 100% 100%, 4% 100%);
            clip-path: polygon(15% 0%, 100% 0, 100% 100%, 4% 100%);
        }
    }
}

.floor-item {
    --floor-left-width: 230px;
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 30px;

    .brand-list {
        width: 100%;
        padding: 10px;
        background-color: #1d1d1f;
        border-left: 10px solid var(--el-color-primary);
        border-right: 10px solid var(--el-color-primary);
        margin-top: 10px;
        overflow: hidden;
        display: grid;
        gap: 8px;
        grid-template-columns: repeat(8, 1fr);
    }

    .left {
        width: var(--floor-left-width);
        color: var(--el-color-white);
        // min-height: 560px;
        height: 620px;
        position: relative;
        z-index: 1;
        background-size: cover;

        .tle {
            font-size: 24px;
            padding: 25px 10px 20px 20px;
        }
    }

    .class-list {
        padding: 0 20px;

        .el-button {
            margin: 5px;
            --el-button-bg-color: transparent;

            --el-button-text-color: var(--el-color-white);
            --el-button-hover-bg-color: transparent;

            &:hover {
                border-color: var(--el-color-primary)
            }
        }
    }

    .right {
        width: calc(100% - var(--floor-left-width));
        // background: var(--el-color-white);
    }

    .tabs-box {
        --el-border-color-light: var(--m-body-bg-color);
        height: 100%;

        :deep(.el-tabs__header) {
            margin: 0;
            background: var(--el-color-white);

            .el-tabs__item.is-top:nth-child(2) {
                padding-left: 20px;
            }
        }

        :deep(.el-tabs__content) {
            height: calc(100% - var(--el-tabs-header-height));

            .el-tab-pane {
                height: 100%;
            }
        }

        // &.el-tabs--top .el-tabs__item.is-top:nth-child(2) {
        //   padding-left: 20px;
        // }

        &.one-tab {
            :deep(.el-tabs__header) {

                .el-tabs__item.is-top:nth-child(2) {
                    padding-left: 0;
                    margin-left: 20px;
                }
            }
        }
    }

}

.goods-list {
    // height: 100%;
    display: flex;
    flex-wrap: wrap;
    background-color: #fff;

    li {

        width: 20%;
        height: 50%;
        border-bottom: 2px solid var(--m-body-bg-color);
        border-right: 2px solid var(--m-body-bg-color);

        &:nth-child(5n) {
            border-right: 0;
        }

        &:nth-child(n+6) {
            border-bottom: 0;
        }

    }

    &.a2 {

        height: 580px;
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 2px;

        li {
            width: 100%;
            height: 50%;

        }
    }

}

.goods-link {
    display: block;
    height: 100%;
    padding: 15px;
    text-align: center;

    &.v1 {
        padding: 20px;

        &:hover {
            box-shadow: 0 0 10px #eee;
        }
    }

    &.v2 {
        min-height: 290px;
        background: var(--el-color-white);

        &:hover {
            box-shadow: 3px 3px 10px #d8d8d8;
        }
    }

    :deep(.co-image) {
        >img {
            transition: all 0.3s;
        }

        &:hover {
            >img {
                transform: scale(1.03);
            }
        }
    }

    .tle {
        height: 48px;
        overflow: hidden;
        line-height: 24px;
        font-size: 14px;
        font-weight: bold;
        text-align: left;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        margin: 5px 0 10px;
    }

    .goods-name {
        height: 40px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        font-size: 14px;
        line-height: 20px;
        margin: 5px 0 5px;
    }

    .hov-name:hover {
        color: var(--el-color-primary);
        text-decoration: underline;
    }

}

.floor-nav {
    position: fixed;
    top: 150px;
    left: 50%;
    transform: translateX(-50%);
    transition: opacity 0.3s, transform .4s, top 0.4s;
    width: 55px;
    margin-left: -630px;
    background: #fff;

    >a {
        display: block;
        width: 55px;
        height: 55px;
        padding: 10px;
        font-size: 14px;
        text-align: center;
        line-height: 18px;

        &:hover {
            color: var(--el-color-white);
            background: var(--el-color-primary);
        }
    }
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 1.5s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    transform: translateY(20px);
    opacity: 0;
}
</style>
