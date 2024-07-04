<!-- 订单详情页面 -->
<template>
    <LayoutUser>
        <el-skeleton :loading="defData.skeleton" animated>
            <template #template>
                <div class="pb15px">
                    <el-skeleton-item class="w20%!" />
                </div>
                <div class="mb20px border-1 p20px">
                    <el-skeleton />
                </div>
                <div class="mb20px border-1 p20px">
                    <el-skeleton />
                </div>
                <div class="min-h300px border-1 p20px">
                    <el-skeleton />
                </div>
            </template>
            <el-breadcrumb class="mb20px">
                <el-breadcrumb-item v-for="item in breadcrumbData" :key="item.id" :to="item.href">
                    {{ item.text }}
                </el-breadcrumb-item>
            </el-breadcrumb>
            <div class="mb20px border-1 p20px">
                <div class="order-top mb20px min-h40px">
                    <div class="lt">
                        <span class="mr20px">订单号：<b>{{ order_no }}</b></span>
                        <span>订单状态：
                            <el-text class="font-bold" size="large" :type="orderState.type"
                                :style="`color: ${orderState.color};`">
                                {{ orderState.text }}
                            </el-text>
                        </span>
                        <div v-if="orderInfo?.order_status === 1" class="mt10px">
                            您的订单已提交成功，请尽快完成付款哦！
                            <el-countdown v-if="orderInfo?.pay_type === 3" format="[剩余]DD[天]HH[时]mm[分]ss[秒]"
                                :value="setEndTime()" value-style="font-size:13px;color:#f00;" @finish="onFinish()" />
                        </div>
                    </div>
                    <div class="gt">
                        <OrderOperate class="order-ope"
                            :data="{ order_no, status: orderInfo!.order_status, bill_status: orderInfo!.bill_status, is_return: orderInfo!.is_refund }"
                            @update="updateOrder" />
                    </div>
                </div>
                <div class="bane-item">
                    <lazy-el-steps class="step-box" :active="stepSelect" finish-status="success">
                        <el-step v-for="(item, index) in orderInfo?.status_info" :key="index" :title="item.text"
                            :description="item.time" />
                    </lazy-el-steps>
                </div>
            </div>
            <div class="mb20px border-1 p20px">
                <div class="tle mb10px text-15px font-600 c-#222">
                    订单信息
                </div>
                <ul class="collect-item">
                    <!-- 下单时间：2023-05-30 13:18:38
                <li>
                    <div class="lt">
                        下单时间：
                    </div>
                    <div class="gt">
                        {{ orderInfo?.cerate_time }}
                    </div>
                </li> -->

                    <li>
                        <div class="lt">
                            收货信息：
                        </div>
                        <div class="gt">
                            <div>{{ orderInfo?.consignee_name }}&emsp;{{ orderInfo?.consignee_phone }}</div>
                            <el-text> {{ addressText }} </el-text>
                            <span class="ml8px text-12px c-#999"> 收货信息有误？请立即联系客服修改</span>
                        </div>
                    </li>
                    <li>
                        <div class="lt">
                            备注信息：
                        </div>
                        <div class="gt">
                            {{ orderInfo?.remarks }}
                        </div>
                    </li>
                    <li>
                        <div class="lt">
                            配送方式：
                        </div>
                        <div class="gt">
                            <div v-for="(item, index) in logisticsList" :key="index">
                                {{ item.logistics_name }} <span class="mr20px opacity-80">({{ item.logistics_no }})</span>
                                <span class="c-#666">发货时间：{{ item.create_time }}</span>

                                <span class="ml25px c-#222">{{ item.goods_name }}</span>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="lt">
                            支付方式：
                        </div>
                        <div class="gt">
                            <span v-if="orderInfo?.pay_type === 1">微信支付</span>
                            <span v-else-if="orderInfo?.pay_type === 2">支付宝支付</span>
                            <span v-else-if="orderInfo?.pay_type === 3" class="color-warning">线下支付</span>
                            <span v-else>--</span>
                        </div>
                    </li>
                    <li>
                        <div class="lt">
                            支付时间：
                        </div>
                        <div class="gt">
                            {{ orderInfo?.pay_time }}
                        </div>
                    </li>
                    <li v-if="orderInfo!.bill_status">
                        <div class="lt">
                            发票信息：
                        </div>
                        <div class="gt">
                            <el-link style="--el-link-font-size:13px;" @click="onInvoiceDetail">
                                <i class="i-ep-view inline-block" />查看
                            </el-link>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="mb10px border-1 p20px">
                <div class="tle mb10px text-15px font-600 c-#222">
                    商品信息
                </div>
                <el-table :data="orderInfo?.goods_list" border>
                    <el-table-column prop="goods_name" label="商品名称" min-width="180">
                        <template #default="{ row }">
                            <div class="h50px flex items-center">
                                <CoImage class="h50px w50px" :src="setGoodsOssImg(row.goods_img, 60)" />
                                <div class="pl10px">
                                    <NuxtLink class="goods-link" :to="`/goods/${row.goods_sn}`" target="_blank">
                                        {{ row.goods_name }}
                                    </NuxtLink>
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column prop="goods_code" label="商品型号" width="160" />
                <el-table-column prop="goods_spec" label="商品规格" width="160" /> -->
                    <el-table-column prop="price" label="商品价格" width="120" />
                    <el-table-column prop="goods_number" label="购买数量" width="100" align="center">
                        <template #default="{ row }">
                            <b>{{ row.goods_number }}</b>
                        </template>
                    </el-table-column>
                    <el-table-column prop="total" label="小计" width="110">
                        <template #default="{ row }">
                            <b>{{ formatNumber(row.price * row.goods_number) }}</b>
                        </template>
                    </el-table-column>
                </el-table>
                <ul class="prefer-ul pt5px">
                    <li>
                        <span class="item-title">商品总件数：</span>
                        <span class="item-text">{{ orderInfo?.total_number }}件</span>
                    </li>
                    <li>
                        <span class="item-title">商品总金额：</span>
                        <span class="item-text">￥{{ orderInfo?.total_price }}</span>
                    </li>
                    <li>
                        <span class="item-title">运费<i>(明细)</i>：</span>
                        <span class="item-text">￥{{ orderInfo?.freight_price }}</span>
                    </li>
                    <li>
                        <span class="item-title">优惠券抵扣金额：</span>
                        <span class="item-text">-￥{{ formatNumber(setPreferMoney) }}</span>
                    </li>
                    <li>
                        <span class="item-title">工游豆抵扣金额：</span>
                        <span class="item-text">-￥{{ orderInfo?.peas_price }}</span>
                    </li>
                    <li>
                        <span class="item-title">实付金额：</span>
                        <span class="item-text color-primary text-18px font-bold">￥{{ orderInfo?.meet_price
                        }}</span>
                    </li>
                </ul>
            </div>
            <OrderInvoiceModel ref="invoiceRef" />
        </el-skeleton>
    </LayoutUser>
