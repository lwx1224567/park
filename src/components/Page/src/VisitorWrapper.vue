<template>
  <a-layout class="w-full h-full pl-[15px] pr-[15px] pb-[15px] bg-initial">
    <a-layout-header class="auto-box">
      <slot name="header"></slot>
    </a-layout-header>
    <a-layout-content class="relative">
      <div class="absolute inset-0 pb-[15px]">
        <slot></slot>
      </div>
    </a-layout-content>
    <a-layout-footer class="auto-box">
      <VisitorPanels />
    </a-layout-footer>
  </a-layout>
</template>

<script lang="ts" setup>
  import VisitorPanels from '@/views/visitorSystem/components/VisitorPanels.vue';
</script>
<style lang="less" scoped>
  .bg-initial {
    background: initial;
  }

  .auto-box {
    height: auto;
    padding: 0;
    background: initial;
  }
</style>
