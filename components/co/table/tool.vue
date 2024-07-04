<template>
    <el-form v-if="searchData.config.length" ref="formRef" class="co-table-tool" v-bind="$attrs" :model="searchData.data">
        <!-- :ref="setItemRef" -->
        <!-- :ref="(el: FormItemInstance | any) => { if (el) formItemRef[index] = el }" -->
        <el-form-item v-for="(item, index) in searchData.config" :key="index" ref="formItemRef"
            :class="setFormItemClass(index)" v-bind="item.itemProp" :prop="item.itemProp.prop">
            <div class="co-table-tool-content" :style="{ width: setElWidth(item.width) }">
                <slot v-if="item.slot" :name="item.itemProp.prop" :row="searchData.data" :width="setElWidth(item.width)" />
                <el-input v-else v-model.trim="searchData.data[item.itemProp.prop]"
                    :style="{ width: setElWidth(item.width) }" :placeholder="item.placeholder" clearable />
            </div>
        </el-form-item>
        <el-form-item ref="lastItemRef" label="">
            <el-button type="primary" @click="onSearch">
                <i class="i-ep-search mr4px h1em w1em" />
                查询
            </el-button>
            <el-button @click="onReset">
                <i class="i-ep-refresh mr4px h1em w1em" />
                重置
            </el-button>
            <slot />
            <el-button v-if="hideBtn === false" type="primary" link @click="onToggle">
                <template v-if="defData.showAll">
                    收起
                    <i class="i-ep-arrow-up h1em w1em" />
                </template>
                <template v-else>
                    展开
                    <i class="i-ep-arrow-down h1em w1em" />
                </template>
            </el-button>
        </el-form-item>
    </el-form>
</template>

<script lang="ts" setup>
import type { FormInstance, FormItemInstance } from 'element-plus'

const props = defineProps({
    data: {
        type: Object as PropType<BaseFormToolType>,
        required: true,
    },
})
const emits = defineEmits<{
    (event: 'reset'): void
}>()
const formRef = ref<FormInstance>()
const formItemRef = ref<FormItemInstance[]>([])
const lastItemRef = ref<FormItemInstance>()

const defData = reactive({
    hideForm: true, // 默认先隐藏form
    showAll: false,
    hideIndex: -1,
})

const searchData = ref(props.data)

const hideBtn = computed(() => !!props.data.hideBtn)

// const searchData = reactive({
//     data: props.data.data,
//     config: props.data.config
//     // data: {
//     //     company_id: '',
//     //     depot: '' as '' | number,   //仓库名称
//     //     goods_name: '',
//     //     goods_sn: '',
//     //     goods_model: '',
//     //     class_id: '' as '' | number,
//     //     brand: '',
//     //     time: [] as string[],
//     //     goods_size: '', //规格
//     //     goods_site: '',  //货位
//     //     goods_vender: '',//供应商
//     //     is_stock: false,     // 是否显示0库存
//     // },
//     // config: {
//     //     company_id: { label: "公司名称", prop: "company_id", slot: true, placeholder: '', width: '180' },
//     //     depot: { label: "仓库名称", prop: "depot", slot: true, placeholder: '请选择仓库', width: '180' },
//     //     goods_name: { label: "商品名称", prop: "goods_name", slot: true, placeholder: '请输入商品名称', width: '180' },
//     //     class_id: { label: "商品分类", prop: "class_id", slot: true, placeholder: '', width: '180' },
//     //     goods_sn: { label: "商品编号", prop: "goods_sn", slot: false, placeholder: '请输入商品编号', width: '180' },
//     // }
// })

const { width: formWidth } = useElementSize(formRef as any)

// 查询
const onSearch = () => {
    searchData.value.searchFunc()
}
// 重置
const onReset = async () => {
    formRef.value?.resetFields()
    emits('reset')
    await wait(150)
    onSearch()
}

// 设置form-item隐藏class名
const setFormItemClass = (index: number) => {
    return !(defData.hideIndex >= 0 && index > defData.hideIndex) ? '' : 'hide-item'
}

// 设置宽度
const setElWidth = (wid?: string) => {
    if (!wid) return ''
    return Number.isNaN(Number(wid)) ? wid : `${wid}px`
}

// 判断是否显示项
const setHideItem = async (show: boolean, wid: number) => {
    // 不显示展开收起按钮时
    if (props.data.hideBtn) return
    // 展开收起按钮为展开时
    if (show) return defData.hideIndex = -1
    // 还未获取到宽度时
    if (!wid) return

    const formWid = wid
    const lastWidth = lastItemRef.value?.$el.getBoundingClientRect()

    const indexArr: number[] = []
    props.data.config.reduce((prev, next, index) => {
        const elBound = formItemRef.value[index].$el.getBoundingClientRect()
        const count = prev + elBound.width
        if (formWid - count < lastWidth.width) indexArr.push(index)
        return count
    }, 0)

    if (indexArr.length) defData.hideIndex = indexArr[0] > 0 ? indexArr[0] - 1 : 0
}

// 展开收起
const onToggle = () => {
    defData.showAll = !defData.showAll
    setHideItem(defData.showAll, formWidth.value)
}

// 监听展开、关闭状态以及form元素宽度变化
watchEffect(() => {
    setHideItem(defData.showAll, formWidth.value)
}, {
    flush: 'post',
})

defineExpose({
    formRef,
})

// 采用watch监听时
// watch(() => formWidth.value, () => {
//     setHideItem(defData.showAll, formWidth.value)
// })

onMounted(() => {
    if (props.data.showAll) defData.showAll = true
    // nextTick(() => {
    //     setHideItem(defData.showAll, formWidth.value)
    // })
})
</script>

<style lang="scss">
.co-table-tool {
    overflow: hidden;

    .el-form-item {
        margin-right: 0;
        padding-right: 18px;

        &.hide-item {
            position: absolute;
            left: 0;
            visibility: hidden;
            z-index: -1000;
        }
    }

    .co-table-tool-content>* {
        width: 100%;
    }
}
</style>
