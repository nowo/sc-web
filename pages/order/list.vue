<!-- 订单列表 -->
<script setup lang="ts">
import type { TableColumnCtx } from 'element-plus'
import { OrderApi } from '~/api/goods/order'

definePageMeta({
    layout: 'home',
    middleware: 'auth',
})

const route = useRoute()
const router = useRouter()
const page = useRouteQuery('page')

const defData = reactive({
    skeleton: true, // 显示骨架屏
    payList: { // 支付类型 1微信 2支付宝 3线下
        1: '微信',
        2: '支付宝',
        3: '线下',
    },
    stateList: { // 待支付 1，待发货 2，已发货 3，配货中 4，部分发货 5，已完成 6，已取消 7
        1: '待支付',
        2: '待发货',
        3: '待确认',
        4: '配货中',
        5: '部分发货',
        6: '已完成',
        7: '已取消',
    },

})

// form表单数据类型
interface FormSearchData {
    order_no: ''
    pay_type: '' | number
    consignee_name: ''
    status: ''
    time: ['', '']
}

const searchData = reactive<BaseFormToolType<FormSearchData>>({
    data: {
        order_no: '',
        pay_type: '',
        consignee_name: '',
        status: '',
        time: ['', ''],
    },
    config: [
        { itemProp: { label: '订单编号', prop: 'order_no' }, placeholder: '请输入订单编号', width: '180' },
        { itemProp: { label: '收件人', prop: 'consignee_name' }, placeholder: '请输入收件人名称', width: '160' },
        { itemProp: { label: '支付类型', prop: 'pay_type' }, slot: true, placeholder: '', width: '120' },
        { itemProp: { label: '状态', prop: 'status' }, slot: true, placeholder: '', width: '130' },
        { itemProp: { label: '下单时间', prop: 'time' }, slot: true, placeholder: '', width: '360' },

    ],
    hideBtn: false,
    // showAll: true,
    searchFunc: () => initTableData(),
})

type TableDataItem = OrderListTableData
const tableData = reactive<BaseTableDataType<TableDataItem>>({
    data: [],
    tableHeader: [
        // { property: '', label: '', type: "selection", width: 38, },
        // { property: 'goods_img', label: '图片', width: 60, align: "center", slot: true },
        { property: 'main_order_no', label: '订单信息', minWidth: 200, slot: true, className: 'goods-list-row', showOverflowTooltip: false },
        { property: 'meet_price', label: '订单金额', width: 170, align: 'right', slot: true, showOverflowTooltip: false },
        { property: 'consignee_name', label: '收货信息', minWidth: 130, slot: true, showOverflowTooltip: false },
        { property: 'order_status', label: '订单状态', width: 100, slot: true, align: 'center' },
        { property: 'operate', label: '操作', width: 100, slot: true, align: 'center', showOverflowTooltip: false },
        // { property: 'market_price', label: '市场价', width: 85, align: 'center' },
    ],
    pagination: {
        ...PAGINATION,
        page: /^[1-9]\d*$/.test(page.value) ? Number(page.value) : 1,
    },
})

const initTableData = async () => {
    const params: OrderApi_GetOrderList = {
        is_paging: 1,
        page: tableData.pagination.page,
        page_size: tableData.pagination.page_size,
        status: Number(searchData.data.status),
        main_order_no: searchData.data.order_no,
        pay_type: Number(searchData.data.pay_type) || '',
        consignee_name: searchData.data.consignee_name,
        start_time: '',
        end_time: '',
    }

    if (searchData.data.time?.[0]) {
        params.start_time = searchData.data.time[0] ?? ''
        params.end_time = searchData.data.time[1] ?? ''
    }

    const loading = useElLoading()

    const { data: res, error } = await OrderApi.getOrderList(params)
    await wait(300)
    loading?.close()
    if (error.value) return
    defData.skeleton = false

    if (res.value?.code !== 200) return ElMessage.error(res.value?.msg)

    const list: OrderListTableData[] = []
    res.value.data.lists.forEach((item, index) => {
        const goodsList = item.goods_info.map((item) => {
            item.goods_img = setGoodsOssImg(item.goods_img, 60)
            return item
        })
        const obj: OrderListTableData = {
            ...item,
            goods_info: goodsList,
            index: index + 1, // 序列号
        }
        const obj2: OrderListTableData = {
            ...obj,
            goods_info: goodsList,
            index: 0,
        }
        list.push(...[obj, obj2])
    })
    tableData.data = list
    tableData.pagination.total = res.value.data.total // 总条数

    router.replace({
        path: route.path,
        query: {
            ...route.query,
            page: tableData.pagination.page,
        },
    })
}

