<template>
  <div class="view">
    <div v-if="deviceGroups.length === 0" class="empty-state">
      <p>暂无数据</p>
    </div>
    <div v-for="(group, groupIndex) in deviceGroups" :key="groupIndex" class="list-section">
      <div class="list-header" @click="toggleExpand(groupIndex)">
        <span class="list-title">{{ group.nameZh }}</span>
        <i class="icon" :class="{ 'collapsed': !expanded[groupIndex] }">▼</i>
      </div>
      <div class="list-content" v-show="expanded[groupIndex]">
        <div
          class="list-item"
          v-for="(item, index) in group.devices"
          :key="index"
        >
          <span class="item-name">{{ item.name }}</span>
          <div class="item-status" :class="getStatusClass(item)">
            <span class="status-dot" :class="getStatusClass(item)"></span>
            <span class="status-text">{{ getStatusText(item) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  //设备列表
  import { ref, computed, watch } from 'vue';
  import { useRoomStore } from '@/store/modules/room';

  const roomStore = useRoomStore();

  // 设备数据
  const deviceData = computed(() => roomStore.getDeviceListData);

  // 展开/收起状态（动态生成）
  const expanded = ref<Record<number, boolean>>({});

  // 初始化展开状态
  const initExpandedState = () => {
    if (deviceData.value && deviceData.value.length > 0) {
      deviceData.value.forEach((_, index) => {
        if (expanded.value[index] === undefined) {
          expanded.value[index] = false; // 默认不展开
        }
      });
    }
  };

  // 监听 deviceData 变化并初始化展开状态
  watch(
    () => deviceData.value?.length,
    () => {
      initExpandedState();
    },
    { immediate: true }
  );

  // 切换展开/收起
  const toggleExpand = (index: number) => {
    expanded.value[index] = !expanded.value[index];
  };

  // 将 API 数据转换为组件需要的格式
  const deviceGroups = computed(() => {
    if (!deviceData.value || !Array.isArray(deviceData.value)) {
      return [];
    }
    return (deviceData.value as any[]).map((item) => ({
      nameZh: item.category?.nameZh || item.category?.nameEn || item.nameZh || '设备列表',
      count: item.parkList?.length || 0,
      devices: item.parkList?.map((device: any) => ({
        id: device.id,
        name: device.name,
        status: device.status || '在线', // 使用设备的 status 字段
      })) || [],
    }));
  });

  // 根据设备数据获取状态类名
  const getStatusClass = (item: any) => {
    const status = item.status || item.statusText;
    if (status === '在线' || status === 'online' || status === '正常') {
      return 'status-online';
    } else if (status === '维护' || status === 'maintenance') {
      return 'status-maintenance';
    } else if (status === '告警' || status === 'alarm' || status === '故障') {
      return 'status-alarm';
    } else if (status === '离线' || status === 'offline' || status === '断线') {
      return 'status-offline';
    }
    // 默认在线
    return 'status-online';
  };

  // 根据设备数据获取状态文本
  const getStatusText = (item: any) => {
    const status = item.status || item.statusText;
    if (status === 'online' || status === '在线' || status === '正常') {
      return '在线';
    } else if (status === 'maintenance' || status === '维护') {
      return '维护';
    } else if (status === 'alarm' || status === '告警' || status === '故障') {
      return '告警';
    } else if (status === 'offline' || status === '离线' || status === '断线') {
      return '离线';
    }
    return status || '在线';
  };
</script>
<style lang="less" scoped>
  .view {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    padding: 10px;
    overflow-y: auto;
    color: #fff;
    scrollbar-gutter: stable;
  }

  .empty-state {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #666;
    font-size: 14px;
  }

  .list-section {
    margin-bottom: 8px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 6px;
    cursor: pointer;
    transition: all 0.3s;
    border: 1px solid rgba(36, 191, 255, 0.3);
    box-shadow: 0 0 8px 4px rgba(160, 181, 225, 0.3) inset; /* 内发光效果 */
    background: rgba(3, 52, 117, 0.63);
  }

  .list-title {
    font-size: 14px;
    font-weight: bold;
    color: #fff;
  }

  .icon {
    font-size: 10px;
    color: #ddedf3;
    transition: transform 0.3s;
    display: inline-block;
    transform: rotate(0deg);

    &.collapsed {
      transform: rotate(-90deg);
    }
  }

  .list-content {
    max-height: 400px;
    overflow-y: auto;
    padding: 6px 0;
    margin-top: 6px;
    scrollbar-gutter: stable;
  }

  .list-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    background: rgba(48, 170, 223, 0.315);
    border: 1px solid rgba(36, 191, 255, 0.3);
    border-radius: 4px;
    transition: all 0.2s;
    margin-bottom: 4px;
    &:hover {
      background: rgba(36, 191, 255, 0.15);
      border-color: rgba(36, 191, 255, 0.5);
    }
  }

  .item-name {
    font-size: 13px;
    color: #d8effc;
  }

  .item-status {
    display: flex;
    align-items: center;
    gap: 8px;

    // 根据状态设置文字颜色
    &.status-online .status-text {
      color: #52c41a;
    }

    &.status-maintenance .status-text {
      color: #faad14;
    }

    &.status-alarm .status-text {
      color: #ff4d4f;
    }

    &.status-offline .status-text {
      color: #8c8c8c;
    }
  }

  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    display: inline-block;

    &.status-online {
      background: #52c41a;
    }

    &.status-maintenance {
      background: #faad14;
    }

    &.status-alarm {
      background: #ff4d4f;
    }

    &.status-offline {
      background: #8c8c8c;
    }
  }

  .status-text {
    font-size: 12px;
    color: #d8effc;
  }

  // 自定义滚动条样式
  .list-content::-webkit-scrollbar {
    width: 6px;
  }

  .list-content::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 3px;
  }

  .list-content::-webkit-scrollbar-thumb {
    background: rgba(36, 191, 255, 0.5);
    border-radius: 3px;

    &:hover {
      background: rgba(36, 191, 255, 0.8);
    }
  }
</style>
