<template>
    <div style="height: auto;background-color: #f00408;">
        <div style="background-image: url('/assets/images/coupon-bg.png');background-size: cover;background-repeat: no-repeat;
    background-position: center;height: 550px;width: 100%;">
            <Transition name="slide">
                <div class="side-item">
                    <a href="#current">
                        通用券
                    </a>
                    <a href="#category">品类券</a>
                </div>
            </Transition>
        </div>
        <div class="container">
            <div>
                <div id="current" style="text-align: center;font-size: 50px;color: white;margin: 20px 0; ">
                    通用券
                </div>
                <el-space wrap>
                    <el-card v-for="item in defData.CurrentList" :key="item.coupon_id" class="box-card" shadow="hover">
                        <!-- <div class="card-content"> -->
                        <div style="font-size: xx-large;font-weight: bold;">
                            ￥{{ item.par_value }}
                        </div>
                        <div style="font-size: 14px;">
                            活动： {{ item.coupon_name }}
                        </div>
                        <div style="font-size: 14px;">
                            有效期：{{ item.term_time }}
                        </div>
                        <div v-if="item.use_coupon === 0">
                            <el-button type="danger" plain @click="onReceive(item.coupon_id)">
                                去领取
                            </el-button>
                        </div>
                        <div v-else>
                            <el-button type="info" plain>
                                已领取
                            </el-button>
                        </div>
                    </el-card>
                </el-space>
            </div>
            <div>
                <div id="category" style="text-align: center;font-size: 50px;color: white;margin: 20px 0; ">
                    品类券
                </div>
                <el-space wrap>
                    <el-card v-for="item in defData.CategoryList" :key="item.coupon_id" class="box-card" shadow="hover">
                        <div class="card-content">
                            <div style="font-size: xx-large;font-weight: bold;">
                                ￥{{ item.par_value }}
                            </div>
                            <div style="font-size: 14px;">
                                活动： {{ item.coupon_name }}
                            </div>
                            <div style="font-size: 14px;">
                                有效期：{{ item.term_time }}
                            </div>
                            <div v-if="item.use_coupon === 0">
                                <el-button type="danger" plain @click="onReceive(item.coupon_id)">
                                    去领取
                                </el-button>
                            </div>
                            <div v-else>
                                <el-button type="info" plain>
                                    已领取
                                </el-button>
                            </div>
                        </div>
                    </el-card>
                </el-space>
            </div>
            <div class="pb200px" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { CouponApi } from '~/api/user/coupon'

definePageMeta({
    layout: 'home',
})

const userState = useUserState()

const defData = reactive({
    CurrentList: [] as CouponApi_allListResponse['current_list'], // 通用券
    CategoryList: [] as CouponApi_allListResponse['category_list'], // 品类券
    use_coupon: '',
    token: '',
    user_id: '' as number | '',
})

// 展示所有优惠券
const showCoupon = async () => {
    const { data: res, error } = await CouponApi.allList()
    if (error.value) return ElMessage.error(error.value)
    if (res.value?.code === 200) {
        defData.CurrentList = res.value.data.current_list // 通用券列表
        defData.CategoryList = res.value.data.category_list // 品类券列表
        // defData.CurrentList.length = 4
    } else {
        return ElMessage.error(res.value?.msg)
    }
}
showCoupon()

// 领取
const onReceive = async (row: any) => {
    const user = await userState.getUserInfo()
    if (user.value) {
        defData.user_id = user.value.user_id
    }

    const data: CouponApi_addList = {
        user_id: defData.user_id as number,
        coupon_id: row,
    }
    const res = await CouponApi.addList(data)
    if (res.data.value?.code !== 200) return ElMessage.error(res.data.value?.msg)
    ElMessage.success('领取成功')
    showCoupon()
}
</script>

<style lang="scss" scoped>
.box-card {
    width: 280px;
    height: 150px;
    color: var(--el-color-primary);
}

.side-item {
    position: fixed;
    top: 300px;
    left: 50%;
    transform: translateX(-50%);
    transition: opacity 0.3s, transform .4s, top 0.4s;
    width: 70px;
    margin-left: -630px;
    background: #fff;

    >a {
        display: block;
        width: 70px;
        height: 45px;
        padding: 10px;
        font-size: 14px;
        text-align: center;
        line-height: 18px;

        &:hover {
            color: var(--el-color-white);
            background: var(--el-color-primary);
        }
    }
}

/* .slide-fade-enter-from,
.slide-fade-leave-to {
    transform: translateY(20px);
    opacity: 0;
} */
</style>
