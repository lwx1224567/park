<template>
  <!-- 状态卡片容器：用于展示 CPU、内存圆形仪表盘以及温度进度条 -->
  <div class="status-card">
    <!-- 指标网格：用于并排显示两个圆形仪表盘（CPU 和内存） -->
    <div class="metric-grid">
      <!-- 遍历 circleMetrics 中的每一项（即 CPU 和内存），生成对应的圆形仪表盘容器 -->
      <div class="metric-item" v-for="item in circleMetrics" :key="item.key">
        <!-- 
          ref 绑定为 chartRefs（虽然此处未使用，但预留了引用能力）
          动态设置 id，格式为 `chart-${item.key}`，方便后续 ECharts 通过 id 获取容器
        -->
        <div ref="chartRefs" :id="`chart-${item.key}`" class="chart-container"></div>
      </div>
    </div>

    <!-- 温度水平进度条区域 -->
    <div class="temperature-section">
      <!-- 温度标签 -->
      <div class="temp-label">{{ temperatureItem.label }}</div>
      <!-- 进度条容器，包含 a-progress 组件和数值显示 -->
      <div class="temp-container">
        <!-- 
          Ant Design Vue 的进度条组件
          :percent 绑定为计算后的百分比值
          :stroke-color 动态设置进度条颜色
          :trail-color 背景轨道颜色（半透明蓝色）
          :show-info="false" 隐藏内置的百分比文本
          :height="16" 进度条高度
        -->
        <a-progress
          :percent="toPercent(temperatureItem)"
          :stroke-color="temperatureItem.strokeColor"
          :trail-color="'rgba(118, 162, 209, 0.16)'"
          :show-info="false"
          :height="16"
        />
        <!-- 自定义显示的温度数值和单位 -->
        <div class="temp-value"> {{ formatValue(temperatureItem) }}{{ temperatureItem.unit }} </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  // 引入 Vue 组合式 API 相关函数
  import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
  // 引入 ECharts 核心库
  import * as echarts from 'echarts';
  // 引入设备指标项的类型定义（假设类型文件位于 ../types）
  import type { DeviceMetricItem } from '../types';

  // ---------- 模拟数据生成函数 ----------
  // 返回初始的指标数据数组，包含 CPU、内存、温度三个项
  const mockMetrics = (): DeviceMetricItem[] => [
    {
      key: 'cpu',                // 唯一标识
      label: 'CPU 利用率',       // 显示标签
      value: 83,                 // 当前数值
      unit: '%',                 // 单位
      max: 100,                  // 最大值（用于计算百分比）
      strokeColor: '#f6d54a',    // 进度条/仪表盘颜色
    },
    {
      key: 'memory',
      label: '内存利用率',
      value: 93,
      unit: '%',
      max: 100,
      strokeColor: '#ff6f61',
    },
    {
      key: 'temperature',
      label: '温度',
      value: 42,
      unit: '°C',
      max: 100,
      strokeColor: '#1fe0ff',
    },
  ];

  // 响应式指标数据，初始值来自 mockMetrics
  const metrics = ref<DeviceMetricItem[]>(mockMetrics());
  
  // 定时器 ID，用于后续清除定时任务
  let timer = 0;
  
  // 模板中 ref="chartRefs" 的引用（此处为数组，但实际未使用，可忽略）
  const chartRefs = ref<HTMLElement[]>([]);
  
  // 存储已初始化的 ECharts 实例，方便后续更新和销毁
  const charts: echarts.ECharts[] = [];

  // ---------- 计算属性 ----------
  // 过滤出需要显示为圆形仪表盘的指标（排除温度项）
  const circleMetrics = computed(() => {
    return metrics.value.filter((item) => item.key !== 'temperature');
  });

  // 获取温度指标项（确保存在，使用非空断言）
  const temperatureItem = computed(() => {
    return metrics.value.find((item) => item.key === 'temperature')!;
  });

  // ---------- 数据更新逻辑 ----------
  // 根据指标类型生成下一次随机值（模拟实时数据变化）
  const nextValue = (item: DeviceMetricItem) => {
    if (item.key === 'temperature') {
      // 温度范围 34 ~ 52 °C
      return Math.round(Math.random() * 18 + 34);
    }
    if (item.key === 'cpu') {
      // CPU 利用率范围 72% ~ 92%
      return Math.round(Math.random() * 20 + 72);
    }
    // 内存利用率范围 78% ~ 96%
    return Math.round(Math.random() * 18 + 78);
  };

  // 刷新所有指标数据：更新 metrics 数组并重新绘制图表
  const refreshMetrics = () => {
    // 遍历每个指标，生成新的 value 值
    metrics.value = metrics.value.map((item) => ({
      ...item,
      value: nextValue(item),
    }));
    // 调用图表更新函数
    updateCharts();
  };

  // 计算百分比（用于 a-progress 组件），四舍五入取整
  const toPercent = (item: DeviceMetricItem) => {
    return Number(((item.value / item.max) * 100).toFixed(0));
  };

  // 格式化显示数值（取整数部分）
  const formatValue = (item: DeviceMetricItem) => {
    return `${Math.round(item.value)}`;
  };

  // ---------- ECharts 图表初始化与更新 ----------
  // 初始化所有圆形仪表盘图表
  const initCharts = () => {
    // 遍历 CPU 和内存指标项
    circleMetrics.value.forEach((item) => {
      // 根据动态生成的 id 获取 DOM 容器
      const chartDom = document.getElementById(`chart-${item.key}`);
      if (chartDom) {
        // 初始化 ECharts 实例并存入 charts 数组
        const chart = echarts.init(chartDom);
        charts.push(chart);
        // 立即更新图表配置
        updateChart(chart, item);
      }
    });
  };

  // 更新单个图表的配置（核心：四层 Gauge 叠加实现逆时针、刻度遮罩、文本显示）
  const updateChart = (chart: echarts.ECharts, item: DeviceMetricItem) => {
    // 当前指标数值（0-100）
    const gaugeValue = item.value;
    // 根据指标类型选择主题色
    const color = item.key === 'cpu' ? '#f6d54a' : '#ff6f61';
    
    // ECharts 配置对象
    const option = {
      // 全局动画时长（毫秒）
      animationDuration: 2000,
      // 数据更新时的缓动效果
      animationEasingUpdate: 'quinticInOut',
      // 系列列表（多层 Gauge 叠加）
      series: [
        // 第一层：底部灰色背景环（逆时针，无刻度）
        {
          type: 'gauge',
          clockwise: false,        // 逆时针方向绘制
          startAngle: 90,          // 起始角度：正上方（90°）
          endAngle: -270,          // 结束角度：逆时针绕一圈回到正上方（-270°）
          radius: '70%',           // 半径占容器宽/高较小者的 80%
          center: ['50%', '50%'],  // 圆心位置
          axisLine: {
            lineStyle: {
              width: 10,           // 圆环线宽
              color: [[1, '#424a57']] // 纯灰色背景，不随进度变化  #424a57
            }
          },
          // 以下所有辅助元素均隐藏，只保留纯色圆环
          axisTick: { show: false },
          splitLine: { show: false },
          axisLabel: { show: false },
          pointer: { show: false },
          detail: { show: false }
        },
        // 第二层：彩色进度环（逆时针，覆盖在背景环上）
        {
          name: 'colorGauge',
          type: 'gauge',
          clockwise: false,
          startAngle: 90,
          endAngle: -270,
          radius: '70%',
          center: ['50%', '50%'],
          axisLine: {
            lineStyle: {
              width: 12,
              color: [
                [gaugeValue / 100, color],   // 进度部分显示主题色
                [1, 'transparent']            // 剩余部分透明，露出第一层灰色背景
              ]
            }
          },
          // 隐藏所有辅助元素，仅显示彩色进度条
          axisTick: { show: false },
          splitLine: { show: false },
          axisLabel: { show: false },
          pointer: { show: false },
          detail: { show: false },
          data: [{ value: gaugeValue }]
        },
        // 第三层：刻度遮罩层（用于在彩色进度条上制造刻度缺口效果）
        {
          name: 'tickMask',
          type: 'gauge',
          clockwise: false,
          startAngle: 90,
          endAngle: -270,
          radius: '70%',
          center: ['50%', '50%'],
          min: 0,
          max: 100,
          axisLine: {
            lineStyle: {
              width: 12,
              color: [
                [gaugeValue / 100, 'transparent'], // 进度区域：透明，让彩色进度条显示出来
                [1, '#001535']                      // 未到达区域：使用深色背景色，与整体背景融合
              ]
            }
          },
          // 显示刻度线和分割线，模拟从彩色条上“挖去”一部分的效果
          axisTick: {
            show: true,
            splitNumber: 5,          // 刻度分段数量（每段间隔 20%）
            distance: -12,           // 刻度线向内延伸 20px
            length: 12,              // 刻度线长度
            lineStyle: {
              color: '#001535',      // 与背景色相同，形成镂空视觉
              width: 1
            }
          },
          splitLine: {
            show: true,
            distance: -12,
            length: 12,
            lineStyle: {
              color: '#001535',
              width: 1                // 分割线稍粗，增强分段感
            }
          },
          axisLabel: { show: false },
          pointer: { show: false },
          detail: { show: false },
          data: [{ value: gaugeValue }]
        },
        // 第四层：文本显示层（只负责显示中央的数值、单位和标题）
        {
          name: 'textGauge',
          type: 'gauge',
          clockwise: false,
          startAngle: 90,
          endAngle: -270,
          radius: '80%',
          center: ['50%', '50%'],
          // 隐藏所有圆环相关元素
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: { show: false },
          axisLabel: { show: false },
          pointer: { show: false },
          // 仅显示 detail 部分（中央文本）
          detail: {
            valueAnimation: true,   // 数值变化时启用动画
            offsetCenter: [0, '-5%'], // 微调垂直位置
            // 格式化显示内容：大数值 + 单位 + 换行 + 标题
            formatter: function (value: number) {
              return '{value|' + Math.round(value) + '}{unit|% \n}{title|' + item.label + '}';
            },
            // 富文本样式定义
            rich: {
              value: { fontSize: 18, fontWeight: 'bolder', color: '#fff' },
              unit: { fontSize: 10, color: '#fff', padding: [0, 0, -10, 5] },
              title: { fontSize: 10, color: '#fff', padding: [10, 0, 0, 0] }
            }
          },
          data: [{ value: gaugeValue }]
        }
      ]
    };

    // 应用配置到图表实例
    chart.setOption(option);
  };

  // 批量更新所有图表（当数据变化时调用）
  const updateCharts = () => {
    // 遍历 circleMetrics，同时获取索引，使用已存储的 charts 实例进行更新
    circleMetrics.value.forEach((item, index) => {
      if (charts[index]) {
        updateChart(charts[index], item);
      }
    });
  };

  // 浏览器窗口大小改变时，调用每个图表的 resize 方法以适应新尺寸
  const handleResize = () => {
    charts.forEach(chart => chart.resize());
  };

  // ---------- 生命周期钩子 ----------
  onMounted(() => {
    // 组件挂载后，初始化图表
    initCharts();
    // 启动定时器，每 5 秒刷新一次数据
    timer = window.setInterval(refreshMetrics, 5000);
    // 监听窗口 resize 事件
    window.addEventListener('resize', handleResize);
  });

  onBeforeUnmount(() => {
    // 组件卸载前，清除定时器
    window.clearInterval(timer);
    // 移除 resize 监听
    window.removeEventListener('resize', handleResize);
    // 销毁所有 ECharts 实例，释放资源
    charts.forEach(chart => chart.dispose());
  });
