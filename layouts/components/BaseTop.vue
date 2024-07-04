<template>
    <section class="header-top">
        <div class="header-cont container">
            <div class="lt flex items-center">
                <template v-if="userState.token && username">
                    <NuxtLink to="/user" class="hov-item">
                        您好！{{ username }}
                    </NuxtLink>
                    <span class="mx5px">欢迎来到工游记商城!</span>
                    <span class="hov-item-exit" @click="onLoginOut">
                        退出
                    </span>
                </template>
                <template v-else>
                    <span class="mr10px">欢迎来到工游记商城!</span>
                    <NuxtLink to="/login" class="hov-item">
                        登录
                    </NuxtLink>
                    <el-divider direction="vertical" />
                    <NuxtLink to="/login/register" class="hov-item">
                        注册
                    </NuxtLink>
                </template>
            </div>
            <div class="gt flex items-center">
                <!-- <el-button link>
                    <i class="i-ep-location-information" />
                    <span>广东省/深圳市</span>
                </el-button>
                <el-divider direction="vertical" /> -->
                <template v-if="userState.token && username">
                    <NuxtLink to="/order/list" class="hov-item">
                        我的订单
                    </NuxtLink>
                    <el-divider direction="vertical" />
                </template>
                <NuxtLink to="/order/cart" class="hov-item flex items-center">
                    <i class="i-ep-shopping-cart-full mr2px" />
                    <span>购物车({{ number }})</span>
                </NuxtLink>
                <el-divider direction="vertical" />
                <NuxtLink to="/list/site" class="hov-item">
                    网站导航
                </NuxtLink>
                <el-divider direction="vertical" />
                <!-- <NuxtLink href="/content/help">帮助中心</NuxtLink> -->
                <NuxtLink href="javascript:;">
                    帮助中心
                </NuxtLink>
                <el-divider direction="vertical" />
                <NuxtLink to="/sale" class="hov-item">
                    售后中心
                </NuxtLink>
                <el-divider direction="vertical" />
                <span class="mr5px">{{ systemInfo?.sale_tel }}</span>
            </div>
        </div>
        <div v-if="useCartNumber.site.value.show" class="shop-site2"
            :style="{ top: `${useCartNumber.site.value.top || 0}px`, left: `${useCartNumber.site.value.left || 0}px` }">
            <i class="color-primary i-ep-goods-filled block text-24px" />
        </div>
    </section>
</template>

<script lang="ts" setup>
const useSystem = useSystemState()
const userState = useUserState()
const useCartNumber = useCartNumberState()

// 获取商城信息
const systemInfo = await useSystem.getSystemInfo()

// 用户信息
const user = await userState.getUserInfo()

const username = computed(() => user.value?.user_name)

// 购物车商品数量
const number = await useCartNumber.setCartNumber()

// 退出登录
const onLoginOut = async () => {
    useLoginOut()
}
</script>

<style lang="scss" scoped>
.header-top {
    padding: 6px 0 5px;
    background-color: #313131;
    position: relative;
    z-index: 1;

    .header-cont {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 13px;
        color: var(--el-color-white);
    }

    .hov-item {
        &:hover {
            color: var(--el-color-info);
        }
    }

    .hov-item-exit {
        cursor: pointer;
        color: var(--el-color-danger-light-3);

        &:hover {
            color: var(--el-color-danger-light-8);
        }
    }
}

.shop-site {
    position: absolute;
    animation: ani-shop-to-cart 1s ease-in-out forwards;
    // top: v-、bind('styles.top');
    // left: v-、bind('styles.left');
}

@keyframes ani-shop-to-cart {
    0% {
        transform: scale(1.2);
    }

    70% {
        top: 40px;
        transform: translate(-20px, -25px);
    }

    100% {
        top: 70px;
        // left: calc(100% - 100px);
        left: calc((100% - 1200px) / 2 + 1100px);
        transform: translate(0, 0);
        display: none
    }
}

.shop-site2 {
    position: fixed;
    animation: ani-shop-to-cart2 1s ease-in-out forwards;
}

@keyframes ani-shop-to-cart2 {
    0% {
        transform: scale(1.2);
    }

    70% {
        top: 420px;
        transform: translate(-20px, -25px);
    }

    100% {
        top: 430px;
        left: calc(100% - 30px);
        // left: calc((100% - 1200px) / 2 + 1100px);
        transform: translate(0, 0);
        display: none
    }
}
</style>
