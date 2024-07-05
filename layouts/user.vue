<script lang="ts" setup>
import BaseHeader from './components/BaseHeader.vue'

import BaseFooter from './components/BaseFooter.vue'
import BaseRight from './components/BaseRight.vue'
import BaseTop from '~/layouts/components/BaseTop.vue'

</script>

<template>
    <div>
        <BaseTop />
        <BaseHeader />
        <LayoutUser>
            <slot />
        </LayoutUser>

        <BaseFooter />
        <BaseRight />
    </div>
</template>
