<script setup lang="ts">
</script>

<template>

    <div>
        <!-- style="height: 40px;padding:10px;text-align: center;font-size: 17px;" -->
        <h3 class="text-center">
            个人中心
        </h3>

        <el-divider border-style="dotted" style="margin:10px 0;" />
        <p class="title">
            <i class="i-ep-house inline-block" />
            订单中心
        </p>
        <ul class="block">
            <li>
                <NuxtLink to="/order/list">
                    我的订单
                </NuxtLink>
            </li>
            <li>
                <NuxtLink to="/order/return">
                    退换货订单
                </NuxtLink>
            </li>
            <li>
                <NuxtLink to="/user/info">
                    站内信息
                </NuxtLink>
            </li>
            <li>
                <NuxtLink to="/user/Coupon">
                    我的优惠券
                </NuxtLink>
            </li>
            <li>
                <NuxtLink to="/user/Beans">
                    我的工游豆
                </NuxtLink>
            </li>
        </ul>
        <p class="title">
            <i class="i-ep-user inline-block" />
            企业用户
        </p>
        <ul class="block">
            <li>
                <NuxtLink to="/user/Enterprise">
                    企业用户
                </NuxtLink>
            </li>
        </ul>
        <p class="title">
            <i class="i-ep-star inline-block" />
            我关注的
        </p>
        <ul class="block">
            <li>
                <NuxtLink to="/user/MyCollection">
                    我的收藏
                </NuxtLink>
            </li>
            <li>
                <NuxtLink to="/user/InterList">
                    问答列表
                </NuxtLink>
            </li>
            <li>
                <NuxtLink to="/user/BrowseHistory">
                    浏览历史
                </NuxtLink>
            </li>
        </ul>
        <p class="title">
            <i class="i-ep-memo inline-block" />
            账户管理
        </p>
        <ul class="block">
            <li>
                <NuxtLink to="/user/Account">
                    账户资料
                </NuxtLink>
            </li>
            <li>
                <NuxtLink to="/user/Address">
                    地址管理
                </NuxtLink>
            </li>
            <li>
                <NuxtLink to="/user/Invoice">
                    抬头管理
                </NuxtLink>
            </li>
            <li>
                <NuxtLink to="/user/Recommend">
                    推荐管理
                </NuxtLink>
            </li>
        </ul>
    </div>
</template>

<style scoped>
.router-link-active {
    color: var(--el-color-primary);
}

.title {
    text-align: center;
    font-size: 15px;
    font-weight: bold;
}

.block {
    list-style-type: none;
    margin: 10px;
    padding: 0;
}

li {
    color: #000;
    padding: 8px 10px;
    text-align: center;
    font-size: 14px;
}

li:hover {
    color: var(--el-color-primary);
}
</style>
