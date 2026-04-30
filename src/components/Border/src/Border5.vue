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
    height: 100%;
    padding: 0 !important;
    gap: 5px;

    .title {
      display: flex;
      align-items: center;
      justify-content: space-between;

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
      background: url('@/assets/images/layouts/border5-bg.png') no-repeat center;
      background-size: 100% 100%;

      .content {
        position: absolute;
        z-index: 1;
        padding: 26px 10px 10px;
        overflow-y: auto;
        inset: 0;
      }

      &::before {
        content: '';
        position: absolute;
        z-index: 0;
        background: url('@/assets/images/layouts/border5-bg-t.png') no-repeat;
        background-position: left top;
        background-size: 70% auto;
        inset: 0;
      }

      &::after {
        content: '';
        position: absolute;
        z-index: 0;
        background: url('@/assets/images/layouts/border5-bg-b.png') no-repeat;
        background-position: bottom;
        background-size: 100% auto;
        inset: 0;
      }
    }
  }
</style>
