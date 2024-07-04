<!-- 新增、修改地址 -->
<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import { CommonApi } from '~/api/common'
import { UserAddressApi } from '~/api/user/address'

const emits = defineEmits<{
    (event: 'update', params: UserAddressApi_Edit): void
}>()
const formRef = ref<FormInstance>()

const defData = reactive({
    visible: false, // 是否显示窗口，默认为false。
    ready: false, // 内容是否加载完成
    addressList: [] as CommonApi_GetAllRegionItem[],
    type: 1, // 1：新增，2：修改
    btnLoading: false,
})

// 表单数据
const form = reactive({
    data: {
        id: 0, // 地址id
        name: '', // 名称
        phone: '', // 电话号码
        email: '', // 邮件地址
        provinceArr: [] as string[], // 省份列表 省、市、区
        address: '', // 详细地址

        defaultArr: [] as (1 | 2)[], // 是否默认地址  1：默认收货地址  2：默认发票收货地址
    },

})
const rules = reactive<FormRules>({
    name: [
        { required: true, whitespace: true, message: '必填项不能为空', trigger: 'blur' },
    ],
    phone: [
        { required: true, whitespace: true, message: '必填项不能为空', trigger: 'blur' },
        { required: true, pattern: /^1(3\d|4[014-9]|5[0-35-9]|6[2567]|7[0-8]|8\d|9[0-35-9])\d{8}$/, message: '请输入正确的手机号码', trigger: 'blur' },
        // { required: true, pattern: /^(((\d{3,4}-)?[0-9]{7,8})|(1(3|4|5|6|7|8|9)\d{9}))$/, message: '填写正确的手机号格式', trigger: 'blur' },
    ],
    provinceArr: [
        { required: true, type: 'array', message: '必填项不能为空', trigger: 'blur' },
    ],
    email: [
        // { required: true, whitespace: true, type: 'email', message: '必填项不能为空', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' },
    ],
    address: [
        { required: true, whitespace: true, message: '必填项不能为空', trigger: 'blur' },
    ],
})

const comData = computed(() => {
    let dat = {
        title: '新增地址',
    }
    if (defData.type === 2) {
        dat = {
            title: '修改地址',
        }
    }
    return dat
})

// 获取初始信息
const initDefaultData = async () => {
    if (defData.ready) return false
    const { data } = await CommonApi.getAllRegion()
    if (data.value?.code === 200) {
        defData.addressList = data.value.data
    } else {
        ElMessage.error(data.value?.msg) // 提示信息或页面加载不当会引发任何内容。
    }

    defData.ready = true
}

// 打开弹窗
const onOpenDialog = (row?: UserAddressApi_GetListResponse) => {
    if (row) { // 修改
        defData.type = 2
        form.data.id = row.address_id

        form.data.name = row.contacts
        form.data.phone = row.phone
        form.data.email = row.email

        const textArr: string[] = []
        if (row.province) textArr.push(row.province)
        if (row.province && row.city) textArr.push(row.city)
        if (row.province && row.city && row.area) textArr.push(row.area)

        form.data.provinceArr = textArr
        form.data.address = row.address

        const choseArr: (1 | 2)[] = []
        if (row.is_default) choseArr.push(1)
        if (row.is_bill_address) choseArr.push(2)
        form.data.defaultArr = choseArr
    } else {
        defData.type = 1
        form.data.id = 0

        form.data.name = ''
        form.data.phone = ''
        form.data.email = ''
        form.data.address = ''
        form.data.provinceArr = []
        form.data.defaultArr = []
    }

    initDefaultData()
    defData.visible = true
}
// 关闭弹窗
const onClose = () => {
    defData.visible = false
    formRef.value?.resetFields()
}

// 确认
const onConfirm = async () => {
    const isRun = await useFormVerify(formRef.value)
    if (!isRun) return false

    const arr = form.data.provinceArr || []

    const params: UserAddressApi_Add = {
        email: form.data.email.trim() ?? '',
        phone: form.data.phone.trim() ?? '',
        contacts: form.data.name.trim() ?? '',
        province: arr[0] ?? '',
        city: arr[1] ?? '',
        area: arr[2] ?? '',
        address: form.data.address,
        is_default: form.data.defaultArr.includes(1) ? 1 : 0,
        is_bill_address: form.data.defaultArr.includes(2) ? 1 : 0,
    }

    if (defData.type === 1) { //  新增
        defData.btnLoading = true
        const { data } = await UserAddressApi.add(params)
        defData.btnLoading = false
        // console.log('data :>> ', data)
        if (data.value?.code === 200) {
            ElMessage.success('添加成功')
            // @ts-expect-error 接口返回的address_id字段
            const address_id: number = data.value.address_id
            emits('update', {
                ...params,
                address_id,
            })
            // address_id
            onClose()
        } else {
            ElMessage.error(data.value?.msg)
        }
    } else if (defData.type === 2) { // 修改
        const edit: UserAddressApi_Edit = {
            ...params,
            address_id: form.data.id,
        }
        defData.btnLoading = true
        const { data } = await UserAddressApi.edit(edit)
        defData.btnLoading = false
        // console.log('data :>> ', data)
        if (data.value?.code === 200) {
            ElMessage.success('修改成功')
            emits('update', edit)
            onClose()
        } else {
            ElMessage.error(data.value?.msg)
        }
    }
}

defineExpose({
    onOpenDialog,
})
</script>

<template>
    <!-- auto-height -->
    <CoDialog v-model:visible="defData.visible" :loading="defData.btnLoading" auto-height hidden :title="comData.title"
        width="680px" @close="onClose" @cancel="onClose" @confirm="onConfirm">
        <el-form ref="formRef" :model="form.data" :label-width="130" :rules="rules">
            <el-row>
                <el-col :xs="24" :sm="16" :md="16" :lg="16" :xl="16">
                    <el-form-item prop="name" label="联系人：">
                        <el-input v-model="form.data.name" placeholder="请输入联系人名称" maxlength="20" clearable />
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                    <el-form-item prop="phone" label="联系电话：">
                        <el-input v-model="form.data.phone" placeholder="请输入联系电话" maxlength="20" clearable />
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="16" :md="16" :lg="16" :xl="16">
                    <el-form-item prop="email" label="电子邮箱：">
                        <el-input v-model="form.data.email" type="email" placeholder="请输入电子邮箱" maxlength="20" clearable />
                    </el-form-item>
                </el-col>

                <el-col :xs="24" :sm="20" :md="20" :lg="20" :xl="20">
                    <el-form-item label="省市区：" prop="provinceArr">
                        <el-cascader v-model="form.data.provinceArr" :options="defData.addressList"
                            :props="{ value: 'cityName', label: 'cityName' }" class="w100%" clearable filterable />
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="22" :md="22" :lg="22" :xl="22">
                    <el-form-item prop="address" label="详细地址：">
                        <el-input v-model="form.data.address" type="textarea" resize="none" :rows="3" maxlength="50"
                            clearable />
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <el-form-item prop="defaultArr" label="是否默认：">
                        <el-checkbox-group v-model="form.data.defaultArr">
                            <el-checkbox :label="1">
                                设为默认收货地址
                            </el-checkbox>
                            <el-checkbox :label="2">
                                设为默认发票地址
                            </el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </CoDialog>
</template>

<style lang="scss" scoped></style>
