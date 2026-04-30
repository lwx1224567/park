<template>
  <a-layout class="page2-wrapper">
    <div class="title" v-if="showTitle">
      <CaretRightOutlined />
      <CaretRightOutlined />
      <CaretLeftOutlined />
      <CaretLeftOutlined />
    </div>
    <div class="top-tool">
      <slot name="top-tool"></slot>
    </div>
    <a-layout-header class="page-header" v-if="showHeader">
      <div class="header-left">
        <slot name="header-left"></slot>
      </div>
      <slot name="header-content"></slot>
      <div class="header-right">
        <slot name="header-right"></slot>
      </div>
    </a-layout-header>
    <a-layout class="page-content">
      <a-layout-sider class="content-lr" width="auto">
        <slot name="content-left"></slot>
      </a-layout-sider>
      <a-layout-content class="en-page-content">
        <slot></slot>
      </a-layout-content>
      <a-layout-sider class="content-lr" width="auto">
        <slot name="content-right"></slot>
      </a-layout-sider>
    </a-layout>
    <a-layout-footer class="page-footer" v-if="showFooter">
      <slot name="footer"></slot>
    </a-layout-footer>
  </a-layout>
</template>

<script lang="ts" setup>
  import { useRoute } from 'vue-router';
  import { computed } from 'vue';
  import { CaretRightOutlined, CaretLeftOutlined } from '@ant-design/icons-vue';

  const props = defineProps({
    showTitle: { type: Boolean, default: false },
    showHeader: { type: Boolean, default: false },
    showFooter: { type: Boolean, default: false },
  });

  const route = useRoute();
  const title = computed(() => route.meta.title);
</script>
<style lang="less" scoped>
  .page2-wrapper {
    position: relative;
    width: 100%;
    height: 79%;
    padding: 1em;
    background: transparent;

    .title {
      position: absolute;
      top: 0;
      left: 50%;
      transform: translate(-50%, -22%);
      background: linear-gradient(90deg, rgb(216 239 252) 0%, #fff 50%, #d8effc 100%);
      background-clip: text;
      font-size: 20px;
      font-weight: bold;
      text-shadow:
        0 2px 5px rgb(216 239 252 / 45%),
        0 1px 0 rgb(216 239 252 / 12%);
      -webkit-text-fill-color: transparent;
    }

    .top-tool {
      position: absolute;
      z-index: 999;
      top: 0;
      right: 1.6vw;
      transform: translateY(-100%);
      cursor: pointer;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      height: auto;
      margin: 0;
      padding: 0;
      background: initial;
      color: #fff;
      line-height: initial;
    }

    .page-content {
      flex: 1;
      background: initial;
      color: #fff;

      .en-page-content {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .content-lr {
        background: initial;
      }
    }

    .page-footer {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      background: initial;
    }
  }
</style>
