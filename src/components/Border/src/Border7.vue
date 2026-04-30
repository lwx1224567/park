<template>
  <div class="border-wrapper">
    <div class="title">
      <span class="text">{{ title }}</span>
      <div class="tool">
        <slot name="tool"></slot>
      </div>
    </div>
    <div class="border-content">
      <div class="content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  const props = defineProps({
    title: { type: String, default: () => '标题' },
    showTitle: { type: Boolean, default: true },
    showHeader: { type: Boolean, default: true },
  });
</script>
<style lang="less" scoped>
  .border-wrapper {
    display: flex;
    position: relative;
    flex-direction: column;
    width: 100%;
    gap: 5px;

    .title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 5px 10px;
      background: url('@/assets/images/layouts/border6-bg-t.png') no-repeat;
      background-size: auto 100%;

      .text {
        color: #d8effc;
        font-size: 18px;
        font-weight: bold;
        user-select: none;
      }
    }

    .border-content {
      position: relative;
      flex: auto;
      border: 2px solid #013881;

      .content {
        position: relative;
        z-index: 1;
        padding: 30px;
      }

      &::before {
        content: '';
        position: absolute;
        z-index: 0;
        background: url('@/assets/images/layouts/border7-bg-t.png') no-repeat;
        background-position: left top -1px;
        inset: 0;
      }

      &::after {
        content: '';
        position: absolute;
        z-index: 0;
        background: url('@/assets/images/layouts/border7-bg-b.png') no-repeat;
        background-position: right bottom;
        inset: 0;
      }
    }
  }
</style>
