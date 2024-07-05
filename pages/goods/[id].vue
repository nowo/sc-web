<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import QRCode from 'qrcode'
import { GoodsApi } from '~/api/goods/list'
import { InterListApi } from '~/api/user/interList'
import { RecordApi } from '~/api/user/record'
import { UserLogin } from '#components'
import { CouponApi } from '~/api/user/coupon'

// const { text, copy, copied, isSupported } = useClipboard({ legacy: true })
const { x, y } = useMouse() // 鼠标位置函数用于获取当前鼠标位置

const formRef = ref<FormInstance>()

// 获取商城信息
const useSystem = useSystemState()
const systemInfo = await useSystem.getSystemInfo()

const userState = useUserState()
// 登录用户
const userData = await userState.getUserInfo()
const useCartNumber = useCartNumberState()

const loginRef = ref<InstanceType<typeof UserLogin>>()

const defData = reactive({
    page: 1,
    total: 0,
    pageSize: 10,
    // pageSizes: [10, 20, 30],
    leftActive: '1',
    rightActive: '1',

    shareVisible: false,
    shareCode: '', // 分享二维码
    shareLink: '', // 分享的链接地址
    tableData: [] as InterListApi_getListResponse['lists'],
    skeleton: true, // 默认显示骨架屏
    visible: false,
    type: 1, // 1：提问，2：回答
    btnLoading: false,
    visibleLogin: false,
})

const form = reactive({
    number: 1, // 购买数量
    question: '', // 问答列表 提问
    answer: '', // 问答列表 回答
    user_id: '',
    question_id: 0,
})
const param_id = useRouteParam('id')

const goods_sn = param_id.value?.trim() ?? ''
// console.warn(goods_sn)

const { data, error, status } = await GoodsApi.getInfo({ goods_sn })

// 商品信息
const goodsData = computed(() => {

    const goodsInfo = {
        ...data.value?.data?.goods_info,
        cat_name: data.value?.data.cat_name,
        brand_name: data.value?.data.brand_name,
    }

    const id = data.value?.data?.goods_info.goods_id || 0
    const photoList: string[] = goodsInfo?.goods_img ? [goodsInfo?.goods_img] : []

    data.value?.data?.photo_lists.forEach((item) => {
        if (item.photo_url) photoList.push(item.photo_url)
    })

    const linkList = data.value?.data?.link_lists.slice(0, 10)

    return {
        goodsInfo,
        photoList,
        linkList,
        id,
    }
})

if (data.value?.data?.goods_info) {
    const infoData = data.value?.data?.goods_info
    // 设置seo
    const meta = []
    if (infoData.web_desc) meta.push({ name: 'description', content: infoData.web_desc })
    if (infoData.web_keywords) meta.push({ name: 'keywords', content: infoData.web_keywords })
    useHead({
        title: infoData.web_title || infoData.goods_name,
        meta,
    })
}

// 获取商品信息
const initGoodsData = async () => {

}

