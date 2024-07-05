<script setup lang="ts">
import { useApiServer } from '~/api/server'
import { GoodsApi } from '~/api/goods/list'
import { RecordApi } from '~/api/user/record'

definePageMeta({
    layout: 'home',
})

const userState = useUserState() // 用户信息
const useCartNumber = useCartNumberState() // 购物车商品数量
const { x, y } = useMouse() // 鼠标位置函数用于获取当前鼠标位置

const keyword = useRouteQuery('keyword') // 搜索
const cid = useRouteQuery('cid') // 分类
const bid = useRouteQuery('bid') // 品牌

const defData = reactive({
    // ready: false,
    skeleton: true, // 默认显示骨架屏
    isList: false, // 商品显示列表，还是网格
    breadcrumbList: [] as GoodsApi_GetListItemCate[], // 面包屑导航
    classList: [] as GoodsApi_GetListItemCate[], // 商品分类
    brandList: [] as GoodsApi_GetListItemBrand[], // 商品品牌
    tableData: [] as GoodsApi_GetListItem[], // 商品列表
    showClass: false, // 显示所有分类
    showBrand: false, // 显示所有品牌
    optChose: 1, // 1:默认选中状态，2：销量，3：价格
})

const form = reactive({
    cate_id: [],
    brand_id: [],
    price_sort: '', // 价格排序方式   'desc' | 'asc'
    is_stock: false, // 是否有库存
    min_price: '', // 最低价
    max_price: '', // 最高价

    page: 1,
    pageSize: 60,
    pageSizes: [60, 120, 150],
    total: 0,

})

// 取得品牌名称
const brandName = computed(() => {
    if (!bid.value) return ''
    const brand = defData.brandList.find(item => item.brand_id === Number(bid.value))
    return brand?.brand_name || '' // 品牌名称
})

// 获取初始数据
const initTableData = async () => {
    // 滚动条回到顶部(web端调用)
    if (import.meta.client) {
        if (document) document.documentElement.scrollTop = 0
    }

    const params: GoodsApi_GetList = {
        is_paging: 1,
        page: form.page,
        page_size: form.pageSize,
        keyword: keyword.value?.trim() ?? '', // 关键词或名称匹配的商品列表匹配到这个字符串中的任何一个
        cat_id: Number(cid.value),
        brand_id: Number(bid.value), // 品牌id
    }

    if (!params.keyword) delete params.keyword
    if (!params.cat_id) delete params.cat_id
    if (!params.brand_id) delete params.brand_id

    // 销量排序 （desc或asc）
    if (defData.optChose === 2) params.sale_number = 'desc'
    // 价格排序 （desc或asc）
    if (defData.optChose === 3) {
        params.shop_price = form.price_sort === 'desc' ? 'desc' : 'asc'
    }

    // 价格范围
    let price_range = ''
    if (form.min_price || form.max_price) {
        if (form.min_price && form.max_price) {
            price_range = `${form.min_price}-${form.max_price}`
        } else if (form.min_price) {
            price_range = `${form.min_price}-${10 ** 8}`
        } else if (form.max_price) {
            price_range = `0-${form.max_price}`
        }
    }
    if (price_range) params.price_interval = price_range // 价格范围-范围/范围/总价格/价格范围/

    if (form.is_stock) params.goods_number = 1

    // console.log('params :>> ', params)
    const loading = useElLoading()

    const { data } = await useApiServer.getGoodsList(params)

    loading?.close()
    const dat = data.value!.data
    defData.breadcrumbList = dat.category.position
    defData.classList = dat.category.lists
    defData.brandList = dat.brand

    defData.tableData = dat.goods.lists.map((item) => {
        item.goods_img = setGoodsOssImg(item.goods_img, 300)
        return item
    }) || []
    form.total = dat.goods.total || 0

    defData.skeleton = false // 关闭骨架屏
}

// 切换商品显示列表
const toggleShowList = (param: boolean) => {
    if (defData.isList === param) return
    defData.isList = param
}

// 商品分类展开、收起
const toggleClass = () => {
    defData.showClass = !defData.showClass
}
// 商品分类展开、收起
const toggleBrand = () => {
    defData.showBrand = !defData.showBrand
}

