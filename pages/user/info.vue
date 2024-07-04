<template>
    <LayoutUser>
        站内信息
    </LayoutUser>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'home',
    middleware: 'auth',
})
</script>

<style scoped></style>