// 问答列表 弹窗标题
const comData = computed(() => {
    let dat = {
        title: '提问',
    }
    if (defData.type === 2) {
        dat = {
            title: '回答',
        }
    }
    return dat
})
// 问答列表 获取数据
const initQuestionData = async () => {
    const param: InterListApi_getList = {
        is_paging: 1,
        page: defData.page,
        pagesize: defData.pageSize,
        goods_id: goodsData.value.id,
    }
    const res = await InterListApi.getList(param)
    if (res.data.value?.code !== 200) return ElMessage.error(res.data.value?.msg)
    defData.tableData = res.data.value.data.lists
    defData.total = res.data.value.data.total
}
// 打开提问弹窗
const questionClick = async () => {
    defData.type = 1
    defData.visible = true
}
// 打开回答弹窗
const onAnswer = async (row: any) => {
    defData.type = 2
    defData.visible = true
    form.user_id = row.user_id
    form.question_id = row.question_id
}
// 发布提问 / 回答
const answerClick = async () => {
    if (defData.type === 1) { // 提问
        if (!form.question) return ElMessage.warning('请先输入问题')
        const info: InterListApi_addList = {
            goods_id: goodsData.value.id,
            type: 1,
            q_id: 0,
            content: form.question,
        }
        const { data, error } = await InterListApi.addList(info)
        if (error.value) return
        if (data.value?.code !== 200) return ElMessage.error(data.value?.msg)
        initQuestionData()
        defData.visible = false
        ElMessage.success('发布成功')
        form.question = ''
    } else { // 回答
        if (!form.answer) return ElMessage.warning('请输入回答')
        const info: InterListApi_addList = {
            goods_id: goodsData.value.id,
            type: 2,
            q_id: form.question_id,
            content: form.answer,
        }

        const { data, error } = await InterListApi.addList(info)
        if (error.value) return
        if (data.value?.code !== 200) return ElMessage.error(data.value?.msg)
        initQuestionData()
        defData.visible = false
        ElMessage.success('回答成功')
        form.answer = ''
    }
}
// 分页数量点击
const onHandleSizeChange = () => {
    initQuestionData()
}
// 用户名脱敏处理
const changeToStar = (str: any) => {
    const len1 = 1
    const len2 = 1
    const strLen = str.length
    // let stars = ''
    // for (let i = 0; i < strLen - len1 - len2; i++) {
    //     stars += '*'
    // }
    str = `${str.substr(0, len1)}***${str.substr(strLen - len2)}`
    return str
}

// 关闭弹窗
const onClose = () => {
    defData.visible = false
    formRef.value?.resetFields()
}

// 商品收藏
const onCollect = async () => {
    // 用户未登录时
    if (!userState.token.value) {
        return navigateTo('/login')
    }
    // 已经收藏了，取消收藏状态
    if (goodsData.value.goodsInfo?.is_collect) {
        // 清除收藏
        const params: RecordApi_Del = {
            goods_ids: goodsData.value.id.toString(),
            type: 1,
        }
        const { data } = await RecordApi.del(params)
        if (data.value?.code === 200) {
            goodsData.value.goodsInfo.is_collect = 0 // 清除收藏标记
        }
    } else {
        const params: RecordApi_Add = {
            goods_id: goodsData.value.id,
            type: 1,
        }
        const { data } = await RecordApi.add(params)
        if (data.value?.code === 200) {
            goodsData.value.goodsInfo!.is_collect = 1
        }
    }
}

// 立即购买
const onBuyGoods = () => {
    if (!goodsData.value.goodsInfo?.is_sale) return ElMessage.warning('商品已下架')

    const price = goodsData.value.goodsInfo?.shop_price || ''
    if (Number(price) <= 0) {
        return ElMessage.warning('商品价格不正确')
    }
    const param = {
        goods_id: goodsData.value.id,
        goods_number: form.number,
    }

    navigateTo({
        path: '/order/confirm',
        query: param,
    })
}

// 加入购物车
const onAddCart = async () => {
    if (!goodsData.value.goodsInfo?.is_sale) return ElMessage.warning('商品已下架')
    // 用户未登录时，不允许加入购物车页面
    if (!userState.token.value) {
        ElMessage.warning('请先登录!')
        return navigateTo('/login')
    }
    const price = goodsData.value.goodsInfo?.shop_price || ''
    if (Number(price) <= 0) {
        return ElMessage.warning('商品价格不正确')
    }

    const { number } = form
    if (number > 0 && goodsData.value.id) {
        const { data } = await GoodsApi.addCart({ goods_id: goodsData.value.id, goods_number: number })
        if (data.value?.code === 200) {
            useCartNumber.setCartNumber()
            ElMessage.success('加入购物车成功')
            form.number = 1
            // 设置动画
            useCartNumber.setShopAnimate({ top: y.value, left: x.value })
        } else {
            ElMessage.error(data.value?.msg || '加入购物车失败')
        }
    } else {
        ElMessage.warning('购买数量不能为0')
    }
}

