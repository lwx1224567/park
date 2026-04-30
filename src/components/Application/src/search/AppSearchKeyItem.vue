<!--这是一个非常轻量的图标适配组件，
专门为搜索快捷键栏提供按键图标的渲染和样式支持，
实际视觉效果由父组件提供的 CSS 类决定。-->
<template>
  <span :class="$attrs.class">
    <Icon :icon="icon" />
  </span>
</template>
<script lang="ts" setup>
  import Icon from '@/components/Icon/Icon.vue';

  defineProps({
    icon: String,
  });
</script>
