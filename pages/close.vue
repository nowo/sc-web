<template>
    <BaseClose v-if="systemStatus.is_close" />
</template>

<script setup lang="ts">
const { systemStatus } = useSystemState()
if (!systemStatus.value.is_close) {
    navigateTo({
        path: '/',
        replace: true,
    })
}
</script>
