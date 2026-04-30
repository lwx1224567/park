<template>
  <div class="main-container">
    <div class="header-line">{{ viewData.roomInfo?.name || '—' }}</div>
    <div class="stats-container">
      <div class="stat">
        <div class="icon-box bg-[#4ade80]">
          <Icon :size="18" icon="mdi:chart-bell-curve" />
        </div>
        <div class="content">
          <div class="label">空间利用率</div>
          <div class="value strong"
            >{{ viewData.averageSpace * 100 || '—' }}<span class="unit"> %</span></div
          >
        </div>
      </div>
      <div class="stat">
        <div class="icon-box bg-[#60a5fa]">
          <Icon :size="18" icon="mdi:cpu-64-bit" />
        </div>
        <div class="content">
          <div class="label">湿度</div>
          <div class="value">{{ viewData.humidity || '—' }}<span class="unit"> %</span></div>
        </div>
      </div>
      <div class="stat">
        <div class="icon-box bg-[#fb923c]">
          <Icon :size="18" icon="mdi:flash" />
        </div>
        <div class="content">
          <div class="label">负载</div>
          <div class="value">{{ viewData.load || '—' }}<span class="unit"> kWh</span></div>
        </div>
      </div>
      <div class="stat">
        <div class="icon-box bg-[#a78bfa]">
          <Icon :size="18" icon="mdi:office-building" />
        </div>
        <div class="content">
          <div class="label">温度</div>
          <div class="value">{{ viewData.temperature || '—' }}<span class="unit"> °C</span></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { ref, onMounted, watch } from 'vue';
  import { getComprehensiveInformation } from '@/api/cockpit/roomManage';
  import Icon from '@/components/Icon/Icon.vue';
  const props = defineProps({
    id: {
      type: String,
      required: true,
      default: () => '',
    },
  });
  //监听id变化
  watch(
    () => props.id,
    (newId) => {
      if (newId) {
        getData();
      }
    },
  );
  const viewData = ref<any>({}); // 视图数据

  /**
   * @description: 获取数据
   */
  const getData = async () => {
    const res = await getComprehensiveInformation(props.id);
    viewData.value = res;
  };
  onMounted(() => {
    getData();
  });
</script>

<style scoped lang="less">
  .main-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 2px 6px;
    color: #cfe8ff;
    gap: 8px;

    .header-line {
      display: flex;
      align-items: center;
      padding: 16px 10px;
      overflow: hidden;
      border: 1px solid rgb(59 130 246 / 25%);
      border-radius: 8px;
      background: linear-gradient(90deg, rgb(17 66 122 / 25%), rgb(17 66 122 / 5%));
      font-size: 18px;
      font-weight: bold;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .stats-container {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-template-rows: repeat(2, 1fr);
      gap: 6px;
      flex: 1;

      .stat {
        display: flex;
        align-items: center;
        height: 100%;
        padding: 10px 12px;
        border: 1px solid rgb(59 130 246 / 25%);
        border-radius: 8px;
        background: linear-gradient(90deg, rgb(17 66 122 / 18%), rgb(17 66 122 / 4%));
        gap: 12px;

        .icon-box {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 6px;
          color: #fff;
        }

        .content {
          flex: 1;

          .label {
            color: #9cc6ff;
            font-size: 14px;
          }

          .value {
            color: #e8f2ff;
            font-size: 18px;

            .unit {
              margin-left: 2px;
              color: #9cc6ff;
              font-size: 12px;
            }
          }
        }
      }
    }
  }
</style>
