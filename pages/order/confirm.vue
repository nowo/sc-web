<!-- 订单确认 -->
<template>
    <section class="text-14px">
        <div class="container">
            <el-skeleton :loading="defData.skeleton" animated>
                <template #template>
                    <div class="pb10px pt15px">
                        <el-skeleton-item class="w30%!" />
                    </div>
                    <div class="mb20px min-h500px bg-#fff p15px">
                        <el-skeleton :rows="5" />
                    </div>
                </template>
                <template v-if="defData.ready">
                    <el-breadcrumb class="py15px">
                        <el-breadcrumb-item v-for="item in breadcrumbData" :key="item.id" :to="item.href">
                            {{ item.text }}
                        </el-breadcrumb-item>
                    </el-breadcrumb>
                    <el-form ref="formRef" :model="form" :rules="rules" label-width="100" label-position="left">
                        <section class="sec-box">
                            <div class="tle">
                                <b>收货地址</b>
                                <el-button text bg size="small" @click="onAddressInvoice(1)">
                                    新增地址
                                </el-button>
                            </div>
                            <el-form-item prop="address_id" label-width="auto">
                                <el-radio-group v-if="defData.addressList.length" v-model="form.address_id"
                                    class="address-radio" @change="onChooseAddress">
                                    <el-radio v-for="item in defData.addressList" :key="item.address_id"
                                        :label="item.address_id">
                                        <span>{{ setAddressText(item) }}</span>
                                        <span class="mx5px opacity90">（{{ item.contacts }} 收）</span>
                                        <span class="mx5px">{{ item.phone }}</span>
                                        <em v-if="item.is_default" class="mx5px fw400 opacity70">默认地址</em>
                                        <!-- <em class="mx5px fw400 opacity70" @click.stop.prevent="console.log('test')">修改</em> -->
                                    </el-radio>
                                </el-radio-group>
                                <div v-else class="w100% text-center text-13px c-#666">
                                    暂无收货地址,请点击
                                    <span class="cursor-pointer hover:c-#d7231e" @click="onAddressInvoice(1)">新增地址</span>
                                </div>
                            </el-form-item>
                        </section>
                        <section v-if="systemStatus.is_bill" class="sec-box">
                            <div class="tle">
                                <b>发票信息</b>
                                <el-button text bg size="small" @click="onAddressInvoice(3)">
                                    新增发票抬头
                                </el-button>
                            </div>
                            <el-form-item prop="is_invoice" label="是否开发票">
                                <el-radio-group v-model="form.is_invoice" class="mr15px">
                                    <el-radio :label="1">
                                        是
                                    </el-radio>
                                    <el-radio :label="0">
                                        否
                                    </el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item v-if="form.is_invoice" prop="invoice_id" label="" label-width="auto">
                                <el-radio-group v-model="form.invoice_id" class="address-radio bill">
                                    <el-table :data="invoiceData" table-layout="fixed" border>
                                        <el-table-column prop="date" label="增值税发票" align="center">
                                            <template #default="{ row }">
                                                <el-radio v-for="item in row['1']" :key="item.bill_header_id"
                                                    :label="item.bill_header_id">
                                                    <span>抬头：{{ item.header }}</span>
                                                    <span class="mx10px opacity90">email：{{ item.enterprise_email }} </span>
                                                    <!-- <em v-if="item.is_default" class="mx5px fw400 opacity70">默认地址</em> -->
                                                </el-radio>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="name" label="普通发票" align="center">
                                            <template #default="{ row }">
                                                <el-radio v-for="item in row['2']" :key="item.bill_header_id"
                                                    :label="item.bill_header_id">
                                                    <span>抬头：{{ item.header }}</span>
                                                    <span class="mx10px opacity90">email：{{ item.enterprise_email }} </span>
                                                    <!-- <em v-if="item.is_default" class="mx5px fw400 opacity70">默认地址</em> -->
                                                </el-radio>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="address" label="电子普通发票" align="center">
                                            <template #default="{ row }">
                                                <el-radio v-for="item in row['3']" :key="item.bill_header_id"
                                                    :label="item.bill_header_id">
                                                    <span>抬头：{{ item.header }}</span>
                                                    <span class="mx10px opacity90">email：{{ item.enterprise_email }} </span>
                                                    <!-- <em v-if="item.is_default" class="mx5px fw400 opacity70">默认地址</em> -->
                                                </el-radio>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </el-radio-group>
                            </el-form-item>

                            <el-form-item v-if="form.is_invoice" prop="bill_address_id" label="收票地址">
                                <el-radio-group v-if="defData.addressList.length" v-model="form.bill_address_id"
                                    class="address-radio">
                                    <el-radio v-for="item in defData.addressList" :key="item.address_id"
                                        :label="item.address_id">
                                        <span>{{ setAddressText(item) }}</span>
                                        <span class="mx5px opacity90">（{{ item.contacts }} 收）</span>
                                        <span class="mx5px">{{ item.phone }}</span>
                                        <em v-if="item.is_bill_address" class="mx5px fw400 opacity70">默认地址</em>
                                    </el-radio>
                                </el-radio-group>
                                <div v-else class="w100% text-center text-13px c-#666">
                                    暂无收货地址,请点击
                                    <span class="cursor-pointer hover:c-#d7231e" @click="onAddressInvoice(2)">新增地址</span>
                                </div>
                            </el-form-item>
                        </section>
                        <section class="sec-box">
                            <div class="tle">
                                <b>商品列表</b>
                            </div>
                            <el-table :data="form.tableData">
                                <el-table-column prop="goods_name" label="商品名称" min-width="180">
                                    <template #default="{ row }">
                                        <div class="flex items-center">
                                            <CoImage class="h50px w50px" :src="row.goods_img" :icon-size="20" />
                                            <div class="pl10px">
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
                                        <b>{{ row.goods_number }}</b>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </section>
                        <section class="sec-box">
                            <div class="tle">
                                <b>支付方式</b>
                            </div>
                            <div>
                                <el-form-item prop="payType" label="" label-width="auto">
                                    <el-radio-group v-model="form.payType">
                                        <el-radio :label="1" border>
                                            在线支付
                                        </el-radio>
                                        <el-radio :label="2" border>
                                            对公转账
                                        </el-radio>
                                    </el-radio-group>
                                </el-form-item>
                            </div>
                            <div class="text-12px c-#888 -mt5px">
                                支持微信、支付宝在线支付
                            </div>
                        </section>
                        <section v-if="systemStatus.is_coupon || systemStatus.is_bean" class="sec-box">
                            <div class="flex-1">
                                <div class="tle">
                                    <b>优惠方式</b>
                                </div>
                            </div>
                            <el-form-item v-if="systemStatus.is_coupon" prop="coupon_id" label="优惠券">
                                <div v-if="defData.couponList.length" class="coupon-list">
                                    <GoodsCoupon v-for="item in defData.couponList" :key="item.coupon_draw_id"
                                        :class="{ on: item.coupon_draw_id === form.coupon_id }"
                                        @click="choseCoupon(item.coupon_draw_id)">
                                        {{ item.coupon_name }}立减{{ item.par_value }}元
                                    </GoodsCoupon>
                                    <GoodsCoupon :class="{ on: !form.coupon_id }" @click="choseCoupon(0)">
                                        不使用优惠券
                                    </GoodsCoupon>
                                </div>
                                <span v-else class="text-12px c-#888">暂无可用优惠券</span>
                            </el-form-item>
                            <el-form-item v-if="systemStatus.is_bean" prop="is_peas" label="是否使用工游豆" label-width="auto">
                                <el-radio-group v-model="form.is_peas" class="mr15px">
                                    <el-radio :label="1">
                                        是
                                    </el-radio>
                                    <el-radio :label="0">
                                        否
                                    </el-radio>
                                </el-radio-group>
                                <el-input-number v-if="form.is_peas && peasNumber.max" v-model="form.peas_number"
                                    :precision="0" :min="peasNumber.min" :max="peasNumber.max" />
                                <p class="ml10px text-12px c-#999">
                                    本单可用工游豆数量：<span class="mr10px c-#000">{{ defData.total_peas }}</span>
                                    我的工游豆：<span class="c-#000">{{ defData.user_peas }}</span>
                                </p>
                            </el-form-item>
                        </section>
                        <section class="sec-box flex mb0!">
                            <div class="flex-1">
                                <el-form-item prop="remark" label="备注信息">
                                    <el-input v-model="form.remark" maxlength="150" show-word-limit resize="none" :rows="3"
                                        type="textarea" />
                                </el-form-item>
                            </div>
                            <ul class="prefer-ul w300px">
                                <li>
                                    <span class="item-title">商品总件数：</span><span class="item-text">{{ defData.count_number
                                    }}件</span>
                                </li>
                                <li>
                                    <span class="item-title">商品总金额：</span><span class="item-text">￥{{
                                        formatNumber(defData.total_price)
                                    }}</span>
                                </li>
                                <li>
                                    <span class="item-title">运费<i>(明细)</i>：</span>
                                    <span class="item-text">￥{{ formatNumber(defData.freight_price) }}</span>
                                </li>
                                <!-- <li>
                                    <span class="item-title">运费减免：</span>
                                    <span class="item-text">-￥0.00</span>
                                </li> -->
                                <li>
                                    <span class="item-title">优惠券抵扣金额：</span>
                                    <span class="item-text">-￥{{ formatNumber(preferMoney) }}</span>
                                </li>
                                <li>
                                    <span class="item-title">工游豆抵扣金额：</span>
                                    <span class="item-text">-￥{{ formatNumber(beanMoney) }}</span>
                                </li>
                            </ul>
                        </section>
                        <section class="sec-box flex items-center justify-end b-t b-t-#eee">
                            <b class="mr30px">实付款：<span class="main-color text-24px">¥{{ formatNumber(payMoney)
                            }}</span></b>
                            <el-button type="primary" class="min-w150px" size="large" :loading="defData.btnLoading"
                                @click="onSubmit">
                                <b>提交订单</b>
                            </el-button>
                        </section>
                    </el-form>
                </template>
                <div v-else class="my15px min-h400px b-#eee bg-#fff">
                    <BaseError />
                </div>
            </el-skeleton>
        </div>
        <UserAddressModel ref="modelRef" @update="getAddress" />
        <UserInvoiceModel ref="invoiceRef" @update="getInvoice" />
    </section>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import { OrderApi } from '~/api/goods/order'
