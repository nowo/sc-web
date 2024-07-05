<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { requestRegionList } from '~/api/common'
import { LoginApi } from '~/api/login'
import { SaleAfterApi } from '~/api/user/saleAfter'

const formRef = ref<FormInstance>()
const rules = reactive<FormRules>({
    contacts: [{ required: true, whitespace: true, message: '必填项不能为空', trigger: 'blur' }],
    goods_id: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
    phone: [
        { required: true, whitespace: true, message: '必填项不能为空', trigger: 'blur' },
        { required: true, pattern: /^1(3\d|4[014-9]|5[0-35-9]|6[2567]|7[0-8]|8\d|9[0-35-9])\d{8}$/, message: '请输入正确的手机号码', trigger: 'blur' },
    ],
    provinceArr: [{ required: true, type: 'array', message: '必填项不能为空', trigger: 'blur' }],
    address: [{ required: true, whitespace: true, message: '必填项不能为空', trigger: 'blur' }],
    ask_date: [{ required: true, whitespace: true, message: '必填项不能为空', trigger: 'blur' }],
    describe: [{ required: true, whitespace: true, message: '必填项不能为空', trigger: 'blur' }],
    validate_code: [{ required: true, whitespace: true, message: '必填项不能为空', trigger: 'blur' }],
})

const form = reactive({
    data: {
        id: 0, // id
        phone: '', // 联系电话      示例值:13410988888
        contacts: '', // 联系人      示例值:张三
        provinceArr: [] as string[], // 省份列表 省、市、区
        address: '', // 详细地址      示例值:楼村
        goods_type: '' as '' | number, // 商品类型      示例值:1
        goods_type_txt: '', // 商品类型名称      示例值:
        goods_code: '', // 商品型号      示例值:Hv-00799
        describe: '', // 描述      示例值:上门安装
        ask_date: '', // 预约上门时间      示例值:2023-03-04 10:58
        validate_code: '', // 验证码
        goods_id: '' as '' | number, // 商品id
        des_img: '', //
        des_vivo: '',

    },
})

const defData = reactive({
    addressList: [] as CommonApi_GetAllRegionItem[],
    goodsList: [] as SaleAfterApi_SearchResponse['list'],
    goodsSearchList: [] as SaleAfterApi_SearchResponse['list'],

    time: 0, // 验证码倒计时时间
    sendCode: true, // true：发送验证码 false:倒计时
    loading: false, // true

    skeleton: true, // true
})

// 获取省市区数据
const initDefaultData = async () => {
    const { data } = await requestRegionList()
    if (data.value?.code === 200) {
        defData.addressList = data.value.data
    } else {
        ElMessage.error(data.value?.msg) 
    }
}
initDefaultData()

// 获取短信验证码
const getCodeClick = async () => {
    if (!form.data.phone) ElMessage.warning('请先输入手机号码')

    const data: LoginApi_validateCode = {
        type: 6,
        phone: form.data.phone,
    }
    const { data: res } = await LoginApi.validateCode(data)
    if (res.value?.code !== 200) return ElMessage.error(res.value?.msg)
    ElMessage.success('发送成功')
    defData.sendCode = false
    defData.time = 60
    const times = setInterval(() => {
        defData.time--
        if (defData.time <= 0) {
            defData.sendCode = true
            clearInterval(times)
        }
    }, 1000)
}

// 搜素商品信息
const goodsInfo = async (query: string) => {
    const goods: SaleAfterApi_Search = {
        keyword: query,
    }
    const { data: goodsInfo } = await SaleAfterApi.search(goods)
    if (goodsInfo.value?.code === 200) {
        if (goodsInfo.value.data.list.length > 0) {
            defData.goodsSearchList = goodsInfo.value.data.list
        }
        defData.goodsList = goodsInfo.value.data.list
    } else {
        // defData.goodsList = []
    }
}
const remoteMethod = (query: string) => {
    if (query) {
        defData.loading = true
        setTimeout(() => {
            defData.loading = false
            goodsInfo(query)
        }, 100)
    }
}

// 提交
const onSubmit = useThrottleFn(async () => {
    const isRun = await useFormVerify(formRef.value)
    if (!isRun) return false
    const arr = form.data.provinceArr || []
    // 商品列表
    const node = defData.goodsSearchList.find(item => item.goods_id === form.data.goods_id)
    if (node) {
        const data: SaleAfterApi_Add = {
            type: 2,
            phone: form.data.phone.trim() ?? '',
            contacts: form.data.contacts.trim() ?? '',
            validate_code: form.data.validate_code,
            province: arr[0] ?? '',
            city: arr[1] ?? '',
            area: arr[2] ?? '',
            address: form.data.address,
            goods_type: node.cat_id,
            goods_type_txt: node.cat_name,
            goods_code: node.goods_code,
            describe: form.data.describe,
            des_img: form.data.des_img,
            ask_date: form.data.ask_date,
            des_vivo: form.data.des_vivo,
        }
        const res = await SaleAfterApi.add(data)
        if (res.data.value?.code !== 200) return ElMessage.error(res.data.value?.msg)
        ElMessage.success('提交成功')
        return navigateTo('/sale/list')
    }
}, 800)

