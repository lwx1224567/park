<template>
  <a-config-provider :locale="zhCN" :theme="themeConfig">
    <AppProvider>
      <RouterView />
    </AppProvider>
  </a-config-provider>
</template>

<script lang="ts" setup>
  import { AppProvider } from '@/components/Application';
  import zhCN from 'ant-design-vue/es/locale/zh_CN';
  import { theme } from 'ant-design-vue';
  import { reactive } from 'vue';

  const { darkAlgorithm } = theme;

  const themeConfig = reactive({
    token: {
      colorPrimary: '#0960bd',
      colorSuccess: '#55D187',
      colorWarning: '#EFBD47',
      colorError: '#ED6F6F',
      colorInfo: '#0960bd',
    },
    algorithm: [darkAlgorithm],
  });
</script>
