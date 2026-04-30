<template>
  <div class="view-container">
    <!-- 设备信息 -->
    <DeviceInfo v-if="name == 'device-info'" />
  </div>
</template>
<script setup lang="ts">
import DeviceInfo from './components/DeviceInfo.vue'; //综合信息
  const props = defineProps({
    name: {
      type: String,
      default: '',
    },
  });
</script>
<style lang="less" scoped>
  .view-container {
    width: 100%;
    height: 100%;
  }
</style>
