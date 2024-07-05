<script lang="ts" setup>
import QRCode from 'qrcode'
import { OrderApi } from '~/api/goods/order'

const usePayType = usePayTypeState()
// 支持的支付方式
const payTypeList = await usePayType.getPayTypeList()
// console.log('payTypeList :>> ', payTypeList)

// const alipayRef = ref<HTMLDivElement>()

// 获取商城信息
const { getSystemInfo } = useSystemState()
const systemInfo = await getSystemInfo()

const defData = reactive({
    skeleton: true, // 默认打开骨架屏
    ready: true,

    orderInfo: {} as OrderApi_GetInfoResponse | undefined, // 订单信息
    payInfo: {} as OrderApi_PayOrderResponse['bank_info'] | undefined, // 支付信息(线下支付)
    endTime: 0, // 支付截至时间
    countDown: { // 倒计时
        day: '', // 天
        hour: '', // 时
        minute: '', // 分
        second: '', // 秒
        flag: false,
    },
    submit: false,
    visibleChat: false,
    chatPayUrl: '', // 微信返回的支付地址
    update: false, // 是否重新获取订单详情
    visibleAli: false, // 支付宝显示隐藏
    aliData: '', // 支付宝返回的form表单代码
    tim: 0 as any, // 支付宝定时器
})

const form = reactive({
    payType: '' as '' | 1 | 2 | 3,
})

// 订单编号
const order_no = computed(() => {
    return useRouteQuery('out_trade_no').value || useRouteQuery('order_no').value
})

// 支付状态
const payStatus = computed(() => defData.orderInfo!.order_status)

// 微信图标图片
const wxImg = computed(() => {
    const node = payTypeList.value.find(item => item.type === 1)
    return node?.ico_url
})


/**
 * 设置倒计时
 */
 const setCountDown = () => {
    const timestamp = defData.endTime
    if (!timestamp) return
    const timer = setInterval(() => {
        const nowTime = new Date()
        const endTime = new Date(timestamp * 1000)
        const t = endTime.getTime() - nowTime.getTime()
        if (t > 0) {
            const d = Math.floor(t / 86400000)
            const h = Math.floor((t / 3600000) % 24)
            const m = Math.floor((t / 60000) % 60)
            const s = Math.floor((t / 1000) % 60)
            const hh = h < 10 ? `0${h}` : h
            const mm = m < 10 ? `0${m}` : m
            const ss = s < 10 ? `0${s}` : s

            defData.countDown.day = d.toString()
            defData.countDown.hour = hh.toString()
            defData.countDown.minute = mm.toString()
            defData.countDown.second = ss.toString()

            // const format = `(请在<span>${d}</span>天<span>${hh}</span>小时<span>${mm}</span>分<span>${ss}</span>秒 内完成付款，否则订单将自动取消! )`
            // if (d > 0) {
            //     format = `${d}天${hh}小时${mm}分${ss}秒`
            // }
            // if (d <= 0 && Number(hh) > 0) {
            //     format = `${hh}小时${mm}分${ss}秒`
            // }
            // if (d <= 0 && Number(hh) <= 0) {
            //     format = `${mm}分${ss}秒`
            // }
        } else {
            // 关闭倒计时，
            clearInterval(timer)
            defData.countDown.flag = true
            // defData.orderInfo!.order_status=7
        }
    }, 1000)
}


// 获取订单信息 // 查询支付状态
const initDefaultData = async () => {
    if (!order_no.value) {
        defData.ready = false
        defData.skeleton = false
        return
    }

    const { data: res, error } = await useFetch<OrderDetailInfoData>('/api/order/info', {
        method: 'post',
        body: { main_order_no: order_no.value },
    })

    // await wait(200)

    // 线下支付
    if (res.value?.info.pay_type === 3) {
        defData.endTime = res.value.info.end_time || 0
        defData.payInfo = res.value.info.bank_info
        setCountDown()
    }
    await wait(450)

    defData.skeleton = false
    if (error.value) return
    if (res.value?.code !== 200) {
        ElMessage.error(res.value?.msg)
        return defData.ready = false
    }

    defData.orderInfo = res.value!.info
}


