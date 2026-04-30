<template>
  <div class="border-wrapper">
    <img v-if="bgImage" :src="bgImage" alt="" class="bg-image" />
    <div class="title">{{ title }}</div>
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
  defineProps({
    title: { type: String, default: () => '标题' },
    showTitle: { type: Boolean, default: true },
    showHeader: { type: Boolean, default: true },
    bgImage: { type: String, default: '' },
  });
</script>

<style lang="less" scoped>
  .border-wrapper {
    position: relative;
    height: 100%;

    .bg-image {
      position: absolute;
      z-index: 0;
      width: 100%;
      height: 100%;
      object-fit: fill;
      inset: 0;
    }

    .title {
      position: absolute;
      z-index: 2;
      top: 0;
      left: 0;
      width: 100%;
      padding: 5px 10px;
      transform: translateY(-50%);
      background: url('@/assets/images/layouts/border6-bg-t.png') no-repeat;
      background-size: auto 100%;
      color: #d8effc;
      font-size: 18px;
      font-weight: bold;
      user-select: none;
    }

    .content {
      position: absolute;
      z-index: 2;
      padding: 26px 10px 10px;
      overflow-y: auto;
      inset: 0;
    }

    &::before {
      content: '';
      position: absolute;
      z-index: 1;
      background: url('@/assets/images/layouts/border6-bg-r.png') no-repeat;
      background-position: right center;
      background-size: auto;
      inset: 0;
      pointer-events: none;
    }

    &::after {
      content: '';
      position: absolute;
      z-index: 1;
      background: url('@/assets/images/layouts/border6-bg-b.png') no-repeat;
      background-position: left bottom;
      background-size: auto;
      inset: 0;
      pointer-events: none;
    }
  }
</style>
