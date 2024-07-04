<script setup lang="ts">
// 获取商城信息
const useSystem = useSystemState()
const systemInfo = await useSystem.getSystemInfo()
</script>

<template>
    <div class="h100px bg-#313131">
        <div class="container">
            <NuxtLink to="/">
                <img pt3 :src="systemInfo?.shop_logo" alt="">
            </NuxtLink>
        </div>
    </div>
</template>

<style scoped>
.login {
    float: right;
    color: white;
}
</style>
