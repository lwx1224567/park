import { defineStore } from 'pinia';
import { store } from '@/store';

/**
 * 园区驾驶舱默认配置项
 */
export const parkDefaultOptions = {
  left: {
    layout: '3',
    row: 3,
    components: [
      {
        position: 1,
        column: '1/2',
        component: 'basic-info',
        componentLabel: '综合信息',
      },
      {
        position: 2,
        column: '2/3',
        component: 'dynamic-event',
        componentLabel: '动态事件',
      },
      {
        position: 3,
        column: '3/4',
        component: 'alarm-statistics',
        componentLabel: '告警统计',
      },
    ],
    timestamp: '2025-10-22T08:17:47.770Z',
  },
  right: {
    layout: '3',
    row: 3,
    components: [
      {
        position: 1,
        column: '1/2',
        component: 'alarm-ranking-top5',
        componentLabel: '告警排行榜TOP5',
      },
      {
        position: 2,
        column: '2/3',
        component: 'visitor-system',
        componentLabel: '访客记录',
      },
      {
        position: 3,
        column: '3/4',
        component: 'parking-space-info',
        componentLabel: '停车位信息',
      },
    ],
  },
};

/**
 * 机房驾驶舱默认配置项
 */
export const roomDefaultOptions = {
  left: {
    layout: '3',
    row: 3,
    components: [
      {
        position: 1,
        column: '1/2',
        component: 'comprehensive-info',
        componentLabel: '综合信息',
      },
      {
        position: 2,
        column: '2/4',
        component: 'device-list',
        componentLabel: '设备列表',
      },
    ],
  },
  right: {
    layout: '3',
    row: 3,
    components: [
      {
        position: 1,
        column: '1/2',
        component: 'environmental-monitoring',
        componentLabel: '环境监测',
      },
      {
        position: 2,
        column: '2/3',
        component: 'room-operations',
        componentLabel: '机房运维',
      },
      {
        position: 3,
        column: '3/4',
        component: 'distribution-details',
        componentLabel: '配电详情',
      },
    ],
  },
};

/**
 * 机柜驾驶舱默认配置项
 */
export const cabinetDefaultOptions = {
  left: {
    layout: '4',
    row: 3,
    components: [
      {
        position: 1,
        column: '1/2',
        component: 'basic-info',
        componentLabel: '综合信息',
      },
      {
        position: 2,
        column: '2/4',
        component: 'device-list',
        componentLabel: '设备列表',
      },
    ],
  },
  right: {
    layout: '1',
    row: 1,
    components: [
      {
        position: 1,
        column: '1/2',
        component: 'device-info',
        componentLabel: '设备信息',
      },
    ],
  },
};

/**
 * 机房运维驾驶舱配置项
 */
export const controlOptions = {
  left: {
    layout: '4',
    row: 3,
    components: [
      {
        position: 1,
        column: '1/2',
        component: 'basic-info',
        componentLabel: '综合信息',
      },
      {
        position: 2,
        column: '2/4',
        component: 'dynamic-event',
        componentLabel: '动态事件',
      },
    ],
  },
  right: {
    layout: '3',
    row: 3,
    components: [
      {
        position: 1,
        column: '1/2',
        component: 'alarm-statistics',
        componentLabel: '告警统计',
      },
      {
        position: 2,
        column: '2/3',
        component: 'alarm-ranking-top5',
        componentLabel: '告警排行榜TOP5',
      },
      {
        position: 3,
        column: '3/4',
        component: 'maintenance-statistics',
        componentLabel: '维保统计',
      },
    ],
  },
};

/**
 * 周界安防驾驶舱配置项
 */
export const securityOptions = {
  left: {
    layout: '3',
    row: 3,
    components: [
      {
        position: 1,
        column: '1/2',
        component: 'basic-info',
        componentLabel: '综合信息',
      },
      {
        position: 2,
        column: '2/3',
        component: 'security-status',
        componentLabel: '安防状态',
      },
      {
        position: 3,
        column: '3/4',
        component: 'video-surveillance',
        componentLabel: '监控画面',
      },
    ],
  },
  right: {
    layout: '3',
    row: 3,
    components: [
      {
        position: 1,
        column: '1/2',
        component: 'alarm-statistics',
        componentLabel: '告警统计',
      },
      {
        position: 2,
        column: '2/3',
        component: 'alarm-ranking-top5',
        componentLabel: '告警排行榜TOP5',
      },
      {
        position: 3,
        column: '3/4',
        component: 'maintenance-statistics',
        componentLabel: '维保统计',
      },
    ],
  },
};

