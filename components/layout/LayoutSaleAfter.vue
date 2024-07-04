<script lang="ts" setup>

</script>

<template>
    <div class="layout-user">
        <div class="container">
            <el-container class="layout-box">
                <el-aside class="left">
                    <div class="p10px text-center text-17px">
                        售后中心
                    </div>
                    <el-divider border-style="dotted" class="m0!" />
                    <div class="pb15px">
                        <dl class="dl-list">
                            <dt>
                                <i class="i-ep-house inline-block" />
                                售后申请
                            </dt>
                            <dd>
                                <NuxtLink to="/sale/install">
                                    安装申请
                                </NuxtLink>
                            </dd>
                            <dd>
                                <NuxtLink to="/sale/maintenance">
                                    维修申请
                                </NuxtLink>
                            </dd>
                            <dd>
                                <NuxtLink to="/sale/list">
                                    售后信息
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
