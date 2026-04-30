<template>
  <div class="cardBody" :class="active ? 'active' : ''">
    <div class="icon"><Icon :icon="icon" :size="46" /></div>
    <div class="title">{{ name }}</div>
    <bg1></bg1>
  </div>
</template>

<script setup lang="ts">
  import gsapNum from '@/components/gsapNum/index.vue';
  import Icon from '@/components/Icon/Icon.vue';
  import bg1 from './bg1/index.vue';
  const props = defineProps({
    name: {
      type: String,
      required: true,
      default: '标题',
    },
    active: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: String,
      default: 'ic:baseline-apps',
    },
  });
</script>

<style lang="scss" scoped>
  .cardBody {
    display: flex;
    position: relative;
    flex-direction: column;
    width: 180px;
    height: 150px;
    transition: all 0.5s;
    cursor: pointer;
    user-select: none;

    &:hover,&.active {
      color: #00f0ff;
    }

    .title {
      position: absolute;
      z-index: 10;
      top: 50%;
      width: 100%;
      transform: translateY(-50%);
      font-size: 20px;
      font-weight: bold;
      text-align: center;
    }

    .icon {
      width: 100%;
      padding: 20px 10px;
      text-align: center;
    }
  }
</style>
