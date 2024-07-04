<script lang="ts" setup>
import BaseFooter from './components/BaseFooter.vue'
import BaseHeader from './components/BaseHeader.vue'

import BaseTop from './components/BaseTop.vue'
import BaseRight from './components/BaseRight.vue'
</script>

<template>
    <main>
        <BaseTop />
        <BaseHeader />
        <slot />
        <BaseFooter />
        <BaseRight />
    </main>
</template>
