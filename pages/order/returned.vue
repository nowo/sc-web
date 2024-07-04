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
            <div class="order-top mb20px border-1 p20px">
                <div class="lt">
                    <span class="mr20px">订单号：<b>{{ returnData?.main_order_no }}</b></span>
                    <span class="mr20px">退换单号：<b>{{ return_no }}</b></span>
                    <div class="mt10px">
                        退换状态：<el-tag type="success" size="large">
                            {{ defData.operateList[returnData?.status || 0] }}
                        </el-tag>
                    </div>
                </div>
                <div class="gt">
                    <!--  -->
                </div>

                <div class="bane-item">
                    <lazy-el-steps class="step-box" :active="stepSelect" finish-status="success">
                        <el-step v-for="(item, index) in orderInfo?.flow_path" :key="index" :title="item.title"
                            :description="item.item" />
                    </lazy-el-steps>
                </div>
            </div>
            <div class="mb20px border-1 p20px">
                <div class="tle mb10px text-15px font-600 c-#222">
                    退换信息
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
                            服务类型:
                        </div>
                        <div class="gt">
                            <span class="mr-5px">{{ returnData?.is_all ? '全部' : '部分' }}</span>
                            <el-tag v-if="returnData?.type === 1" type="info" size="small">
                                退货/退款
                            </el-tag>
                            <el-tag v-else type="warning" size="small">
                                换货
                            </el-tag>
                            <span v-if="returnData?.type === 1" class="ml20px">退款金额：<span class="color-primary">{{
                                returnData?.meet_money }}</span></span>
                        </div>
                    </li>
                    <li>
                        <div class="lt">
                            退换理由:
                        </div>
                        <div class="gt">
                            {{ returnData?.reason_name }}
                        </div>
                    </li>
                    <li>
                        <div class="lt">
                            问题描述:
                        </div>
                        <div class="gt">
                            {{ returnData?.describe }}
                        </div>
                    </li>
                    <li>
                        <div class="lt">
                            物流公司:
                        </div>
                        <div class="gt">
                            {{ returnData?.logistics_cusmoer || '--' }}
                        </div>
                    </li>
                    <li>
                        <div class="lt">
                            物流单号:
                        </div>
                        <div class="gt">
                            {{ returnData?.logistics_no || '--' }}
                        </div>
                    </li>
                    <el-form v-if="returnData?.status === 2 || returnData?.status === 3 || returnData?.status === 4"
                        ref="formRef" :model="form.data" :label-width="100" :rules="rules">
                        <el-row class="mt15px">
                            <el-col :xs="18" :sm="18" :md="18" :lg="16" :xl="16">
                                <el-form-item prop="describe" label="问题补充:">
                                    <el-input v-model="form.data.describe" type="textarea" resize="none" :rows="3"
                                        maxlength="80" clearable show-word-limit />
                                </el-form-item>
                                <template v-if="form.data.type === 2">
                                    <el-form-item prop="logistics_name" label="物流公司:">
                                        <el-input v-model="form.data.logistics_name" maxlength="30" clearable />
                                    </el-form-item>
                                    <el-form-item prop="logistics_no" label="物流单号:">
                                        <el-input v-model="form.data.logistics_no" clearable />
                                    </el-form-item>
                                </template>
                                <el-form-item label="">
                                    <el-button type="primary" @click="onSubmit">
                                        确定提交
                                    </el-button>
                                </el-form-item>
                            </el-col>
                            <el-col :xs="6" :sm="6" :md="6" :lg="8" :xl="8">
                                <el-form-item prop="img" label="图片:">
                                    <CoUpload v-model="form.data.img" />
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </ul>
            </div>
            <div class="mb20px border-1 p20px">
                <div class="tle mb10px text-15px font-600 c-#222">
                    退换商品
                </div>
                <el-table :data="orderInfo?.goods_list" class="return-table" border>
                    <el-table-column label="商品信息" min-width="160" property="goods_name">
                        <template #default="{ row }">
                            <div class="flex items-center">
                                <CoImage class="h45px w45px" :src="setGoodsOssImg(row.goods_img, 60)" :icon-size="22" />
                                <div class="flex-1 pl8px">
                                    <NuxtLink :to="`/goods/${row.goods_sn}`" target="_blank" class="goods-link">
                                        {{ row.goods_name }}
                                    </NuxtLink>
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="价格" width="120" property="meet_price" />
                    <el-table-column label="退换数量" width="110" property="return_number" align="center">
                        <template #default="{ row }">
                            {{ row.goods_number }}
                        </template>
                    </el-table-column>
                    <el-table-column label="商品总金额" width="150" property="total" align="center">
                        <template #default="{ row }">
                            {{ formatNumber(row.goods_number * row.meet_price) }}
                        </template>
                    </el-table-column>
                </el-table>
                <div class="tle my10px text-15px font-600 c-#222">
                    操作日志
                </div>
                <el-table :data="orderInfo?.refund_log" size="small" border>
                    <el-table-column label="操作者" width="120" property="author" show-overflow-tooltip />
                    <el-table-column label="信息" min-width="160" property="content" show-overflow-tooltip />
                    <el-table-column label="图片" width="80" property="img_url" align="center" show-overflow-tooltip>
                        <template #default="{ row }">
                            <CoImage :src="row.img_url" :preview-src-list="[row.img_url]"
                                class="h30px w50px vertical-bottom" :icon-size="18" preview-teleported />
                        </template>
                    </el-table-column>
                    <el-table-column label="时间" width="160" property="create_time" show-overflow-tooltip />
                </el-table>
            </div>
        </el-skeleton>
    </LayoutUser>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import { OrderReturnApi } from '~/api/goods/order'

