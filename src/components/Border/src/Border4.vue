<!--Border4.vue 是一个装饰性背景容器，
专为需要快速添加统一视觉边框的场景设计。它通过背景图片和绝对定位的内边距，
让内容以固定边距和垂直居中的方式呈现，
适合大屏项目中多个模块的快速布局。使用时注意父容器高度和背景图片的适配。-->
<template>
  <div class="border-wrapper">
    <div class="absolute top-[25px] right-[20px] bottom-[10px] left-[15px] flex items-center">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
  const props = defineProps({
    title: { type: String, default: () => '标题' },
    color: { type: String, default: () => '#fff' },
    showTitle: { type: Boolean, default: true },
    showHeader: { type: Boolean, default: true },
  });
</script>
<style lang="less" scoped>
  .border-wrapper {
    position: relative;
    width: 100%;
    background: url('@/assets/images/layouts/card-bg.png') no-repeat center;
    background-size: 100% 100%;
  }
</style>