import { UserAddressApi } from '~/api/user/address'
import { UserAddressModel, UserInvoiceModel } from '#components'
import { UserInvoiceApi } from '~/api/user/invoice'

// 购物车数量，全局
const useCartNumber = useCartNumberState()
const { systemStatus } = useSystemState() // 商城状态

const router = useRouter()
const backRoute = ref(router.options.history.state.back as string)

const modelRef = ref<InstanceType<typeof UserAddressModel>>()
const invoiceRef = ref<InstanceType<typeof UserInvoiceModel>>()
const formRef = ref<FormInstance>()

const cart_id = useRouteQuery('cart_id') // 购物车id
const goods_id = useRouteQuery('goods_id') // 商品id
const goods_number = useRouteQuery('goods_number') // 商品数量

const defData = reactive({
    skeleton: true, // 默认打开骨架屏
    type: 1, // 添加收货地址使用 1：收货地址 2：发票地址
    addressList: [] as UserAddressApi_GetListResponse[], // 用户地址列表
    ready: true, // 页面正确

    invoiceList: [] as UserInvoiceApi_getListResponse[], // 所有发票列表

    couponList: [] as OrderApi_GetSettleResponse['coupon_list'], // 优惠券列表
    count_number: 0, // 商品总数量
    total_price: 0, // 订单总金额
    total_peas: 0, // 该订单可用工游豆
    user_peas: 0, // 当前可用工游豆
    freight_price: 0, // 运费
    ratio_scale: 0, // 工游豆换算金额的比例

    btnLoading: false,
})

