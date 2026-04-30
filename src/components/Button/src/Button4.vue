<template>
  <button class="bg-button" :class="type">
    {{ text }}
    <slot></slot>
  </button>
</template>
<script lang="ts" setup>
  const props = defineProps({
    text: { type: String, default: () => '' },
    type: { type: String, default: 'default' },
  });
</script>
<style lang="less" scoped>
  .bg-button {
    display: inline-block;
    padding: 5px 12px 5px 17px;
    transition: all 0.2s;
    border: none;
    outline: none;
    background: url('@/assets/images/layouts/button4-bg.png') no-repeat center;
    background-color: transparent;
    background-size: 100% 100%;
    color: #fff;
    font-size: 14px;
    letter-spacing: 5px;
    text-align: center;
    text-decoration: none;
    cursor: pointer;

    &.danger {
      background: url('@/assets/images/layouts/button4-bg-danger.png') no-repeat center;
      background-color: transparent;
      background-size: 100% 100%;
    }
  }
</style>
