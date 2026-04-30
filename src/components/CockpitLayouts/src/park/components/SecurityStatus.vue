<template>
  <div class="summary">
    <div class="header-line">
      <div class="icon-box">
        <img
          src="@/assets/components/SecurityStatus/SecurityStatus-runtimeDuration.png"
          alt="运行时长"
        />
      </div>
      <div class="content">
        <div class="label">运行时长</div>
        <div class="value">{{ formatRunTime(state.runTime) }}</div>
      </div>
    </div>

    <div class="stats">
      <div class="stat">
        <div class="icon-box">
          <img
            src="@/assets/components/SecurityStatus/SecurityStatus-monitoringStatus.png"
            alt="监控状态"
          />
        </div>
        <div class="content">
          <div class="label">监控状态</div>
          <div class="value strong" :class="getStatusClass(state.cameraStatus)">{{
            getStatusText(state.cameraStatus)
          }}</div>
        </div>
      </div>
      <div class="stat">
        <div class="icon-box">
          <img
            src="@/assets/components/SecurityStatus/SecurityStatus-electronicFence.png"
            alt="电子围栏状态"
          />
        </div>
        <div class="content">
          <div class="label">电子围栏状态</div>
          <div class="value" :class="getStatusClass(state.electronicFenceStatus)">{{
            getStatusText(state.electronicFenceStatus)
          }}</div>
        </div>
      </div>
      <div class="stat">
        <div class="icon-box">
          <img
            src="@/assets/components/SecurityStatus/SecurityStatus-NumberInvasions.png"
            alt="入侵次数"
          />
        </div>
        <div class="content">
          <div class="label">入侵次数</div>
          <div class="value">
            {{ formatNumber(state.invasionCount) }}<span class="unit"> 次</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { reactive, onMounted } from 'vue';
  import { useParkStore } from '@/store/modules/park';

  const parkStore = useParkStore();
  const state = reactive<any>({
    // 安防状态数据
    cameraStatus: '',
    electronicFenceStatus: '',
    invasionCount: 0,
    runTime: 0,
  });

  function formatNumber(n?: number) {
    if (n === undefined || n === null) return '—';
    return new Intl.NumberFormat('zh-CN').format(n);
  }

  function formatRunTime(seconds: number): string {
    if (!seconds) return '—';

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}小时${minutes}分钟`;
    } else {
      return `${minutes}分钟`;
    }
  }

  function getStatusText(status: string): string {
    return status === 'true' ? '正常' : '异常';
  }

  function getStatusClass(status: string): string {
    return status === 'true' ? 'status-normal' : 'status-error';
  }

  onMounted(() => {
    const securityData = parkStore.getSecurityStatus as any;
    // 从安防状态数据获取
    state.cameraStatus = securityData.cameraStatus || '';
    state.electronicFenceStatus = securityData.electronicFenceStatus || '';
    state.invasionCount = parseInt(securityData.invasionCount || '0');
    state.runTime = parseInt(securityData.runTime || '0');
  });
</script>

<style scoped lang="less">
  .summary {
    display: flex;
    flex-direction: column;
    height: 100%;
    color: #cfe8ff;
    gap: 0.5vw;

    .header-line {
      display: flex;
      align-items: center;
      padding: 0.5vw;
      border: 1px solid rgb(59 130 246 / 25%);
      border-radius: 8px;
      background: linear-gradient(90deg, rgb(17 66 122 / 25%), rgb(17 66 122 / 5%));
      gap: 0.5vw;

      .icon-box {
        width: 45px;
        height: 45px;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .content {
        flex: auto;

        .label {
          font-size: 16px;
        }

        .value {
          font-size: 18px;
          font-weight: 600;
        }
      }
    }
  }

  .stats {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);
    flex: auto;
    gap: 0.5vw;

    .stat {
      display: flex;
      align-items: center;
      height: 100%;
      padding: 0 0.5vw;
      border: 1px solid rgb(59 130 246 / 25%);
      border-radius: 8px;
      background: linear-gradient(90deg, rgb(17 66 122 / 18%), rgb(17 66 122 / 4%));
      gap: 0.5vw;

      .icon-box {
        width: 40px;
        height: 40px;
        border-radius: 6px;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .content {
        flex: auto;

        .label {
          color: #9cc6ff;
          font-size: 14px;
        }

        .value {
          color: #e8f2ff;
          font-size: 14px;
        }
      }
    }
  }

  .value.strong {
    font-weight: 600;
  }

  .unit {
    margin-left: 2px;
    color: #9cc6ff;
    font-size: 12px;
  }

  .sub {
    margin-top: 2px;
    color: #9cc6ff;
    font-size: 12px;
  }

  .status-normal {
    color: #10b981 !important;
  }

  .status-error {
    color: #ef4444 !important;
  }
</style>
