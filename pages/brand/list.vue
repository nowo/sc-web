<script setup lang="ts">
import { BrandApi } from '~/api/brand/brand'

definePageMeta({
    layout: 'home',
})

const defData = reactive({
    page: 1,
    total: 0,
    pageSize: 24,
    BrandList: [] as BrandApi_GetListResponse['lists'],
})

const initData = async () => {
    const data: BrandApi_GetList = {
        is_paging: 1,
        page: defData.page,
        page_size: defData.pageSize,
    }
    const res = await BrandApi.getList(data)
    if (res.data.value?.code !== 200) return ElMessage.error(res.data.value?.msg)
    defData.BrandList = res.data.value.data.lists
    defData.total = res.data.value.data.total
}
initData()

// 分页数量点击
const onHandleSizeChange = () => {
    initData()
}
</script>

<template>
    <div class="container">
        <div style="height: 680px;background-color: rgb(255, 255, 255);margin: 20px 0;">
            <div>
                <el-space wrap :size="20">
                    <div v-for="item in defData.BrandList" :key="item.brand_id" :data="defData" ml30px mt50px>
                        <!-- <img :src="item.brand_logo" h55px w140px> -->
                        <co-image class="h55px w140px" :src="item.brand_logo" :icon-size="24" />
                        <div style="font-size: 12px;margin-top: 10px;text-align: center;">
                            {{ item.brand_name }}
                        </div>
                    </div>
                </el-space>
            </div>
            <div class="goods-pagination" ml30px mt25px>
                <el-pagination v-model:current-page="defData.page" v-model:page-size="defData.pageSize" small background
                    layout=" prev, pager, next,total, jumper" :total="defData.total" @size-change="onHandleSizeChange"
                    @current-change="onHandleSizeChange" />
            </div>
        </div>
    </div>
</template>

<style scoped></style>
