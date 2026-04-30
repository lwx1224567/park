<template>
  <div class="data-analysis">
    <div v-if="isServer" class="chart-container">
      <div class="chart-item">
        <div class="chart-title"></div>
        <div class="chart-content">
          <div ref="performanceChart" class="chart"></div>
        </div>
      </div>
      <div class="chart-item">
        <div class="chart-title"></div>
        <div class="chart-content">
          <div ref="progressChart" class="chart"></div>
        </div>
      </div>
    </div>
    <div v-else class="chart-container">
      <div class="chart-item">
        <div class="chart-title"></div>
        <div class="chart-content">
          <div ref="lineChart" class="chart"></div>
        </div>
      </div>
      <div class="chart-item">
        <div class="chart-title"></div>
        <div class="chart-content">
          <div ref="barLineChart" class="chart"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts';
import { ref, onMounted, onUnmounted, watch, nextTick, inject } from 'vue';
import { deviceModelContextKey } from '../types/index';

// 注入设备模型上下文
const context = inject(deviceModelContextKey);
const isServer = context?.isServer;


// DOM引用：用于挂载图表
const performanceChart = ref<HTMLElement | null>(null); // 左侧环形图
const progressChart = ref<HTMLElement | null>(null);    // 右侧进度条图
const lineChart = ref<HTMLElement | null>(null);        // 左侧曲线图
const barLineChart = ref<HTMLElement | null>(null);     // 右侧柱状+折线图

// 图表实例
let chartInstance: echarts.ECharts | null = null;
let progressChartInstance: echarts.ECharts | null = null;
let lineChartInstance: echarts.ECharts | null = null;
let barLineChartInstance: echarts.ECharts | null = null;

// 饼图数据
const pieData = [ 
  { value: 60, name: '数据1', itemStyle: { color: '#00ffa2' } }, 
  { value: 10, name: '数据2', itemStyle: { color: '#2b47ff' } }, 
  { value: 20, name: '数据3', itemStyle: { color: '#00e1ff' } }, 
  { value: 20, name: '数据4', itemStyle: { color: '#ffcc00' } } 
]; 

// 计算总值（用于中间显示）
const totalValue = pieData.reduce((sum, item) => sum + item.value, 0); 

// ================= 左侧环形图 =================
const initChart = () => {
  if (performanceChart.value) {
    chartInstance = echarts.init(performanceChart.value);

    const option = { 
      series: [ 
        // 1. 外部刻度盘 (Gauge)
        { 
          type: 'gauge', 
          center: ['50%', '50%'], 
          radius: '95%',       // 外圈半径
          startAngle: 90,      // 起始角度
          endAngle: -269.999,  // 结束角度（形成完整一圈）
          axisLine: { show: false }, // 不显示轴线
          pointer: { show: false },  // 不显示指针

          // 小刻度
          axisTick: { 
            distance: 0, 
            length: 6, 
            lineStyle: { color: '#1890FF', width: 2 } 
          }, 

          // 大刻度
          splitLine: { 
            distance: 0, 
            length: 8, 
            lineStyle: { color: '#1890FF', width: 3 } 
          }, 

          axisLabel: { show: false }, // 不显示刻度文字
          detail: { show: false },    // 不显示详情
          data: [{ value: 0 }] 
        }, 

        // 2. 环形图 (Pie)
        { 
          type: 'pie', 
          radius: ['50%', '65%'], // 内外半径，形成环形
          center: ['50%', '50%'], 
          avoidLabelOverlap: false, 

          // 图块样式
          itemStyle: { 
            borderRadius: 0, 
            borderColor: '#062757', // 分隔线颜色（背景色）
            borderWidth: 2 
          }, 

          // 高亮效果（鼠标移上去）
          emphasis:{
            scale: true, // 放大
            label:{
              show: true, // 显示标签
            },
            labelLine: {
              show: true  // 显示引导线
            }
          },

          // 标签显示
          label: { 
            show: true, 
            formatter: function(params) {
              // params.value：数值  params.name：名称
              return `{num|${params.value}}\n{name|${params.name}}`;
            },
            rich: {
              num: {
                color: 'auto',  // 使用图块颜色
                fontSize: 12,
                fontWeight: 'bold'
              },
              name: {
                color: '#fff',  // 名称白色
                fontSize: 12
              }
            },
            lineHeight: 20,
          }, 

          // 标签指引线
          labelLine: { 
            show: true, 
            length: 20,   // 第一段长度
            length2: 30,  // 第二段长度
            lineStyle: function(params) {
              return { color: params.color }; // 跟随图块颜色
            }
          }, 

          data: pieData 
        }, 

        // 3. 中间文字（用隐藏饼图实现）
        { 
          type: 'pie', 
          radius: [0, '50%'], 
          center: ['50%', '50%'], 
          silent: true, // 不响应鼠标事件

          label: { 
            show: true, 
            position: 'center', // 居中
            formatter: `{val|${totalValue}}\n{name|数据}`, 
            rich: { 
              val: { 
                color: '#ffcc00', // 数值颜色
                fontSize: 14, 
                fontWeight: 'bold', 
                padding: [5, 0] 
              }, 
              name: { 
                color: '#fff', 
                fontSize: 14 
              } 
            } 
          }, 

          data: [{ value: 1 }], 
          itemStyle: { color: 'transparent' } // 不显示图形
        } 
      ] 
    };

    chartInstance.setOption(option);
  }
};

