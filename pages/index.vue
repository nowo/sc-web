<script setup lang="ts">
definePageMeta({
    layout: 'home',
})
</script>

<template>
    <div class="index-box">
        <Suspense>
            <HomeMain />
            <!-- <ClientOnly></ClientOnly> -->
            <template #fallback>
                <div class="container">
                    <div class="min-h300px" italic op50>
                        <span animate-pulse>Loading...</span>
                    </div>
                </div>
            </template>
        </Suspense>
    </div>
</template>

<style  lang="scss" scoped>
.index-box {
    padding-top: 40px;
    background-color: #f3f3f3;
}
</style>
