<template>
  <button class="mo_btn_wrap" :class="[active ? 'active' : '']">
    <div class="content">
      {{ text }}
      <slot></slot>
    </div>
  </button>
</template>

<script setup lang="ts">
  const props = defineProps({
    active: {
      type: Boolean,
      default: false,
    },
    text: {
      type: String,
      default: '',
    },
  });
</script>

<style scoped lang="less">
  .mo_btn_wrap {
    display: inline-block;
    padding: 10px 20px;
    transition: all 0.2s;
    border: 0;
    border-radius: 3px;
    outline: none;
    background: url('@/assets/images/layouts/menu-bg.png') no-repeat center center;
    background-color: transparent;
    background-size: 100% 100%;
    line-height: 1;
    // font-size: 16px;
    text-decoration: none;
    cursor: pointer;

    &.active {
      background-image: url('@/assets/images/layouts/menu-bg-active.png');
    }

    .content {
      background: linear-gradient(#fff, #fff, #8ef1ff); /* 标准语法 */
      background-clip: text;
      color: rgb(51 244 245 / 30%);
      font-size: 18px;
      font-weight: bold;
      text-shadow:
        1px 1px 0 #bbb,
        1px 1px 0 #999,
        -1px -1px 0 #888,
        1px -1px 0 #777,
        -1px 1px 0 #666;
      text-shadow: 0 3px 5px #0a3779;
      white-space: nowrap;
      -webkit-text-fill-color: rgb(91 245 245 / 30%);
    }
  }
</style>
