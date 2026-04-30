<template>
  <div class="base-info-card">
    <div class="info-row" v-for="item in infoRows" :key="item.label">
      <div class="info-label">{{ item.label }}</div>
      <div class="info-value">{{ item.value }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, inject } from 'vue';
  import type { DeviceBasicInfo } from '../types/index';
  import { deviceModelContextKey } from '../types/index';

  import { DeviceType } from '../types';

  const mockBasicInfo: DeviceBasicInfo = {
    deviceId: 'SW-1U-525DX',
    deviceName: '1U-525DX',
    deviceModel: '1U-525DX',
    deviceType: DeviceType.SWITCH,
    status: '正常运行',
    location: 'A区机房 3排 02柜',
    ipAddress: '192.168.10.25',
    manufacturer: 'OpenIOT Labs',
    firmwareVersion: 'FW-5.2.18',
    portSummary: '48 / 100MBPS',
  };

  const deviceContext = inject(deviceModelContextKey, null);

  const basicInfo = computed(() => deviceContext?.basicInfo.value ?? mockBasicInfo);

  const infoRows = computed(() => [
    { label: '设备名称', value: basicInfo.value.deviceName },
    { label: '设备类型', value: basicInfo.value.deviceType },
    { label: '设备位置', value: basicInfo.value.location },
    { label: '接口数量 / 速率', value: basicInfo.value.portSummary },
  ]);
</script>

<style scoped>
  .base-info-card {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 16px 8px;
    color: #cfeeff;
    box-sizing: border-box;
    gap: 8px;
    justify-content: center;
  }

  .info-row {
    display: grid;
    padding: 0px 24px;
    border-bottom: 3px solid rgba(251, 251, 251, 0.1);
  }

  .info-label {
    color: #ffffff;
    font-size: 13px;
  }

  .info-value {
    overflow: hidden;
    color: #6ad7ff;
    font-size: 14px;
    font-weight: 600;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: right;
  }
</style>
