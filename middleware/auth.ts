export default defineNuxtRouteMiddleware((to, from) => {
    const admin_token = useCookie('admin_token')
    if (!admin_token.value) {
        return navigateTo('/login')
    // return abortNavigation()  //阻止访问
    }
    // return abortNavigation()
    // if (to.params.id === '1') {
    //   return abortNavigation()
    // }
    // return navigateTo(to)
})
