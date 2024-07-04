import { createRouter, defineEventHandler, useBase } from 'h3'

const router = createRouter()

/**
 * 获取商品详情
 */
router.use('/info', defineEventHandler(async (event) => {
    // 获取订单信息
    const res = await useServerFetch<OrderApi_GetInfoResponse>(event, '/api/mall_order/order_details')
    // console.log(res)
    if (res) {
        if (res.code !== 200) return { code: res.code, msg: res.msg }
        // 获取线下支付的订单信息
        // if (res.data.pay_type === 3) {
        //     // { main_order_no: order_no.value, pay_type: form.payType }
        //     const dat = await useServerFetch<OrderApi_PayOrderResponse>(event, '/api/mall/pay_order', {
        //         pay_type: 3,
        //     }, true)
        //     console.log('dat :>> ', dat)
        //     return { code: 200, info: res.data, pay: dat.data }
        // }
        return { code: 200, info: res.data }
    }
    return res
}))

// const ITEM = {
//     handler_name: '崔高旋',
//     account_name: '“其他银行”',

//     balance1: '0.00',
//     cost1: '8241.78',
//     profit1: '68330.00',
//     rate1: '1.00',

//     balance2: '0.00',
//     cost2: '8241.78',
//     profit2: '68330.00',
//     rate2: '1.00',

//     balance3: '0.00',
//     cost3: '8241.78',
//     profit3: '68330.00',
//     rate3: '1.00',
// }

/**
 * 订单结算 - 获取信息
 */
router.use('/confirm', defineEventHandler(async (event) => {
    const method = event.method
    const params = method === 'GET' ? getQuery(event) : await readBody(event)

    let data: OrderApi_GetSettleResponse | undefined
    if (params.cart_id) {
        const pam = {
            cart_id: params.cart_id,
            address_id: params.address_id,
        }
        const res = await useServerFetch<OrderApi_GetSettleResponse>(event, '/api/mall/settle_goods', pam)
        if (res.code !== 200) return { code: res.code, msg: res.msg }
        data = res.data
    } else if (params.goods_id) {
        const numReg = /^[1-9]\d*$/ // 检查数字是否合法或不包含数字的正则表达式 或 空或空字符串

        const num = numReg.test(params.goods_number) ? (Number(params.goods_number) || 1) : 1
        const pam = {
            goods_id: params.goods_id,
            goods_number: num,
            address_id: params.address_id,
        }
        // console.log(pam)
        const res = await useServerFetch<OrderApi_GetSettleResponse>(event, '/api/mall/settle_liji', pam)
        if (res.code !== 200) return { code: res.code, msg: res.msg }
        data = res.data
    }
    // console.log(params, data)
    if (!data) return { code: 400, msg: 'error' }

    return { code: 200, data }
}))

export default useBase('/api/order', router.handler)
