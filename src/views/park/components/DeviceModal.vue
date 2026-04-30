<template>
  <BasicModal
    v-bind="$attrs"
    @register="register"
    :title="title"
    :showCancelBtn="false"
    :showOkBtn="false"
    :mask="false"
    width="600px"
  >
    <div class="w-full h-full flex items-center justify-center pt-8">
      <a-empty description="暂无设备数据" />
    </div>
  </BasicModal>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '@/components/Modal';

  const title = ref('设备详情');

  const [register, { closeModal }] = useModalInner((data) => {
    if (!data) return;
    title.value = `${data.name}设备详情` || '设备详情';
  });
</script>

<style scoped lang="less">
</style>