// table合并行
interface SpanMethodProps {
    row: OrderListTableData
    column: TableColumnCtx<OrderListTableData>
    rowIndex: number
    columnIndex: number
}

const arraySpanMethod = (item: SpanMethodProps) => {
    if (item.row.index) {
        if (item.columnIndex === 0) {
            return [1, 5]
        }
    }
}

const setRowClassName = (item: {
    row: OrderListTableData
    rowIndex: number
}) => {
    return item.row.index ? 'line-text' : ''
}

const setTagType = (row: number) => {
    const dat = {
        type: '',
        color: '',
        text: '',
    }
    // 'primary'| 'success'| 'warning'| 'danger'| 'info'
    // 1: '待支付', 2: '待发货', 3: '待确认', 4: '配货中', 5: '部分发货', 6: '已确认', 7: '已取消',
    const lis = {
        1: {
            type: '',
            color: '#ff6c00',
            text: '待支付',
        },
        2: {
            type: 'primary',
            color: '',
            text: '待发货',
        },
        3: {
            type: 'success',
            color: '',
            text: '待收货',
        },
        4: {
            type: '',
            color: '#626aef',
            text: '配货中',
        },
        5: {
            type: 'warning',
            color: '',
            text: '部分发货',
        },
        6: {
            type: 'warning',
            color: '#ff6c6c',
            text: '已完成',
        },
        7: {
            type: 'info',
            color: '',
            text: '已取消',
        },
    }
    const end = (lis[row as 1] ?? dat) as {
        type: ''
        color: string
        text: string
    }
    // console.log(end)
    return end
}

const setAddressText = (row: OrderApi_GetOrderListItem) => {
    return setArrayTextName([row.province, row.city, row.area, row.address], '  ')
}

// 设置优惠金额
const setPreferMoney = (row: OrderApi_GetOrderListItem) => {
    const num = Number(row.total_price) - Number(row.meet_price)
    return formatNumber(num > 0 ? num : 0) // 输出金额格式化的字符串
}

/**
 * 设置倒计时结束的时间
 */
const setEndTime = (row: OrderApi_GetOrderListItem) => {
    if (!row.end_time) return 0
    return row.end_time * 1000
}

/**
 * 倒计时结束事件（清除倒计时，订单设置为已取消）
 */
const onFinish = (row: OrderApi_GetOrderListItem) => {
    // 订单支付完成时，不处理
    if (row.order_status > 1) return
    tableData.data.forEach((item) => {
        if (item.main_order_no === row.main_order_no) {
            item.order_status = 7
        }
    })
}

// 查看详情
const onDetail = (row: OrderListTableData) => {
    navigateTo({
        path: '/order/detail',
        query: {
            order_no: row.main_order_no,
        },
    })
}

// 搜索
const onSearch = () => {
    tableData.pagination.page = 1
    initTableData()
}
// 分页切换
const onHandleCurrentChange = (pagination: BaseTableDataType['pagination']) => {
    initTableData()
}

//
const setTableList = (status: number) => {
    if (status === 7) initTableData()
}

initTableData()
</script>

