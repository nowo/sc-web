<!-- 商品分类 -->
<script lang="ts" setup>
import { GoodsApi } from '~/api/goods/list'

// const goodsState = useGoodsState()

// 设置图标
const eleIconChange = (icon: string) => {
    if (!icon.includes('ele-')) return ''
    const str = icon.split('-')?.[1]

    if (str) {
        let a = ''
        const arr = str.split('')
        arr.forEach((item) => {
            if (item >= 'A' && item <= 'Z') {
                a += `-${item.toLowerCase()}`
            } else {
                a += item
            }
        })
        return `i-ep${a}`
    } else {
        return ''
    }
}

// 获取商品分类
const { data: cate } = await GoodsApi.getIndexClass()
const cateList = computed(() => cate.value?.data ?? [])
//
</script>

<template>
    <div class="goods-class-tle">
        <!-- <i class="i-carbon-list" /> -->
        <i class="i-ic-outline-format-list-bulleted" />
        <span class="ml8px">商品分类</span>
        <ul class="goods-class-child">
            <client-only>
                <li v-for="item in cateList" :key="item.id">
                    <div class="card">
                        <div class="tle flex items-center text-13px font-bold">
                            <div class="w20px">
                                <i class="block" :class="eleIconChange(item.icon)" />
                            </div>
                            <h6>{{ item.custom_name }}</h6>
                        </div>
                        <div class="flex">
                            <div class="w20px" />
                            <div class="card-link flex-1 text-13px">
                                <NuxtLink v-for="sub in item.lists" :key="sub.cat_id" class="mr5px inline-block"
                                    :to="linkGoodsList({ query: { cid: sub.cat_id }, url: true })">
                                    <span>{{ sub.cat_name }}</span>
                                </NuxtLink>
                            </div>
                        </div>
                    </div>
                    <div class="goods-class-pane">
                        <dl>
                            <dd v-for="sub in item.lists" :key="sub.cat_id">
                                <div class="lt">
                                    <NuxtLink :to="linkGoodsList({ query: { cid: sub.cat_id }, url: true })">
                                        {{ sub.cat_name }}
                                    </NuxtLink>
                                </div>
                                <div class="ico">
                                    <i class="i-ep-arrow-right" />
                                </div>
                                <div class="gt">
                                    <NuxtLink v-for="son in sub.children" :key="son.cat_id"
                                        :to="linkGoodsList({ query: { cid: son.cat_id }, url: true })">
                                        {{ son.cat_name }}
                                    </NuxtLink>
                                </div>
                            </dd>
                        </dl>
                    </div>
                </li>
            </client-only>
        </ul>
    </div>
</template>

<style lang="scss" scoped>
.goods-class-tle {
    width: 100%;
    height: 100%;
    background: var(--el-color-primary);
    color: var(--el-color-white);
    display: flex;
    align-items: center;
    padding: 5px 10px;

    &:hover .goods-class-child {
        display: block;
    }
}

.goods-class-child {
    width: 100%;
    height: var(--banner-height);
    position: absolute;
    top: 100%;
    left: 0;
    background-color: var(--el-color-white);
    color: #333;
    display: none;
    // box-shadow: -1px 3px 12px -1px rgba(0, 0, 0, .3);
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
    padding: 5px 0;

    .card {
        --b-border-width: 10px;
        padding: 5px var(--b-border-width);
        // background-color: #333;
        position: relative;
        z-index: 1;

        &::after {
            --b-position-left: 7px;
            --b-position-top: 0px;
            content: '';
            display: block;
            position: absolute;
            top: var(--b-position-top);
            left: var(--b-position-left);
            width: calc(100% - var(--b-position-left) * 2);
            height: calc(100% - var(--b-position-top) * 2);
            // background-color: var(--el-color-info-light-8);
            z-index: -1;
            border-radius: 2px;
        }

        &-link {
            >a {
                color: var(--el-text-color-regular);

                &:hover {
                    color: var(--el-color-primary);
                }
            }

        }
    }

    li>a {
        display: flex;
        align-items: center;
        // padding: 5px 10px;
        font-size: 15px;
        line-height: 48px;
        padding: 0 10px;

        i {
            margin-right: 5px;
        }
    }

    li:hover {
        .card::after {
            background-color: var(--el-color-info-light-8);
        }

        .goods-class-pane {
            display: block;
        }
    }
}

.goods-class-pane {
    position: absolute;
    top: 0;
    left: 100%;
    width: var(--banner-width);
    height: var(--banner-height);
    background-color: #fff;
    overflow: auto;
    display: none;
    box-shadow: 0 3px 6px rgba(0, 0, 0, .05);
    padding: 10px;

    dd {
        display: flex;
        font-size: 13px;
        line-height: 22px;
        --dd-left-width: 100px;
        padding: 5px 0;

        +dd {
            border-top: 1px dotted var(--el-border-color);
        }

        .lt {
            width: var(--dd-left-width);
            font-weight: bold;
            padding-left: 4px;
        }

        .ico {
            width: 30px;
            height: 22px;
            display: flex;
            align-items: center;
            justify-content: center;

            i {
                display: block;
                width: 1em;
                height: 1em;
            }
        }

        .gt {
            flex: 1;

            a {
                display: inline-block;
                margin-right: 15px;
                // color: var(--el-text-color-secondary);
                color: var(--el-text-color-regular);
            }

        }

        a:hover {
            color: var(--el-color-primary);
        }
    }
}
</style>
