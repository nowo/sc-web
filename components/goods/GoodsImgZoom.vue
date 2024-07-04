<script  lang="ts" setup>
import { reactive, ref } from 'vue'
import { useMouseInElement } from '@vueuse/core'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation } from 'swiper'

import 'swiper/css'
import 'swiper/css/navigation'
import type { NavigationOptions } from 'swiper/types'

const props = defineProps<{
    images: string[]
}>()

const imgList = computed(() => {
    const small = props.images.map((item) => {
        let url = item
        try {
            url = setGoodsOssImg(item, 60)
        } catch (error) {

        }
        return url
    })
    return { big: props.images, small }
})

const modules = ref([Navigation])

const navigate = ref<NavigationOptions>({
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
})

// 当前预览图的索引
const currIndex = ref(0)

// 1. 是否显示遮罩和大图
const show = ref(false)
// 2. 遮罩的坐标(样式)
const layerPosition = reactive({
    left: '',
    top: '',
})
// 3. 大图背景定位(样式)
const largePosition = reactive({
    backgroundPositionX: '',
    backgroundPositionY: '',
})
// 4. 使用useMouseInElement得到基于元素左上角的坐标和是否离开元素数据
// const target: any = ref(null)
const target = ref<HTMLDivElement | null>(null)
const { elementX, elementY, isOutside } = useMouseInElement(target)

const moveImg = () => {
    if (!target.value) return
    const domData = target.value.getBoundingClientRect()

    // 5. 根据得到数据设置样式数据和是否显示数据
    show.value = !isOutside.value
    // 计算坐标
    let position = { x: 0, y: 0 }

    let x = elementX.value - 100
    let y = elementY.value - 100

    if (x <= 0) x = 0
    if (x >= domData.width - 200) x = domData.width - 200
    if (y <= 0) y = 0
    if (y >= domData.width - 200) y = domData.width - 200
    position = { x, y }

    // if (elementX.value < 100) position.x = 0
    // else if (elementX.value > 300) position.x = 200
    // else position.x = elementX.value - 100

    // if (elementY.value < 100) position.y = 0
    // else if (elementY.value > 300) position.y = 200
    // else position.y = elementY.value - 100

    // 给样式赋值
    // 中图遮罩层的位置
    layerPosition.left = `${position.x}px`
    layerPosition.top = `${position.y}px`

    // 小图跟大图宽度比例为1:1.5,需要在这基础上扩大1.5倍
    // 大图的显示的位置
    largePosition.backgroundPositionX = `${-(2 * 1.2) * position.x}px`
    largePosition.backgroundPositionY = `${-(2 * 1.2) * position.y}px`
}
const moveOutImg = () => {
    show.value = false
}

// watch([elementX, elementY, isOutside], () => {
//
//     let domData = target.value.getBoundingClientRect()
//

//     // 5. 根据得到数据设置样式数据和是否显示数据
//     show.value = !isOutside.value
//     // 计算坐标
//     let position = { x: 0, y: 0 }

//     let x = elementX.value - 100
//     let y = elementY.value - 100;
//

//     if (x <= 0) x = 0
//     if (x >= domData.width - 200) x = domData.width - 200
//     if (y <= 0) y = 0
//     if (y >= domData.width - 200) y = domData.width - 200
//     position = { x, y }

//     // if (elementX.value < 100) position.x = 0
//     // else if (elementX.value > 300) position.x = 200
//     // else position.x = elementX.value - 100

//     // if (elementY.value < 100) position.y = 0
//     // else if (elementY.value > 300) position.y = 200
//     // else position.y = elementY.value - 100

//     // 给样式赋值
//     // 中图遮罩层的位置
//     layerPosition.left = position.x + 'px'
//     layerPosition.top = position.y + 'px'
//     // 大图的显示的位置
//     largePosition.backgroundPositionX = -2 * position.x + 'px'
//     largePosition.backgroundPositionY = -2 * position.y + 'px'
// })
</script>

<template>
    <div class="goods-image mb10px">
        <!-- 大图 -->
        <div v-show="show" class="large" :style="[{ backgroundImage: `url(${imgList.big[currIndex]})` }, largePosition]" />
        <!-- 中图 -->
        <div ref="target" class="middle" @mousemove="moveImg" @mouseleave="moveOutImg">
            <img :src="imgList.big[currIndex]" alt="">
            <!-- 遮罩色块 -->
            <div v-show="show" class="layer" :style="layerPosition" />
        </div>
    </div>
    <div class="swiper-box">
        <Swiper class="swp" :slides-per-view="5" :slides-per-group="5" :space-between="10" :navigation="navigate"
            :modules="modules">
            <SwiperSlide v-for="(item, index) in imgList.small" :key="index" class="swp-slide"
                :class="{ active: index === currIndex }">
                <img :src="item" alt="" @mouseenter="currIndex = index">
            </SwiperSlide>
        </Swiper>
        <div class="swiper-button-next" />
        <div class="swiper-button-prev" />
    </div>
</template>

<style scoped lang="scss">
.swiper-box {
    position: relative;
    --swiper-navigation-sides-offset: 5px;

    .swp {
        width: calc(100% - 50px);
        margin: 0 auto;
    }

    .swp-slide {

        // height: 100%;
        img {
            display: block;
            width: 100%;
            aspect-ratio: 1/1;
            object-fit: cover;
        }

        &:hover,
        &.active {
            border: 1px solid #f00;
        }
    }

    --swiper-navigation-size: 24px;
    --swiper-navigation-color:#333;

    .swiper-button-prev,
    .swiper-button-next {
        height: 50px;
        margin: 0;
        transform: translateY(-50%);
        // width: 15px;
        // border-radius: 2px;
        font-weight: bold;
        display: flex;
    }

    // .swiper-button-prev,
    // .swiper-rtl .swiper-button-next {
    //   left: 0px;
    //   // background-color: #eee;
    // }

    // .swiper-button-next,
    // .swiper-rtl .swiper-button-prev {
    //   right: 0px;
    //   // background-color: #eee;
    // }
}

.goods-image {
    // width: 100%;
    width: 400px;
    position: relative;
    display: flex;
    z-index: 3;

    .large {
        position: absolute;
        top: 0;
        left: 101%;
        width: 480px;
        height: 480px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        background-repeat: no-repeat;
        background-size: 200% 200%;
        background-color: #f8f8f8;
    }

    .middle {
        width: 100%;
        aspect-ratio: 1/1;
        // height: 400px;
        background: #f5f5f5;
        border: 1px solid #f5f5f5;
        position: relative;
        cursor: move;
        overflow: hidden;

        img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            background-color: #fff;
        }

        .layer {
            width: 200px;
            height: 200px;
            background: rgba(0, 0, 0, 0.2);
            left: 0;
            top: 0;
            position: absolute;
        }
    }

    .small {
        width: 80px;

        li {
            width: 68px;
            height: 68px;
            margin-left: 12px;
            margin-bottom: 15px;
            cursor: pointer;

            &:hover,
            &.active {
                border: 2px solid #f00;
            }
        }
    }
}
</style>
