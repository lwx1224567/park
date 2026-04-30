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
    width: 100%;
    min-height: 80px;
    padding: 10px;
    border-top: 10px solid rgb(0 89 210);
    background: rgb(27 84 153 / 80%);
    box-shadow:
      inset 0 6px 12px rgb(255 255 255 / 5%),
      inset 0 -6px 12px rgb(255 255 255 / 5%),
      inset 0 0 30px rgb(255 255 255 / 5%);

    .title {
      position: absolute;
      top: -10px;
      left: 50%;
      padding: 1px 30px 2px;
      transform: translateX(-50%);
      background: url('@/assets/images/layouts/border10-bg-t.png') no-repeat;
      background-size: 100% 100%;
      color: #d8effc;
      font-size: 16px;
      font-weight: bold;
    }
  }
</style>
