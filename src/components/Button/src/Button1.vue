<template>
  <button class="bg-button">
    {{ text }}
    <slot></slot>
  </button>
</template>
<script lang="ts" setup>
  const props = defineProps({
    text: { type: String, default: () => '' },
  });
</script>
<style lang="less" scoped>
  .bg-button {
    display: inline-block;
    padding: 5px 10px 5px 15px;
    transition: all 0.2s;
    border: none;
    outline: none;
    background: url('@/assets/images/layouts/button-bg.png') no-repeat center;
    background-color: transparent;
    background-size: 100% 100%;
    color: #fff;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 5px;
    text-align: center;
    text-decoration: none;
    cursor: pointer;
  }
</style>
