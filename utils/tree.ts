/**
 * 根据当前一级id(或字段)查找上级所有的节点内容
 * @param classifyList 嵌套数组
 * @param val 需要查找的值
 * @param key 查找值对应的键值，默认为id
 * @param children 子类的键值，默认children
 * @returns any[]
 * @example
 * ```javascript
 *const list = [{
 *    value: 1,
 *    name: '物品',
 *    children: [{
 *        value: 2,
 *        name: '物品2',
 *        children: [],
 *    }, {
 *        value: 3,
 *        name: '物品1-3',
 *    }],
 *}]
 * findParentsNode(list, 3, 'value', 'children') // [{value:1, name: '物品', children: [{value:2, name: '物品2', children: []},{value:3, name: '物品1-3'}]},{value:3, name: '物品1-3'}]
 * ```
 */
export function findParentsNode<T = any>(classifyList: Array<T>, val: T[keyof T], key = 'id' as keyof T, children = 'children' as keyof T): T[] {
    const temp: any[] = []
    const forFn = function (arr: any[], id: T[keyof T]) {
        for (let i = 0; i < arr.length; i++) {
            const item = arr[i]
            // 找到值对应的那一项，追加进去
            if (item[key] === val) temp.push(item)
            if (item[children]) {
                const data1 = item[children].find((item1: any) => {
                    return item1[key] === id
                })
                if (data1) {
                    temp.unshift(item) // 数组前面追加进去
                    forFn(classifyList, item[key])
                    break
                } else {
                    forFn(item[children], id)
                }
            }
        }
    }
    forFn(classifyList || [], val)
    return temp
}

/**
 * 传入参数：需要遍历的json，需要匹配的id(根据id取得对应的那一项)
 * @param data 数组数据，平级或树形数组皆可
 * @param val 键值id的值，（唯一）
 * @param key id 默认（唯一不重复的键值）
 * @param children 子类
 * @returns
 */
export function findNodeItem<T = any>(data: Array<T>, val: T[keyof T], key = 'id' as keyof T, children = 'children' as keyof T): T | undefined {
    let temp: any = ''
    const forFn = function (arr: any[], id: T[keyof T]) {
        for (let i = 0; i < arr.length; i++) {
            if (temp) break // 已经拿到值了,就退出循环
            const item = arr[i]
            // 找到值对应的那一项，赋值
            if (item[key] === val) temp = item

            if (item[children]) forFn(item[children], id)
        }
    }
    forFn(data, val)
    return temp
}

/**
 * 树形数据过滤（模糊匹配），上级匹配上就直接全部返回(包括子类)，匹配到子类就往上找父级
 * @param data 全部数据
 * @param keyword 用于模糊查询的关键字
 * @param name 查找关键字对应的那个键名
 * @param children 子类元素集合的键名，默认为'children'
 */
export const filterTreeList = <T = any>(data: T[], keyword: T[keyof T], name: keyof T, children = 'children' as keyof T): T[] => {
    const result = []
    let item: any
    for (item of data) {
        if (item[name].includes(keyword)) {
            result.push(item)
        } else if (item.children && item.children.length > 0) {
            const filteredChildren = filterTreeList(item.children, keyword, name, children)
            if (filteredChildren.length > 0) result.push({ ...item, children: filteredChildren })
        }
    }
    return result
}

/**
 * 商品分类，根据某个分类id获取获取到后面最后一级的分类id（逗号拼接）
 * @param data 数组数据，平级或树形数组皆可
 * @param val 键值id的值，（唯一）
 * @param key id 默认（唯一不重复的键值）
 * @param children 子类
 * @returns
 */
export function getLastLevelIds<T = any>(data: Array<T>, val: T[keyof T], key = 'id' as keyof T, children = 'children' as keyof T) {
    if (!val) return ''
    const ids: T[keyof T][] = []

    const forFn = function (arr: any[]) {
        for (let i = 0; i < arr.length; i++) {
            const item = arr[i]
            if (item[children]?.length) { // 有子类继续找子类内容
                forFn(item[children])
            } else { // 没有子类时，当前项就是最后一级
                ids.push(item[key])
            }
        }
    }

    const node = findNodeItem(data, val, key, children)
    if (node) {
        // @ts-expect-error children是子类内容
        if (node[children]?.length) { //
            forFn(node[children] as any[])
        } else { // 没有子类，当前这一级就是最后一级
            ids.push(node[key])
        }
    }

    return ids.join(',')
}
