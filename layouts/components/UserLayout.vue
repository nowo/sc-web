<script lang="ts" setup>

</script>

<template>
    <div class="container">
        <el-container class="layout-box">
            <el-aside class="left">
                <div class="p10px text-center text-17px">
                    个人中心
                </div>
                <el-divider border-style="dotted" class="m0!" />
                <div class="pb15px">
                    <dl class="dl-list">
                        <dt>
                            <i class="i-ep-house inline-block" />
                            订单中心
                        </dt>
                        <dd>
                            <NuxtLink to="/order/list">
                                我的订单
                            </NuxtLink>
                        </dd>
                        <dd>
                            <NuxtLink to="/order/return">
                                退换货订单
                            </NuxtLink>
                        </dd>
                        <dd>
                            <NuxtLink to="/user/info">
                                站内信息
                            </NuxtLink>
                        </dd>
                        <dd>
                            <NuxtLink to="/user/coupon">
                                我的优惠券
                            </NuxtLink>
                        </dd>
                        <dd>
                            <NuxtLink to="/user/beans">
                                我的工游豆
                            </NuxtLink>
                        </dd>
                    </dl>
                    <dl class="dl-list">
                        <dt>
                            <i class="i-ep-user inline-block" />
                            企业用户
                        </dt>
                        <dd>
                            <NuxtLink to="/user/enterprise">
                                企业用户
                            </NuxtLink>
                        </dd>
                    </dl>
                    <dl class="dl-list">
                        <dt>
                            <i class="i-ep-star inline-block" />
                            我关注的
                        </dt>
                        <dd>
                            <NuxtLink to="/user/collect">
                                我的收藏
                            </NuxtLink>
                        </dd>
                        <dd>
                            <NuxtLink to="/user/question">
                                问答列表
                            </NuxtLink>
                        </dd>
                        <dd>
                            <NuxtLink to="/user/history">
                                浏览历史
                            </NuxtLink>
                        </dd>
                    </dl>
                    <dl class="dl-list">
                        <dt>
                            <i class="i-ep-memo inline-block" />
                            账户管理
                        </dt>
                        <dd>
                            <NuxtLink to="/user/account">
                                账户资料
                            </NuxtLink>
                        </dd>
                        <dd>
                            <NuxtLink to="/user/address">
                                地址管理
                            </NuxtLink>
                        </dd>
                        <dd>
                            <NuxtLink to="/user/invoice">
                                抬头管理
                            </NuxtLink>
                        </dd>
                        <dd>
                            <NuxtLink to="/user/recommend">
                                推荐管理
                            </NuxtLink>
                        </dd>
                    </dl>
                </div>
            </el-aside>
            <el-main class="right">
                <slot />
            </el-main>
        </el-container>
    </div>
</template>

<style lang="scss" scoped>
.router-link-active {
    color: var(--el-color-primary);
}

.layout-box {
    padding: 20px 0;

    .left {
        width: var(--m-aside-width);
        margin-right: 10px;
        background-color: var(--el-color-white);
    }

    .right {
        background-color: var(--el-color-white);

    }
}

.dl-list {
    text-align: center;
    padding-top: 10px;

    dt {
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: bold;
        font-size: 15px;
        line-height: 2;
    }

    dd {
        font-size: 14px;
        line-height: 32px;

        a {
            display: block;

            &:hover {
                color: var(--el-color-primary);
            }
        }
    }
}
</style>
