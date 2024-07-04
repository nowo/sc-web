<script setup lang="ts">
const defData = reactive({
    activeName: '1',
    skeleton: true,
})

onMounted(() => {
    defData.skeleton = false
})

definePageMeta({
    layout: 'home',
    middleware: 'auth',
})
</script>

<template>
    <LayoutUser>
        <el-skeleton :loading="defData.skeleton" animated>
            <template #template>
                <div class="pb20px">
                    <el-skeleton-item class="w20%!" />
                </div>
                <div class="min-h500px">
                    <el-skeleton :rows="5" />
                </div>
            </template>

            <el-breadcrumb class="mb20px">
                <el-breadcrumb-item>
                    我关注的
                </el-breadcrumb-item>
                <el-breadcrumb-item>问答列表</el-breadcrumb-item>
            </el-breadcrumb>

            <el-tabs v-model="defData.activeName" type="card">
                <el-tab-pane label="我的提问" name="1">
                    <UserQuestion :type="1" />
                </el-tab-pane>
                <el-tab-pane label="我的回答" name="2" lazy>
                    <UserQuestion :type="2" />
                </el-tab-pane>
            </el-tabs>
        </el-skeleton>
    </LayoutUser>
</template>

<style scoped></style>
