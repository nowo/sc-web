<script setup lang="ts">
definePageMeta({
    layout: 'home',
    middleware: 'auth',
})
</script>

<template>
    <LayoutUser>
        站内信息
    </LayoutUser>
</template>

<style scoped></style>
