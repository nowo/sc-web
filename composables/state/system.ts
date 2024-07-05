import { requestSystemInfo } from '~/api/common'
import { requestUserInfo } from '~/api/user/account'

/**
 * 商城信息状态存储
 * @returns
 */
export const useSystemState = () => {
    const system = useState<CommonApi_GetSystemResponse | undefined>('system')

    const systemStatus = ref({
        is_close: !!Number(system.value?.shop_status), // 是否关闭商城
        close_msg: system.value?.status_cause, // 关闭原因
        is_bill: !!Number(system.value?.is_bill), // 是否能开发票
        is_coupon: !!Number(system.value?.is_coupon), // 是否使用优惠券
        is_bean: !!Number(system.value?.is_legumes), // 是否使用工游豆
        is_signup: !!Number(system.value?.logon_status), // 是否关闭注册
    })

    /**
     * 获取系统信息
     * @param update boolean 是否强制获取最新数据，默认false
     * @returns
     */
    const getSystemInfo = async (update?: boolean) => {
        // 系统信息已存在
        if (system.value && !update) return system
        const { data, error } = await requestSystemInfo()
        // console.log(data.value)
        // 接口发生错误时
        if (error.value) return system
        // await wait(800)
        if (data.value?.code === 200) {
            system.value = data.value.data
        } else {
            ElMessage.error(data.value?.msg)
        }
        return system
    }

    return {
        system,
        getSystemInfo,
        systemStatus,
    }
}

/**
 * 获取用户信息
 * @returns
 */
export const useUserState = () => {
    const cookieToken = useCookie<string>('admin_token', { maxAge: 3600 * 24 * 5 })

    const token = useState<string | null>('token', () => cookieToken.value)

    // 设置token
    const setToken = (val: string) => {
        token.value = val
        if (val) cookieToken.value = val

        return token
    }

    const userInfo = useState<AccountApi_userInfoResponse | undefined>('user')

    // 获取用户接口数据
    const getUserData = async () => {
        // if (!token.value) return userInfo

        // if (token.value && userInfo.value) {
        //     return userInfo
        // }

        // const res = await requestUserInfo()
        // console.log('res :>> ', res)
        // console.log('res.data.value?.code :>> ', res.data.value?.code)
        // console.log('res.error.value :>> ', res.error.value)
        // if (res.data.value?.code !== 200 || res.error.value) {
        //     console.log('111 :>> ', 111)
        //     // await useClearToken()
        //     token.value = ''
        //     return userInfo
        // }
        // console.log('res :>> ', res)
        // userInfo.value = res.data.value?.data
        // return userInfo

        const { data, error } = await requestUserInfo()

        if (error.value) {
            token.value = ''
            return userInfo
        }

        watch(() => data.value, () => {
            userInfo.value = data.value?.data
        })
        // const dat = computed(() => userInfo.value)
        // console.log('userInfo.values :>> ', data.value?.data)
        return computed(() => data.value?.data)

        // console.log(data.value?.code)
        // await wait(5800)
        // console.log(data.value?.code)
        // console.log('data,error :>> ', data, error.value)
        // // 接口发生错误时
        // if (error.value) {
        //     // await useClearToken()
        //     token.value = ''
        //     return userInfo
        // }
        // if (data.value?.code === 200) {
        //     userInfo.value = data.value.data
        // } else {
        //     userInfo.value = undefined
        // }

        // return userInfo
    }

    /**
     * 获取用户信息
     * @param update boolean value 是否获取最新数据，默认false
     * @returns
     */
    const getUserInfo = async (update?: boolean) => {
        // 获取最新数据
        if (update) return await getUserData()

        // 已经有数据了，直接返回
        if (token.value && userInfo.value) return userInfo

        // 啥都没有，重新获取接口数据
        return await getUserData()
    }

    return {
        token,
        setToken,
        userInfo,
        getUserInfo,
    }
}