// 关闭支付宝支付弹窗
const onCloseAlipay = () => {
    defData.visibleAli = false
    clearInterval(defData.tim)
}

// 关闭微信支付弹窗
const onCloseWechatPay = () => {
    defData.visibleChat = false
    clearInterval(defData.tim)
}

// 支付
const onPayment = async () => {
    if (!order_no.value) return
    if (!form.payType) return ElMessage.warning('请选择支付方式')// 验证选择的支付方式是否选择了支付方式
    defData.submit = true
    const { data: res, error } = await OrderApi.payOrder({ main_order_no: order_no.value, pay_type: form.payType })
    defData.submit = false
    if (error.value) return
    // console.log('res :>> ', res)
    if (res.value?.code !== 200) return ElMessage.error(res.value?.msg)

    if (form.payType === 1) {
        const dat = res.value?.data as OrderApi_PayOrderWeChatResponse
        const url = dat.code_url
        // const url = dat.code_url ? `${dat.code_url}&_tcs=${Date.now()}` : ''
        if (!url) return ElMessage.warning('未获取到付款码，请稍后再试')
        defData.chatPayUrl = await QRCode.toDataURL(url, { margin: 2 })

        defData.visibleChat = true

        // 监听微信支付是否完成
        defData.tim = setInterval(async () => {
            await initDefaultData()
            if (payStatus.value > 1) onCloseWechatPay() // 关闭 支付及弹窗
        }, 2500)

        return
    }

    if (form.payType === 2) { // 支付宝支付
        defData.visibleAli = true

        defData.aliData = res.value?.data as string

        defData.tim = setInterval(async () => {
            await initDefaultData()
            if (payStatus.value > 1) onCloseAlipay() // 关闭 支付及弹窗
        }, 2500)

        // nextTick(() => {
        //     const form = alipayRef.value?.firstElementChild as HTMLFormElement
        //     form.setAttribute('target', '_blank')
        //     form.submit()
        // })

        // const aliPaySubmit = document.getElementById('alipaySubmit')
        // if (aliPaySubmit) document.body.removeChild(aliPaySubmit)// 删除动态创建的按钮元素，防止隐藏按钮造成的
        // const div = document.createElement('div')
        // div.id = 'aliPaySubmit'
        // div.innerHTML = res.value?.data
        // document.body.appendChild(div)
        // const form = div.firstElementChild as HTMLFormElement
        // form.setAttribute('target', '_blank')
        // form.submit()
    }
    // if (form.payType === 3) defData.status = 1
}

// 微信扫码支付关闭弹窗，查询订单是否支付完成了
const onClose = async () => {
    onCloseWechatPay()
    await initDefaultData()

    // if (defData.update) return
    // defData.update = true

    // await initDefaultData()

    // defData.update = false
}


initDefaultData()

definePageMeta({
    layout: 'home',
    middleware: 'auth',
})
</script>

