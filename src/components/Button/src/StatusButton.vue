<template>
  <button class="bg-button" :class="type" :style="`--padding: ${padding};`">
    {{ text }}
    <slot></slot>
  </button>
</template>
<script lang="ts" setup>
  const props = defineProps({
    text: { type: String, default: () => '' },
    padding: { type: String, default: () => '8px 15px 8px 20px' },
    type: { type: String, default: () => 'default' },
  });
</script>
<style lang="less" scoped>
  .bg-button {
    display: inline-block;
    padding: var(--padding);
    transition: all 0.2s;
    border: none;
    outline: none;
    letter-spacing: 2px;
    text-align: center;
    text-decoration: none;
    cursor: pointer;

    &.default {
      background: url('@/assets/images/layouts/button-bg.png') no-repeat center / 100% 100%;
    }

    &.danger {
      background: url('@/assets/images/layouts/button-danger.png') no-repeat center / 100% 100%;
    }
  }
</style>