// 商品分类选中
const onChoseClass = (id: number) => {
    linkGoodsList({ query: { cid: id }, relate: true })
}
// 商品品牌选中
const onChoseBrand = (id: number) => {
    // 品牌已选中时，清空选中状态
    const brand_id = id === Number(bid.value) ? '' : id
    linkGoodsList({ query: { bid: brand_id }, relate: true })
}

// 分页数量点击
const onHandleSizeChange = () => {
    initTableData()
}

// 选择销量、价格排序、库存等
const onChoseOpt = (type: number) => {
    if (type === 3) { // 价格排序
        if (defData.optChose === type) {
            form.price_sort = form.price_sort === 'asc' ? 'desc' : 'asc'
        }
        if (!form.price_sort) form.price_sort = 'asc'
    }

    defData.optChose = type

    nextTick(() => {
        initTableData()
    })
}

// 有无库存
const onStockChange = () => {
    initTableData()
}

// 价格范围
const onPriceRange = () => {
    initTableData()
}

// 商品收藏
const onAddCollect = async (row: GoodsApi_GetListItem) => {
    // 用户未登录时
    if (!userState.token.value) {
        return navigateTo('/login')
    }
    // 已经收藏了，取消收藏状态
    if (row.is_collect) {
        // 清除收藏
        const params: RecordApi_Del = {
            goods_ids: row.goods_id.toString(),
            type: 1,
        }
        const { data } = await RecordApi.del(params)
        if (data.value?.code === 200) {
            row.is_collect = 0 // 清除收藏标志位
        }
    } else {
        const params: RecordApi_Add = {
            goods_id: row.goods_id,
            type: 1,
        }
        const { data } = await RecordApi.add(params)
        if (data.value?.code === 200) {
            row.is_collect = 1
        }
    }
}

// 加入购物车
const onAddCart = async (row: GoodsApi_GetListItem) => {
    // 用户未登录时，不允许加入购物车页面
    if (!userState.token.value) {
        // TODO 使用弹窗登陆效果更好
        return navigateTo('/login')
    }
    const price = row.shop_price || ''
    if (Number(price) <= 0) {
        return ElMessage.warning('商品价格不正确')
    }

    const number = 1 // 默认加1购物车条目
    const { data } = await GoodsApi.addCart({ goods_id: row.goods_id, goods_number: number })
    if (data.value?.code === 200) {
        useCartNumber.setCartNumber() // 更新购物车商品数量
        ElMessage.success('加入购物车成功')

        // 设置动画
        useCartNumber.setShopAnimate({ top: y.value, left: x.value })
    } else {
        ElMessage.error(data.value?.msg || '加入购物车失败')
    }
}

initTableData()

watch(() => [keyword.value, cid.value, bid.value], () => {
    // if (!keyword.value && !cid.value && !bid.value) return
    initTableData()
})
</script>

