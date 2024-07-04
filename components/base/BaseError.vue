<script setup lang="ts">

</script>

<template>
    <div p="x4 y10" text="center #888 dark:gray-200">
        <div mt10px text-72px>
            <div class="i-carbon-warning inline-block" />
        </div>
        <div class="mb30px text-72px lh-1em -mt20px">
            404
        </div>
        <div>
            <p>对不起，您访问的页面没找到</p>
            <!-- <p>您可以检查刚才的输入，或者去其他地方逛逛</p> -->
            <p>请检查网址地址是否正确或存在多余错误字符</p>
        </div>
        <div class="mt20px">
            <NuxtLink to="/">
                <el-button type="primary">
                    返回首页
                </el-button>
            </NuxtLink>
            <el-button class="ml15px" type="primary" plain @click="$router.back()">
                返回上一页
            </el-button>
        </div>
    </div>
</template>
