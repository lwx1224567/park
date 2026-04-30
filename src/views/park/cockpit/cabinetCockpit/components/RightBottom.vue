<template>
  <div class="port-connection">
    <div class="connection-item">
      <div class="item-content">
        <span class="path-text">{{ getPathText(connectionData.startPark) }}</span>
      </div>
    </div>
    <div class="connection-item single-line">
      <span class="item-label">起始端口</span>
      <span class="port-name">{{ connectionData.startPort?.portName || '—' }}</span>
      <span class="port-type">类型：{{ getTypeText(connectionData.startPort?.type) }}</span>
      
    </div>
    

    <div class="connection-item">
      <div class="item-content">
        <span class="path-text">{{ getPathText(connectionData.endPark) }}</span>
      </div>
    </div>
    <div class="connection-item single-line">
      <div class="item-label">目标端口</div>
        <span class="port-name">{{ connectionData.endPort?.portName || '—' }}</span>
        <span class="port-type">类型：{{ getTypeText(connectionData.endPort?.type) }}</span>
    </div>
    

  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted, watch } from 'vue';
  import { getDevicePortDetails } from '@/api/cockpit/cabinetManage';
  import { TKEvenBus } from '@/utils/TKThree/TKEvenBus';

  // 接收父组件传递的端口参数
  const props = defineProps<{
    portId?: string;
    linkId?: string;
  }>();

  // 事件总线实例
  const eventBus = TKEvenBus.getInstance();
  
  // 当前设备ID
  const currentDeviceId = ref<string>('');

  // 端口连接数据类型定义
  interface PortData {
    id: number;
    modelName: string;
    portName: string;
    type: number;
    isFront: number;
    linkType: boolean | null;
    parkId: string | null;
    linkId: number | null;
    positionX: number | null;
    positionY: number | null;
    positionZ: number | null;
    rotationX: number | null;
    rotationY: number | null;
    rotationZ: number | null;
    scaleX: number | null;
    scaleY: number | null;
    scaleZ: number | null;
    baseOffsetX: number | null;
    baseOffsetY: number | null;
    baseOffsetZ: number | null;
    deptId: string | null;
    remark: string | null;
  }

  interface ConnectionData {
    startPort: PortData | null;
    endPort: PortData | null;
    startPark: string[];
    endPark: string[];
  }

  const connectionData = ref<ConnectionData>({
    startPort: null,
    endPort: null,
    startPark: [],
    endPark: []
  });

  // 类型映射函数
  const getTypeText = (type: number | undefined) => {
    if (type === undefined || type === null) return '—';
    switch (type) {
      case 0: return '电源';
      case 1: return '网口';
      case 2: return '光口';
      default: return '—';
    }
  };

  // 路径文本处理
  const getPathText = (pathArray: string[] | undefined) => {
    if (!pathArray || !Array.isArray(pathArray) || pathArray.length === 0) {
      return '—';
    }
    return pathArray.join(' > ');
  };

  // 获取端口连接数据
  const getData = async (deviceId?: string) => {
    if (!deviceId && !currentDeviceId.value) return;
    
    try {
      const portId = props.portId || '1';
      const linkId = props.linkId || '1';
      const targetDeviceId = deviceId || currentDeviceId.value;
      const response = await getDevicePortDetails(portId, linkId, targetDeviceId);
      const data = response?.data || response || {};
      
      connectionData.value = {
        startPort: data.startPort || null,
        endPort: data.endPort || null,
        startPark: data.startPark || [],
        endPark: data.endPark || []
      };
    } catch (error) {
      // 忽略超时和取消错误
      if (error.code === 'ECONNABORTED' || error.name === 'CanceledError' || error.code === 'ERR_CANCELED') {
        return;
      }
      // console.error('获取端口连接数据失败:', error);
    }
  };

  // 处理设备切换事件
  const handleDeviceChanged = (eventData: any) => {
    if (eventData && eventData.deviceId) {
      currentDeviceId.value = eventData.deviceId;
      getData(eventData.deviceId);
    }
  };

  // 监听参数变化
  watch([() => props.portId, () => props.linkId], () => {
    if (currentDeviceId.value) {
      getData();
    }
  }, { immediate: false });

  onMounted(() => {
    // 监听设备切换事件
    eventBus.on('deviceChanged', handleDeviceChanged);
  });

  onUnmounted(() => {
    // 取消事件监听
    eventBus.off('deviceChanged', handleDeviceChanged);
  });
</script>

<style scoped lang="less">
.port-connection {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
  height: 100%;
  color: #cfe8ff;
}

.connection-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 10px;
  border: 1px solid rgba(59, 130, 246, 0.25);
  border-radius: 6px;
  background: linear-gradient(90deg, rgba(17, 66, 122, 0.2), rgba(17, 66, 122, 0.05));
}

.item-label {
  font-size: 12px;
  color: #9cc6ff;
  font-weight: 500;
  margin-bottom: 4px;
}

.item-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.port-name {
  font-size: 14px;
  color: #e8f2ff;
  font-weight: 600;
}

.port-type {
  font-size: 11px;
  color: #60a5fa;
  font-weight: 500;
  padding: 2px 6px;
  background: rgba(96, 165, 250, 0.1);
  border-radius: 4px;
  display: inline-block;
  width: fit-content;
}

.path-text {
  font-size: 1em;
  color: #b9e1ff;
  line-height: 1.4;
  word-break: break-all;
  text-align: center;
}

.separator {
  font-size:  1em;
  color: #00d4ff;
  margin: 0 8px;
  font-weight: bold;
}

.connection-item.single-line {
  display: flex !important;
  align-items: center;
  gap: 12px;
  flex-direction: row !important;
  
  .item-label {
    flex: 1;
    font-size: 12px;
    color: #7fb2d9;
    margin: 0;
    text-align: center;
    display: inline-block;
  }
  
  .port-name {
    flex: 1;
    text-align: center;
    display: inline-block;
  }
  
  .port-type {
    flex: 1;
    text-align: center;
    display: inline-block;
  }
}
</style>