<template>
    <section class="text-14px">
        <div class="container">
            <el-skeleton :loading="defData.skeleton" animated>
                <template #template>
                    <div class="pb10px pt15px">
                        <el-skeleton-item style="width: 30%" />
                    </div>
                    <div class="goods-attr">
                        <div class="goods-attr-item">
                            <div class="left">
                                <el-skeleton-item />
                            </div>
                            <div class="right items-center">
                                <el-skeleton-item class="mr10px w15%!" />
                                <el-skeleton-item class="mr10px w10%!" />
                                <el-skeleton-item class="mr10px w10%!" />
                                <el-skeleton-item class="mr10px w10%!" />
                                <el-skeleton-item class="mr10px w15%!" />
                                <el-skeleton-item class="w15%!" />
                            </div>
                        </div>
                        <div class="goods-attr-item">
                            <div class="left">
                                <el-skeleton-item />
                            </div>
                            <div class="right items-center">
                                <el-skeleton-item class="mr10px w10%!" />
                                <el-skeleton-item class="mr10px w15%!" />
                                <el-skeleton-item class="mr10px w10%!" />

                                <el-skeleton-item class="w15%!" />
                            </div>
                        </div>
                    </div>
                    <div class="goods-opt">
                        <dl class="goods-opt-dl">
                            <dd class="goods-opt-item w100px">
                                <el-skeleton-item />
                            </dd>
                            <dd class="goods-opt-item w100px">
                                <el-skeleton-item />
                            </dd>
                            <dd class="goods-opt-item w100px">
                                <el-skeleton-item />
                            </dd>
                            <dd class="goods-opt-item w150px">
                                <el-skeleton-item />
                            </dd>
                        </dl>
                        <dl class="goods-opt-dl">
                            <dd class="goods-opt-item w60px">
                                <el-skeleton-item />
                            </dd>
                            <dd class="goods-opt-item w60px">
                                <el-skeleton-item />
                            </dd>
                            <dd class="goods-opt-item w150px">
                                <el-skeleton-item />
                            </dd>
                        </dl>
                    </div>
                    <div class="min-h800px" />
                </template>

                <el-breadcrumb class="goods-breadcrumb">
                    <el-breadcrumb-item :to="{ path: '/' }">
                        首页
                    </el-breadcrumb-item>
                    <el-breadcrumb-item v-for="item in defData.breadcrumbList" :key="item.cat_id">
                        <NuxtLink :to="linkGoodsList({ query: { cid: item.cat_id }, relate: true, url: true })">
                            {{ item.cat_name }}
                        </NuxtLink>
                    </el-breadcrumb-item>
                    <el-breadcrumb-item v-if="brandName">
                        {{ brandName }}
                    </el-breadcrumb-item>
                </el-breadcrumb>
                <el-form size="small">
                    <div class="goods-attr">
                        <div v-if="defData.classList.length" class="goods-attr-item">
                            <div title="分类" class="left">
                                分类
                            </div>
                            <div class="right">
                                <div class="attr-list" :class="defData.showClass ? '' : 'attr-collect'">
                                    <el-check-tag v-for="item in defData.classList" :key="item.cat_id"
                                        @change="onChoseClass(item.cat_id)">
                                        {{ item.cat_name }}
                                    </el-check-tag>
                                </div>
                                <el-button class="mx4px my3px" size="small" @click="toggleClass">
                                    <template v-if="defData.showClass">
                                        收起
                                        <i class="i-ep-arrow-up" />
                                    </template>
                                    <template v-else>
                                        展开
                                        <i class="i-ep-arrow-down" />
                                    </template>
                                </el-button>
                            </div>
                        </div>
                        <div class="goods-attr-item">
                            <div title="品牌" class="left">
                                品牌
                            </div>
                            <div class="right">
                                <div class="attr-list" :class="defData.showBrand ? '' : 'attr-collect'">
                                    <el-check-tag v-for="item in defData.brandList" :key="item.brand_id"
                                        :checked="item.brand_id === Number(bid) ? true : false"
                                        @change="onChoseBrand(item.brand_id)">
                                        {{ item.brand_name }}
                                    </el-check-tag>
                                </div>
                                <el-button class="mx4px my3px" size="small" @click="toggleBrand">
                                    <template v-if="defData.showBrand">
                                        收起
                                        <i class="i-ep-arrow-up" />
                                    </template>
                                    <template v-else>
                                        展开
                                        <i class="i-ep-arrow-down" />
                                    </template>
                                </el-button>
                            </div>
                        </div>
                    </div>
                    <div class="goods-opt">
                        <dl class="goods-opt-dl">
                            <dd class="goods-opt-item cursor-pointer" :class="defData.optChose === 1 ? 'on' : ''"
                                @click="onChoseOpt(1)">
                                默认
                            </dd>
                            <dd class="goods-opt-item cursor-pointer" :class="{ on: defData.optChose === 2 }"
                                @click="onChoseOpt(2)">
                                销量
                                <i class="i-ic-baseline-arrow-downward" />
                            </dd>
                            <dd class="goods-opt-item cursor-pointer" :class="{ on: defData.optChose === 3 }"
                                @click="onChoseOpt(3)">
                                价格
                                <i v-if="defData.optChose !== 3" class="i-ep-sort" />
                                <i v-if="defData.optChose === 3 && form.price_sort === 'asc'" class="i-ep-sort-up" />
                                <i v-if="defData.optChose === 3 && form.price_sort === 'desc'" class="i-ep-sort-down" />
                            </dd>
                            <dd class="goods-opt-item checkbox">
                                <el-checkbox v-model="form.is_stock" label="有库存" @change="onStockChange" />
                            </dd>
                            <dd class="goods-opt-item">
                                <el-input v-model="form.min_price" class="w70px!" size="small" placeholder="最低价"
                                    clearable />
                                <span class="mx5px">-</span>
                                <el-input v-model="form.max_price" class="w70px!" size="small" placeholder="最高价"
                                    clearable />
                                <el-button class="ml5px" size="small" @click="onPriceRange">
                                    搜索
                                </el-button>
                            </dd>
                        </dl>
                        <dl class="goods-opt-dl">
                            <dd class="goods-opt-item cursor-pointer" :class="{ show: !defData.isList }"
                                @click="toggleShowList(false)">
                                <i class="i-ep-menu" />
                            </dd>
                            <dd class="goods-opt-item cursor-pointer" :class="{ show: defData.isList }"
                                @click="toggleShowList(true)">
                                <i class="i-ic-baseline-table-rows" />
                            </dd>
                            <dd class="goods-opt-item b-0">
                                共 {{ form.total }} 件相关商品
                            </dd>
                        </dl>
                    </div>
                </el-form>
                <div v-if="defData.tableData.length" class="goods-list">
                    <!-- 列表 -->
                    <dl v-if="defData.isList" class="goods-list-dl">
                        <dt class="goods-item-s">
                            <div class="w450px px20px!">
                                商品信息
                            </div>
                            <div class="w180px">
                                品牌
                            </div>
                            <div class="w180px">
                                型号
                            </div>
                            <div class="w150px text-center">
                                价格
                            </div>
                            <div class="flex-1 text-center">
                                操作
                            </div>
                        </dt>
                        <dd v-for=" item in defData.tableData" :key="item.goods_id" class="goods-item-s">
                            <div class="g-info w450px">
                                <div class="g-info-left">
                                    <NuxtLink :to="`/goods/${item.goods_sn}`" target="_blank">
                                        <CoImage class="hov-img w100% pb100%" :src="item.goods_img" :icon-size="28" />
                                    </NuxtLink>
                                </div>
                                <div class="g-info-right">
                                    <div class="g-info-name">
                                        <NuxtLink class="link" :to="`/goods/${item.goods_sn}`" target="_blank">
                                            {{ item.goods_name }}
                                        </NuxtLink>
                                    </div>
                                    <div class="tags">
                                        <el-tag v-if="item.is_new" type="success">
                                            新品
                                        </el-tag>
                                        <el-tag v-if="item.is_hot" class="ml-5px" type="warning">
                                            热销
                                        </el-tag>
                                        <el-tag v-if="item.is_best" class="ml-5px" type="danger">
                                            精选
                                        </el-tag>
                                    </div>
                                </div>
                            </div>
                            <div class="g-brand w180px">
                                <el-tag>{{ item.brand_name }}</el-tag>
                            </div>
                            <div class="g-code w180px">
                                {{ item.goods_code }}
                            </div>
                            <div class="g-price w150px text-center">
                                <div class="g-price-1">
                                    <!-- <i>￥</i>
                                    <span>{{ formatNumber(item.shop_price) }}</span> -->
                                    -
                                    <!-- <span class="integer">157</span><span class="decimal">.90</span><span
                                        class="unit">/个</span> -->
                                </div>
                                <!-- <div class="g-price-2">
                                    <span class="member-price">
                                        ￥ ？
                                    </span>
                                    <span class="member-title">
                                        会员价
                                    </span>
                                </div> -->
                            </div>
                            <div class="flex-1 text-center">
                                <el-button :class="{ focus: item.is_collect }" class="w100%" @click="onAddCollect(item)">
                                    <i :class="item.is_collect ? `i-carbon-favorite-filled` : 'i-carbon-favorite'" />
                                    <span class="ml5px">收藏</span>
                                </el-button>
                                <!-- <el-button type="primary" @click="onAddCart(item)">
                                    <i class="i-carbon-shopping-cart" />
                                    加入购物车
                                </el-button> -->
                                <!-- <br> -->
                                <!-- <el-button v-if="item.goods_id % 2" class="focus">
                                    <i class="i-carbon-favorite-filled" />
                                    收藏
                                </el-button>
                                <el-button v-else>
                                    <i class="i-carbon-favorite" />
                                    收藏
                                </el-button> -->
                            </div>
                        </dd>
                    </dl>
                    <!-- 网格 -->
                    <ul v-else class="goods-list-ul">
                        <li v-for=" item in defData.tableData" :key="item.goods_id">
                            <div class="goods-list-item">
                                <NuxtLink :to="`/goods/${item.goods_sn}`" target="_blank">
                                    <CoImage class="hov-img w100% pb100%" :src="item.goods_img" loading="lazy" />
                                </NuxtLink>
                                <div v-if="0" class="goods-price">
                                    <div class="goods-price-left">
                                        <i>￥</i><span class="integer">{{ formatNumber(item.shop_price) }}</span>
                                        <!-- <span class="unit">/台</span> -->
                                    </div>
                                    <!-- <div class="goods-price-right">
                                        <span class="member-price">
                                            ￥ ？
                                        </span>
                                        <span class="member-title">
                                            会员价
                                        </span>
                                    </div> -->
                                </div>
                                <div class="goods-name" :title="item.goods_name">
                                    <NuxtLink :to="`/goods/${item.goods_sn}`" target="_blank">
                                        {{ item.goods_name }}
                                    </NuxtLink>
                                </div>
                                <div class="goods-desc">
                                    <!-- <p class="truncate">
                                    <span>订货编码：{{item.goods_code}}</span><i class="iconfont copy-icon"></i>
                                </p> -->
                                    <p class="mb3px truncate">
                                        <span>商品型号：{{ item.goods_code }}</span>
                                    </p>
                                </div>
                                <div class="goods-bot flex">
                                    <el-button :class="{ focus: item.is_collect }" class="w100%" @click="onAddCollect(item)">
                                        <i
                                            :class="item.is_collect ? `i-carbon-favorite-filled` : 'i-carbon-favorite'" />
                                                                                <span class="ml5px">收藏</span>
                                    </el-button>
                                    <!-- v-if="item.is_collect"
                                    <el-button v-else>
                                        <i class="i-carbon-favorite" />
                                    </el-button> -->
                                    <!-- <el-button class="flex-1" @click="onAddCart(item)">
                                        <i class="i-carbon-shopping-cart" />
                                        加入购物车
                                    </el-button> -->
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
                <div v-else class="min-h500px flex items-center justify-center">
                    <p class="text-12px c-#777">
                        暂无相应的商品或者商品已下架！
                    </p>
                </div>
                <div v-if="form.total" class="goods-pagination">
                    <el-pagination v-model:current-page="form.page" v-model:page-size="form.pageSize"
                        :page-sizes="form.pageSizes" background size="small" layout="total, prev, pager, next, jumper"
                        :total="form.total" @size-change="onHandleSizeChange" @current-change="onHandleSizeChange" />
                </div>
            </el-skeleton>
        </div>
    </section>
