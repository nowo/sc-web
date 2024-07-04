<script lang="ts" setup>
import type { TableInstance } from 'element-plus'
import { ElPagination, ElTableColumn } from 'element-plus'

// 分页
type Pagination = BaseTableDataType['pagination']

// TODO 暂时设置为any，vue3.3可设设置 generic="T"，泛型组件
// type TableHeaderType = BaseTableHeaderType<any, any> & TableColumnCtx<any>
type TableHeaderType = any

// type PropsDataType={
//     data:TableType["data"],
//     tableHeader:TableType["tableHeader"] | typeof ElTableColumn[],
//     page:TableType["pagination"],
//     hide?:boolean
// }

// const props=defineProps<PropsDataType>()

const props = defineProps({
    data: {
        type: Array as PropType<BaseTableDataType['data']>,
        default: () => [],
    },
    tableHeader: {
        type: Array as PropType<TableHeaderType[]>,
        required: true,
    },
    page: {
        type: Object as PropType<BaseTableDataType['pagination']>,
        required: true,
    },
    hide: {
        type: Boolean,
        default: false,
    },
    autoHeight: {
        type: Boolean,
        default: false,
    },
})

const emits = defineEmits<{
    (e: 'update:page', param: Pagination): void
    (e: 'update:table-header', param: TableHeaderType[]): void
}>()
// const slots = defineSlots<{
//     // default(props: { [key: BaseTableDataType['tableHeader'][0]['property']]: string }): any
//     default(props: { name: BaseTableDataType['tableHeader'][0]['property']; scopes: any }): any
// }>()

const tableRef = ref<TableInstance>()

// 高度变化，更新最大高度
const tablePageRef = ref<HTMLDivElement | null>(null)
const pageRef = ref<InstanceType<typeof ElPagination> | null>(null)
const { height: tHei } = useElementSize(tablePageRef as any)
const { height: pageHei } = useElementBounding(pageRef as never)
const tableHeight = computed(() => {
    if (props.autoHeight) return 'unset'
    const pHei = pageHei.value ? pageHei.value + 15 : 0
    const hei = Math.floor(tHei.value - pHei) % 2 ? Math.floor(tHei.value - pHei) - 1 : Math.floor(tHei.value - pHei)
    // unset\min-content
    return hei > 0 ? hei : 'unset'
})

// 默认数据列表
const defData = reactive({
    visible: false,
    pagination: props.page,
    time: 0, // 用于分页和分页数量同时改变时，更新数据判断
})

// 属性透传，去除id、class、style，不传入el-table组件
// const attrs = useAttrs();
// const newAttrs = computed(() => {
//     const att = deepClone(attrs);
//     if (att.style) delete att.style;
//     if (att.class) delete att.class;
//     if (att.id) delete att.id;
//     return att
// })

// const columnAttrs = (item: TableHeaderType[0]):any => {
//     const attr = deepClone(item);
//     attr.property = String(attr.property);
//     if (attr.slot) delete attr.slot;
//     return attr
// }

// 分页点击
const onHandleCurrentChange = (val: number) => {
    const { total, page_size } = defData.pagination
    if (total < page_size && props.data.length === total) return

    defData.time = Date.now()
    emits('update:page', defData.pagination)
    tableRef.value?.setScrollTop(0)
    document.documentElement.scrollTop = 0
}
// 分页数量点击
const onHandleSizeChange = async (val: number) => {
    const { total, page_size } = defData.pagination
    if (total < page_size && props.data.length === total) return
    // 分页跟分页数量同时改变时，通过时间去判断让他只调用一个方法
    await wait(10) // 等待10ms，defData.time才可能是最新的
    if (Date.now() - defData.time < 20) return
    defData.time = Date.now()

    emits('update:page', defData.pagination)
    tableRef.value?.setScrollTop(0)
    document.documentElement.scrollTop = 0
}

const headerList = computed(() => {
    return props.tableHeader.map(item => item)
})

// const setHeader = ref(props.tableHeader)
// // 设置 tool header 数据
// // const setHeader = computed(() => {
// //  return props.header.filter((v) => v.isCheck);
// // });
// const moveRef = ref<HTMLDivElement>()

defineExpose({
    tableRef,
})
</script>

<template>
    <div ref="tablePageRef" class="co-table">
        <div class="co-table-content">
            <client-only>
                <ElTable ref="tableRef" v-bind="$attrs" :data="props.data" :max-height="tableHeight">
                    <ElTableColumn v-for="(item, index) in headerList" :key="index" show-overflow-tooltip v-bind="item">
                        <template v-if="item.slotHeader" #header="scope">
                            <slot :name="`${item.property}Header`" :scopes="scope" />
                        </template>
                        <!-- 这里根据slot字段来判断是否使用插槽 -->
                        <template v-if="item.type !== 'selection' && item.type !== 'index'" #default="scope">
                            <slot v-if="item.slot" :name="item.property" :scopes="scope" />
                            <span v-else>{{ scope.row[item.property] }}</span>
                        </template>
                    </ElTableColumn>
                </ElTable>
            </client-only>
        </div>
        <ElPagination v-if="defData.pagination.total" ref="pageRef" v-model:current-page="defData.pagination.page"
            v-model:page-size="defData.pagination.page_size" small :page-sizes="defData.pagination.page_sizes"
            :total="defData.pagination.total" :pager-count="5" background layout="total, sizes, prev, pager, next, jumper"
            class="mt15px" @size-change="onHandleSizeChange" @current-change="onHandleCurrentChange" />
    </div>
</template>

<style lang="scss">
.co-table {
    display: flex;
    flex-direction: column;
    // min-height: 100%;
    // height: 100%;
    overflow: auto;
    border: 0;

    &-content {
        flex: 1;
    }
}
</style>
