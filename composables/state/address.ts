import { UserAddressApi } from '~/api/user/address'

/**
 * 获取地址信息
 * @returns
 */
export const userAddressState = () => {
    const address = useState<UserAddressApi_GetListResponse[]>('address')

    const getAddressInfo = async (update?: boolean) => {
        // console.log('system.value :>> ', system.value)
        if (address.value) return address
        const { data, error } = await UserAddressApi.getList()
        // console.log(data.value?.code)
        // 接口发生错误时
        if (error.value) return address
        // await wait(800)
        if (data.value?.code === 200) {
            address.value = data.value.data
        } else {
            ElMessage.error(data.value?.msg)
        }
        return address
    }

    return {
        address,
        getAddressInfo,
    }
}
