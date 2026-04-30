<template>
  <div class="summary">
    <div class="header-line">
      <span class="park">{{ state.cabinetName || '—' }}</span>
    </div>

    <div class="stats">
      <div class="stat">
        <div class="icon-box pu">
          <Icon :size="18" icon="mdi:thermometer" />
        </div>
        <div class="content">
          <div class="label">温度</div>
          <div class="value strong">{{ state.temperature ?? '—' }}<span class="unit">°C</span></div>
        </div>
      </div>
      <div class="stat">
        <div class="icon-box it">
          <Icon :size="18" icon="mdi:water-percent" />
        </div>
        <div class="content">
          <div class="label">湿度</div>
          <div class="value">{{ state.humidity ?? '—' }}<span class="unit">%</span></div>
        </div>
      </div>
      <div class="stat">
        <div class="icon-box energy">
          <Icon :size="18" icon="mdi:weight" />
        </div>
        <div class="content">
          <div class="label">载重</div>
          <div class="value">{{ state.load ?? '—' }}<span class="unit">KG</span></div>
        </div>
      </div>
      <div class="stat">
        <div class="icon-box room">
          <Icon :size="18" icon="mdi:cube-outline" />
        </div>
        <div class="content">
          <div class="label">空间利用率</div>
          <div class="value">{{ formatSpaceUtilization(state.space) }}<span class="unit">%</span></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { reactive, onMounted, watch } from 'vue';
  import Icon from '@/components/Icon/Icon.vue';
  import { getCabinetComprehensiveInformation } from '@/api/cockpit/cabinetManage';

  // 接收父组件传递的机柜ID
  const props = defineProps<{
    cabinetId: string;
  }>();

  const state = reactive({
    cabinetName: '',
    caretaker: '',
    temperature: undefined as string | undefined,
    humidity: undefined as string | undefined,
    load: undefined as string | undefined,
    space: undefined as string | undefined,
  });

  function formatNumber(n?: number) {
    if (n === undefined || n === null) return '—';
    return new Intl.NumberFormat('zh-CN').format(n);
  }

  function formatSpaceUtilization(space?: string) {
    if (space === undefined || space === null || space === '') return '—';
    const num = parseFloat(space);
    if (isNaN(num)) return '—';
    return Math.round(num * 100);
  }

  async function fetchData() {
    try {
      const json: any = await getCabinetComprehensiveInformation(props.cabinetId);
      // 兼容返回 { code,msg,data } 或直接返回 data 两种形式
      const d = (json && json.data !== undefined) ? json.data : (json || {});
      state.cabinetName = d?.cabinetInfo?.name || '';
      state.temperature = d?.temperature;
      state.humidity = d?.humidity;
      state.load = d?.load;
      state.space = d?.space;
    } catch (e) {
      // 静默处理错误
    }
  }

  onMounted(fetchData);

  // 监听机柜ID变化，刷新数据
  watch(
    () => props.cabinetId,
    () => {
      fetchData();
    }
  );
</script>

<style scoped lang="less">
  .summary {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 2px 6px;
    color: #cfe8ff;
    height: 100%;
  }

  .header-line {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 16px 10px;
    background: linear-gradient(90deg, rgba(17, 66, 122, 0.25), rgba(17, 66, 122, 0.05));
    border: 1px solid rgba(59, 130, 246, 0.25);
    border-radius: 8px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .header-line .park { font-size: 18px; font-weight: 700; color: #e8f2ff; letter-spacing: 0.2px; }
  .header-line .owner { font-size: 18px; font-weight: 700; color: #b6d4ff; margin-left: auto; }

  .stats {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);
    gap: 6px;
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
  .icon-box.pu { background: linear-gradient(135deg, #22c55e, #16a34a); }
  .icon-box.it { background: linear-gradient(135deg, #60a5fa, #3b82f6); }
  .icon-box.energy { background: linear-gradient(135deg, #fb923c, #f97316); }
  .icon-box.room { background: linear-gradient(135deg, #a78bfa, #8b5cf6); }

  .content { flex: 1; }
  .label { font-size: 14px; color: #9cc6ff; }
  .value { font-size: 18px; color: #e8f2ff; }
  .value.strong { font-weight: 600; }
  .unit { margin-left: 2px; font-size: 12px; color: #9cc6ff; }
  .sub { margin-top: 2px; font-size: 12px; color: #9cc6ff; }
</style>