const form = reactive({
    tableData: [] as OrderApi_GetSettleResponse['goods_list'],

    payType: 1, // 支付方式 1-在线，  2：对公转账
    address_id: '' as '' | number, // 地址id
    bill_address_id: '' as '' | number, // 发票地址

    is_invoice: 0, // 是否开发票 1：是 0：否 （默认1）
    invoice_id: '' as '' | number, // 发票id

    coupon_id: '' as '' | number, // 使用的优惠券编号或编号列表（可选）
    is_peas: 1, // 是否使用工游豆 1：是 0：否 (默认为1)
    peas_number: 0, // 使用的工游豆数量
    remark: '', // 备注信息
})

const rules = reactive<FormRules>({
    address_id: [{ required: true, message: '请设置收货地址', trigger: 'change' }],
    bill_address_id: [{ required: true, message: '请设置发票收货地址', trigger: 'change' }],
    invoice_id: [{ required: true, message: '请选择发票', trigger: 'change' }],
})

// 增值税发票
const invoiceData = computed(() => {
    const obj: {
        [key: string]: UserInvoiceApi_getListResponse[]
    } = {}
    defData.invoiceList.forEach((item) => {
        if (!obj[item.type]) {
            obj[item.type] = []
        }
        obj[item.type].push(item)
    })

    return [obj]
})

