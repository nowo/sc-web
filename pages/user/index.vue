<script setup lang="ts">
definePageMeta({
    layout: 'home',
    middleware: 'auth',
    redirect: {
        path: '/order/list',
    },
})
</script>

<template>
    <div>
    <!-- 我的订单 -->
    </div>
</template>

<style  lang="scss" scoped>

</style>
