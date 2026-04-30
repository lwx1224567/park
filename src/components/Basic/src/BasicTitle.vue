<!--BasicTitle.vue 是一个轻量级标题组件，
封装了常见的标题视觉需求（加粗、竖条、帮助图标）。
在项目中通常用于表单区块、卡片标题、页面内分组等场景，
帮助保持界面一致性并快速添加辅助说明。-->
<template>
  <span :class="getClass">
    <slot></slot>
    <BasicHelp :class="`${prefixCls}-help`" v-if="helpMessage" :text="helpMessage" />
  </span>
</template>
<script lang="ts" setup>
  import type { PropType } from 'vue';
  import { useSlots, computed } from 'vue';
  import BasicHelp from './BasicHelp.vue';
  import { useDesign } from '@/hooks/web/useDesign';

  const props = defineProps({
    /**
     * Help text list or string
     * @default: ''
     */
    helpMessage: {
      type: [String, Array] as PropType<string | string[]>,
      default: '',
    },
    /**
     * Whether the color block on the left side of the title
     * @default: false
     */
    span: { type: Boolean },
    /**
     * Whether to default the text, that is, not bold
     * @default: false
     */
    normal: { type: Boolean },
  });

  const { prefixCls } = useDesign('basic-title');
  const slots = useSlots();
  const getClass = computed(() => [
    prefixCls,
    { [`${prefixCls}-show-span`]: props.span && slots.default },
    { [`${prefixCls}-normal`]: props.normal },
  ]);
</script>
<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-basic-title';

  .@{prefix-cls} {
    display: flex;
    position: relative;
    padding-left: 7px;
    color: #00f6ff;
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    user-select: none;

    &-normal {
      font-size: 14px;
      font-weight: 500;
    }

    &-show-span::before {
      content: '';
      position: absolute;
      top: 4px;
      left: 0;
      width: 3px;
      height: 16px;
      margin-right: 4px;
      background-color: @primary-color;
    }

    &-help {
      margin-left: 10px;
    }
  }
</style>