// 商品分享
const onShare = async () => {
    if (userData.value?.user_id) {
        defData.shareLink = `${location.origin}/login/register?id=${userData.value?.user_id}`
        if (!defData.shareCode) {
            defData.shareCode = await QRCode.toDataURL(defData.shareLink)
        }

        defData.shareVisible = true
    } else {
        navigateTo('/login')
    }
}

/**
 * base64转Blob：
 */
const base64ToBlob = (url: string) => {
    const arr = url.split(',')
    const mime = arr[0].match(/:(.*?);/)?.[1]
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
    }
    return new Blob([u8arr], { type: mime })
}

// 复制链接地址或二维码
const onCopy = async (type: 'text' | 'img') => {
    if (type === 'text') {
        try {
            await navigator.clipboard.writeText(defData.shareLink)
            ElMessage.success('复制成功')
        } catch (err) {
            const e = document.createElement('textarea')
            document.body.appendChild(e)
            e.innerHTML = defData.shareLink
            e.select()
            if (document.execCommand('copy')) {
                document.execCommand('copy')
            }
            document.body.removeChild(e)
            ElMessage.success('复制成功')
        }
        // navigator.clipboard.writeText(defData.shareLink).then(() => {
        //   ElMessage.success('复制成功')
        // }).catch(() => {
        //   const e = document.createElement('textarea')
        //   document.body.appendChild(e)
        //   e.innerHTML = defData.shareLink
        //   e.select()
        //   if (document.execCommand('copy')) {
        //     document.execCommand('copy')
        //   }
        //   document.body.removeChild(e)
        //   ElMessage.success('复制成功')
        // })
    } else {
        const myBlob = base64ToBlob(defData.shareCode)
        navigator.clipboard.write([new window.ClipboardItem({ [myBlob.type]: myBlob })]).then(() => {
            ElMessage.success('复制成功')
        })
    }
}

// 下载二维码
const onDownload = () => {
    const myBlob = base64ToBlob(defData.shareCode)
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(myBlob)
    link.download = `goyojo-share${Date.now()}.png`
    link.click()

    document.removeChild(link)
}

// 认证企业会员
const onApprove = () => {
    if (!userData.value?.user_id) { // 未登录
        // navigateTo('/login')
        defData.visibleLogin = true
    } else {
        // 转到企业认证页面
        navigateTo('/user/enterprise')
    }
}

// 用户登陆成功后,更新页面
const onUserLogin = () => {
    defData.visibleLogin = false // 关闭登陆
    if (import.meta.client) location.reload()
}

/**
 * 商品详情区域tab切换
 */
const onRightTabChange = async () => {
    if (defData.rightActive === '2') {
        initQuestionData()
    }
}

// 领取优惠券
const onReceive = async (id: number) => {
    const data: CouponApi_addList = {
        user_id: userData.value!.user_id,
        coupon_id: id,
    }
    const res = await CouponApi.addList(data)
    if (res.data.value?.code !== 200) return ElMessage.error(res.data.value?.msg)
    ElMessage.success('领取成功')
}

// 添加商品浏览历史
const onHistory = async () => {
    // 只在客户端时执行
    if (!import.meta.client) return

    // 获取当前路由
    const name = useRoute().name

    // 进入页面2秒后加入历史记录中
    await wait(2000)

    // 路由发生变化时，不添加进入历史记录
    const newName = useRoute().name
    if (newName !== name) return

    if (userData.value?.user_id && goodsData.value.id) {
        const params: RecordApi_Add = {
            goods_id: goodsData.value.id,
            type: 2,
        }
        await RecordApi.add(params)
    }
}

