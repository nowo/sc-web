import { GoodsApi } from '~/api/goods/list'
import { OrderApi } from '~/api/goods/order'

/**
 * 获取用户信息
 * @returns
 */
export const useGoodsState = () => {
    // 商品分类
    const goodsClassList = useState<GoodsApi_GetClass[]>('goodsClass', () => [])

    /**
     * 获取商品分类
     * @returns
     */
    const getGoodsClass = async () => {
        // return goodsClassList
        if (goodsClassList.value.length) return goodsClassList
        const { data: cate, error,status } = await GoodsApi.getClass()
        console.log(status)
        console.log(cate.value,error.value)
        // 接口发生错误时
        if (error.value) return goodsClassList
        watch(status, (newVal) => {
            if(newVal=='success'){
                if (cate.value?.code === 200) {
                    goodsClassList.value = cate.value.data
                } else {
                    // console.log('cate.value :>> ', cate.value);
                    ElMessage.error(cate.value?.msg)
                    goodsClassList.value = []
                }
            }
        })
        return goodsClassList
    }

    return {
        goodsClassList,
        getGoodsClass,
    }
}

/**
 * 获取购物车商品数量
 * @returns
 */
export const useCartNumberState = () => {
    const cartNum = useState('cartNum', () => 0) // 记录购物车数量

    const site = useState('cartSite', () => {
        return {
            show: false, // 图标显示隐藏
            top: 0, // 距离顶部的位置
            left: 0, //  距离左部的位置
        }
    })
    /**
     * 获取购物车数量
     */
    const setCartNumber = async () => {
        const token = useUserState().token
        if (!token.value) {
            cartNum.value = 0
            return cartNum
        }
        const { data } = await GoodsApi.cartNum()
        if (data.value?.code === 200) {
            cartNum.value = data.value.data.number || 0 //
        }

        return cartNum
    }

    /**
     * 设置购物车动画
     */
    const setShopAnimate = async (param: { top: number, left: number }) => {
        let scrollTop = 0
        if (import.meta.client) scrollTop = document.documentElement.scrollTop
        site.value.top = param.top - 30 - scrollTop
        site.value.left = param.left - 20
        site.value.show = true
        await wait(1000)
        site.value.show = false

        site.value.top = 0
        site.value.left = 0
    }

    return {
        cartNum,
        setCartNumber,
        site,
        setShopAnimate,
    }
}

/**
 * 获取支付方式
 * @returns
 */
export const usePayTypeState = () => {
    const typeList = useState<OrderApi_GetPayTypeResponse[]>('payType', () => []) // 记录购物车数量
    /**
     * 获取支付方式
     */
    const getPayTypeList = async () => {
        if (typeList.value.length) return typeList
        const { data } = await OrderApi.getPayType()
        // await wait(1000)
        if (data.value?.code === 200) {
            typeList.value = data.value.data || [] //
        }

        return typeList
    }
    return {
        typeList,
        getPayTypeList,
    }
}
