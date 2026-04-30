<template>
  <div class="device-info">
    <!-- 设备名称区域 -->
    <div class="device-header">
      <div class="device-name">{{ deviceData?.name || '—' }}{{ deviceData.assetsVo?.name ? '——' + deviceData.assetsVo.name : '' }}</div>
    </div>

    <!-- 设备状态四宫格 -->
    <!-- <div class="status-grid">
      <div class="status-item">
        <div class="icon-box cpu">
          <Icon :size="18" icon="mdi:cpu-64-bit" />
        </div>
        <div class="content">
          <div class="label">CPU使用率</div>
          <div class="value">{{ deviceData.info?.cpu || 0 }}%</div>
        </div>
      </div>
      <div class="status-item">
        <div class="icon-box memory">
          <Icon :size="18" icon="mdi:memory" />
        </div>
        <div class="content">
          <div class="label">内存使用率</div>
          <div class="value">{{ deviceData.info?.memory || 0 }}%</div>
        </div>
      </div>
      <div class="status-item">
        <div class="icon-box temperature">
          <Icon :size="18" icon="mdi:thermometer" />
        </div>
        <div class="content">
          <div class="label">设备温度</div>
          <div class="value">{{ deviceData.info?.temperature || 0 }}°C</div>
        </div>
      </div>
      <div class="status-item">
        <div class="icon-box disk">
          <Icon :size="18" icon="mdi:harddisk" />
        </div>
        <div class="content">
          <div class="label">磁盘使用率</div>
          <div class="value">{{ deviceData.info?.diskUsage || 0 }}%</div>
        </div>
      </div>
    </div> -->

    <!-- 资产信息区域 -->
    <div class="asset-info">
      <div class="asset-row">
       
        <div class="asset-item">
          <span class="label">设备型号:&nbsp;<span class="c-ffff">{{ deviceData.assetsVo?.model || deviceData.modelName || '—' }}</span></span>
        </div>
        <div class="asset-item">
          <span class="label">资产类型:&nbsp;<span class="c-ffff">{{  formatAssetType(deviceData.assetsVo?.type) }}</span></span>
        </div>
      </div>

      <div class="asset-row">
        <div class="asset-item">
          <span class="label">序列号:&nbsp;<span class="c-ffff">{{ deviceData.assetsVo?.serialNumber || '—' }}</span></span>
        </div>
        <div class="asset-item">
          <span class="label">资产状态:&nbsp;<span class="c-ffff">{{ formatAssetStatus(deviceData.assetsVo?.assetStatus) }}</span></span>
        </div>
      </div>

      <div class="asset-row">
        <div class="asset-item">
          <span class="label">采购日期:&nbsp;<span class="c-ffff">{{ formatDateYMD(deviceData.assetsVo?.purchaseDate) }}</span></span>
        </div>
        <div class="asset-item">
          <span class="label">保修到期:&nbsp;<span class="c-ffff">{{ formatDateYMD(deviceData.assetsVo?.warrantyEndDate) }}</span></span>
        </div>
      </div>

      <div class="asset-row">
        <div class="asset-item">
          <span class="label">资产价值:&nbsp;<span class="c-ffff">{{ deviceData.assetsVo?.assetValue || '—' }}</span></span>
        </div>
        <div class="asset-item">
          <span class="label">发现来源:&nbsp;<span class="c-ffff">{{ formatDiscoverySource(deviceData.assetsVo?.discoverySource) }}</span></span>
        </div>
      </div>

      <div class="asset-row">
        <div class="asset-item">
          <span class="label">IP地址:&nbsp;<span class="c-ffff">{{ deviceData.assetsVo?.ipAddress || '—' }}</span></span>
        </div>
        <div class="asset-item">
          <span class="label">MAC地址:&nbsp;<span class="c-ffff">{{ deviceData.assetsVo?.macAddress || '—' }}</span></span>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import Icon from '@/components/Icon/Icon.vue';
import { getDeviceComprehensiveInformation } from '@/api/cockpit/cabinetManage';
import { TKEvenBus } from '@/utils/TKThree/TKEvenBus';

// 事件总线实例
const eventBus = TKEvenBus.getInstance();

// 设备数据类型定义
interface DeviceInfo {
  cpu: number;
  memory: number;
  temperature: number;
  diskUsage: number;
}