// ================= 生命周期 =================
onMounted(() => {
  nextTick(() => {
    if (isServer?.value) {
      initChart();          // 初始化左图
      initProgressChart();  // 初始化右图
    } else {
      initLineChart();      // 初始化左侧曲线图
      initBarLineChart();   // 初始化右侧柱状+折线图
    }
    window.addEventListener('resize', handleResize); // 监听窗口变化
  });
});

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.dispose(); // 销毁图表
  }
  if (progressChartInstance) {
    progressChartInstance.dispose();
  }
  if (lineChartInstance) {
    lineChartInstance.dispose();
  }
  if (barLineChartInstance) {
    barLineChartInstance.dispose();
  }
  window.removeEventListener('resize', handleResize);
});

// ================= 右侧进度条图 =================
const initProgressChart = () => {
  if (progressChart.value) {
    progressChartInstance = echarts.init(progressChart.value);

    // 准备数据：数值 + 颜色配置
    const rawData = [
      { name: '数据展示', value: 60, color: ['rgba(249,215,28,0.8)', '#f9d71c'] },
      { name: '数据展示', value: 85, color: ['rgba(102,240,192,0.8)', '#66f0c0'] },
      { name: '数据展示', value: 60, color: ['rgba(249,215,28,0.8)', '#f9d71c'] },
      { name: '数据展示', value: 85, color: ['rgba(102,240,192,0.8)', '#66f0c0'] },
      { name: '数据展示', value: 60, color: ['rgba(249,215,28,0.8)', '#f9d71c'] },
      { name: '数据展示', value: 85, color: ['rgba(102,240,192,0.8)', '#66f0c0'] }
    ];

    const option = {
      grid: { left: '4%', right: '10%', top: '2%', bottom: '2%', containLabel: true },
      xAxis: { type: 'value', max: 100, show: false },
      yAxis: {
        type: 'category',
        data: rawData.map(item => item.name),
        inverse: true,
        axisTick: { show: false },
        axisLine: { show: false },
        axisLabel: { color: '#fff', fontSize: 13 }
      },
      series: [
        // 1. 背景条 (底色)
        {
          type: 'bar',
          barWidth: 4,
          silent: true,
          z: 1, // 较低层级
          itemStyle: { color: '#082d42', borderRadius: 4 },
          data: rawData.map(() => 100)
        },
        // 2. 锥形进度条 (Custom)
        {
          type: 'custom',
          z: 3, // 必须高于背景条
          renderItem: (params, api) => {
            const x0 = api.coord([0, params.dataIndex])[0];
            const x1 = api.coord([api.value(0), params.dataIndex])[0];
            const y = api.coord([0, params.dataIndex])[1];
            const colorCfg = rawData[params.dataIndex].color;

            return {
              type: 'polygon',
              shape: {
                points: [
                  [x0, y - 1], // 起点稍微窄一点
                  [x1, y - 2], // 终点宽一点
                  [x1, y + 2],
                  [x0, y + 1]
                ]
              },
              style: {
                fill: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                  { offset: 0, color: colorCfg[0] },
                  { offset: 1, color: colorCfg[1] }
                ]),
              }
            };
          },
          // 禁用鼠标悬浮时的缩放/变色效果，防止闪烁
          emphasis: { disabled: true },
          data: rawData.map(item => item.value)
        },
        // 3. 末端发光点
        {
          type: 'scatter',
          z: 4,
          silent: true,
          symbolSize: 16,
          data: rawData.map((item, index) => ({
            value: [item.value, index],
            itemStyle: {
              color: 'rgba(255, 255, 255, 0.2)',
              shadowBlur: 16,
              shadowColor: 'rgba(255, 255, 255, 0.4)'
            }
          }))
        },
           // 4. 末端发光点 - 内层彩色中心
          {
            type: 'scatter',
            z: 5, // 确保彩色中心点压在白晕上面
            silent: true,
            symbolSize: 8, 
            data: rawData.map((item, index) => ({
              value: [item.value, index],
              itemStyle: {
                color: item.color[1], // 保持你原来的彩色（黄色或青色）
                shadowBlur: 0,        // 内层不需要模糊，保持锐利
                opacity: 1
              }
            }))
          }
      ]
    };
    progressChartInstance.setOption(option);
  }
};