</template>

<style scoped lang="scss">
.goods-breadcrumb {
    padding: 15px 0;
}

.goods-attr {

    background-color: var(--el-color-white);
    border: 1px solid var(--el-color-info-light-7);
    font-size: 14px;

}

.goods-attr-item {
    display: flex;
    --attr-left-width: 100px;
    --goods-item-height: 38px;

    +.goods-attr-item {
        border-top: 1px solid var(--el-color-info-light-7);
    }

    .left {
        width: var(--attr-left-width);
        line-height: var(--goods-item-height);
        padding: 0 8px;
        border-right: 1px solid var(--el-color-info-light-7);
        font-weight: bold;
    }

    .right {
        width: calc(100% - var(--attr-left-width));
        padding: 4px;
        display: flex;
        flex-wrap: wrap;

        .attr-list {
            flex: 1;
            overflow: hidden;
        }

        .attr-collect {
            height: 30px;
        }
    }

    :deep(.el-check-tag) {
        --el-color-info: #555;
        --el-color-info-light-9: transparent;

        line-height: 22px;
        padding: 0 5px;
        margin: 4px 5px;
        font-size: 12px;
        font-weight: normal;

        &:hover {
            background-color: var(--el-color-primary-light-8);
            color: var(--el-color-primary);
        }
    }

}

