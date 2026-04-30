<!--Border2.vue 是一个支持标签页切换的装饰性容器，
适合需要在一组相关数据视图间快速切换的大屏或后台模块。
它封装了标签栏样式、边框和事件通知，
父组件只需提供标签数据、监听切换事件并动态渲染对应内容即可。-->
<template>
  <div class="border-wrapper">
    <div class="flex justify-end relative header">
      <div class="tag-content">
        <div
          v-for="(item, index) in props.tag"
          :key="index"
          class="tag-item"
          :class="{ active: tabsIndex == index }"
          @click="handleClick(index)"
        >
          {{ item.taskName }}
        </div>
      </div>
      <div class="relative bottom-1 flex gap-4">
        <slot name="toolbar"></slot>
      </div>
    </div>
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
  const props = defineProps({
    tag: { type: Array, default: () => [] } as any,
    tabsIndex: { type: Number, default: () => 0 },
    color: { type: String, default: () => '#fff' },
    showTitle: { type: Boolean, default: true },
  });
  const emit = defineEmits(['open-change']);
  const handleClick = (index) => {
    // console.log(index);
    emit('open-change', index);
  };
</script>
<style lang="less" scoped>
  .border-wrapper {
    display: flex;
    flex-direction: column;

    .header {
      min-height: 32px;

      .tag-content {
        display: flex;
        position: absolute;
        bottom: 0;
        left: 0;
        gap: 5px;

        .tag-item {
          display: inline-block;
          width: fit-content;
          padding: 0 30px;
          border: 1px solid #0b5585;
          border-radius: 5px 5px 0 0;
          background-color: rgb(22 47 91 / 30%);
          color: #84cef0;
          font-size: 16px;
          line-height: 32px;
          cursor: pointer;

          &.active {
            background-color: rgb(22 47 91 / 100%);
            color: #fff;
            font-weight: bold;
          }
        }
      }
    }

    .content {
      flex: auto;
      border: 4px solid #0b5585;
    }
  }
</style>
