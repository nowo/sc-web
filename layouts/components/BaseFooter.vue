<template>
    <div class="footer-box bg-#333">
        <div class="container">
            <div class="footer-top">
                <div class="content" v-html="systemInfo?.footer_content" />
            </div>
            <div class="mid">
                <ul class="footer-link">
                    <lazy-client-only>
                        <li v-for="item in navList" :key="item.id">
                            <dl>
                                <dt>{{ item.name }}</dt>
                                <dd v-for="sub in item.children" :key="sub.id">
                                    <NuxtLink :to="`/content/help?id=${sub.id}`">
                                        {{ sub.name }}
                                    </NuxtLink>
                                </dd>
                            </dl>
                        </li>
                    </lazy-client-only>
                </ul>
                <div class="footer-right">
                    <div class="footer-logo">
                        <NuxtLink to="/">
                            <CoImage class="mb15px h60px w210px" :src="systemInfo?.small_logo" alt="logo" />
                        </NuxtLink>
                        <p>售后电话: {{ systemInfo?.sale_tel }}</p>
                        <p>工作时间: {{ systemInfo?.work_time }}</p>
                    </div>
                    <div class="footer-code">
                        <div class="footer-code-box text-center">
                            <CoImage class="w110px pb100%" :src="systemInfo?.wx_code" alt="公众号二维码" />
                            <div class="mt5px">
                                公众号二维码
                            </div>
                            <!-- <div class="footer-code-item">
                <div class="mb5px">
                  公众号二维码
                </div>
                <img class="w110px" src="https://images.gdbmro.com/index/public_code.jpg" alt="">
              </div> -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="footer-bot">
            <div class="flex justify-between container">
                <div class="left">
                    <NuxtLink href="javascript:;" class="mr5px">
                        隐私政策
                    </NuxtLink>
                    <NuxtLink href="javascript:;" class="mr5px">
                        用户协议
                    </NuxtLink>
                    <NuxtLink to="/list/site" class="link-name mr5px">
                        网站导航
                    </NuxtLink>
                </div>
                <div class="right">
                    {{ systemInfo?.copyright }}
                    <NuxtLink :to="systemInfo?.filings_url" target="_blank" rel="noopener" class="ml5px">
                        {{ systemInfo?.filings }}
                    </NuxtLink>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
// 获取系统信息
const useSystem = useSystemState()
const systemInfo = await useSystem.getSystemInfo()

// 获取底部导航
const { data: footer } = await useFetch<{ data: HomeApi_GetArticleResponse[] } & ResponseCodeMsg>('/api/main/nav', {
    method: 'post',
    body: {
        type: 1,
    },
})

const navList = computed<HomeApi_GetArticleResponse[]>(() => footer.value?.data || [])
</script>

<style lang="scss" scoped>
.footer-box {
    color: #fff;
    padding-top: 50px;

    .top {
        padding: 10px;
    }

    .mid {
        padding-bottom: 30px;
        border-bottom: 1px solid #555;
        display: flex;
        justify-content: space-between;
    }

    .footer-bot {
        font-size: 14px;
        padding: 15px 0;
        border-bottom: 5px solid var(--el-color-primary-light-3);
    }
}

.footer-top {
    display: flex;
    justify-content: center;
    margin-bottom: 50px;

    .content {
        width: 100%;
        text-align: center;

        :deep(img) {
            display: inline-block;
        }
    }
}

.footer-link {
    display: flex;

    li {
        width: 130px;

        dt {
            font-weight: bold;
        }

        dd {
            font-size: 14px;
            color: #ccc;
            margin: 5px 0;

            a:hover {
                color: #fff;
            }
        }
    }
}

.footer-right {
    width: 38%;
    display: flex;
    justify-content: space-between;
}

.link-name {
    &:hover {
        color: var(--el-color-info);
    }
}
</style>