// ================= 左侧曲线图 =================
const initLineChart = () => {
  if (lineChart.value) {
    lineChartInstance = echarts.init(lineChart.value);

    const option = {
      // 图表背景色
      //backgroundColor: '#001c4d',
      // 提示框配置
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#001c4d',   // 提示框背景色
        borderColor: '#2c5780',       // 提示框边框
        borderWidth: 1,
        textStyle: {
          color: '#ffffff',
          fontSize: 12
        },
        axisPointer: {
          type: 'line',
          lineStyle: {
            color: 'rgba(255,255,255,0.3)',
            width: 1,
            type: 'dashed'
          }
        },
        // 默认情况下，ECharts 会自动生成与系列 itemStyle.color 一致的圆点
      },

      // 布局位置
      grid: {
        top: '20%',
        bottom: '5%',
        left: '5%',
        right: '5%',
        containLabel: true
      },

      // X轴
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['数据', '数据', '数据', '数据', '数据'],
        axisLine: {
          show:true,
          symbol: ['none', 'arrow'], // 只在末端显示箭头
          symbolSize: [4, 6], // 箭头大小
          symbolOffset: [0, 4], // 箭头位置微调 
          lineStyle: { color: '#6794b5' } 
        },
        axisTick: { show: false },
        axisLabel: { color: '#fff', fontSize: 12, margin: 15 }
       
      },

      // Y轴
      yAxis: {
        type: 'value',
        name: '(人)',
        nameTextStyle: { color: '#ffffff', padding: [0, 0, 0, -30] },
        min: 0,
        max: 1000,
        interval: 200,
        splitLine: {
          lineStyle: { color: '#163359', type: 'solid' }
        },
        axisLabel: { color: '#ffffff',fontSize: 12 },
        axisLine:{
          show:true,
          symbol: ['none', 'arrow'], // 只在末端显示箭头
          symbolSize: [4, 6], // 箭头大小
          symbolOffset: [0, 4], // 箭头位置微调 
          lineStyle: { color: '#6794b5' }
        }
      },

      // 数据系列
      series: [
        {
          name: '青绿数据',
          type: 'line',
          smooth: true,
          symbol: 'none',
          // 关键改进：在这里定义 itemStyle，提示框圆点会自动取这个颜色
          itemStyle: {
            color: '#00f2c3'
          },
          lineStyle: {
            width: 2
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(0, 242, 195, 0.5)' },
              { offset: 1, color: 'rgba(0, 242, 195, 0)' }
            ])
          },
          data: [450, 150, 1000, 550, 400]
        },
        {
          name: '蓝色数据',
          type: 'line',
          smooth: true,
          symbol: 'none',
          // 关键改进：提示框圆点会自动取这个颜色
          itemStyle: {
            color: '#007bff'
          },
          lineStyle: {
            width: 2
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(0, 123, 255, 0.4)' },
              { offset: 1, color: 'rgba(0, 123, 255, 0)' }
            ])
          },
          data: [450, 850, 600, 950, 550]
        }
      ]
    };

    lineChartInstance.setOption(option);
  }
};

