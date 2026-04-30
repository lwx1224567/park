<template>
  <div class="item chart-wrap">
    <!-- 分项能耗 2x2 文字展示 -->
    <div class="meta-grid">
      <div class="meta-item" v-for="(it, i) in energyList" :key="i">
        <div class="icon-box" :class="`k${i}`">
          <Icon :size="12" :icon="iconFor(it.name)" />
        </div>
        <div class="content">
          <div class="label">{{ it.name || '—' }}</div>
          <div class="value">{{ it.percent }}<span class="unit">%</span></div>
        </div>
      </div>
    </div>
    <!-- PUE 趋势折线 -->
    <div ref="chartRef" class="chart"></div>
  </div>
  
</template>

<script setup lang="ts">
  import { onMounted, onUnmounted, ref, computed } from 'vue';
  import Icon from '@/components/Icon/Icon.vue';
  import { getParkEnergyEfficiency } from '@/api/cockpit/parkManage';

  // 接收父组件传递的园区ID
  const props = defineProps<{
    parkId: string;
  }>();

  // 尽量简单的 ECharts 实现：上方柱状图(能耗占比) + 下方折线图(PUE 24点趋势)
  const chartRef = ref<HTMLDivElement | null>(null);
  let chart: any;
  let echartsLib: any;
  const dataRef = ref<any>({ energyAndEfficiency: [], pueTrend: [] });
  let ro: ResizeObserver | null = null;


  async function fetchData() {
    try {
      const json: any = await getParkEnergyEfficiency(props.parkId);
      return (json && json.data !== undefined) ? json.data : (json || {});
    } catch (e) {
      return { pueTrend: [], energyAndEfficiency: [] };
    }
  }

  const energyList = computed(() => {
    const list = (dataRef.value?.energyAndEfficiency || []).slice(0, 4);
    return list.map((d: any) => ({ name: d.name, percent: Math.round((d.value || 0) * 100) }));
  });

  // 简单根据名称选图标
  function iconFor(name?: string) {
    if (!name) return 'mdi:chart-donut-variant';
    if (name.includes('IT')) return 'mdi:cpu-64-bit';
    if (name.includes('冷') || name.includes('制冷')) return 'mdi:snowflake';
    if (name.includes('照明') || name.includes('灯')) return 'mdi:lightbulb-on-outline';
    if (name.includes('办') || name.includes('办公')) return 'mdi:briefcase';
    return 'mdi:chart-donut-variant';
  }

  function buildOption(data: any) {
    const pue = data?.pueTrend || [];
    const hours = Array.from({ length: pue.length }, (_, i) => `${i}时`);

    return {
      backgroundColor: 'transparent',
      grid: [{ left: 12, right: 12, top: 30, bottom: 8, containLabel: true }],
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(6, 23, 55, 0.9)',
        borderColor: 'rgba(59, 130, 246, 0.35)',
        textStyle: { color: '#e8f2ff' },
        formatter: (params: any[]) => {
          const lines = params.map((p) => {
            const val = p.seriesName === 'PUE' ? p.value : `${p.value}%`;
            return `${p.marker} ${p.seriesName}：${val}`;
          });
          const name = params?.[0]?.axisValueLabel ?? '';
          return `${name}<br/>${lines.join('<br/>')}`;
        },
        axisPointer: {
          type: 'cross',
          crossStyle: { color: 'rgba(59,130,246,.35)' },
          lineStyle: { color: 'rgba(59,130,246,.35)' },
        },
      },
      legend: {
        top: 0,
        right: 12,
        textStyle: { color: '#cfe8ff' },
        data: ['PUE'],
        icon: 'circle',
        itemWidth: 10,
        itemHeight: 10,
      },
      xAxis: [{
        type: 'category',
        data: hours,
        axisLabel: { color: '#9cc6ff', interval: Math.ceil(hours.length / 6), hideOverlap: true, margin: 12 },
        axisLine: { lineStyle: { color: 'rgba(156,198,255,.3)' } },
      }],
      yAxis: [{
        type: 'value',
        name: 'PUE',
        nameTextStyle: { color: '#9cc6ff' },
        axisLabel: { color: '#9cc6ff' },
        splitLine: { lineStyle: { color: 'rgba(156,198,255,.12)' } },
        min: (val: any) => Math.max(0, Math.floor((val.min - 0.2) * 10) / 10),
        max: (val: any) => Math.ceil((val.max + 0.2) * 10) / 10,
      }],
      series: [{
        name: 'PUE',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 5,
        lineStyle: { color: '#f59e0b', width: 2 },
        itemStyle: { color: '#f59e0b' },
        areaStyle: {
          color: new echartsLib.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(245,158,11,0.35)' },
            { offset: 1, color: 'rgba(245,158,11,0.03)' },
          ]),
        },
        data: pue,
      }],
    };
  }

  async function initChart() {
    if (!chartRef.value) return;
    const mod: any = await import('echarts');
    echartsLib = mod?.default || mod;
    chart = echartsLib.init(chartRef.value);
    const data = await fetchData();
    dataRef.value = data || {};
    chart.setOption(buildOption(dataRef.value));
    // 初始渲染后延迟一次 resize，避免动画/布局导致的截断
    setTimeout(() => resize(), 120);
    window.addEventListener('resize', resize);
  }

  // 简单防抖，避免频繁触发
  let resizeTimer: number | undefined;
  function resize() {
    if (!chart) return;
    if (resizeTimer) window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => chart && chart.resize(), 60);
  }

  onMounted(async () => {
    await initChart();
    // 监听容器尺寸变化，使折线图自适应父容器
    if (chartRef.value && 'ResizeObserver' in window) {
      ro = new ResizeObserver(() => resize());
      ro.observe(chartRef.value);
    }
    window.addEventListener('orientationchange', resize);
  });
  onUnmounted(() => {
    window.removeEventListener('resize', resize);
    window.removeEventListener('orientationchange', resize);
    if (ro) {
      ro.disconnect();
      ro = null;
    }
    if (chart) chart.dispose();
  });