interface AssetsVo {
  id?: number;
  parkId?: string;
  name?: string;
  model?: string;
  serialNumber?: string;
  type?: number;
  assetStatus?: number;
  purchaseDate?: string;
  assetValue?: string;
  discoverySource?: number;
  isValid?: number;
  ipAddress?: string;
  macAddress?: string;
  warrantyEndDate?: string;
  deptId?: string | null;
  remark?: string | null;
}

interface DeviceData {
  id: string;
  name: string;
  modelName: string;
  className: string;
  info: DeviceInfo;
  assetsVo: AssetsVo;
}

const deviceData = ref<DeviceData>({
  id: '',
  name: '',
  modelName: '',
  className: '',
  info: {
    cpu: 0,
    memory: 0,
    temperature: 0,
    diskUsage: 0
  },
  assetsVo: {
    id: undefined,
    parkId: undefined,
    name: '',
    model: '',
    serialNumber: '',
    type: undefined,
    assetStatus: undefined,
    purchaseDate: '',
    assetValue: '',
    discoverySource: undefined,
    isValid: undefined,
    ipAddress: '',
    macAddress: '',
    warrantyEndDate: '',
    deptId: null,
    remark: null
  }
});

// 当前设备ID
const currentDeviceId = ref<string>('');

// 获取设备信息
async function fetchDeviceData(deviceId: string) {
  if (!deviceId) return;
  
  try {
    const response = await getDeviceComprehensiveInformation(deviceId);
    // 兼容 {code,msg,data} 或 {data:{...}} 或 直接对象
    const data = (response?.data?.data ?? response?.data ?? response ?? {}) as any;
    
    deviceData.value = {
      id: data.id || deviceId,
      name: data.name || '',
      modelName: data.modelName || '',
      className: data.className || '',
      info: {
        cpu: data.info?.cpu || 0,
        memory: data.info?.memory || 0,
        temperature: data.info?.temperature || 0,
        diskUsage: data.info?.diskUsage || 0
      },
      assetsVo: {
      id: data.assetsVo?.id,
      parkId: data.assetsVo?.parkId,
      name: data.assetsVo?.name || '',
      model: data.assetsVo?.model || '',
      serialNumber: data.assetsVo?.serialNumber || '',
      type: data.assetsVo?.type,
      assetStatus: data.assetsVo?.assetStatus,
      purchaseDate: data.assetsVo?.purchaseDate || '',
      assetValue: data.assetsVo?.assetValue || '',
      discoverySource: data.assetsVo?.discoverySource,
      isValid: data.assetsVo?.isValid,
      ipAddress: data.assetsVo?.ipAddress || '',
      macAddress: data.assetsVo?.macAddress || '',
      warrantyEndDate: data.assetsVo?.warrantyEndDate || '',
      deptId: data.assetsVo?.deptId ?? null,
      remark: data.assetsVo?.remark ?? null
      }
    };
  } catch (error) {
    // 忽略超时和取消错误，避免控制台报错
    if (error.code === 'ECONNABORTED' || error.name === 'CanceledError' || error.code === 'ERR_CANCELED') {
      // console.warn('设备信息请求被取消或超时，使用默认数据');
      return;
    }
    // console.error('获取设备信息失败:', error);
    // 设置默认数据，避免显示空白
    deviceData.value = {
      id: deviceId,
      name: '设备加载中...',
      modelName: '—',
      className: '',
      info: {
        cpu: 0,
        memory: 0,
        temperature: 0,
        diskUsage: 0
      },
      assetsVo: {
        serialNumber: '—',
        ipAddress: '—',
        macAddress: '—',
        assetValue: '—'
      }
    };
  }
}

// 处理设备切换事件
const handleDeviceChanged = (eventData: any) => {
  if (eventData && eventData.deviceId) {
    currentDeviceId.value = eventData.deviceId;
    fetchDeviceData(eventData.deviceId);
  }
};

// 定时器引用
let dataTimer: NodeJS.Timeout | null = null;

onMounted(() => {
  // 监听设备切换事件
  eventBus.on('deviceChanged', handleDeviceChanged);
  
  // 每30秒更新一次数据
  dataTimer = setInterval(() => {
    if (currentDeviceId.value) {
      fetchDeviceData(currentDeviceId.value);
    }
  }, 30000);
});

onUnmounted(() => {
  // 取消事件监听
  eventBus.off('deviceChanged', handleDeviceChanged);
  
  // 清除定时器
  if (dataTimer) {
    clearInterval(dataTimer);
  }
});