</template>

<script lang="ts" setup>
import { OrderInvoiceModel } from '#components'
import { OrderApi, OrderInvoiceApi } from '~/api/goods/order'

const router = useRouter()
const backRoute = ref(router.options.history.state.back as string)

// 订单编号
const order_no = useRouteQuery('order_no')
const invoiceRef = ref<InstanceType<typeof OrderInvoiceModel>>()
const defData = reactive({
    skeleton: true, // 显示骨架屏

})

// 面包屑导航
const breadcrumbData = computed(() => {
    const _list = [
        { text: '个人中心', href: '/order/list', id: 1 },
        { text: '我的订单', href: backRoute.value, id: 2 },
        { text: '订单详情', href: '', id: 3 },
    ]

    if (backRoute.value?.includes('/order/return')) {
        _list[1].text = '退换货订单'
        _list[1].href = '/order/return' // 回跳到指定页面的操作页面,不传递参数的情况下，
    }
    return _list
})

// 订单信息
const orderInfo = ref<OrderApi_GetInfoResponse>()

// 订单状态
const orderState = computed(() => {
    return setOrderStatusType(orderInfo.value?.order_status || 0)
})
// 收货地址
const addressText = computed(() => {
    return setArrayTextName([orderInfo.value?.province, orderInfo.value?.city, orderInfo.value?.area, orderInfo.value?.address], ' ')
})
// 步骤选中
const stepSelect = computed(() => {
    let step = 0
    orderInfo.value?.status_info.forEach((item, index, arr) => {
        if (item.selected) {
            if (arr.length - 1 === index) {
                step = index + 1
            } else {
                step = index
            }
        }
    })
    return step
})

