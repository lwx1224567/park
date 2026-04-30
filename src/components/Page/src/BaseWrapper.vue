<template>
  <div class="wrapper-container">
    <div class="title">{{ title }}</div>
    <div class="action-container">
      <slot name="action"></slot>
    </div>
    <slot></slot>
  </div>
</template>
<script setup lang="ts">
  const props = defineProps({
    title: {
      type: String,
      default: '',
    },
  });
</script>

<style scoped lang="scss">
  .wrapper-container {
    position: absolute;
    padding: 50px 10px 10px;
    overflow: hidden;
    border: 1px solid rgb(0 123 255 / 40%);
    border-radius: 4px;
    color: #fff;
    inset: 0 15px 15px;

    .title {
      display: flex;
      position: absolute;
      top: 0;
      left: 0;
      flex-shrink: 0;
      width: auto;
      height: 40px;
      padding: 0 36px;
      border-radius: 5px;
      background: url('@/assets/images/layouts/title-base-bh.png') no-repeat;
      background-size: 100% 100%;
      font-size: 16px;
      font-weight: bold;
      line-height: 38px;
    }

    .action-container {
      position: absolute;
      top: 10px;
      right: 10px;
    }
  }
</style>
