<script lang="ts" setup>
import { ElAutocomplete } from 'element-plus'
import HeaderIndex from './header/HeaderIndex.vue'
import { GoodsApi } from '~/api/goods/list'

const useCartNumber = useCartNumberState()
const number = await useCartNumber.setCartNumber()

const route = useRoute()

const search = reactive({
    keyword: '',
    select: '1',
})

const useSystem = useSystemState()
const systemInfo = ref(useSystem.system)

const autocompleteRef = ref<InstanceType<typeof ElAutocomplete>>()
const showTeleport = ref(false)
const showClear = ref(false) // 是否显示清除按钮

const searchDataList = useLocalStorage<GoodsSearchItem[]>('searchKeywordList', [])

const searchHotList = computed(() => {
    const text = systemInfo.value?.hot ?? ''
    return text.split(',')
})

// 搜索
const onSearch = (row?: any | '') => {
    const queryStr = search.keyword?.trim() ?? ''
    if (!queryStr) return ElMessage.error('请输入商品关键词')

    const node: GoodsSearchItem = {
        id: row?.id ?? 0,
        type: row?.type ?? 3,
        value: row?.value ?? queryStr,
    }

    // 记录搜索历史,追加到第一项
    const index = searchDataList.value.findIndex(item => item.value === node.value)
    if (index >= 0) {
        searchDataList.value = moveArraySite(searchDataList.value, index, 0) // 移动到第一项位置
    } else {
        searchDataList.value.unshift({ value: node.value, id: node.id, type: node.type })
    }

    const query: GoodsListParamsQuery = {}
    if (node.type === 1) query.cid = node.id
    if (node.type === 2) query.bid = node.id
    if (node.type === 3) query.keyword = node.value

    linkGoodsList({
        query,
    })

    // 是分类、品牌跳转时，清空input框
    if (node.type === 1 || node.type === 2) {
        search.keyword = ''
    }
}

// 热门
const onSearchHot = (text: string) => {
    search.keyword = text
    onSearch()
}

// 下拉显示数据
const querySearchAsync = (queryString: string, callback: (arg: any) => void) => {
    const query = queryString?.trim() ?? ''
    if (query) {
        GoodsApi.searchKeyword({ keyword: queryString }).then((res) => {
            // console.log(res)
            const results: GoodsSearchItem[] = []
            if (res.data.value) {
                const { goods_lists, cate_lists, brand_lists } = res.data.value.data

                // 商品分类
                for (let i = 0; i < cate_lists?.length; i++) {
                    if (results.length >= 10) break
                    const element = cate_lists[i]
                    results.push({
                        value: element.name,
                        id: Number(element.id),
                        type: 1,
                    })
                }

                // 商品品牌
                for (let i = 0; i < brand_lists?.length; i++) {
                    if (results.length >= 10) break
                    const element = brand_lists[i]
                    results.push({
                        value: element.name,
                        id: Number(element.id),
                        type: 2,
                    })
                }

                // 商品
                for (let i = 0; i < goods_lists?.length; i++) {
                    if (results.length >= 10) break
                    const element = goods_lists[i]
                    results.push({
                        value: element.name,
                        id: Number(element.id),
                        type: 3,
                    })
                }
            }

            callback(results)
        })
        showClear.value = false
    } else {
        const dat = searchDataList.value.slice(0, 10).map(item => ({ ...item, history: 1 }))
        if (dat.length) showClear.value = true
        callback(dat)
    }
}

// 删除搜索记录
const onRemoveHistory = (text: string) => {
    const index = searchDataList.value.findIndex(item => item.value === text)
    if (index >= 0) searchDataList.value.splice(index, 1) // Remove item from list.
    // 失去焦点
    autocompleteRef.value?.blur()
}
// 删除所有搜索记录
const onRemoveHistoryAll = () => {
    searchDataList.value = []
    // 失去焦点
    autocompleteRef.value?.blur()
}

// 设置文字高亮
const setHighlightText = (text: string) => {
    if (!search.keyword?.trim()) return text
    // 使用正则表达式全局查找关键字
    const regex = new RegExp(search.keyword, 'g')

    // 将标注的内容替换到查到到的原内容
    const newP = `<span class="color-primary">${search.keyword}</span>`
    return text.replace(regex, newP)
}

watch(() => route.query.keyword, (val) => {
    search.keyword = val ? val as string : ''
})
onMounted(async () => {
    await wait(100)
    showTeleport.value = true
})
</script>

