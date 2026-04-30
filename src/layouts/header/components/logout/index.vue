<template>
  <PoweroffOutlined @click="handleLoginOut" />
</template>

<script lang="ts" setup>
  import { useUserStore } from '@/store/modules/user';
  import { PoweroffOutlined } from '@ant-design/icons-vue';

  const userStore = useUserStore();
  //  login out
  function handleLoginOut() {
    userStore.confirmLoginOut();
  }
</script>
<style lang="less" scoped></style>