</script>

<style scoped>
  /* 状态卡片根容器：纵向弹性布局 */
  .status-card {
    display: flex;
    flex-direction: column;
    height: 100%;
    /*padding: 8px;*/
    box-sizing: border-box;
    overflow: hidden;
  }

  /* 网格布局：两列等宽，用于并排放置两个圆形仪表盘 */
  .metric-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
    flex: 0 0 auto;          /* 不伸缩，基于内容高度 */
    align-items: center;
    justify-items: center;
    /*padding: 5px 0;*/
  }

  /* 每个仪表盘项容器 */
  .metric-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0;
    /*padding: 10px 6px;*/
    width: 100%;
    height: 150px;           /* 固定高度，保证图表容器有足够空间 */
  }

  /* 图表容器填满父级 */
  .chart-container {
    width: 100%;
    height: 100%;
  }

  /* 温度进度条区域，向上移动减少与上方仪表盘的间距 */
  .temperature-section {
    padding: 4px 4px;
    margin-top: -24px;
  }

  /* 温度标签样式 */
  .temp-label {
    color: #d5f3ff;
    font-size: 13px;
    font-weight: 600;
    margin-bottom: 4px;
  }

  /* 温度进度条与数值的横向容器 */
  .temp-container {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  /* 使用深度选择器穿透 scoped，修改 ant-design-vue 进度条内部样式（此处未实际修改，仅预留） */
  .temp-container :deep(.ant-progress) {
    flex: 1;
  }

  /* 温度数值文本样式 */
  .temp-value {
    color: #ffffff;
    font-size: 16px;
    font-weight: 700;
    min-width: 10px;
    text-align: right;
  }
</style>