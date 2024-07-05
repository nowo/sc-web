<script lang="ts" setup>
const useCartNumber = useCartNumberState()

// 购物车商品数量
const number = await useCartNumber.setCartNumber()
// const el = ref<HTMLElement | null>(null)
// const rt = useScroll(el, { behavior: 'smooth' })

// const goBackTop = () => {
//   console.log('y :>> ', rt)
// }
</script>

<template>
    <div class="fixed-box">
        <ul class="side-ul">
            <!-- <li>
                <NuxtLink class="side-item" to="https://w1011.ttkefu.com/k/linkurl/?t=3G6FHI1" target="_blank">
                    <i class="i-ep-service" />
                    <p class="text">
                        客服
                    </p>
                </NuxtLink>
            </li> -->
            <li>
                <NuxtLink class="side-item" to="/user">
                    <i class="i-ep-user-filled" />
                    <p class="text">
                        我的
                    </p>
                </NuxtLink>
            </li>
            <!-- <li>
                <NuxtLink class="side-item cart-num" to="/order/cart">
                    <i class="i-ic-twotone-shopping-cart" />
                    <p class="text">
                        购物车
                    </p>
                    <span v-if="number" class="n">{{ number }}</span>
                </NuxtLink>
            </li> -->
            <li>
                <NuxtLink class="side-item" to="/user/collect">
                    <i class="i-carbon-favorite-filled" />
                    <p class="text">
                        我的收藏
                    </p>
                </NuxtLink>
            </li>
            <li>
                <NuxtLink class="side-item" to="/user/history">
                    <i class="i-ep-list" />
                    <p class="text">
                        浏览历史
                    </p>
                </NuxtLink>
            </li>
            <li>
                <a class="side-item" href="#">
                    <i class="i-ic-baseline-arrow-upward" />
                    <p class="text">
                        返回顶部
                    </p>
                </a>
            </li>
        </ul>
    </div>
</template>

<style lang="scss" scoped>
.fixed-box {
    position: fixed;
    right: 0;
    top: 300px;
    z-index: 10;
}

.side-ul {
    li {
        width: 60px;
        height: 55px;
        box-shadow: 0 0 5px 0 rgba(0, 0, 0, .08);
        font-size: 12px;
        background-color: var(--el-color-white);
    }

    .side-item {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        width: 100%;
        height: 100%;
        cursor: pointer;

        &:hover {
            background-color: var(--el-color-primary);
            color: var(--el-color-white);
            i{
                color: var(--el-color-white);
            }
        }

        &-top {
            position: relative;
            font-size: 12px;
            border-radius: 0;
        }

        i {
            font-size: 18px;
            color: var(--el-color-primary-light-3);
        }
    }

    .cart-num {
        position: relative;

        .n {
            position: absolute;
            transform: scale(0.8);
            top: 2px;
            left: 38px;
            color: var(--el-color-primary);
        }
        &:hover{
            .n{
                color: var(--el-color-white);
            }
        }
    }
}
</style>
