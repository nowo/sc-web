import { OrderReturnApi } from '~/api/goods/order'

/**
 * 获取退货原因信息
 * @returns
 */
export const orderReasonState = () => {
    const reason = useState<OrderReturnApi_reasonResponse['lists']>('reason')

    const getReasonInfo = async (update?: boolean) => {
        if (reason.value) return reason
        const { data, error } = await OrderReturnApi.reason()
        // 接口发生错误时
        if (error.value) return reason
        // await wait(800)
        if (data.value?.code === 200) {
            reason.value = data.value.data.lists
        } else {
            ElMessage.error(data.value?.msg)
        }
        return reason
    }

    return {
        reason,
        getReasonInfo,
    }
}