// 优惠券抵扣金额
const setPreferMoney = computed(() => {
    const num = Number(orderInfo.value?.coupon_price || 0)
    return num >= 0 ? num : 0
})

// 物流，去除单号重复的物流
const logisticsList = computed(() => {
    const arr = orderInfo.value?.order_logistics

    return arr

    // // 数组去重（根据物流单号去重）
    // const array = arr?.filter((item, index) => arr?.findIndex(opt => opt.logistics_no === item.logistics_no) === index)
    // return array || []

    // const list: OrderApi_GetInfoResponse['order_logistics'] = []
    //     orderInfo.value?.order_logistics.forEach((item) => {
    //         const node = list.find(opt => opt.logistics_no === item.logistics_no)
    //         if (!node) list.push(item)
    //     })
    //     return list
})

// 获取初始信息
const initDefaultData = async () => {
    // if (defData.ready) return false

    const { data, error } = await OrderApi.getInfo({ main_order_no: order_no.value })

    await wait(100)
    if (error.value) return

    defData.skeleton = false // 显示内容
    if (data.value?.code !== 200) return ElMessage.error(data.value?.msg)

    orderInfo.value = data.value.data

    // defData.ready = true
}

/**
 * 设置倒计时结束的时间
 */
const setEndTime = () => {
    if (!orderInfo.value?.end_time) return 0
    return orderInfo.value.end_time * 1000
}

/**
 * 倒计时结束事件（清除倒计时，订单设置为已取消）
 */
const onFinish = () => {
    orderInfo.value!.order_status = 7
}

/**
 * 更新订单状态
 */
const updateOrder = (status: number) => {
    if (status === 7) initDefaultData()
}

// 查看订单发票信息
const onInvoiceDetail = async () => {
    const { data } = await OrderInvoiceApi.info({ order_no: order_no.value })
    await wait(200)
    if (data.value?.code !== 200) return ElMessage.error(data.value?.msg)

    invoiceRef.value?.onOpenDialog(data.value.data, 3)
}

initDefaultData()

definePageMeta({
    layout: 'home',
    middleware: 'auth',
})
</script>

<style lang="scss" scoped>
.order-top {
    display: flex;
    font-size: 13px;

    .lt {
        flex: 1;
    }
}

.bane-item {
    padding: 20px;
    background: var(--el-fill-color-light);
    border-radius: 4px;
}

.collect-item {
    li {
        display: flex;
        font-size: 14px;
        border-bottom: 1px dashed var(--el-border-color);
        padding: 8px 0;

        .lt {
            color: #666666;
            width: 70px;
        }

        .gt {
            width: calc(100% - 70px);
        }
    }
}

.order-ope {
    display: flex;

    :deep(.item-ope) {
        &+.item-ope {
            margin-left: 10px;
        }
    }
}

.goods-link {
    &:hover {
        color: var(--el-color-primary);
    }
}

.prefer-ul {
    font-size: 12px;
    text-align: right;
    color: #333;
    line-height: 2;

    .item-text {
        display: inline-block;
        min-width: 90px;
        color: var(--el-color-primary);
    }
}
</style>
