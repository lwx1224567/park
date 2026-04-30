<!--Border1.vue 是一个轻量级的装饰性容器组件，
适用于需要统一边框风格和标题栏的场景。它提供了标题、标题颜色、头部显隐等配置，
并预留了工具栏插槽，
使得在大屏或后台管理系统中快速构建模块化界面变得简单高效。-->
<template>
  <div class="border-wrapper">
    <div class="flex justify-end relative header" v-if="showHeader">
      <div class="title" :style="{ color: color }" v-if="showTitle">{{ title }}</div>
      <div class="relative bottom-1 flex gap-4">
        <slot name="toolbar"></slot>
      </div>
    </div>
    <div class="content relative">
      <div class="absolute inset-0">
        <slot></slot>
      </div>
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
    display: flex;
    flex-direction: column;

    .header {
      height: 32px;

      .title {
        display: inline-block;
        position: absolute;
        bottom: 0;
        left: 0;
        width: fit-content;
        padding: 0 30px;
        border: 1px solid #0b5585;
        border-radius: 5px 5px 0 0;
        background-color: rgb(22 47 91 / 50%);
        font-size: 16px;
        font-weight: bold;
        line-height: 32px;
      }
    }

    .content {
      height: calc(100% - 32px);
      border: 4px solid #0b5585;
    }
  }
</style>
