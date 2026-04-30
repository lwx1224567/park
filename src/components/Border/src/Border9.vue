<template>
  <div class="border-wrapper">
    <div class="title">{{ title }}</div>
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
  const props = defineProps({
    title: { type: String, default: () => '标题' },
  });
</script>
<style lang="less" scoped>
  .border-wrapper {
    display: flex;
    position: relative;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-height: 100px;
    padding: 20px 10px 10px;
    border-top: 8px solid rgb(0 89 210);
    background: rgb(0 54 121 / 50%);
    box-shadow:
      inset 0 6px 12px rgb(255 255 255 / 5%),
      inset 0 -6px 12px rgb(255 255 255 / 5%),
      inset 0 0 30px rgb(255 255 255 / 5%);

    .title {
      position: absolute;
      top: -8px;
      right: 0;
      padding: 2px 10px 2px 30px;
      background: url('@/assets/images/layouts/border9-bg-tl.png') no-repeat;
      background-size: 100% 100%;
      color: #d8effc;
      font-size: 16px;
      font-weight: bold;
    }

    &::before {
      content: '';
      position: absolute;
      z-index: 0;
      background: url('@/assets/images/layouts/border9-bg-bl.png') no-repeat;
      background-position: left bottom;
      inset: 0;
    }

    &::after {
      content: '';
      position: absolute;
      z-index: 0;
      background: url('@/assets/images/layouts/border9-bg-br.png') no-repeat;
      background-position: right bottom;
      inset: 0;
    }
  }
</style>
