export default defineNuxtRouteMiddleware(async (to, from) => {
    const useSystem = useSystemState()
    const system = await useSystem.getSystemInfo()
    // console.log('system :>> ', system.value)
    if (import.meta.client && !!Number(system.value?.shop_status)) {
        if (to.name !== 'close') return navigateTo('/close')
    }
console.log(to)
    if(to.path.startsWith('/order')) return navigateTo('/404')
})
