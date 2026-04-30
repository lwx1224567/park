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
    background: rgb(0 54 121 / 50%);
    box-shadow:
      inset 0 6px 12px rgb(255 255 255 / 5%),
      inset 0 -6px 12px rgb(255 255 255 / 5%),
      inset 0 0 30px rgb(255 255 255 / 5%);

    .title {
      display: flex;
      position: relative;
      z-index: 1;
      padding: 5px 10px;
      background: url('@/assets/images/layouts/border5-bg-t.png') no-repeat;
      background-position: left -80px top;
      background-size: auto 100%;

      .text {
        color: #d8effc;
        font-size: 18px;
        font-weight: bold;
        user-select: none;
      }

      .tool{
        position: absolute;
        top: 6px;
        right: 10px;
      }
    }

    &::before {
      content: '';
      position: absolute;
      z-index: 0;
      background: url('@/assets/images/layouts/border8-bg-tl.png') no-repeat;
      background-position: left bottom;
      inset: 0;
    }

    &::after {
      content: '';
      position: absolute;
      z-index: 0;
      background: url('@/assets/images/layouts/border8-bg-tr.png') no-repeat;
      background-position: right bottom;
      inset: 0;
    }

    .border-content {
      position: relative;
      flex: auto;

      .content {
        position: absolute;
        z-index: 1;
        padding: 10px;
        overflow-y: auto;
        inset: 0;
      }
    }
  }
</style>