// 工具：日期裁剪为 YYYY-MM-DD
function formatDateYMD(input?: string) {
  if (!input || typeof input !== 'string') return '—';
  // 形如 '2023-01-15 00:00:00' 或 ISO 字符串
  const idx = input.indexOf(' ');
  if (idx > 0) return input.slice(0, idx);
  // 若本身就是 YYYY-MM-DD 或其它格式，尽量截断到前 10 位
  return input.slice(0, 10) || '—';
}

// 工具：资产状态映射
function formatAssetStatus(status?: number) {
  if (status === 1) return '正常';
  if (status === 2) return '维修中';
  if (status === 3) return '已报废';
  return '—';
}

// 工具：发现来源映射
function formatDiscoverySource(source?: number) {
  if (source === 1) return '自动发现';
  if (source === 2) return '手动录入';
  return '—';
}

// 工具：资产类型映射
function formatAssetType(type?: number) {
  switch (type) {
    case 1: return '服务器';
    case 2: return '存储设备';
    case 3: return '网络设备';
    case 4: return '办公设备';
    case 5: return '其他';
    default: return '—';
  }
}
</script>

<style scoped lang="less">
.device-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 6px;
  height: 100%;
  color: #cfe8ff;
  overflow: hidden;
}

.device-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 12px;
  background: linear-gradient(90deg, rgba(17, 66, 122, 0.3), rgba(17, 66, 122, 0.1));
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 6px;
  text-align: center;
  flex-shrink: 0;
}

.device-name {
  font-size: 1.1em;
  font-weight: 600;
  color: #e8f2ff;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.device-model {
  font-size: 0.9em;
  color: #9cc6ff;
  opacity: 0.8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 8px;
  flex: 1;
  min-height: 0;
}

.status-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border: 1px solid rgba(59, 130, 246, 0.25);
  border-radius: 6px;
  background: linear-gradient(90deg, rgba(17, 66, 122, 0.2), rgba(17, 66, 122, 0.05));
  height: 100%;
  transition: all 0.3s ease;
  overflow: hidden;
}

.status-item:hover {
  border-color: rgba(59, 130, 246, 0.4);
  background: linear-gradient(90deg, rgba(17, 66, 122, 0.3), rgba(17, 66, 122, 0.1));
}

.icon-box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  color: #fff;
  flex-shrink: 0;
}

.icon-box.cpu { 
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
}
.icon-box.memory { 
  background: linear-gradient(135deg, #10b981, #059669);
}
.icon-box.temperature { 
  background: linear-gradient(135deg, #f59e0b, #d97706);
}
.icon-box.disk { 
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
}

.content { 
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  min-width: 0;
}

.label { 
  font-size: 0.9em; 
  color: #ffffff; 
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.value { 
  font-size: 1.1em; 
  color: #e8f2ff; 
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 资产信息视觉强化：使用 em 实现整体自适应放大 */
.asset-info {
  --base-size: 1rem; /* 可通过容器 font-size 控制整块缩放 */
  font-size: 1.05em;
  border: 0.0625em solid rgba(59, 130, 246, 0.35);
  border-radius: 0.5em;
  background: linear-gradient(135deg, rgba(17, 66, 122, 0.22), rgba(17, 66, 122, 0.08));
  box-shadow: 0 0.5em 1.25em rgba(0, 0, 0, 0.25) inset, 0 0.25em 0.75em rgba(0, 0, 0, 0.25);
  overflow: hidden;
  flex-shrink: 0;
}

.asset-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75em 1em;
  gap: 1em;
  border-bottom: 0.0625em solid rgba(255, 255, 255, 0.06);
}
.asset-row:last-child { border-bottom: none; }

.asset-item {
  display: flex;
  align-items: center;
  gap: 0.5em;
  flex: 1;
  min-width: 0;
}

.asset-item .label {
  font-size: 0.95em;
  color: #cfe8ff;
  font-weight: 600;
  letter-spacing: 0.01em;
  white-space: nowrap;
  text-shadow: 0 0.0625em 0.125em rgba(0, 0, 0, 0.35);
}

.asset-item .label .c-ffff { color: #fff; font-weight: 600; }

.asset-item .value {
  font-size: 1.05em;
  color: #e8f2ff;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}

/* 响应式：小屏提升可读性，增大行距与字号 */
@media (max-width: 1440px) {
  .asset-info { font-size: 1.1em; }
}
@media (max-width: 1024px) {
  .asset-info { font-size: 1.2em; }
  .asset-row { flex-direction: column; align-items: flex-start; gap: 0.5em; }
}

</style>


