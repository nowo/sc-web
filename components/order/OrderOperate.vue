<script lang="ts" setup>
import { OrderApi } from '~/api/goods/order'
import { OrderInvoiceModel, OrderReturnModel } from '#components'

// const props = defineProps<{
//     data: OrderOperatePropsData
//     size: 'small' | 'default' | 'large'
// }>()
const props = withDefaults(defineProps<{
    data: OrderOperatePropsData
    size?: '' | 'small' | 'default' | 'large'
    link?: boolean
}>(), {
    size: '',
})

// const emits = defineEmits<{
//     (event: 'update', status: number): void
// }>()

const emits = defineEmits<{
    update: [status: number]
}>()

const { systemStatus } = useSystemState() // 商城状态

// 退货申请
const modelRef = ref<InstanceType<typeof OrderReturnModel>>()
// 发票申请
const invoiceRef = ref<InstanceType<typeof OrderInvoiceModel>>()

// 订单状态
const orderStatus = computed(() => props.data.status)

// 是否可以申请发票
const isApply = computed(() => {
    // 商城关闭开发票是
    if (!systemStatus.value.is_bill) return false
    // 已付款、未申请发票、订单未取消
    return orderStatus.value > 1 && !props.data.bill_status && orderStatus.value !== 7
})

// 退换申请提交后，向上更新父组件列表数据
const setUpdateList = () => {
    emits('update', 7)
}

/**
 * 去付款
 * @param row
 */
const onPayOrder = () => {
    navigateTo({
        path: '/order/pay',
        query: {
            order_no: props.data.order_no,
        },
    })
}

/**
 * 取消订单
 * @param row
 */
const onCancel = async () => {
    ElMessageBox.confirm('确定要取消该订单吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(async () => {
        const { data } = await OrderApi.cancelOrder({ main_order_no: props.data.order_no })

        if (data.value?.code !== 200) return ElMessage.error(data.value?.msg)

        ElMessage.success('操作成功')
        emits('update', 7) // 取消订单状态为已取消中间状态
    }).catch(() => {
        // ElMessage({
        //     type: 'info',
        //     message: 'Delete canceled',
        // })
    })
}

/**
 *  确认订单
 */
const onConfirm = async () => {
    ElMessageBox.confirm('将该订单设置收货状态？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(async () => {
        const { data } = await OrderApi.confirmOrder({ main_order_no: props.data.order_no })
        if (data.value?.code !== 200) return ElMessage.error(data.value?.msg)

        ElMessage.success('操作成功')
        emits('update', 7) // 更新
    }).catch(() => {
        // ElMessage({
        //     type: 'info',
        //     message: 'Delete canceled',
        // })
    })
}

/**
 * 退换货申请
 */
const onReturn = async () => {
    modelRef.value?.onOpenDialog({ order_no: props.data.order_no })
}

/**
 * 再次购买
 */
// const onOrderBuy = () => {

// }

/**
 * 删除订单
 */
const onDel = () => {
    ElMessageBox.confirm('确定要删除该订单吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(async () => {
        const { data } = await OrderApi.delOrder({ main_order_no: props.data.order_no })

        if (data.value?.code !== 200) return ElMessage.error(data.value?.msg)

        ElMessage.success('操作成功')
        emits('update', 7) // 取消订单状态为已取消中间状态
    }).catch(() => {
        // ElMessage({
        //     type: 'info',
        //     message: 'Delete canceled',
        // })
    })
}

/**
 * 申请发票
 */
const onInvoice = () => {
    invoiceRef.value?.onOpenDialog({ order_no: props.data.order_no }, 1)
}
</script>

<template>
    <div class="order-operate">
        <div v-if="isApply" class="item-ope">
            <el-button type="" :link="props.link" :size="props.size" class="mb3px" @click="onInvoice()">
                申请发票
            </el-button>
            <Teleport to="body">
                <OrderInvoiceModel ref="invoiceRef" @update="setUpdateList()" />
            </Teleport>
        </div>
        <div v-if="orderStatus === 1" class="item-ope">
            <el-button type="warning" :link="props.link" :size="props.size" class="mb3px" @click="onPayOrder()">
                去付款
            </el-button>
        </div>
        <div v-if="orderStatus === 1 || orderStatus === 2 || orderStatus === 4" class="item-ope">
            <el-button type="info" :link="props.link" :size="props.size" @click="onCancel()">
                取消订单
            </el-button>
        </div>
        <template v-if="orderStatus === 3">
            <div class="item-ope">
                <el-button type="success" :link="props.link" :size="props.size" class="mb3px" @click="onConfirm()">
                    确认收货
                </el-button>
            </div>
        </template>
        <div v-if="(orderStatus === 3 || orderStatus === 6) && !props.data.is_return" class="item-ope">
            <el-button type="primary" :link="props.link" :size="props.size" @click="onReturn()">
                退换申请
            </el-button>
            <Teleport to="body">
                <OrderReturnModel ref="modelRef" @update="setUpdateList()" />
            </Teleport>
        </div>

        <div v-if="orderStatus === 6 || orderStatus === 7" class="item-ope">
            <!-- <el-button type="primary" :link="props.link" :size="props.size" @click="onOrderBuy()">
                再次购买
            </el-button> -->
            <el-button type="info" :link="props.link" :size="props.size" @click="onDel()">
                删除订单
            </el-button>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>