initGoodsData()
// watch(()=>status.value, async (val) => {
//     console.log(val)
//     // if (val) {
//     //     await wait(150)
//     //     defData.skeleton = false
//     // }
// })
watchEffect(async () => {
    console.warn('status', status.value)
    await wait(100)
    defData.skeleton = false
})
// watch(() => goodsData.value.id, async (val) => {
//     console.log(val)
//     if (val) {
//         await wait(150)
//         defData.skeleton = false
//     }
// })

onMounted(() => {
    onHistory()
})

definePageMeta({
    layout: 'home',
})
</script>

<template>
    <section class="goods-detail">
        <div class="container">
            <!--   status!='success'-->
            <el-skeleton :loading="defData.skeleton" animated>
                <template #template>
                    <div class="my15px">
                        <el-skeleton-item class="w30%!" />
                    </div>
                    <div class="goods-main">
                        <div class="goods-zoom">
                            <div class="relative w100% pb100%">
                                <el-skeleton-item variant="image" class="absolute left-0 top-0 h100%! w100%!" />
                            </div>
                        </div>
                        <div class="goods-cen">
                            <el-skeleton-item variant="h1" class="mb10px w50%!" />
                            <el-skeleton :rows="6" />
                            <div class="my10px flex b-t b-t-dashed pt10px">
                                <el-skeleton-item variant="button" class="mr15px w150px!" />
                                <el-skeleton-item variant="button" class="mr15px w150px!" />
                            </div>
                        </div>
                        <div class="goods-right">
                            <el-skeleton-item variant="image" style="width:210px;height:360px" />
                        </div>
                    </div>
                    <div class="goods-cont">
                        <div class="lt bg-white p15px">
                            <el-skeleton />
                        </div>
                        <div class="gt min-h500px p15px">
                            <el-skeleton />
                            <el-skeleton class="mt15px" />
                        </div>
                    </div>
                </template>
                <GoodsBreadcrumb class="my15px" :cid="goodsData.goodsInfo?.cat_id"
                    :name="goodsData.goodsInfo?.goods_name" />
                <div class="goods-main">
                    <div class="goods-zoom">
                        <GoodsImgZoom v-if="(goodsData.photoList.length > 0)" :images="goodsData.photoList" />
                        <CoImage v-else class="w100% pb100%" style="--el-color-info-light-9:#fff;" />
                    </div>
                    <div class="goods-cen">
                        <div class="goods-tle">
                            {{ goodsData.goodsInfo?.goods_name }}
                        </div>
                        <ul class="goods-pros">
                            <li class="items-center bg-#f8f8f8">
                                <div class="lt">
                                    价格
                                </div>
                                <div class="gt">
                                    <div class="flex">
                                        <el-popover placement="right" title="联系方式" :width="200" trigger="hover"
                                            :content="systemInfo?.sale_tel">
                                            <template #reference>
                                                <el-alert class="w-auto!" title="联系客服人员获取报价信息>>" type="warning"
                                                    :closable="false" />

                                            </template>
                                        </el-popover>
                                    </div>
                                    <div v-if="0" class="price1">
                                        <b>￥{{ goodsData.goodsInfo?.shop_price }}
                                            <!-- <span v-if="goodsInfo?.unit">/{{ goodsInfo?.unit}}</span> -->
                                        </b>
                                        <!-- <span class="price2 ml8px">{{ goodsData?.market_price }}</span> -->
                                    </div>
                                </div>
                            </li>
                            <!-- <li v-if="!userData?.attest_status" class="items-center bg-#f8f8f8 -mt10px">
                                <div class="lt" />
                                <div class="gt">
                                    <span class="price3" @click="onApprove">
                                        认证企业会员尊享价
                                        <i class="i-ep-arrow-right inline-block" />
                                    </span>
                                    <span class="text-12px c-#666">会员价</span>
                                </div>
                            </li> -->
                            <li v-if="goodsData.goodsInfo?.coupon_list?.length && false" class="bg-#f8f8f8">
                                <div class="lt">
                                    优惠券
                                </div>
                                <div class="gt">
                                    <!-- 未登录禁止领取 -->
                                    <el-popover v-for="item in goodsData.goodsInfo?.coupon_list?.slice(0, 5)"
                                        :key="item.coupon_id" placement="top" :width="75"
                                        :popper-style="{ minWidth: '75px' }" trigger="hover"
                                        :disabled="userData?.user_id ? false : true">
                                        <el-button class="w100%" type="primary" size="small" link
                                            @click="onReceive(item.coupon_id)">
                                            领取
                                        </el-button>
                                        <template #reference>
                                            <GoodsCoupon>
                                                {{ item.coupon_name }}立减{{ item.par_value }}元
                                            </GoodsCoupon>
                                        </template>
                                    </el-popover>

                                    <!-- <GoodsCoupon v-for="item in goodsInfo.coupon_list.slice(0, 5)" :key="item.coupon_id">
                                        {{ item.coupon_name }}立减{{ item.par_value }}元
                                    </GoodsCoupon> -->
                                </div>
                            </li>
                            <li class="items-center bg-#f8f8f8 -mt10px">
                                <div class="lt" />
                                <div class="gt my5px">
                                    <el-tag v-if="goodsData.goodsInfo?.is_best" type="primary" effect="dark"
                                        size="small" class="mr5px">
                                        精选
                                    </el-tag>
                                    <el-tag v-if="goodsData.goodsInfo?.is_new" type="warning" effect="dark" size="small"
                                        class="mr5px">
                                        精选
                                    </el-tag>
                                    <el-tag v-if="goodsData.goodsInfo?.is_hot" type="danger" effect="dark" size="small"
                                        class="mr5px">
                                        热销
                                    </el-tag>
                                </div>
                            </li>
                            <li>
                                <div class="lt">
                                    商品编号
                                </div>
                                <div class="gt">
                                    {{ goodsData.goodsInfo?.goods_sn }}
                                </div>
                            </li>
                            <li>
                                <div class="lt">
                                    商品品牌
                                </div>
                                <div class="gt">
                                    {{ goodsData.goodsInfo?.brand_name }}
                                </div>
                            </li>
                            <li>
                                <div class="lt">
                                    商品分类
                                </div>
                                <div class="gt">
                                    {{ goodsData.goodsInfo?.cat_name }}
                                </div>
                            </li>
                            <li>
                                <div class="lt">
                                    商品型号
                                </div>
                                <div class="gt">
                                    {{ goodsData.goodsInfo?.goods_code }}
                                </div>
                            </li>
                            <li>
                                <div class="lt">
                                    商品单位
                                </div>
                                <div class="gt">
                                    {{ goodsData.goodsInfo?.unit }}
                                </div>
                            </li>
                            <!-- <li>
                                <div class="lt">
                                    支付方式
                                </div>
                                <div class="gt">
                                    <el-button text bg size="small" class="cursor-default!">
                                        <i class="i-ic-baseline-wechat mr3px c-#09bb07" />
                                        微信
                                    </el-button>
                                    <el-button text bg size="small" class="cursor-default!">
                                        <i class="i-ri-alipay-fill mr3px c-#3887ff" />
                                        支付宝
                                    </el-button>
                                    <el-button text bg size="small" class="cursor-default!">
                                        <i class="i-ic-twotone-payments mr3px c-#ff5335" />
                                        线下转账
                                    </el-button>
                                </div>
                            </li>
                            <li class="items-center">
                                <div class="lt">
                                    购买数量
                                </div>
                                <div class="gt">
                                    <el-input-number v-model="form.number" :min="1" :max="9999" />
                                    <span class="ml5px c-#aaa">起购量:1个</span>
                                </div>
                            </li> -->
                            <li class="my8px b-t b-t-dashed">
                                <!--  -->
                            </li>
                            <li>
                                <div class="lt" />
                                <div class="gt">
                                    <el-button v-if="goodsData.goodsInfo?.is_collect" type="primary" text bg
                                        size="large" @click="onCollect">
                                        <i class="i-carbon-favorite-filled mr3px" />
                                        收藏
                                    </el-button>
                                    <el-button v-else text bg size="large" @click="onCollect">
                                        <i class="i-carbon-favorite mr3px" />
                                        收藏
                                    </el-button>
                                    <!-- <el-button text bg size="small" @click="onShare">
                                        <i class="i-ep-share mr3px" />
                                        分享
                                    </el-button> -->
                                </div>
                            </li>
                            <!-- <li class="buy-item">
                                <div class="lt">

                                </div>
                                <div class="gt">
                                    <el-button type="primary" size="large" @click="onBuyGoods">
                                        立即购买
                                    </el-button>
                                    <el-button type="primary" plain size="large" @click="onAddCart">
                                        <i class="i-carbon-shopping-cart mr3px" />
                                        加入购物车
                                    </el-button>
                                </div>
                            </li> -->
                        </ul>
                    </div>
                    <div class="goods-right">
                        <img class="outline-1px outline-#e5e7eb outline-solid" src="~/assets/images/gyj-band.png"
                            alt="">
                    </div>
                </div>
                <div class="goods-cont">
                    <div class="lt">
                        <el-tabs v-model="defData.leftActive" class="goods-lt-tabs">
                            <el-tab-pane label="推荐商品" name="1">
                                <ul v-if="goodsData?.linkList" class="goods-list">
                                    <li v-for="item in goodsData?.linkList" :key="item.goods_id">
                                        <NuxtLink class="pos" :to="`/goods/${item.goods_sn}`">
                                            <CoImage :src="setGoodsOssImg(item.goods_img, 300)"
                                                class="hov-img w100% pb100%" />
                                        </NuxtLink>
                                        <div class="tle">
                                            <NuxtLink :to="`/goods/${item.goods_sn}`">
                                                {{ item.goods_name }}
                                            </NuxtLink>
                                        </div>
                                        <!-- <div class="pce">
                                            <span>￥{{ item.shop_price }}</span>
                                        </div> -->
                                    </li>
                                </ul>
                            </el-tab-pane>
                        </el-tabs>
                    </div>
                    <div class="gt">
                        <el-tabs v-model="defData.rightActive" class="goods-gt-tabs" @tab-change="onRightTabChange">
                            <el-tab-pane label="商品详情" name="1">
                                <div v-html="goodsData.goodsInfo?.goods_desc" />
                            </el-tab-pane>
                            <el-tab-pane label="商品问答" name="2" lazy>
                                <el-button style="background-color: var(--el-color-primary);color: white;"
                                    @click="questionClick">
                                    我要提问
                                </el-button>
                                <el-table :data="defData.tableData" style="width: 100%" default-expand-all>
                                    <el-table-column type="expand">
                                        <template #default="props">
                                            <div v-if="props.row.answer_lists.length === 0" class="ml-60px c-#aaa">
                                                <span class="mr5px fw-800">答</span>
                                                暂无回答
                                            </div>
                                            <el-table v-else :data="props.row.answer_lists" :show-header="false"
                                                style="--el-table-border-color: none;">
                                                <el-table-column width="49px" />
                                                <el-table-column prop="content">
                                                    <template #default="scopes">
                                                        <span class="mr5px c-green fw-800">答</span>
                                                        <span>{{ scopes.row.content }}</span>
                                                    </template>
                                                </el-table-column>
                                                <el-table-column prop="" width="300" show-overflow-tooltip
                                                    align="right">
                                                    <template #default="scopes">
                                                        <span style="font-weight: 80;font-size: 12px;"> {{
                changeToStar(scopes.row.user_name) }}
                                                            {{ formatTime(scopes.row.add_time) }}</span>
                                                    </template>
                                                </el-table-column>
                                                <el-table-column width="120px" />
                                            </el-table>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="" prop="content">
                                        <template #default="scopes">
                                            <span class="mr5px c-red fw-800">问</span>
                                            <span style="font-weight: 800;">{{ scopes.row.content }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="" width="300" show-overflow-tooltip align="right">
                                        <template #default="scopes">
                                            <span style="font-weight: 80;font-size: 13px;"> {{
                changeToStar(scopes.row.user_name) }}
                                                {{ formatTime(scopes.row.add_time) }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column fixed="right" label="" width="120">
                                        <template #default="scopes">
                                            <el-button link type="primary" size="small" @click="onAnswer(scopes.row)">
                                                去回答
                                            </el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                                <div class="goods-pagination" mt15px>
                                    <el-pagination v-model:current-page="defData.page"
                                        v-model:page-size="defData.pageSize" size="small" background
                                        layout=" prev, pager, next,total, jumper" :total="defData.total"
                                        @size-change="onHandleSizeChange" @current-change="onHandleSizeChange" />
                                </div>
                            </el-tab-pane>
                        </el-tabs>
                    </div>
                </div>
                <el-dialog v-if="CLIENT" v-model="defData.shareVisible" title="分享给好友" width="450px" draggable>
                    <el-form class="-mt20px" label-position="top">
                        <el-form-item label="链接地址">
                            <el-input v-model="defData.shareLink" class="pr12px w70%!" disabled />
                            <el-button type="primary" class="w30%" @click="onCopy('text')">
                                复制地址
                            </el-button>
                        </el-form-item>
                        <el-form-item label="二维码">
                            <div class="flex">
                                <el-image :src="defData.shareCode" class="mr12px h120px w120px b b-1 b-#eee" />
                                <el-button type="primary" @click="onDownload">
                                    下载二维码
                                </el-button>
                            </div>
                        </el-form-item>
                    </el-form>
                    <!-- <div class="text-center">
                        <el-image :src="defData.shareCode" class="h120px w120px -mt20px" />
                        <div class="">
                            <el-button type="success" text @click="onCopy('text')">
                            复制链接地址
                            </el-button>
                            <el-button type="warning" text @click="onCopy('img')">
                            复制二维码
                            </el-button>
                        </div>
                    </div> -->
                </el-dialog>
                <el-dialog v-model="defData.visibleLogin" width="450px" title="">
                    <UserLogin ref="loginRef" class="goods-login" @update="onUserLogin" />
                </el-dialog>
            </el-skeleton>
        </div>

        <el-dialog v-model="defData.visible" auto-height width="680px" :draggable="true" :title="comData.title"
            @close="onClose">
            <el-form ref="formRef" :model="form" inline>
                <el-form-item v-if="defData.type === 1" prop="content">
                    <el-input v-model="form.question" style="width: 500px;margin-right: 10px;" placeholder="请输入您的问题吧~"
                        clearable type="textarea" />
                </el-form-item>

                <el-form-item v-else prop="content">
                    <el-input v-model="form.answer" type="textarea" style="width: 500px" placeholder="请输入您的回答~"
                        clearable />
                </el-form-item>
                <el-form-item>
                    <el-button style="background-color: var(--el-color-primary);color: white;" @click="answerClick">
                        发布
                    </el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </section>

</template>

<style lang="scss" scoped>
.goods-main {
    display: flex;
    justify-content: space-between;
    --goods-img-zoom-width: 400px;
    --goods-right-width: 230px;

    .goods-zoom {
        width: var(--goods-img-zoom-width);
        min-height: var(--goods-img-zoom-width);
        background-color: var(--el-color-white);

        :deep(.swiper-box) {
            margin-bottom: 10px;
            --swiper-navigation-sides-offset: 8px;

            .swp {
                width: calc(100% - 60px);
            }

        }
    }

    .goods-cen {
        --goods-cen-left-blank: 10px;
        width: calc(100% - var(--goods-img-zoom-width) - var(--goods-right-width) - var(--goods-cen-left-blank));
        margin-left: var(--goods-cen-left-blank);
        background-color: var(--el-color-white);
        padding: 20px;
    }

    .goods-right {
        width: var(--goods-right-width);
        background-color: var(--el-color-white);
        padding: 20px;
        padding-left:0;
        display: flex;
        align-items: center;
    }

    .goods-tle {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 15px;
    }

}

.goods-pros {

    >li {
        font-size: 14px;
        display: flex;
        text-align: left;
        font-weight: normal;
        // line-height: 24px;
        line-height: 1.6;
    }

    .buy-item {
        :deep(.el-button) {
            --el-font-size-base: 16px;
        }
    }

    .lt {
        width: 80px;
        padding: 5px 8px;

        color: var(--el-text-color-secondary);
    }

    .gt {
        flex: 1;
        padding: 5px 8px;
        color: var(--el-text-color-primary);

        .price1 {

            b {
                font-size: 28px;
                color: var(--el-color-primary);

                span {
                    font-size: 70%;
                    font-weight: normal;
                }
            }

        }

        .price2 {
            font-size: 16px;
            text-decoration: line-through;
            color: var(--el-text-color-secondary);
        }

        .price3 {
            display: inline-flex;
            align-items: center;
            padding-left: 3px;
            border: 1px solid var(--el-color-info);
            font-size: 12px;
            cursor: pointer;

            &:hover {
                color: var(--el-color-primary);
                border-color: var(--el-color-primary);
            }
        }
    }

}

.goods-cont {
    display: flex;
    justify-content: space-between;
    --goods-cont-left-width: 250px;
    margin: 20px 0;

    .lt {
        width: var(--goods-cont-left-width);

        :deep(.el-tabs--top) {

            // :not(:last-child)
            .el-tabs__item.is-top:nth-child(2) {
                margin-left: 20px;
            }
        }
    }

    .gt {
        width: calc(100% - var(--goods-cont-left-width) - 10px);
        background-color: var(--el-color-white);

    }

    :deep(.el-tabs--top) {

        // :not(:last-child)
        .el-tabs__item {
            font-weight: bold;
        }

        .el-tabs__item.is-top:nth-child(2) {
            // padding-left: 20px;
            margin-left: 20px;
        }
    }

    :deep(.el-tabs__content) {
        padding: 10px;
    }

    .goods-lt-tabs {
        background-color: var(--el-color-white);
        min-height: 400px;
        height: 100%;
    }

    .goods-gt-tabs {
        :deep(.el-tabs__content) {
            padding: 15px;
        }
    }
}

.goods-list {
    li {
        padding: 10px;

        +li {
            border-top: 1px dashed var(--el-border-color-light);
        }
    }

    .pos {
        padding-bottom: 100%;
        display: block;
    }

    .tle {
        height: 40px;
        // margin-bottom: 8px;

        a {
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            line-height: 20px;
            max-height: 40px;
            font-size: 14px;
            color: var(--el-text-color-regular);

            &:hover {
                cursor: pointer;
                color: var(--el-color-primary);
                text-decoration: underline;
            }
        }
    }

    .pce {
        font-size: 13px;
        font-weight: bold;
        color: var(--el-color-primary);
    }

    .hov-img {
        :deep(>img) {
            transition: all 0.3s;
        }

        &:hover {
            :deep(>img) {
                transform: scale(1.03);
            }
        }

    }
}

.no-goods-box {
    margin: 20px 0;
    padding: 30px;
    border: 1px solid var(--el-border-color-light);
    background-color: var(--el-color-white);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
}

.goods-login {
    width: 100%;

    :deep(.login-tle) {
        margin-top: -30px;
    }
}
</style>
