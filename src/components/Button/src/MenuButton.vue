<template>
  <button class="mo_btn_wrap" :class="[active ? 'active' : '']">
    <div class="content">
      <slot></slot>
    </div>
  </button>
</template>
<script setup>
  const props = defineProps({
    active: {
      type: Boolean,
      default: false,
    },
  });
</script>

<style scoped lang="scss">
  .mo_btn_wrap {
    --color-primary: 4, 130, 255;

    display: inline-block;
    width: 100%;
    padding: 0.5vw 0.3vw;
    transition: all 0.2s;
    border: 0;
    border-radius: 3px;
    outline: none;
    background: url('@/assets/images/layouts/menu-bg.png') no-repeat center center;
    background-color: transparent;
    background-size: 100% 100%;
    line-height: 1;
    text-decoration: none;
    cursor: pointer;

    .content {
      padding: 0 15px;
      background: linear-gradient(#fff, #fff, #8ef1ff);
      background-clip: text;
      color: rgba($color: #33f4ff, $alpha: 30%);
      font-size: 1.2vw;
      font-weight: bold;
      text-shadow:
        1px 1px 0 #bbb,
        1px 1px 0 #999,
        -1px -1px 0 #888,
        1px -1px 0 #777,
        -1px 1px 0 #666;
      text-shadow: 0 3px 5px #0a3779;
      white-space: nowrap;
      -webkit-text-fill-color: rgba($color: #5bf5f5, $alpha: 30%);
    }

    &.active {
      background-image: url('@/assets/images/layouts/menu-bg-active.png');
    }
  }
</style>