<template>
    <section>
        <div class="container">
            <el-skeleton :loading="defData.skeleton" animated>
                <template #template>
                    <div class="pb10px pt15px">
                        <el-skeleton-item style="width: 30%" />
                    </div>
                    <div class="mb20px min-h500px bg-#fff p15px">
                        <el-skeleton :rows="5" />
                    </div>
                </template>
                <div v-if="defData.ready">
                    <el-breadcrumb class="py15px">
                        <el-breadcrumb-item :to="{ path: '/' }">
                            首页
                        </el-breadcrumb-item>
                        <el-breadcrumb-item>
                            订单支付
                        </el-breadcrumb-item>
                    </el-breadcrumb>
                    <div class="mb20px min-h380px bg-#fff p15px">
                        <div v-if="defData.orderInfo?.pay_type === 3 && !defData.countDown.flag && payStatus <= 1"
                            class="flex flex-wrap p5px">
                            <div class="flex-1">
                                <div class="pay-ready text-center">
                                    <el-alert type="success" :closable="false" show-icon center>
                                        <div class="text-16px -mt5px">
                                            订单已提交成功，请您及时付款，我们将尽快为您安排发货!
                                        </div>
                                    </el-alert>
                                    <div class="my20px flex items-center justify-center">
                                        <span class="mr5px">订单编号: </span>
                                        <el-text type="primary">
                                            {{ order_no }}
                                        </el-text>
                                        <span class="ml20px">订单金额: </span>
                                        <b class="text-20px c-#f00">￥{{ defData.orderInfo?.meet_price }}</b>
                                    </div>
                                    <div class="pay-countdown mb30px">
                                        (请在<span>{{ defData.countDown.day }}</span>天
                                        <span>{{ defData.countDown.hour }}</span>小时
                                        <span>{{ defData.countDown.minute }}</span>分
                                        <span>{{ defData.countDown.second }}</span>秒 内完成付款，否则订单将自动取消! )
                                    </div>
                                    <div>
                                        <NuxtLink to="/goods/list">
                                            <el-button class="min-w70px" type="primary" size="large">
                                                继续购物
                                            </el-button>
                                        </NuxtLink>
                                        <NuxtLink to="/order/list" class="ml10px">
                                            <el-button class="min-w70px" type="primary" size="large" plain>
                                                我的订单
                                            </el-button>
                                        </NuxtLink>
                                    </div>
                                </div>
                            </div>
                            <el-descriptions class="ml20px w40%" title="银行账号信息" :column="1" border>
                                <el-descriptions-item label="公司名称">
                                    <b>{{ defData.payInfo?.company_name }}</b>
                                </el-descriptions-item>
                                <el-descriptions-item label="银行账号">
                                    <b>{{ defData.payInfo?.bank_account }}</b>
                                </el-descriptions-item>
                                <el-descriptions-item label="开户银行">
                                    <b>{{ defData.payInfo?.bank_name }}</b>
                                </el-descriptions-item>
                                <el-descriptions-item label="银联号(CNAPS)">
                                    <b>{{ defData.payInfo?.bank_cnaps }}</b>
                                </el-descriptions-item>
                                <el-descriptions-item label="用途/备注/摘要">
                                    <b>{{ defData.payInfo?.notes }}</b>
                                </el-descriptions-item>
                                <el-descriptions-item label="税号">
                                    <b>{{ defData.payInfo?.duty }}</b>
                                </el-descriptions-item>
                                <el-descriptions-item label="电话">
                                    <b>{{ defData.payInfo?.phone }}</b>
                                </el-descriptions-item>
                                <el-descriptions-item label="地址">
                                    <b>{{ defData.payInfo?.address }}</b>
                                </el-descriptions-item>
                            </el-descriptions>
                            <div v-if="defData.payInfo?.item_notes" class="mt20px w100%">
                                <h3 class="mb5px">
                                    注意事项：
                                </h3>
                                <el-alert type="info" :closable="false">
                                    <template #title>
                                        <div v-html="defData.payInfo?.item_notes" />
                                    </template>
                                </el-alert>
                            </div>
                        </div>
                        <el-result v-else-if="payStatus === 1" icon="info" title="订单提交成功" sub-title="立即支付完成订单">
                            <template #extra>
                                <div class="mb15px text-13px">
                                    需支付：<span class="mr20px text-24px">￥{{
                                        formatNumber(Number(defData.orderInfo?.meet_price) || 0) }}</span>
                                    您的订单号：<span class="color-primary">{{ order_no }}</span>
                                </div>
                                <div class="radio-box mb20px">
                                    <el-radio-group v-model="form.payType">
                                        <div v-for="item in payTypeList" :key="item.id" class="radio-item">
                                            <el-radio :label="item.type" border>
                                                <img :src="item.ico_url" alt="">
                                                <!-- <i class="i-ic-baseline-wechat mr3px inline-block v-text-top c-#09bb07" /> -->
                                                <!-- <i :class="item.ico_url" /> -->
                                                <!-- {{ item.name }} -->
                                            </el-radio>
                                        </div>
                                    </el-radio-group>
                                </div>
                                <el-button type="primary" size="large" :loading="defData.submit" @click="onPayment">
                                    立即支付
                                </el-button>
                                <!-- 支付宝支付 -->
                                <!-- <div ref="alipayRef" class="hidden" v-html="defData.aliData" /> -->
                                <el-dialog v-model="defData.visibleAli" width="750" title="" center @close="onCloseAlipay">
                                    <iframe :srcdoc="defData.aliData" width="700" height="560" scrolling="no" />
                                </el-dialog>
                                <!-- 微信支付 -->
                                <el-dialog v-model="defData.visibleChat" width="660px" title="" center @close="onClose">
                                    <div class="text-center">
                                        <h3 class="mb5px text-22px c-#000">
                                            微信扫码支付
                                        </h3>
                                        <div class="relative ma h220px w220px select-none">
                                            <co-image :src="defData.chatPayUrl" class="h100% w100% b-1 b-#eee block!" />
                                            <div v-if="systemInfo?.ico_img"
                                                class="ico-code absolute left-50% top-50% h50px w50px bg-#fefefe p5px">
                                                <co-image :src="systemInfo?.ico_img" class="h100% w100% block!" />
                                            </div>
                                        </div>
                                        <p class="mt5px">
                                            请使用微信扫一扫完成支付
                                        </p>
                                    </div>
                                    <el-descriptions class="wx-table p20px" :column="1" border>
                                        <el-descriptions-item label="交易金额" label-align="right" label-class-name="w130px ">
                                            <strong class="text-18px c-#f60 lh-32px">{{ defData.orderInfo?.meet_price
                                            }}</strong> 元
                                        </el-descriptions-item>
                                        <el-descriptions-item label="支付方式" label-align="right">
                                            <img :src="wxImg" class="h32px -ml8px">
                                        </el-descriptions-item>
                                        <el-descriptions-item label="交易号" label-align="right">
                                            <p class="lh-32px">
                                                {{ order_no }}
                                            </p>
                                        </el-descriptions-item>
                                    </el-descriptions>
                                </el-dialog>
                            </template>
                        </el-result>
                        <el-result v-else :icon="payStatus === 7 ? 'error' : 'success'"
                            :title="payStatus === 7 ? '订单已取消' : '订单支付完成'" sub-title="">
                            <template #extra>
                                <NuxtLink to="/">
                                    <el-button type="primary">
                                        返回首页
                                    </el-button>
                                </NuxtLink>
                                <NuxtLink to="/order/list">
                                    <el-button class="ml15px" type="primary" plain>
                                        我的订单
                                    </el-button>
                                </NuxtLink>
                            </template>
                        </el-result>
                    </div>
                </div>
                <div v-else class="my15px b-#eee bg-#fff">
                    <BaseError />
                </div>
            </el-skeleton>
        </div>
    </section>
</template>

<style lang="scss" scoped>
.radio-box {
    .el-radio {
        height: unset;
        padding-left: 15px;
    }

    .radio-item {
        // width: 150px;
        text-align: center;
        margin: 0 10px;
    }
}

.pay-ready {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    background-color: var(--el-color-danger-light-9);
    border-radius: var(--el-border-radius-base);
    font-size: 14px;

    :deep(.el-alert) {
        background-color: var(--el-color-primary-light-9);
    }
}

.pay-countdown {
    color: var(--el-text-color-regular);

    >span {
        display: inline-block;
        min-width: 30px;
        text-align: center;
        color: var(--el-color-primary);
    }
}

.wx-table {
    --el-fill-color-light: #fbfbfb;
}

.ico-code {
    transform: translate(-50%, -50%);
    border-radius: 3px;
}
</style>
