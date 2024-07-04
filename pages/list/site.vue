<template>
    <div class="container">
        <div class="cat-box min-h500px">
            <div v-for="item in defData.cateList" :key="item.cat_id" class="cat-item">
                <div class="cat-tle">
                    <NuxtLink :to="onGoodsLink(item.cat_id)" target="_blank" class="link-name inline-flex items-center">
                        <i class="i-ep-discount mr3px" />
                        {{ item.cat_name }}
                    </NuxtLink>
                </div>
                <ul class="cat-ul">
                    <li v-for="sub in item.children" :key="sub.cat_id">
                        <div class="two-tle">
                            <NuxtLink :to="onGoodsLink(sub.cat_id)" target="_blank" class="link-name">
                                {{ sub.cat_name }}
                            </NuxtLink>
                        </div>
                        <div class="two-right">
                            <NuxtLink v-for="son in sub.children" :key="son.cat_id" :to="onGoodsLink(son.cat_id)"
                                target="_blank" class="link-name mb5px ml30px inline-block">
                                {{ son.cat_name }}
                            </NuxtLink>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { GoodsApi } from '~/api/goods/list'

definePageMeta({
    layout: 'home',
})

const defData = reactive({
    skeleton: true, // 骨架屏
    page: 1,
    pageSize: 24,
    total: 0,
    cateList: [] as GoodsApi_GetClass[],
})

// 商品分类
const { data, error } = await GoodsApi.getClass()
if (!error.value && data.value?.code === 200) {
    defData.skeleton = false
    defData.cateList = data.value.data
}

// 跳转至商品列表的地址
const onGoodsLink = (id: number) => {
    return `/goods/list?cid=${id}`
}
</script>

<style lang="scss" scoped>
.cat-box {
    background-color: var(--el-color-white);
    margin: 25px 0;
    padding: 40px;

}

.cat-item {
    .cat-tle {
        text-align: center;
        font-size: 20px;
        padding: 20px 0 15px;
    }
}

.cat-ul {
    li {
        display: flex;
        font-size: 13px;
        padding: 15px 0;
        line-height: 30px;
    }

    --cat-left-wid:130px;

    .two-tle {
        width: var(--cat-left-wid);
        font-weight: bold;
        color: var(--el-text-color-primary);
    }

    .two-right {
        width: calc(100% - var(--cat-left-wid));
        color: var(--el-text-color-regular);
    }
}

.link-name {
    &:hover {
        color: var(--el-color-primary);
    }
}
</style>
