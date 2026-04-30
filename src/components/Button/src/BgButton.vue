<template>
  <div class="bg-button">
    <slot></slot>
  </div>
</template>
<style lang="less" scoped>
  .bg-button {
    display: inline-block;
    background: url('@/assets/images/layouts/button-bg.png') no-repeat center;
    background-size: 100% 100%;
  }
</style>
