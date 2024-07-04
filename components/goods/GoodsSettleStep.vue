<template>
    <el-steps class="step-box" v-bind="$attrs" align-center finish-status="success">
        <el-step title="选择商品" />
        <el-step title="订单结算" />
        <el-step title="订单支付" />
    </el-steps>
</template>

<script lang="ts" setup>

</script>

<style lang="scss" scoped>
.step-box{
  --el-color-success:var(--el-color-primary);
}
</style>
