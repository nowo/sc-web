<script setup lang="ts">
import { CouponApi } from '~/api/user/coupon'

const defData = reactive({
    MyCouponList: [] as CouponApi_getListResponse['lists'],
    CouponList: [] as CouponApi_allListResponse[],
    use_coupon: '',
    user_id: '' as number | '',
    token: '',
    skeleton: true,
    is_status: 1,

})

// 初始化数据 我的优惠券
const initCardData = async () => {
    const data: CouponApi_getList = {
        is_status: defData.is_status as 1 | 2 | 3 | 4,
    }
    const res = await CouponApi.geList(data)
    await wait(10)
    defData.skeleton = false
    if (res.data.value?.code !== 200) return ElMessage.error(res.data.value?.msg)
    defData.MyCouponList = res.data.value.data.lists
}
initCardData()

const onclick = () => {
    initCardData()
}

// 删除
const delClick = async (row: any) => {
    ElMessageBox.confirm('此操作将永久删除该条内容，是否继续?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        buttonSize: 'default',
    }).then(async () => {
        const res = await CouponApi.delList({
            id: row,
        })
        if (res.data.value?.code !== 200) {
            ElMessage.error(res.data.value?.msg)
            return false
        }
        ElMessage.success('删除成功')
        initCardData()
    }).catch(() => { })
}

definePageMeta({
    layout: 'home',
    middleware: 'auth',
})
</script>

<template>
    <LayoutUser>
        <el-skeleton :loading="defData.skeleton" animated>
            <template #template>
                <div class="pb20px">
                    <el-skeleton-item class="w20%!" />
                </div>
                <div class="min-h500px">
                    <el-skeleton :rows="5" />
                </div>
            </template>
            <el-breadcrumb>
                <el-breadcrumb-item>
                    订单中心
                </el-breadcrumb-item>
                <el-breadcrumb-item>我的优惠券</el-breadcrumb-item>
            </el-breadcrumb>

            <!-- <div style="margin:0 0 20px;font-size: large;">
                    我的优惠券
                    <NuxtLink to="/coupon">
                        <div v-if="defData.MyCouponList.length === 0"
                            style="color: var(--el-color-primary);margin: 8px;font-size: medium;">
                            暂无优惠券，去优惠券中心领取
                        </div>
                    </NuxtLink>
                </div> -->

            <div style="margin-top: 20px">
                <el-radio-group v-model="defData.is_status" @change="onclick()">
                    <el-radio-button :label="1">
                        可用优惠券
                    </el-radio-button>
                    <!-- <el-radio-button :label="2">
                        使用中
                    </el-radio-button> -->
                    <el-radio-button :label="3">
                        已用优惠券
                    </el-radio-button>
                    <el-radio-button :label="4">
                        过期优惠券
                    </el-radio-button>
                </el-radio-group>
            </div>

            <div class="mt10px">
                <el-space wrap>
                    <div v-if="defData.MyCouponList.length === 0">
                        <el-empty class="ml50px" description="暂无优惠券" />
                    </div>
                    <el-card v-for="item in defData.MyCouponList" :key="item.coupon_id" class="box-card" shadow="hover"
                        :data="defData">
                        <i class="i-ep-close inline-block" style="float: right;margin: 5px;" @click="delClick(item.id)" />
                        <div style="font-size: xx-large;font-weight: bold;">
                            ￥{{ item.par_value }}
                        </div>
                        <div style="font-size: 14px;">
                            类型： {{ item.type === 1 ? '通用券' : '品类券' }}
                        </div>
                        <div style="font-size: 14px;">
                            活动： {{ item.coupon_name }}
                        </div>
                        <div style="font-size: 14px;">
                            有效期：{{ item.start_time }}至{{ item.end_time }}
                        </div>
                        <!-- <div v-if="item.is_status === 1">
                            <el-button type="danger" plain>
                                未使用
                            </el-button>
                        </div> -->
                        <!-- <div v-else-if="item.is_status === 3">
                            <el-button type="info" plain>
                                已使用
                            </el-button>
                        </div>
                        <div v-else>
                            <el-button type="info" plain>
                                已过期
                            </el-button>
                        </div> -->
                    </el-card>
                </el-space>
            </div>
        </el-skeleton>
    </LayoutUser>
</template>

<style scoped>
.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.box-card {
    width: 280px;
    height: 150px;
    color: var(--el-color-primary);
}
</style>