// 面包屑导航
const breadcrumbData = computed(() => {
    const _list = [
        { text: '首页', href: '/', id: 1 },
        { text: '购物车', href: '/order/cart', id: 2 },
        { text: '订单结算', href: '', id: 3 },
    ]
    // 不是从购物车进入时，删除进入购物车那项
    if (!backRoute.value?.includes('/order/cart')) {
        _list.splice(1, 1)
    }
    return _list
})

// 工游豆可用最大最小数量
const peasNumber = computed(() => {
    const min = 0
    const max = defData.user_peas > defData.total_peas ? defData.total_peas : defData.user_peas
    return { min, max }
})

// 优惠金额
const preferMoney = computed(() => {
    const node = defData.couponList.find(item => item.coupon_draw_id === form.coupon_id)
    if (!node) return 0
    return Number(node.par_value)
})
// 工游豆抵扣金额
const beanMoney = computed(() => {
    if (!form.is_peas) return 0
    if (!form.peas_number || !defData.ratio_scale) return 0
    return form.peas_number / defData.ratio_scale
})

// 需支付金额
const payMoney = computed(() => {
    const money = defData.total_price + defData.freight_price - beanMoney.value - preferMoney.value
    return money > 0 ? money : 0
})

const initDefaultData = async () => {
    const numReg = /^[1-9][0-9]*$/ // 检查数字是否合法或不包含数字的正则表达式 或 空或空字符串

    if (!cart_id.value && !numReg.test(goods_id.value)) {
        defData.skeleton = false
        defData.ready = false
        return
    }

    // 先获取用户地址,选中地址设置运费
    await initAddressData()

    // 获取结算商品信息、发票列表
    const res1 = await initGoodsData()
    await wait(300)
    defData.skeleton = false
    // console.log(res1)
    if (!res1) return defData.ready = false

    const data = res1
    // console.log('data :>> ', data)
    // 未获取到商品时
    if (!data.goods_list.length) return defData.ready = false

    form.tableData = data.goods_list.map((item) => {
        item.goods_img = setGoodsOssImg(item.goods_img, 60)
        return item
    })
    defData.couponList = data.coupon_list
    if (defData.couponList.length) {
        form.coupon_id = defData.couponList[0].coupon_draw_id
    }

    defData.count_number = data.number
    defData.total_price = Number(data.total_price)
    defData.total_peas = Math.floor(data.total_peas || 0)
    defData.user_peas = data.user_peas
    defData.freight_price = Number(data.freight_price)

    defData.ratio_scale = data.matrixing_scale || 0
}

