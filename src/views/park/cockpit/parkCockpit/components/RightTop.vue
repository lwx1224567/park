<template>
  <div class="security-status">
    <!-- 系统状态区域 -->
    <div class="status-section">
      <div class="status-item">
        <div class="status-left">
          <div class="status-label">门禁系统</div>
          <div class="status-indicator" :class="accessControlStatus">
            {{ accessControlText }}
          </div>
        </div>
        <div class="status-divider"></div>
        <div class="status-right">
          <div class="status-label">电子围栏</div>
          <div class="status-indicator" :class="fenceStatus">
            {{ fenceText }}
          </div>
        </div>
      </div>
    </div>

    <!-- 数据统计四宫格 -->
    <div class="stats-grid">
      <div class="stat">
        <div class="icon-box personnel">
          <Icon :size="18" icon="mdi:account-group" />
        </div>
        <div class="content">
          <div class="label">进驻人员数</div>
          <div class="value">{{ state.personnelCount }}</div>
        </div>
      </div>
      <div class="stat">
        <div class="icon-box access">
          <Icon :size="18" icon="mdi:door-open" />
        </div>
        <div class="content">
          <div class="label">门禁告警</div>
          <div class="value">{{ state.accessAlarms }}</div>
        </div>
      </div>
      <div class="stat">
        <div class="icon-box fence">
          <Icon :size="18" icon="mdi:fence" />
        </div>
        <div class="content">
          <div class="label">电子围栏告警</div>
          <div class="value">{{ state.fenceAlarms }}</div>
        </div>
      </div>
      <div class="stat">
        <div class="icon-box abnormal">
          <Icon :size="18" icon="mdi:alert-circle" />
        </div>
        <div class="content">
          <div class="label">异常告警</div>
          <div class="value">{{ state.abnormalAlarms }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, onMounted } from 'vue';
import Icon from '@/components/Icon/Icon.vue';
import { getParkSecurityStatus } from '@/api/cockpit/parkManage';

// 接收父组件传递的园区ID
const props = defineProps<{
  parkId: string;
}>();

const state = reactive({
  // 系统状态
  accessControlOnline: true,
  fenceOnline: true,
  // 统计数据
  personnelCount: 0,
  accessAlarms: 0,
  fenceAlarms: 0,
  abnormalAlarms: 0,
});

// 门禁系统状态
const accessControlStatus = computed(() => state.accessControlOnline ? 'online' : 'offline');
const accessControlText = computed(() => state.accessControlOnline ? '正常运行' : '系统异常');

// 电子围栏状态
const fenceStatus = computed(() => state.fenceOnline ? 'online' : 'offline');
const fenceText = computed(() => state.fenceOnline ? '正常运行' : '系统异常');

// 获取安防数据
async function fetchSecurityData() {
  try {
    const json: any = await getParkSecurityStatus(props.parkId);
    const data = (json && json.data !== undefined) ? json.data : (json || {});
    // 将接口字段映射到现有状态
    state.accessControlOnline = (data.doorStatus || '').includes('正常');
    state.fenceOnline = (data.electronicFenceStatus || '').includes('正常');
    state.personnelCount = data.enterCount ?? 0;
    state.accessAlarms = data.doorAlarmCount ?? 0;
    state.fenceAlarms = data.electronicFenceCount ?? 0;
    state.abnormalAlarms = data.abnormalAlarm ?? 0;
  } catch (e) {
    // 失败时置零/离线，不写死展示值
    state.accessControlOnline = false;
    state.fenceOnline = false;
    state.personnelCount = 0;
    state.accessAlarms = 0;
    state.fenceAlarms = 0;
    state.abnormalAlarms = 0;
  }
}

onMounted(() => {
  fetchSecurityData();
  // 每30秒更新一次数据
  setInterval(fetchSecurityData, 30000);
});
</script>

<style scoped lang="less">
.security-status {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 2px 6px;
  height: 100%;
  color: #cfe8ff;
}

.status-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.status-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  background: linear-gradient(90deg, rgba(17, 66, 122, 0.25), rgba(17, 66, 122, 0.05));
  border: 1px solid rgba(59, 130, 246, 0.25);
  border-radius: 8px;
  position: relative;
}

.status-left,
.status-right {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  text-align: center;
}

.status-divider {
  width: 1px;
  height: 40px;
  background: linear-gradient(180deg, transparent, rgba(59, 130, 246, 0.4), transparent);
  margin: 0 16px;
}

.status-label {
  font-size: 16px;
  font-weight: 500;
  color: #e8f2ff;
  margin-bottom: 8px;
}

.status-indicator {
  padding: 4px 10px;
  border-radius: 14px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid;
}

.status-indicator.online {
  color: #22c55e;
  border-color: #22c55e;
  background: rgba(34, 197, 94, 0.1);
}

.status-indicator.offline {
  color: #ef4444;
  border-color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 12px;
  flex: 1;
  min-height: 0;
}

.stat {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border: 1px solid rgba(59, 130, 246, 0.25);
  border-radius: 8px;
  background: linear-gradient(90deg, rgba(17, 66, 122, 0.18), rgba(17, 66, 122, 0.04));
  height: 100%;
}

.icon-box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  color: #fff;
}

.icon-box.personnel { background: linear-gradient(135deg, #60a5fa, #3b82f6); }
.icon-box.access { background: linear-gradient(135deg, #22c55e, #16a34a); }
.icon-box.fence { background: linear-gradient(135deg, #f59e0b, #d97706); }
.icon-box.abnormal { background: linear-gradient(135deg, #ef4444, #dc2626); }

.content { flex: 1; }
.label { font-size: 14px; color: #9cc6ff; }
.value { font-size: 18px; color: #e8f2ff; font-weight: 600; }
</style>


