import { useServerFetch } from '../../utils'

/**
 * 获取订单列表
 */
export default defineEventHandler(async (event) => {
    return 1
    const res = await useServerFetch<OrderApi_GetOrderListResponse>(event, '/api/mall_order/get_order_list')

    // if(res.)
    const list: OrderListTableData[] = []
    res.data.lists.forEach((item, index) => {
        const obj: OrderListTableData = {
            ...item,
            index: index + 1, // 序列号
        }
        const obj2: OrderListTableData = {
            ...obj,
            index: 0,
        }
        list.push(...[obj, obj2])
    })

    return { code: 200, list, total: res.data.total }
})