.goods-opt {
    --goods-opt-height: 38px;
    margin: 15px 0 7px;
    border: 1px solid var(--el-color-info-light-7);
    background-color: var(--el-color-white);
    display: flex;
    justify-content: space-between;
    height: var(--goods-opt-height);
    font-size: 12px;

    .goods-opt-dl {
        display: flex;

        &:nth-child(2n) {
            .goods-opt-item {
                border: 0;
                border-left: 1px solid var(--el-color-info-light-7);
            }
        }
    }

    .goods-opt-item {
        padding: 0 20px;
        line-height: var(--goods-opt-height);
        border-right: 1px solid var(--el-color-info-light-7);
        display: flex;
        align-items: center;
        color: var(--el-text-color-regular);

        &.cursor-pointer:not(.on):hover {
            color: var(--el-color-primary);
        }

        &.on {
            background-color: var(--el-color-primary);
            color: var(--el-color-white)
        }

        &.checkbox {
            padding: 0;

            :deep(.el-checkbox) {
                padding: 0 20px;
                height: 100%;

                &:hover {
                    color: var(--el-color-primary);
                }
            }
        }

        &.show {
            color: var(--el-color-primary);
        }
    }
}

.goods-list {
    .hov-img {
        :deep(>img) {
            transition: all 0.3s;
        }

        &:hover {
            :deep(>img) {
                transform: scale(1.05);
            }
        }

    }
}