<template>
    <LayoutUser>
        <el-skeleton :loading="defData.skeleton" animated>
            <template #template>
                <div class="mb20px flex items-center">
                    <el-skeleton-item class="mr10px py15px w10%!" />
                    <el-skeleton-item class="mr20px py15px w20%!" />
                    <el-skeleton-item class="mr10px py15px w10%!" />
                    <el-skeleton-item class="mr20px py15px w20%!" />
                    <el-skeleton-item class="mr15px py15px w10%!" />
                    <el-skeleton-item class="py15px w10%!" />
                </div>
                <div class="min-h500px">
                    <el-skeleton class="mb20px" />
                    <el-skeleton :rows="5" />
                </div>
            </template>
            <CoTableTool :data="searchData" inline @submit.prevent="onSearch">
                <template #pay_type="{ row }">
                    <el-select v-model="row.pay_type" clearable filterable placeholder="">
                        <el-option v-for="(item, index) in defData.payList" :key="index" :label="item" :value="index" />
                    </el-select>
                </template>
                <template #status="{ row }">
                    <el-select v-model="row.status" filterable clearable placeholder="">
                        <el-option v-for="(item, index) in defData.stateList" :key="index" :label="item" :value="index" />
                    </el-select>
                </template>
                <template #time="{ row }">
                    <CoDatePicker v-model="row.time" />
                </template>
            </CoTableTool>
            <CoTable v-model:page="tableData.pagination" v-model:table-header="tableData.tableHeader" class="table-box"
                :data="tableData.data" :row-class-name="setRowClassName" :span-method="arraySpanMethod" auto-height
                scrollbar-always-on border @update:page="onHandleCurrentChange">
                <template #main_order_no="{ scopes }">
                    <div v-if="scopes.row.index" class="flex justify-between">
                        <div>
                            订单编号：<span class="mr8px c-#000">{{ scopes.row.main_order_no }}</span>
                            下单时间：<span>{{ scopes.row.cerate_time }}</span>
                        </div>
                        <div v-if="scopes.row.pay_type === 3 && scopes.row.order_status === 1" class="flex items-center">
                            <i class="i-ep-clock mr3px mt2px" />
                            <el-countdown title="" format="[倒计时 剩余]DD[天]HH[时]mm[分]ss[秒]" :value="setEndTime(scopes.row)"
                                value-style="font-size:13px;" @finish="onFinish(scopes.row)" />
                        </div>
                    </div>
                    <ul v-else class="goods-list">
                        <li v-for="item in scopes.row.goods_info" :key="item.goods_id">
                            <CoImage class="h50px w50px" :src="item.goods_img" :icon-size="24" />
                            <div class="flex-1 pl10px">
                                <h3 class="tle">
                                    <NuxtLink :to="`/goods/${item.goods_sn}`" target="_blank">
                                        {{ item.goods_name }}
                                    </NuxtLink>
                                </h3>
                                <div class="pce text-12px c-#888">
                                    价格：<span class="mr5px">￥{{ item.price }}</span>
                                    数量：<span>{{ item.goods_number }}</span>
                                </div>
                            </div>
                        </li>
                    </ul>
                </template>
                <template #meet_price="{ scopes }">
                    <div v-if="scopes.row.index" />
                    <div v-else class="goods-amount">
                        <!-- <p>总金额：{{ scopes.row.total_price }}</p>
          <p>优惠金额：{{ scopes.row.coupon_price }}</p>
          <p>实付金额(含运费)：¥{{ scopes.row.meet_price }}</p> -->
                        <p class="text-12px">
                            优惠金额：-{{ setPreferMoney(scopes.row) }}
                        </p>
                        <p class="truncate c-#000" :title="`￥${scopes.row.meet_price}`">
                            实付金额: <span class="c-#f00">￥{{ scopes.row.meet_price }}</span>
                        </p>
                        <p class="b-t-1 text-12px">
                            <span v-if="scopes.row.pay_type === 1">微信支付</span>
                            <span v-else-if="scopes.row.pay_type === 2">支付宝支付</span>
                            <span v-else-if="scopes.row.pay_type === 3">线下支付</span>
                            <span v-else>--</span>
                        </p>
                    </div>
                </template>
                <template #consignee_name="{ scopes }">
                    <div v-if="scopes.row.index">
                        <!--  -->
                    </div>
                    <div v-else>
                        <p>
                            <span class="mr5px">{{ scopes.row.consignee_name }}</span>
                            <span>{{ scopes.row.consignee_phone }}</span>
                        </p>
                        <p>{{ setAddressText(scopes.row) }}</p>
                    </div>
                </template>
                <template #order_status="{ scopes }">
                    <div v-if="scopes.row.index" />
                    <div v-else class="cur-button">
                        <el-button :type="setTagType(scopes.row.order_status).type"
                            :color="setTagType(scopes.row.order_status).color" size="small" plain
                            class="pointer-events-none op-60">
                            {{ setTagType(scopes.row.order_status).text }}
                        </el-button>
                        <div class="mt3px">
                            <el-button link type="primary" size="small" @click="onDetail(scopes.row)">
                                订单详情
                            </el-button>
                        </div>
                    </div>
                </template>

                <template #operate="{ scopes }">
                    <template v-if="!scopes.row.index">
                        <OrderOperate size="small" link
                            :data="{ order_no: scopes.row.main_order_no, status: scopes.row.order_status, bill_status: scopes.row.bill_status, is_return: scopes.row.is_refund }"
                            @update="setTableList" />
                    </template>
                </template>
            </CoTable>
        </el-skeleton>
    </LayoutUser>
</template>

<style  lang="scss" scoped>
.table-box {
    :deep(.el-table) {
        font-size: 13px;

        // --el-table-row-hover-bg-color: var(--el-color-white);
        .line-text {
            background-color: var(--el-table-row-hover-bg-color);
        }

        .goods-list-row:has(.goods-list) {
            padding: 0;

            .cell {
                padding: 0;
            }
        }

    }
}

.goods-list {
    display: grid;
    gap: 10px;
    padding: 8px 12px;

    li {
        display: flex;

        &+li {
            border-top: 1px;
        }

    }

    .tle {
        line-height: 22px;
        max-height: 44px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        /* 需要显示的行数 */
        overflow: hidden;
        word-break: break-all;

        /* 强制英文单词断行 */
        a {
            color: #333;

            &:hover {
                color: var(--el-color-primary);
            }
        }

    }

}
</style>