onBeforeMount(() => {
    defData.skeleton = false
})

definePageMeta({
    layout: 'home',
    middleware: 'auth',
})
</script>

<template>
    <LayoutSaleAfter>
        <el-skeleton :loading="defData.skeleton" animated>
            <template #template>
                <div><el-skeleton /></div>
                <div class="min-h300px">
                    <el-skeleton />
                </div>
            </template>
            <el-breadcrumb>
                <el-breadcrumb-item>
                    售后申请
                </el-breadcrumb-item>
                <el-breadcrumb-item>维修申请</el-breadcrumb-item>
            </el-breadcrumb>
            <el-form ref="formRef" class="px5px" :model="form.data" :rules="rules" label-width="110px">
                <el-row :gutter="10">
                    <el-col :xs="24" :sm="12" :md="12" :lg="11" :xl="11" class="mt20px">
                        <el-form-item label="联系人" prop="contacts">
                            <el-input v-model="form.data.contacts" class="w100%" placeholder="请输入联系人" maxlength="20"
                                clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :xs="0" :sm="12" :md="12" :lg="11" :xl="11" />
                    <el-col :xs="24" :sm="20" :md="20" :lg="20" :xl="20">
                        <el-form-item label="省市区" prop="provinceArr">
                            <el-cascader v-model="form.data.provinceArr" :options="defData.addressList"
                                :props="{ value: 'cityName', label: 'cityName' }" class="w100%" clearable filterable />
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="20" :md="20" :lg="20" :xl="20">
                        <el-form-item label="详细地址" prop="address">
                            <el-input v-model="form.data.address" type="textarea" maxlength="200" clearable
                                show-word-limit />
                        </el-form-item>
                    </el-col>
                    <!-- <el-col :xs="24" :sm="20" :md="20" :lg="20" :xl="20"> -->
                    <el-form-item label="商品关键字" prop="goods_id">
                        <el-select v-model="form.data.goods_id" placeholder="请输入商品关键字" style="width: 500px"
                            :remote-method="remoteMethod" :loading="defData.loading" filterable clearable remote
                            reserve-keyword>
                            <el-option v-for="item in defData.goodsList" :key="item.goods_id" :label="item.goods_name"
                                :value="item.goods_id" />
                        </el-select>
                    </el-form-item>
                    <el-col :xs="24" :sm="20" :md="20" :lg="20" :xl="20">
                        <el-form-item label="需求详细描述" prop="describe">
                            <el-input v-model="form.data.describe" type="textarea" show-word-limit maxlength="200"
                                clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="22" :md="22" :lg="22" :xl="22">
                        <el-form-item prop="des_img" label="上传图片">
                            <CoUpload v-model="form.data.des_img" chat="||" multiple :limit="10" />
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="22" :md="22" :lg="22" :xl="22">
                        <el-form-item label="上传视频" prop="des_video">
                            <CoUpload v-model="form.data.des_vivo" type="text" accept="video/*" />
                        </el-form-item>
                    </el-col>

                    <el-col :xs="24" :sm="12" :md="12" :lg="11" :xl="11">
                        <el-form-item label="手机号码" prop="phone">
                            <el-input v-model="form.data.phone" class="w100%" placeholder="请输入手机号码" maxlength="255"
                                clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :xs="0" :sm="12" :md="12" :lg="11" :xl="11" />
                    <el-col :xs="24" :sm="12" :md="12" :lg="11" :xl="11">
                        <el-form-item label="验证码" prop="validate_code">
                            <el-col :span="15">
                                <el-input v-model.trim="form.data.validate_code" type="text" placeholder="请输入短信验证码"
                                    clearable tabindex="3" />
                            </el-col>
                            <el-col :span="1" />
                            <el-col :span="8">
                                <el-button v-if="defData.sendCode" class="w100%" @click="getCodeClick">
                                    获取验证码
                                </el-button>
                                <el-button v-else class="w100%">
                                    {{ defData.time }}秒
                                </el-button>
                            </el-col>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="0" :sm="12" :md="12" :lg="11" :xl="11" />
                    <el-col :xs="24" :sm="20" :md="20" :lg="20" :xl="20">
                        <el-form-item label="预约上门时间" prop="ask_date">
                            <el-date-picker v-model="form.data.ask_date" type="datetime" value-format="YYYY-MM-DD HH:mm" />
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="20" :md="20" :lg="20" :xl="20">
                        <el-button type="primary" class="ml350px min-w150px" size="large" @click="onSubmit">
                            <b>提交维修申请</b>
                        </el-button>
                    </el-col>
                </el-row>
            </el-form>
        </el-skeleton>
    </LayoutSaleAfter>
</template>

<style scoped></style>
