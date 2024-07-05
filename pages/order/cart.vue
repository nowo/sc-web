<!-- 购物车 -->
<script setup lang="ts">
import type { TableInstance } from 'element-plus'
import Big from 'big.js'
import { GoodsApi } from '~/api/goods/list'

type GoodsTableCartItem = GoodsApi_GetCartListResponse['goods_list'][0]

const useCartNumber = useCartNumberState()

const tableRef = ref<TableInstance>()

const defData = reactive({
    url: '',
    breadcrumbList: [],
    tableData: [] as GoodsTableCartItem[],
    selectData: [] as GoodsTableCartItem[], // 选中的商品
})

// 商品总金额
const countMoney = computed(() => {
    const money = defData.selectData.reduce((sum, item) => {
        return sum + Number(item.shop_price) * item.goods_number
    }, 0)

    return new Big(money).toFixed(2)
})

const initTableData = async () => {
    // 获取购物车商品
    const { data } = await GoodsApi.getCartList()
    await wait(500)
    if (data.value?.code === 200) {
        defData.tableData = data.value.data.goods_list.map((item) => {
            item.goods_img = setGoodsOssImg(item.goods_img, 60)
            return item
        })
    } else {
        ElMessage.error(data.value?.msg)
    }
}

// el-table多选事件
const handleSelectionChange = (val: GoodsTableCartItem[]) => {
    defData.selectData = val
}

/**
 * 删除购物车商品
 * @param row 当前行的数据对象。GoodsTableCartItem 或 多选选中的商品defData.selectData
 */
const onRemove = async (row: GoodsTableCartItem | 'all') => {
    let ids = ''
    if (row === 'all') { // 删除所有选中的商品
        if (!defData.selectData.length) return ElMessage.error('请选择需要删除的商品')
        ids = defData.selectData.map(item => item.id).join(',') // 获取选中的id
    } else {
        ids = row.id.toString()

        // // 获取到在tableData对应的下标
        // const index = defData.tableData.findIndex(item => item.goods_id === row.goods_id)
        // // console.log('index :>> ', index)
        // // 删除
        // defData.tableData.splice(index, 1)
    }

    const { data } = await GoodsApi.delCart({ id: ids }) // 删除选中的商品记录 或者 删除所有购物
    if (data.value?.code === 200) {
        initTableData() // 重新获取列表数据
        useCartNumber.setCartNumber() // 更新购物车数量
    } else {
        ElMessage.error(data.value?.msg) 
    }
}

// 数量增加减少
const onChangeNumber = useDebounceFn(async (row: GoodsTableCartItem) => {
    const { data } = await GoodsApi.editNum({
        id: row.id,
        number: row.goods_number,
    })
    if (data.value?.code === 200) {
        if (row.goods_number !== data.value?.data.number) row.goods_number = data.value?.data.number
        // if (data.value.data.goods_number < row.goods_number) row.goods_number = data.value.data.goods_number
        useCartNumber.setCartNumber() // 更新购物车数量
    }
}, 1000)

// 订单结算
const onSettle = () => {
    if (!defData.selectData.length) return false
    const ids = defData.selectData.map(item => item.id).join(',') // 获取选中的id

    navigateTo({
        path: '/order/confirm',
        query: { cart_id: ids },
    })
}

onBeforeMount(() => {
    initTableData()
})

definePageMeta({
    layout: 'home',
    middleware: 'auth',
})
</script>

<template>
    <section class="pb30px text-14px">
        <div class="container">
            <!-- <div class="mx-a my-20px w60%">
        <GoodsSettleStep :active="1" />
      </div> -->
            <el-breadcrumb class="py15px">
                <el-breadcrumb-item :to="{ path: '/' }">
                    首页
                </el-breadcrumb-item>
                <el-breadcrumb-item>购物车</el-breadcrumb-item>
            </el-breadcrumb>
            <div class="table-cart">
                <ElTable ref="tableRef" :data="defData.tableData" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55" align="center" />
                    <el-table-column prop="goods_name" label="商品名称" min-width="180">
                        <template #default="{ row }">
                            <div class="h45px flex items-center">
                                <CoImage class="h45px w45px" :src="row.goods_img" :icon-size="20" />
                                <div class="flex-1 pl10px">
                                    <NuxtLink class="goods-link" :to="`/goods/${row.goods_sn}`" target="_blank">
                                        {{ row.goods_name }}
                                    </NuxtLink>
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="goods_code" label="商品型号" width="160" />
                    <el-table-column prop="goods_spec" label="商品规格" width="160" />
                    <el-table-column prop="shop_price" label="价格" width="120" align="center" />
                    <el-table-column prop="goods_number" label="商品数量" width="150" align="center">
                        <template #default="{ row }">
                            <el-input-number v-model="row.goods_number" class="w100%!" :precision="0" :min="1" :max="9999"
                                @change="onChangeNumber(row)" />
                        </template>
                    </el-table-column>
                    <el-table-column prop="operate" label="操作" width="100" align="center">
                        <template #default="{ row }">
                            <el-button type="primary" size="small" link @click="onRemove(row)">
                                删除
                            </el-button>
                        </template>
                    </el-table-column>
                </ElTable>
            </div>
            <div class="table-cart-count">
                <div class="lt">
                    <el-button type="primary" link @click="onRemove('all')">
                        删除所选商品
                    </el-button>
                    <!-- <el-button type="primary" link>
            继续购物
          </el-button> -->
                </div>
                <div class="gt">
                    商品总价（未包含运费）： <b class="main-color text-20px">{{ countMoney }}</b> 元
                    <el-button class="ml5px tracking-2px" type="primary"
                        :disabled="defData.selectData.length ? false : true" @click="onSettle">
                        结算商品
                    </el-button>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped lang="scss">
.table-cart {
    min-height: 500px;
    background-color: var(--el-color-white);

    .goods-link {
        font-weight: bold;
        color: var(--el-table-text-color);

        &:hover {
            color: var(--el-color-primary);
            text-decoration: underline;
        }
    }
}

.table-cart-count {
    background-color: var(--el-color-white);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    border-top: 1px solid var(--el-border-color-lighter);
}
</style>
