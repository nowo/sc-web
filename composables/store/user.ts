import { defineStore } from 'pinia'
import { AccountApi } from '~/api/user/account'

export const useUserStore = defineStore('user', () => {
    const cookieToken = useCookie<string>('token')

    const token = ref<string>(cookieToken.value)
    // 用户信息
    const userInfo = ref<AccountApi_userInfoResponse>()

    // 设置token
    const setToken = (val: string) => {
        token.value = val
        if (val) cookieToken.value = val

        return token
    }

    // 获取接口数据
    const getUserData = async () => {
        if (!token.value) {
            // ElMessage.error('请先登录')
            return userInfo
        }

        const { data } = await AccountApi.userInfo()

        await wait(500)

        if (data.value?.code === 200) {
            userInfo.value = data.value.data
        }

        return userInfo
    }

    /**
   * 获取用户信息
   * @param update boolean value 是否获取最新数据，默认false
   * @returns
   */
    const getUserInfo = async (update?: boolean) => {
        if (update) {
            return await getUserData()
        } else {
            if (userInfo.value) return userInfo

            const data = await getUserData()
            return data
        }
    }

    return {
        userInfo,
        getUserInfo,
        token,
        setToken,
    }
},
    // {
    //   persist: true,
    // }
)
