<template>
  <div class="view">
    <div v-if="deviceData.length === 0" class="empty-state">
      <p>暂无数据</p>
    </div>
    <div class="list-item" v-for="(item, index) in deviceData" :key="index" @click="hangleClick(item)">
      <span class="item-name">{{ item.name }}</span>
      <div class="item-status" :class="getStatusClass(item)">
        <span class="status-dot" :class="getStatusClass(item)"></span>
        <span class="status-text">{{ getStatusText(item) }}</span>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  //设备列表
  import { computed } from 'vue';
  import { useCabinetStore } from '@/store/modules/cabinet';
  import { TKEvenBus } from '@/utils/TKThree/TKEvenBus';

  const cabinetStore = useCabinetStore();

  // 设备数据
  const deviceData = computed(() => cabinetStore.getDeviceListData) as any;
  // 点击事件
  const hangleClick = (item) => {
    TKEvenBus.getInstance().emit('pullOutDeviceById', item.id);// 弹出设备
  };

  // 状态映射配置
  const STATUS_MAP = {
    online: { class: 'status-online', text: '在线' },
    在线: { class: 'status-online', text: '在线' },
    maintenance: { class: 'status-maintenance', text: '维护' },
    维护: { class: 'status-maintenance', text: '维护' },
    alarm: { class: 'status-alarm', text: '告警' },
    告警: { class: 'status-alarm', text: '告警' },
    offline: { class: 'status-offline', text: '离线' },
    离线: { class: 'status-offline', text: '离线' },
  };

  // 获取状态信息
  const getStatus = (item: any) => {
    const status = item.status || item.statusText;
    return STATUS_MAP[status] || { class: 'status-online', text: '在线' };
  };

  // 根据设备数据获取状态类名
  const getStatusClass = (item: any) => {
    return getStatus(item).class;
  };

  // 根据设备数据获取状态文本
  const getStatusText = (item: any) => {
    return getStatus(item).text;
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
    align-items: center;
    justify-content: space-between;
    padding: 6px;
    transition: all 0.3s;
    border: 1px solid rgb(36 191 255 / 30%);
    background: rgb(3 52 117 / 63%);
    box-shadow: 0 0 8px 4px rgb(160 181 225 / 30%) inset; /* 内发光效果 */
    cursor: pointer;
  }

  .list-title {
    color: #fff;
    font-size: 14px;
    font-weight: bold;
  }

  .icon {
    display: inline-block;
    transform: rotate(0deg);
    transition: transform 0.3s;
    color: #ddedf3;
    font-size: 10px;

    &.collapsed {
      transform: rotate(-90deg);
    }
  }

  .list-content {
    max-height: 400px;
    margin-top: 6px;
    padding: 6px 0;
    overflow-y: auto;
    scrollbar-gutter: stable;
  }

  .list-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    padding: 10px 12px;
    transition: all 0.2s;
    border: 1px solid rgb(36 191 255 / 30%);
    border-radius: 4px;
    background: rgb(48 170 223 / 31.5%);
    cursor: pointer;

    &:hover {
      background: rgb(117 125 133 / 50%);
      //border-color: rgba(36, 191, 255, 0.5);
    }
  }

  .item-name {
    color: #d8effc;
    font-size: 16px;
    font-weight: bold;
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
    display: inline-block;
    width: 18px;
    height: 18px;
    border: 2px solid rgb(38 130 217 / 30%);
    border-radius: 50%;

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
    color: #d8effc;
    font-size: 16px;
    font-weight: bold;
  }

  // 自定义滚动条样式
  .list-content::-webkit-scrollbar {
    width: 6px;
  }

  .list-content::-webkit-scrollbar-track {
    border-radius: 3px;
    background: rgb(0 0 0 / 20%);
  }

  .list-content::-webkit-scrollbar-thumb {
    border-radius: 3px;
    background: rgb(36 191 255 / 50%);

    &:hover {
      background: rgba(rgb(117 125 133));
    }
  }
</style>
