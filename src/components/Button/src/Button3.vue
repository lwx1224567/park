<template>
  <button class="mo_btn_wrap">
    <div class="content">
      {{ text }}
      <slot></slot>
    </div>
  </button>
</template>

<script setup lang="ts">
  const props = defineProps({
    text: {
      type: String,
      default: '',
    },
  });
</script>

<style scoped lang="less">
  .mo_btn_wrap {
    display: inline-block;
    padding: 0.8vh 2vw;
    transition: all 0.2s;
    border: 0;
    outline: none;
    background: url('@/assets/images/layouts/button3-bg.png') no-repeat center center;
    background-color: transparent;
    background-size: 100% 100%;
    text-decoration: none;
    cursor: pointer;

    .content {
      background: linear-gradient(#fff, #fff, #8ef1ff);
      background-clip: text;
      color: rgb(51 244 245 / 30%);
      font-size: 1vw;
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