<template>
    <section class="header-box">
        <el-form class="overflow-hidden py25px" size="large" @submit.prevent="onSearch('')">
            <div class="flex items-center justify-between text-#f8f8f8 container">
                <div class="logo min-w150px">
                    <NuxtLink to="/">
                        <img class="h50px" :src="systemInfo?.shop_logo" height="50" alt="logo">
                    </NuxtLink>
                </div>
                <div class="search-box relative w50%">
                    <client-only>
                        <ElAutocomplete ref="autocompleteRef" v-model="search.keyword"
                            :fetch-suggestions="querySearchAsync" popper-class="pop-search" class="w100%"
                            :debounce="800" fit-input-width placeholder="" select-when-unmatched label="test"
                            @select="onSearch">
                            <template #prefix>
                                <i class="i-ep-search" />
                            </template>
                            <!-- <template #prepend>
                            <lazy-el-select v-model="search.select" placeholder="" style="width: 115px">
                                <el-option label="全部商品" value="1" />
                                <el-option label="精选商品" value="2" />
                                <el-option label="特价商品" value="3" />
                            </lazy-el-select>
                        </template> -->
                            <template #append>
                                <el-button type="primary" class="btn-search min-w120px" @click="onSearch('')">
                                    搜 索
                                </el-button>
                            </template>
                            <template #default="{ item }">
                                <div class="pop-item flex justify-between">
                                    <div class="pop-text text-13px" v-html="setHighlightText(item.value)" />
                                    <el-button v-if="item.history" size="small" link
                                        @click.stop="onRemoveHistory(item.value)">
                                        <span class="v1">搜索历史</span>
                                        <span class="pop-remove">删除</span>
                                    </el-button>
                                </div>
                            </template>
                        </ElAutocomplete>
                        <Teleport v-if="showTeleport" to=".pop-search">
                            <div v-if="showClear" class="pop-clear i-ep-delete" @click.stop="onRemoveHistoryAll" />
                        </Teleport>
                        <template #fallback>
                            <div class="flex items-center justify-between b-rounded-4px bg-#fff pl15px">
                                <i class="i-ep-search text-14px c-#a8abb2" />
                                <el-button type="primary" class="btn-search min-w120px">
                                    搜 索
                                </el-button>
                            </div>
                        </template>
                    </client-only>

                    <div v-if="searchHotList.length" class="search-hot">
                        热门搜索：<span v-for="(item) in searchHotList" :key="item" @click="onSearchHot(item)">{{ item
                        }}</span>
                    </div>
                </div>
                <div class="cart">
                    <!-- <NuxtLink to="/order/cart">
                        <el-badge :value="number" class="cart-number">
                            <el-button type="primary" class="min-w150px">
                                <i class="i-ep-shopping-cart-full mr8px" />
                                购物车
                            </el-button>
                        </el-badge>
                    </NuxtLink> -->
                    <NuxtLink to="/order/history">
                        <el-button type="primary" class="min-w150px">
                            <i class="i-ep-shopping-cart-full mr8px" />
                            历史记录
                        </el-button>
                    </NuxtLink>
                </div>
            </div>
        </el-form>

        <HeaderIndex />
    </section>
</template>

<style lang="scss" scoped>
.header-box {

    background-image: url('~/assets/images/banner-bg.png');
    background-position: top center;

    .cart-number {
        --el-bg-color: #ffa0a0;
    }

}

.search-box {

    :deep(.el-input) {
        --el-input-focus-border-color: transparent;
        // --el-input-border-radius: 10px;
    }

    // .el-input__wrapper,
    // .el-input {
    //   --el-input-border-radius: 10px;
    // }

    .el-input__wrapper {
        &.is-focus {
            box-shadow: none;
        }
    }

    :deep(.el-input-group__append) {
        overflow: hidden;
    }

    .btn-search {
        border-color: var(--el-button-bg-color);
        background-color: var(--el-button-bg-color);
        color: var(--el-color-white);
        --el-border-radius-base: 0;

        &:focus,
        &:hover {
            color: var(--el-button-hover-text-color);
            border-color: var(--el-button-hover-border-color);
            background-color: var(--el-button-hover-bg-color);
            outline: 0;
        }
    }
}

.search-hot {
    font-size: 12px;
    line-height: 1;
    position: absolute;
    left: 0px;
    margin-top: 5px;

    span {
        margin-right: 8px;
        color: var(--el-color-info-light-5);
        cursor: pointer;

        &:hover {
            color: var(--el-color-primary-light-3);
        }
    }
}
</style>

<style lang="scss">
.pop-search {
    .pop-item {
        .pop-remove {
            color: var(--el-color-primary);
            display: none;
        }

        &:hover {
            .v1 {
                display: none;
            }

            .pop-remove {
                display: block;
            }
        }
    }

    .pop-clear {
        position: absolute;
        right: 3px;
        bottom: 4px;
        // line-height: 16px;
        cursor: pointer;

        &:hover {
            color: var(--el-color-primary);
        }
    }
}
</style>