.goods-list-ul {
    display: grid;
    gap: 12px;
    grid-template-columns: repeat(5, 1fr);
    padding: 10px 0;
}

// 网格
.goods-list-item {
    padding: 10px;
    background-color: var(--el-color-white);
    border-radius: 2px;

    &:hover {
        box-shadow: 0 0 5px 0 rgba(0, 0, 0, .12);
    }

    .goods-price {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 5px;

        .goods-price-left {
            font-size: 16px;
            font-weight: bold;
            color: var(--el-color-primary);

            .unit {
                font-size: 14px;
                color: #666;
                padding-left: 4px;
            }
        }
    }

    .goods-name {
        font-size: 14px;
        color: #000;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        line-height: 20px;
        height: 40px;
        overflow: hidden;
        margin-bottom: 8px;
        font-weight: bold;

        >a:hover {
            color: var(--el-color-primary);
            text-decoration: underline;
        }
    }

    .goods-desc {
        font-size: 12px;
    }

    .goods-bot {
        .focus {
            color: var(--el-button-hover-text-color);
            border-color: var(--el-button-hover-border-color);
            background-color: var(--el-button-hover-bg-color);
            outline: 0;
        }
    }
}

// 列表
.goods-list-dl {
    background-color: var(--el-color-white);

    .goods-item-s {
        display: flex;
        padding: 12px 0;

        +.goods-item-s {
            border-top: 1px dashed var(--el-color-info-light-7);
        }

        &>* {
            padding: 0 8px;
        }

        .g-price {
            padding: 5px;

            &-1 {
                color: var(--el-color-primary);
                font-size: 16px;
                font-weight: bold;

                .unit {
                    font-size: 14px;
                    color: #666;
                    padding-left: 4px;
                }
            }

            &-2 {
                display: inline-block;
                border: 1px solid var(--el-color-primary-light-3);
                padding: 0 2px;
                font-size: 12px;
            }

            &-3 {
                color: #999;
                text-decoration: line-through;
                font-size: 12px;
            }

        }

        .focus {
            color: var(--el-button-hover-text-color);
            border-color: var(--el-button-hover-border-color);
            background-color: var(--el-button-hover-bg-color);
            outline: 0;
        }
    }

    dd.goods-item-s:hover {
        background-color: #fafafa;
    }
}

.g-info {
    display: flex;
    --goods-info-img-width: 80px;

    .g-info-left {
        width: var(--goods-info-img-width);
    }

    .g-info-right {
        width: calc(100% - var(--goods-info-img-width));
        padding: 0 10px;

    }

    .g-info-name {
        // height: 48px;
        max-height: 48px;
        margin-bottom: 5px;
        font-weight: bold;

        .link {
            line-height: 24px;
            max-height: 48px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;

            &:hover {
                cursor: pointer;
                color: var(--el-color-primary);
                text-decoration: underline;
            }
        }
    }
}

.goods-pagination {
    padding: 20px 0 30px;

    :deep(.el-pagination) {
        --el-pagination-button-bg-color: var(--el-color-white);
        justify-content: center;
        --el-disabled-bg-color: var(--el-border-color);
    }
}
</style>
