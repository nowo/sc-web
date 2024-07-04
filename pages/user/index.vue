<template>
    <div>
    <!-- 我的订单 -->
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'home',
    middleware: 'auth',
    redirect: {
        path: '/order/list',
    },
})
</script>

<style  lang="scss" scoped>

</style>
