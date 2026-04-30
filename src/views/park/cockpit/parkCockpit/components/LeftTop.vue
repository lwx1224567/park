<template>
  <div class="summary">
    <div class="header-line">
      <span class="park">{{ state.parkName || '—' }}</span>
      <span class="owner">当值：{{ state.caretaker || '—' }}</span>
    </div>

    <div class="stats">
      <div class="stat">
        <div class="icon-box pu">
          <Icon :size="18" icon="mdi:chart-bell-curve" />
        </div>
        <div class="content">
          <div class="label">实时 PUE</div>
          <div class="value strong">{{ state.pue ?? '—' }}</div>
        </div>
      </div>
      <div class="stat">
        <div class="icon-box it">
          <Icon :size="18" icon="mdi:cpu-64-bit" />
        </div>
        <div class="content">
          <div class="label">当前 IT 负载</div>
          <div class="value">{{ formatNumber(state.itLoad) }}<span class="unit"> kW</span></div>
        </div>
      </div>
      <div class="stat">
        <div class="icon-box energy">
          <Icon :size="18" icon="mdi:flash" />
        </div>
        <div class="content">
          <div class="label">今日总能耗</div>
          <div class="value">{{ formatNumber(state.totalEnergy) }}<span class="unit"> kWh</span></div>
        </div>
      </div>
      <div class="stat">
        <div class="icon-box room">
          <Icon :size="18" icon="mdi:office-building" />
        </div>
        <div class="content">
          <div class="label">园区总机房数</div>
          <div class="value">{{ state.parkCount ?? '—' }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { reactive, onMounted } from 'vue';
  import Icon from '@/components/Icon/Icon.vue';
  import { getParkDashboardComprehensive } from '@/api/cockpit/parkManage';

  // 接收父组件传递的园区ID
  const props = defineProps<{
    parkId: string;
  }>();

  const state = reactive({
    parkName: '',
    caretaker: '',
    pue: undefined as number | string | undefined,
    itLoad: undefined as number | undefined,
    totalEnergy: undefined as number | undefined,
    parkCount: undefined as number | undefined,
  });

  function formatNumber(n?: number) {
    if (n === undefined || n === null) return '—';
    return new Intl.NumberFormat('zh-CN').format(n);
  }


  async function fetchData() {
    try {
      const json: any = await getParkDashboardComprehensive(props.parkId);
      // 兼容返回 { code,msg,data } 或直接返回 data 两种形式
      const d = (json && json.data !== undefined) ? json.data : (json || {});
      state.parkName = d?.park?.name || '';
      state.caretaker = d?.park?.caretaker || '';
      state.pue = d?.pue;
      state.itLoad = d?.itLoad;
      state.totalEnergy = d?.totalEnergy;
      state.parkCount = d?.parkCount;
    } catch (e) {
      // 保持占位，不再写死默认值
      state.parkName = '';
      state.caretaker = '';
      state.pue = undefined;
      state.itLoad = undefined;
      state.totalEnergy = undefined;
      state.parkCount = undefined;
    }
  }

  onMounted(fetchData);
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