</script>
<style scoped lang="less">
  .chart-wrap {
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  .meta-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 4px;
    padding: 2px 8px 2px 8px;
    align-items: stretch;
  }
  .meta-item {
    display: grid;
    grid-template-columns: 32px 1fr;
    align-items: center;
    height: 44px;
    border: 1px solid rgba(59, 130, 246, 0.28);
    background: linear-gradient(180deg, rgba(17,66,122,0.25), rgba(17,66,122,0.08));
    border-radius: 8px;
    padding: 8px 10px;
    color: #e8f2ff;
    box-shadow: inset 0 0 0 1px rgba(255,255,255,0.04), 0 2px 8px rgba(0, 0, 0, 0.25);
    position: relative;
    overflow: hidden;
  }
  .meta-item::before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    height: 1px;
    background: linear-gradient(90deg, rgba(255,255,255,0.15), rgba(255,255,255,0));
    pointer-events: none;
  }
  .icon-box {
    width: 28px; height: 28px; border-radius: 6px; display: flex; align-items: center; justify-content: center; color: #fff;
    background: linear-gradient(135deg, #60a5fa, #3b82f6);
  }
  .icon-box.k1 { background: linear-gradient(135deg, #22c55e, #16a34a); }
  .icon-box.k2 { background: linear-gradient(135deg, #f59e0b, #d97706); }
  .icon-box.k3 { background: linear-gradient(135deg, #a78bfa, #8b5cf6); }
  .icon-box.k0 { background: linear-gradient(135deg, #60a5fa, #3b82f6); }
  .content { display: flex; align-items: center; justify-content: space-between; gap: 6px; width: 100%; }
  .label { font-size: 13px; color: #e2f1ff; letter-spacing: 0.2px; text-shadow: 0 1px 2px rgba(0,0,0,.2); }
  .value { font-size: 18px; font-weight: 800; line-height: 1; color: #ffffff; min-width: 48px; text-align: right; text-shadow: 0 1px 2px rgba(0,0,0,.2); }
  .unit { margin-left: 2px; font-size: 12px; color: #9cc6ff; }
  .chart {
    flex: 1;
  }
</style>


