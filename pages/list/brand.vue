<template>
    <div class="container">
        <div class="brand-box min-h300px">
            <el-skeleton class="brand-list" :loading="defData.skeleton" animated :count="24">
                <template #template>
                    <div class="brand-item">
                        <el-skeleton-item variant="image" style="width:100%;height:65px;" />
                        <el-skeleton-item class="mt10px" />
                    </div>
                </template>
                <div class="brand-list">
                    <div v-for="item in defData.brandList" :key="item.brand_id" class="brand-item">
                        <NuxtLink :to="linkGoodsList({ query: { bid: item.brand_id }, url: true })">
                            <co-image class="w100% pb45%" :src="item.brand_logo" :icon-size="24" />
                            <div class="pt5px text-center text-14px">
                                {{ item.brand_name }}
                            </div>
                        </NuxtLink>
                    </div>
                </div>
                <div class="mt30px">
                    <el-pagination v-model:current-page="defData.page" v-model:page-size="defData.pageSize" small background
                        layout=" prev, pager, next,total, jumper" :total="defData.total" @size-change="onHandleSizeChange"
                        @current-change="onHandleSizeChange" />
                </div>
            </el-skeleton>
        </div>
    </div>
</template>

<script setup lang="ts">
import { BrandApi } from '~/api/brand/brand'

definePageMeta({
    layout: 'home',
})

const defData = reactive({
    skeleton: true, // 骨架屏
    page: 1,
    pageSize: 24,
    total: 0,
    brandList: [] as BrandApi_GetListResponse['lists'],
})

const initData = async () => {
    const params: BrandApi_GetList = {
        is_paging: 1,
        page: defData.page,
        page_size: defData.pageSize,
    }

    const { data, error } = await BrandApi.getList(params)
    if (error.value) return

    defData.skeleton = false

    if (data.value?.code !== 200) return ElMessage.error(data.value?.msg)
    defData.brandList = data.value.data.lists
    defData.total = data.value.data.total
}
initData()

// 分页数量点击
const onHandleSizeChange = () => {
    initData()
}
</script>

<style lang="scss" scoped>
.brand-box {
    background-color: var(--el-color-white);
    margin: 20px 0;
    padding: 40px;

}

.brand-list {
    display: grid;
    gap: 40px;
    grid-template-columns: repeat(6, 1fr);

    .brand-item:hover {
        color: var(--el-color-primary);

        :deep(.co-image) {
            >img {
                border: 1px solid var(--el-color-error-light-5);
            }
        }

    }
}
</style>
