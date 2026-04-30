<template>
  <div class="modal-header">
    <div class="title-content">{{ title }}</div>
  </div>
</template>
<script lang="ts" setup>
  import type { PropType } from 'vue';

  defineOptions({ name: 'BasicModalHeader' });

  defineProps({
    helpMessage: {
      type: [String, Array] as PropType<string | string[]>,
    },
    title: { type: String },
  });
</script>
<style scoped lang="less">
  .modal-header {
    position: relative;
    width: 100%;
    height: 30px;

    .title-content {
      display: flex;
      position: absolute;
      left: 50%;
      align-items: center;
      justify-content: center;
      height: 100%;
      padding: 0 40px;
      transform: translateX(-50%);
      background: url('@/assets/images/layouts/modal-title-bg.png') no-repeat;
      background-size: 100% 100%;
      font-size: 16px;
      font-weight: 600;
      line-height: 32px;
      text-shadow: 0 0 1px #fff;
    }
  }
</style>