/**
 * 访客系统驾驶舱配置项
 */
export const visitorOptions = {
  left: {
    layout: '3',
    row: 3,
    components: [
      {
        position: 1,
        column: '1/2',
        component: 'basic-info',
        componentLabel: '综合信息',
      },
      {
        position: 2,
        column: '2/3',
        component: 'visitor-system',
        componentLabel: '访客记录',
      },
      {
        position: 3,
        column: '3/4',
        component: 'video-surveillance',
        componentLabel: '监控画面',
      },
    ],
  },
  right: {
    layout: '3',
    row: 3,
    components: [
      {
        position: 1,
        column: '1/2',
        component: 'alarm-statistics',
        componentLabel: '告警统计',
      },
      {
        position: 2,
        column: '2/3',
        component: 'alarm-ranking-top5',
        componentLabel: '告警排行榜TOP5',
      },
      {
        position: 3,
        column: '3/4',
        component: 'maintenance-statistics',
        componentLabel: '维保统计',
      },
    ],
  },
};

/**
 * 停车系统驾驶舱配置项
 */
export const parkingOptions = {
  left: {
    layout: '3',
    row: 3,
    components: [
      {
        position: 1,
        column: '1/2',
        component: 'basic-info',
        componentLabel: '综合信息',
      },
      {
        position: 2,
        column: '2/3',
        component: 'parking-space-info',
        componentLabel: '停车位信息',
      },
      {
        position: 3,
        column: '3/4',
        component: 'video-surveillance',
        componentLabel: '监控画面',
      },
    ],
  },
  right: {
    layout: '3',
    row: 3,
    components: [
      {
        position: 1,
        column: '1/2',
        component: 'alarm-statistics',
        componentLabel: '告警统计',
      },
      {
        position: 2,
        column: '2/3',
        component: 'alarm-ranking-top5',
        componentLabel: '告警排行榜TOP5',
      },
      {
        position: 3,
        column: '3/4',
        component: 'maintenance-statistics',
        componentLabel: '维保统计',
      },
    ],
  },
};
/**
 * 园区设施驾驶舱配置项
 */
export const facilityOptions = {
  left: {
    layout: '3',
    row: 3,
    components: [
      {
        position: 1,
        column: '1/2',
        component: 'basic-info',
        componentLabel: '综合信息',
      },
      {
        position: 2,
        column: '2/3',
        component: 'energy-electricity',
        componentLabel: '用电-能耗分析',
      },
      {
        position: 3,
        column: '3/4',
        component: 'energy-water',
        componentLabel: '用水-能耗分析',
      },
    ],
  },
  right: {
    layout: '3',
    row: 3,
    components: [
      {
        position: 1,
        column: '1/2',
        component: 'energy-gas',
        componentLabel: '天然气-能耗分析',
      },
      {
        position: 2,
        column: '2/3',
        component: 'maintenance-statistics',
        componentLabel: '维保统计',
      },
      {
        position: 3,
        column: '3/4',
        component: 'video-surveillance',
        componentLabel: '监控画面',
      },
    ],
  },
};

/**
 * 基础配置项
 */
export const useBasicConfigStore = defineStore('basicConfig', {
  state: () => ({
    systemLayout: {
      operations: controlOptions,
      security: securityOptions,
      visitor: visitorOptions,
      parking: parkingOptions,
      park: facilityOptions,
    },
  }),
  getters: {
    // 获取驾驶舱系统布局
    getSystemLayout(state) {
      return state.systemLayout;
    },
  },
  actions: {},
  persist: true,
});

export function useBasicConfigStoreWithOut() {
  return useBasicConfigStore(store);
}