const formRef = ref<FormInstance>()

// 退货单号
const return_no = useRouteQuery('order_no')

const defData = reactive({
    skeleton: true, // 显示骨架屏
    operateList: { // 0售后正在审核出来 1审核通过待处理 2审核未通过 3要求售后寄回 4快递已寄回 5售后完成
        0: '售后正在审核处理',
        1: '审核通过,待处理',
        2: '审核未通过',
        3: '售后要求寄回',
        4: '快递已寄回',
        5: '快递已寄出',
        6: '售后已完成',
    },
})

// 表单数据
const form = reactive({
    data: {
        id: 0, // 地址id
        type: 1 as '' | 1 | 2, // 类型 1补充问题 2添加快递
        describe: '', // 描述
        img: '', // 图片地址
        logistics_name: '', // 物流公司
        logistics_no: '', // 物流单号
    },

})
const rules = reactive<FormRules>({
    name: [
        { required: true, whitespace: true, message: '必填项不能为空', trigger: 'blur' },
    ],
    type: [
        { required: true, message: '请选择退换类型', trigger: 'blur' },
    ],
    describe: [
        { required: true, whitespace: true, message: '请输入问题描述', trigger: 'blur' },
    ],
    logistics_name: [
        { required: true, whitespace: true, message: '请填写物流公司', trigger: 'blur' },
    ],
    logistics_no: [
        { required: true, whitespace: true, message: '请填写物流单号', trigger: 'blur' },
    ],
    img: [
        // { required: true, message: '必填项不能为空', trigger: 'blur' },
    ],
})

// 面包屑导航
const breadcrumbData = computed(() => {
    const _list = [
        { text: '个人中心', href: '/order/list', id: 1 },
        { text: '退换货订单', href: '/order/return', id: 2 },
        { text: '退换详情', href: '', id: 3 },
    ]

    return _list
})

// 订单信息
const orderInfo = ref<OrderReturnApi_InfoResponse>()
const returnData = computed(() => orderInfo.value?.refund_info)

// 步骤选中
const stepSelect = computed(() => {
    let step = 0
    orderInfo.value?.flow_path.forEach((item, index, arr) => {
        if (item.selected) step = index
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

// 获取初始信息
const initDefaultData = async () => {
    // if (defData.ready) return false
    const refund_no = return_no.value?.trim() ?? ''
    if (!refund_no) return ElMessage.error('退换单号错误')
    const { data, error } = await OrderReturnApi.info({ refund_no })

    await wait(100)
    if (error.value) return
    if (data.value?.code !== 200) return ElMessage.error(data.value?.msg)

    defData.skeleton = false // 显示内容

    orderInfo.value = data.value.data
    //  3要求售后寄回
    if (data.value.data.refund_info.status === 3) {
        form.data.type = 2
        rules.describe = []
    } else {
        form.data.type = 1
        rules.describe = [
            { required: true, whitespace: true, message: '请输入问题描述', trigger: 'blur' },
        ]
    }

    // defData.ready = true
}

// 确定
const onSubmit = async () => {
    const isRun = await useFormVerify(formRef.value)
    if (!isRun) return false

    const params: OrderReturnApi_Fill = {
        refund_no: return_no.value,
        refund_type: form.data.type === 2 ? 2 : 1,
        describe: form.data.describe?.trim(),
        img_url: form.data.img,
        logistics_cusmoer: form.data.logistics_name?.trim() ?? '',
        logistics_no: form.data.logistics_no?.trim() ?? '',
    }

    if (params.refund_type === 1) {
        delete params.logistics_cusmoer
        delete params.logistics_no
    }
    const { data, error } = await OrderReturnApi.fill(params)

    await wait(100)
    if (error.value) return
    if (data.value?.code !== 200) return ElMessage.error(data.value?.msg)

    ElMessage.success('操作成功！')
    initDefaultData()
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
    flex-wrap: wrap;
    font-size: 13px;

    .lt {
        flex: 1;
    }
}

.bane-item {
    padding: 20px;
    background: var(--el-fill-color-light);
    border-radius: 4px;
    width: 100%;
    margin-top: 15px;
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

.goods-link {
    &:hover {
        color: var(--el-color-primary);
    }
}
</style>
