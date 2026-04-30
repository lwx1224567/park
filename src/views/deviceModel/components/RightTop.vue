<template>
  <div class="interface-card">
    <div class="legend"></div>

    <div class="group-list">
      <div
        class="group-card"
        v-for="group in displayGroups"
        :key="group.name"
      >
        <div v-if="isServer" class="group-title">{{ group.name }}</div>

        <div class="port-rows">
          <div
            class="port-row"
            v-for="(row, rowIndex) in chunkPorts(group.interfaces, 10)"
            :key="rowIndex"
          >
            <div class="port-icons-row">
              <div
                class="port-item"
                v-for="item in row"
                :key="item.id"
              >
                <div class="port-lamp">
                  <img
                    :src="getStatusImage(item.status)"
                    class="status-image"
                  />
                </div>
              </div>
            </div>

            <div class="port-names-row">
              <div
                class="port-name"
                v-for="item in row"
                :key="item.id"
              >
                {{ item.name }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="displayGroups.length === 0" class="empty-content">
      暂无接口信息
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import type { InterfaceGroup, InterfaceStatus } from '../types';
import { deviceModelContextKey } from '../types';

// 引入状态图片
import greenImg from '@/assets/components/DeviceInfo/green.png';
import yellowImg from '@/assets/components/DeviceInfo/yellow.png';
import redImg from '@/assets/components/DeviceInfo/red.png';

// 获取设备上下文，判断是服务器还是交换机
const deviceContext = inject(deviceModelContextKey, null);
const isServer = computed(() => deviceContext?.isServer.value ?? false);

/**
 * 配置参数
 */
const SERVER_GROUP_COUNT = 3;  // 服务器：展示3个板卡
const SERVER_PORT_COUNT = 20;  // 服务器：每个板卡20个口
const SWITCH_PORT_COUNT = 18;  // 交换机：默认展示24个口（可根据需求调整）

// 模拟状态循环种子
const statusSeed: InterfaceStatus[] = [
  'active', 'normal', 'normal', 'warning', 'normal', 
  'unused', 'error', 'normal', 'active', 'normal',
];

/**
 * 核心逻辑：根据设备类型计算展示的分组数据
 */
const displayGroups = computed<InterfaceGroup[]>(() => {
  // --- 1. 服务器模式：多板卡结构 ---
  if (isServer.value) {
    return Array.from({ length: SERVER_GROUP_COUNT }, (_, groupIndex) => ({
      name: `板卡 0${groupIndex + 1}`,
      interfaces: Array.from({ length: SERVER_PORT_COUNT }, (_, portIndex) => {
        const serial = portIndex + 1;
        return {
          id: `server-${groupIndex}-${serial}`,
          name: `LAN${serial}`,
          status: statusSeed[(groupIndex * 2 + portIndex) % statusSeed.length],
        };
      }),
    }));
  } 
  
  // --- 2. 交换机模式：单组结构，无标题 ---
  return [{
    name: 'SwitchInterfaces', // 仅作 key 使用，template 中已 v-if 隐藏标题
    interfaces: Array.from({ length: SWITCH_PORT_COUNT }, (_, portIndex) => {
      const serial = portIndex + 1;
      return {
        id: `switch-${serial}`,
        name: `LAN${serial}`,
        status: statusSeed[portIndex % statusSeed.length],
      };
    }),
  }];
});

/**
 * 辅助工具：将端口数组按每行 size 个进行切分
 */
const chunkPorts = (ports: any[], size = 10) => {
  const result: any[] = [];
  for (let i = 0; i < ports.length; i += size) {
    result.push(ports.slice(i, i + size));
  }
  return result;
};

/**
 * 根据状态获取对应的图片
 */
const getStatusImage = (status: InterfaceStatus) => {
  switch (status) {
    case 'normal':
    case 'active':
      return greenImg;
    case 'warning':
    case 'unused':
      return yellowImg;
    case 'error':
      return redImg;
    default:
      return yellowImg;
  }
};
</script>

<style scoped>
.interface-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 8px;
  box-sizing: border-box;
  overflow: hidden;
  background-color: transparent; /* 背景由外部容器决定 */
}

/* 列表容器 */
.group-list {
  display: flex;
  flex-direction: column;
  gap: 12px; /* 组与组之间的间距 */
  overflow-y: auto;
}

/* 单个板卡/组卡片 */
.group-card {
  padding: 2px;
}

/* 板卡标题样式 */
.group-title {
  margin-bottom: 6px;
  color: #ffffff;
  font-size: 13px;
  font-weight: bold;
}

/* 行包装器 */
.port-rows {
  display: flex;
  flex-direction: column;
  gap: 4px; /* 图标行与名称行之间的微调 */
}

.port-row {
  display: flex;
  flex-direction: column;
  margin-bottom: 4px;
}

/* ✅ 图标行：带背景色 */
.port-icons-row {
  display: grid;
  grid-template-columns: repeat(10, 1fr); /* 严格每行10个 */
  background: rgba(0, 61, 137, 1);
  padding: 2px 0;
  border-radius: 2px;
  align-items: center;
}

.port-item {
  display: flex;
  justify-content: center;
  align-items: center;
}

.port-lamp {
  width: 18px;
  height: 16px;
  display: flex;
}

.status-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* ✅ 名称行：无背景 */
.port-names-row {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  margin-top: 2px;
}

.port-name {
  text-align: center;
  font-size: 10px;
  color: #ffffff;
  white-space: nowrap;
  transform: scale(0.9); /* 如果文字太长可以微调缩放 */
}

/* 滚动条美化 */
.group-list::-webkit-scrollbar {
  width: 4px;
}
.group-list::-webkit-scrollbar-thumb {
  background: rgba(52, 169, 255, 0.3);
  border-radius: 2px;
}

.empty-content {
  color: #999;
  text-align: center;
  padding: 20px;
}
</style>