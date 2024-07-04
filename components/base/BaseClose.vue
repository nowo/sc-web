<script setup lang="ts">
const { systemStatus } = useSystemState() // 商城状态
</script>

<template>
    <div class="min-h100vh bg-white">
        <div class="ma max-w100% w600px pt200px">
            <el-alert type="error" show-icon :closable="false">
                <template #title>
                    {{ systemStatus.close_msg || '网站维护中...' }}
                </template>
            </el-alert>
        </div>
    </div>
</template>
