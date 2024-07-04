<script lang="ts" setup>
// import LoginFooter from './components/LoginFooter.vue'
import LoginHeader from './components/LoginHeader.vue'
import BaseFooter from './components/BaseFooter.vue'
</script>

<template>
    <main>
        <LoginHeader />
        <slot />
        <BaseFooter />
    </main>
</template>
