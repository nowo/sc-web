<!-- 个人信息 -->

<script lang="ts" setup>
const userState = useUserState()
const user = await userState.getUserInfo()
// console.log('userData :>> ', userData)

// 头像
const faceImg = computed(() => user.value?.headimgurl || '')

/**
 * 退出登录
 */
const onLoginOut = () => {
    useLoginOut()
}
</script>

<template>
    <div class="user-card p15px">
        <div class="user-welcome">
            <div class="user-login">
                <div class="flex items-center">
                    <div class="face">
                        <co-image v-if="user?.user_name && faceImg" class="h55px w55px b-rounded-5px" :src="faceImg"
                            width="55" height="55" :alt="user?.user_name" />
                        <i v-else class="i-carbon-user-avatar-filled-alt block text-48px" />
                    </div>
                    <div class="text-14px font700">
                        <p> 欢迎光临工游记商城</p>
                        <p v-if="user?.user_name">
                            你好！{{ user?.user_name }}
                        </p>
                    </div>
                </div>
                <div v-if="user?.user_name" class="pt12px text-center">
                    <NuxtLink to="/user" class="mr20px">
                        <el-button class="min-w70px" type="danger" size="small">
                            个人中心
                        </el-button>
                    </NuxtLink>
                    <el-button class="min-w70px" type="info" size="small" plain @click="onLoginOut">
                        退出登录
                    </el-button>
                </div>
                <div v-else class="pb15px pt10px text-center">
                    <NuxtLink to="/login/register">
                        <el-button class="min-w70px" type="primary" size="small">
                            注 册
                        </el-button>
                    </NuxtLink>
                    <NuxtLink to="/login" class="ml10px">
                        <el-button class="min-w70px" type="primary" size="small" plain>
                            登 录
                        </el-button>
                    </NuxtLink>
                </div>
            </div>
        </div>
        <div class="user-tle">
            企业会员权益
        </div>
        <div class="user-warp">
            <ul class="user-warp-ul">
                <li>
                    <a href="javascript:;" class="cursor-default">
                        <div class="icon-box">
                            <img src="~assets/images/gyj-huiyuanjia.png" width="24" height="24" alt="专享会员价">
                        </div>
                        <div>专享会员价</div>
                    </a>
                </li>
                <li>
                    <a href="javascript:;" class="cursor-default">
                        <div class="icon-box">
                            <img src="~assets/images/gyj-quanbao.png" width="24" height="24" alt="降本券包">
                        </div>
                        <div>降本券包</div>
                    </a>
                </li>
                <li>
                    <a href="javascript:;" class="cursor-default">
                        <div class="icon-box">
                            <img src="~assets/images/gyj-mianyou.png" width="24" height="24" alt="首单免邮">
                        </div>
                        <div>首单免邮</div>
                    </a>
                </li>
                <li>
                    <a href="javascript:;" class="cursor-default">
                        <div class="icon-box">
                            <img src="~assets/images/gyj-quanyi.png" width="24" height="24" alt="帐期权益">
                        </div>
                        <div>帐期权益</div>
                    </a>
                </li>
                <li>
                    <a href="javascript:;" class="cursor-default">
                        <div class="icon-box">
                            <img src="~assets/images/gyj-zuzhiguanli.png" width="24" height="24" alt="组织管理">
                        </div>
                        <div>组织管理</div>
                    </a>
                </li>
                <li>
                    <a href="javascript:;" class="cursor-default">
                        <div class="icon-box">
                            <img src="~assets/images/gyj-kefu1.png" width="24" height="24" alt="专属客服">
                        </div>
                        <div>专属客服</div>
                    </a>
                </li>
            </ul>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.user-card {
    height: 100%;
    --m-welcome-height: 110px;
    --m-tle-height: 40px;

    .user-welcome {
        height: var(--m-welcome-height);
    }

    .user-tle {
        padding-top: 15px;
        border-top: 1px solid var(--el-border-color);
        font-size: 14px;
        font-weight: 700;
    }

    .user-warp {
        height: calc(100% - var(--m-welcome-height) - var(--m-tle-height));
        padding-top: 10px;

        &-ul {
            height: 100%;
            display: grid;
            grid-gap: 2px;
            grid-template-columns: 1fr 1fr;
            grid-template-rows: auto;

            li {
                >a {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-direction: column;
                    height: 100%;
                    width: 100%;
                    font-size: 12px;

                    &:hover {
                        box-shadow: 0 0 8px 0 rgba(65, 65, 65, .2);
                        border-radius: 3px;
                    }

                    .icon-box {
                        margin-bottom: 8px;
                    }

                    img {
                        width: 24px;
                        margin: 0 auto;
                    }
                }
            }
        }
    }

    .user-login {
        .face {
            color: var(--el-text-color-regular);
            margin-right: 5px;
            height: 55px;
        }
    }

}
</style>