// 获取结算的商品信息
const initGoodsData = async () => {
    // const num = Number(goods_number.value) ? (Number(goods_number.value) > 10000 ? 9999 : Number(goods_number.value)) : ''
    const num = Number(goods_number.value) || ''
    const { data, error } = await useFetch<{ data: OrderApi_GetSettleResponse } & ResponseCodeMsg>('/api/order/confirm', {
        method: 'POST',
        body: {
            cart_id: cart_id.value,
            goods_id: Number(goods_id.value),
            goods_number: num,
            address_id: form.address_id,
        },
    })

    // console.log(pending.value)
    await nextTick()
    // await wait(800)
    // console.log(pending.value)
    // console.log(error.value)
    // console.log('data.value?.code :>> ', data.value?.code)
    // 请求错误处理
    if (error.value) {
        return defData.ready = false
    }
    if (data.value?.code !== 200) {
        ElMessage.error(data.value?.msg)
        return defData.ready = false
    }
    return data.value.data
}

// 初始化收货地址，选中默认地址
const initAddressData = async () => {
    const res2 = await UserAddressApi.getList()
    await wait(350)
    await nextTick()
    if (res2 && res2.data.value?.code === 200) {
        const data = res2.data.value?.data
        defData.addressList = data

        // 选中默认地址
        const node = defData.addressList.find(item => item.is_default === 1)
        form.address_id = node?.address_id || ''

        const node2 = defData.addressList.find(item => item.is_bill_address === 1)
        form.bill_address_id = node2?.address_id || ''
    }
}

// 初始化发票列表
const initInvoiceData = async () => {
    // 不开发票时，不调用接口
    if (!systemStatus.value.is_bill) return false
    const res3 = await UserInvoiceApi.getList()
    await wait(300)
    if (res3 && res3.data.value?.code === 200) {
        const data = res3.data.value?.data
        defData.invoiceList = data
    }
}

// 地址信息拼接
const setAddressText = (row: UserAddressApi_GetListResponse) => {
    return setArrayTextName([row.province, row.city, row.area, row.address], '  ')
}

// 地址选中(设置运费)
const onChooseAddress = async () => {
    // 位置移动
    // const index = defData.addressList.findIndex(item => item.address_id === form.address_id)
    // if (index > 0) defData.addressList = moveArraySite(defData.addressList, index, 0)

    // 运费更新
    const dat = await initGoodsData()
    if (dat) defData.freight_price = dat.freight_price
}

/**
 * 新增地址、新增发票
 * @param type 1：收货地址 2：发票地址，3、新增发票
 */
const onAddressInvoice = async (type: 1 | 2 | 3) => {
    defData.type = type
    if (type === 1 || type === 2) {
        modelRef.value?.onOpenDialog()
    } else {
        invoiceRef.value?.onOpenDialog()
    }
}

// 新增地址处理
const getAddress = (params: UserAddressApi_Edit) => {
    if (!params.address_id) return
    const dat = {
        ...params,
        user_id: 0,
    }
    defData.addressList.push(dat)

    if (defData.type === 1) {
        form.address_id = params.address_id
        onChooseAddress() // 更新运费
    } else if (defData.type === 2) {
        form.bill_address_id = params.address_id
    }
}

/**
 * 获取新增的发票数据
 */
const getInvoice = (params: UserInvoiceApi_Edit) => {
    if (!params) return

    defData.invoiceList.push({
        ...params,
        header: params.enterprise_name,
        is_default: 0,
    })

    form.invoice_id = params.bill_header_id
}