// ================= 右侧柱状+折线图 =================
const initBarLineChart = () => {
  if (barLineChart.value) {
    barLineChartInstance = echarts.init(barLineChart.value);

    const option = {
      //backgroundColor: '#03122b', // 对应图中的深蓝色底色
      // 1. 添加标题作为单位显示
      title: {
        text: '单位：',
        textStyle: {
          color: '#82b1ff',
          fontSize: 12,
          fontWeight: 'normal'
        },
        top: '4%',
        left: '1%'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        backgroundColor: '#001c4d', // 这里是你要求的背景色
        borderColor: '#2c5780',
        textStyle: { color: '#fff',fontSize: 12 }
      },
      legend: {
        data: [
          { name: '数据1', itemStyle: { color: '#43eec6', fontSize: 12 } },
          { name: '数据2', itemStyle: { color: '#00aaff', fontSize: 12 } },
          { name: '占有率', itemStyle: { color: '#ff9c3e', fontSize: 12 } }
        ],
        textStyle: { color: '#82b1ff', fontSize: 12 },
        top: '0%',
        right: '0%',
        itemWidth: 15,   // 图标宽度（默认约25）
        itemHeight: 8,   // 图标高度（默认约14）
      },
      grid: {
        top: '20%',
        bottom: '5%',
        left: '5%',
        right: '5%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: ['数据', '数据', '数据', '数据', '数据'],
        axisLine: { lineStyle: { color: '#1a365d' } },
        axisTick: { show: false },
        axisLabel: { color: '#fff', fontSize: 12, margin: 15 }
      },
      yAxis: {
        type: 'value',
        max: 100, // 假设是百分比制，固定最大值让背景槽统一
        axisLabel: { show: false }, // 原图中左侧没显示具体数值，可按需开启
        splitLine: {
          lineStyle: {
            color: '#112a4b',
            type: 'solid'
          }
        },
        axisLine: { show: false }
      },
      series: [
        {
          name: '数据1',
          type: 'bar',
          barWidth: 12, // 柱子宽度
          barGap: '80%', // 两个柱子之间的间距（22*40%）
          showBackground: true, // 开启背景槽
          backgroundStyle: {
            color: 'rgba(255, 255, 255, 0.05)' // 极淡的白色透明度模拟深蓝色背景感
          },
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#43eec6' }, // 顶部亮青色
              { offset: 0.8, color: '#022a42' }  // 底部深蓝色
            ])
          },
          label: {
            show: true,
            position: 'top',
            color: '#fff',
            formatter: '{c}%',
            fontSize: 10
          },
          data: [72, 24, 29, 47, 24]
        },
        {
          name: '数据2',
          type: 'bar',
          barWidth: 14,
          showBackground: true,
          backgroundStyle: {
            color: 'rgba(255, 255, 255, 0.05)'
          },
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#00aaff' }, // 顶部亮蓝色
              { offset: 0.8, color: '#022a42' }  // 底部蓝紫色
            ])
          },
          label: {
            show: true,
            position: 'top',
            color: '#fff',
            formatter: '{c}%',
            fontSize: 10
          },
          data: [20, 37, 15, 20, 39]
        },
        {
          name: '占有率',
          type: 'line',
          symbol: 'circle',
          symbolSize: 6,
          smooth: false, // 原图是直线连接，如需平滑设为 true
          itemStyle: {
            color: '#ff9c3e', // 橙色圆点
            borderWidth: 1,
            borderColor: '#fff'
          },
          lineStyle: {
            width: 2,
            color: '#ff9c3e'
          },
          // 为了让折线位于两柱子中间，数据需对应类目
          data: [45, 40, 65, 45, 42]
        }
      ]
    };

    barLineChartInstance.setOption(option);
  }
};

// 窗口变化自适应
const handleResize = () => {
  if (isServer?.value) {
    if (chartInstance) {
      chartInstance.resize();
    }
    if (progressChartInstance) {
      progressChartInstance.resize();
    }
  } else {
    if (lineChartInstance) {
      lineChartInstance.resize();
    }
    if (barLineChartInstance) {
      barLineChartInstance.resize();
    }
  }
};
</script>

<style scoped lang="less">
  .data-analysis {
    width: 100%;
    height: 100%;
    padding: 16px;
    min-height: 240px; 
    /*box-sizing: border-box;*/
    
    .chart-container {
      display: flex;
      /*flex-direction: column;*/
      flex-direction: row;
      gap: 15px;
      height: 100%;
      
      .chart-item {
        flex: 1;
        border-radius: 4px;
        padding: 10px;
        
        .chart-title {
           display: none;
        }
        
        .chart-content {
          height: calc(100% - 24px);
          /*overflow: visible; */
           position: relative;
           top: -20px;  // 容器往上移动
           margin-bottom: -20px;  // 补偿下方空间，防止布局错乱
          
          .chart {
            width: 100%;
            height: 100%;
          }
          
          .chart-placeholder {
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, rgba(26, 58, 106, 0.3) 0%, rgba(0, 68, 170, 0.2) 100%);
            border-radius: 4px;
            position: relative;
            
            &::after {
              content: '图表区域';
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              color: rgba(0, 255, 255, 0.5);
              font-size: 12px;
            }
          }
        }
      }
    }
  }
</style>