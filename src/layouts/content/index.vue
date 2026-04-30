<template>
  <a-layout-content class="relative">
    <a-layout class="absolute inset-0 bg-initial">
      <a-layout-sider class="bg-initial" width="auto">
        <slot name="sider" />
      </a-layout-sider>
      <a-layout-content class="relative">
        <RouterView>
          <template #default="{ Component, route }">
            <keep-alive>
              <component v-if="route.meta.keepAlive" :is="Component" :key="route.fullPath" />
            </keep-alive>
            <component v-if="!route.meta.keepAlive" :is="Component" :key="route.fullPath" />
          </template>
        </RouterView>
      </a-layout-content>
    </a-layout>
  </a-layout-content>
</template>

<script lang="ts" setup></script>
<style lang="less" scoped>
  .bg-initial {
    background: initial;
  }
</style>