// 选择优惠券
const choseCoupon = (id: number) => {
    form.coupon_id = id
}

// 提交订单
const onSubmit = async () => {
    const isRun = await useFormVerify(formRef.value)
    if (!isRun) return false

    let goods_peas = Number(form.peas_number)
    if (!form.is_peas || !goods_peas) { // 不使用工游豆，或者工豆为0时
        form.is_peas = 0
        goods_peas = 0
    }

    const params: OrderApi_ConfirmSettle = {
        is_peas: form.is_peas,
        goods_peas,
        address_id: Number(form.address_id),
        coupon_draw_id: form.coupon_id || 0,
        remarks: form.remark,
        pay_type: form.payType === 1 ? 1 : 2,
        bill_status: form.is_invoice ? 1 : 0, // 是否开票
        type: '',
        header: '',
        tax_no: '',
        enterprise_name: '',
        enterprise_email: '',
        logon_tel: '',
        logon_addr: '',
        bank: '',
        bank_account: '',
        bill_address_id: '',
    }

    // 进行开票
    if (params.bill_status) {
        const invoice = defData.invoiceList.find(item => item.bill_header_id === form.invoice_id)

        if (invoice) {
            params.bill_address_id = form.bill_address_id
            params.type = invoice.type
            params.header = invoice.header
            params.tax_no = invoice.tax_no
            params.enterprise_name = invoice.enterprise_name
            params.enterprise_email = invoice.enterprise_email

            if (invoice.type === 1) {
                params.logon_tel = invoice.logon_tel
                params.logon_addr = invoice.logon_addr
                params.bank = invoice.bank
                params.bank_account = invoice.bank_account
            }
        }
        //
    }

    // const resp = await useFetch('/api/test', {
    //     method: 'post',
    //     body: params,
    // })
    // console.log(resp)
    // console.log('params :>> ', params)
    // return
    defData.btnLoading = true
    const { data: res, error } = await OrderApi.confirmSettle(params)
    defData.btnLoading = false

    if (error.value) return
    if (res.value?.code === 200) {
        ElMessage.success('提交成功')
        const order_no = res.value.data.main_order_no

        // 从购物车来下单的，更新购物车商品数量
        if (cart_id.value) useCartNumber.setCartNumber()

        navigateTo({
            path: '/order/pay',
            query: {
                order_no, // 订单编号，
            },
        })
    } else {
        ElMessage.error(res.value?.msg)
    }
}

onBeforeMount(() => {
    initDefaultData()
    // 默认不开发票，获取发票列表可以慢点执行，
    initInvoiceData()
})

definePageMeta({
    layout: 'home',
    middleware: 'auth',
})
</script>

<style lang="scss" scoped>
.sec-box {
    background: var(--el-color-white);
    padding: 15px;
    margin-bottom: 20px;

    .tle {
        font-size: 15px;
        margin-bottom: 10px;

        b {
            margin-right: 8px;
        }
    }

    :deep(.el-table) {
        .cell {
            font-size: 13px;
        }
    }

}

.address-radio {
    display: flex;
    width: 100%;

    .el-radio {
        width: 100%;
        padding: 0 10px;
        border: 1px solid transparent;
        margin: 0;

        &:hover {
            background-color: var(--el-color-danger-light-9);
        }

        &.is-checked {
            font-weight: bold;
            border-color: var(--el-color-danger-light-7);
        }
    }

    &.bill {
        .el-radio {
            display: flex;
        }
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

.goods-link {
    font-size: 14px;

    &:hover {
        color: var(--el-color-primary);
    }
}

.coupon-list {
    display: flex;
    align-items: center;

    :deep(.coupon-pane) {
        --coupon-default-color: var(--el-text-color-regular);
        transform: unset;
        margin-right: 20px;
        cursor: pointer;
        padding: 2px 10px;

        &.on {
            --coupon-default-color: var(--el-color-primary)
        }
    }
}
</style>
