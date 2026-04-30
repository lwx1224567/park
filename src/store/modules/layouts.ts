import { defineStore } from 'pinia';
import { store } from '@/store';
import {
  parkDefaultOptions,
  roomDefaultOptions,
  cabinetDefaultOptions,
} from '@/store/modules/basicConfig';

// 页面选项配置
export const pageOptions = [
  { label: '园区', value: 'park' },
  { label: '机房', value: 'room' },
  { label: '机柜', value: 'cabinet' },
];

// 布局选项配置
export const layoutOptions = [
  {
    label: '布局1',
    value: '1',
    preview: '/src/assets/images/layouts/layout-1.png',
    row: 1,
    columns: ['1/2'],
  },
  {
    label: '布局2',
    value: '2',
    preview: '/src/assets/images/layouts/layout-2.png',
    row: 2,
    columns: ['1/2', '2/3'],
  },
  {
    label: '布局3',
    value: '3',
    preview: '/src/assets/images/layouts/layout-3.png',
    row: 3,
    columns: ['1/2', '2/3', '3/4'],
  },
  {
    label: '布局4',
    value: '4',
    preview: '/src/assets/images/layouts/layout-4.png',
    row: 3,
    columns: ['1/2', '2/4'],
  },
  {
    label: '布局5',
    value: '5',
    preview: '/src/assets/images/layouts/layout-5.png',
    row: 3,
    columns: ['1/3', '3/4'],
  },
];

// 组件选项配置 - 根据页面类型区分
export const componentOptions = {
  // 园区页面组件
  park: [
    {
      label: '综合信息',
      value: 'basic-info',
      image: '/src/assets/components/ComponentEffect/基本信息.png',
    },
    {
      label: '动态事件',
      value: 'dynamic-event',
      image: '/src/assets/components/ComponentEffect/动态事件.png',
    },
    {
      label: '告警统计',
      value: 'alarm-statistics',
      image: '/src/assets/components/ComponentEffect/告警统计.png',
    },
    {
      label: '告警排行榜TOP5',
      value: 'alarm-ranking-top5',
      image: '/src/assets/components/ComponentEffect/告警排行TOP5.png',
    },
    {
      label: '停车位信息',
      value: 'parking-space-info',
      image: '/src/assets/components/ComponentEffect/停车位信息.png',
    },
    {
      label: '安防状态',
      value: 'security-status',
      image: '/src/assets/components/ComponentEffect/安防状态.png',
    },
    {
      label: '监控画面',
      value: 'video-surveillance',
      image: '/src/assets/components/ComponentEffect/视频画面.png',
    },
    {
      label: '用电-能耗分析',
      value: 'energy-electricity',
      image: '/src/assets/components/ComponentEffect/用电-能耗分析.png',
    },
    {
      label: '用水-能耗分析',
      value: 'energy-water',
      image: '/src/assets/components/ComponentEffect/用水-能耗分析.png',
    },
    {
      label: '天然气-能耗分析',
      value: 'energy-gas',
      image: '/src/assets/components/ComponentEffect/天然气-能耗分析.png',
    },
    {
      label: '访客记录',
      value: 'visitor-system',
      image: '/src/assets/components/ComponentEffect/访客记录.png',
    },
    {
      label: '维保统计',
      value: 'maintenance-statistics',
      image: '/src/assets/components/ComponentEffect/维保统计.png',
    },
  ],
  // 机房页面组件
  room: [
    {
      label: '环境监测',
      value: 'environmental-monitoring',
      image: '/src/assets/images/components/room-info.png',
    },
    {
      label: '机房运维',
      value: 'room-operations',
      image: '/src/assets/images/components/device-monitor.png',
    },
    {
      label: '配电详情',
      value: 'distribution-details',
      image: '/src/assets/images/components/environment-monitor.png',
    },
    {
      label: '实时告警',
      value: 'real-time-alerts',
      image: '/src/assets/images/components/environment-monitor.png',
    },
    {
      label: '告警统计',
      value: 'alarm-statistics',
      image: '/src/assets/images/components/environment-monitor.png',
    },
    {
      label: '事件总览',
      value: 'event-overview',
      image: '/src/assets/images/components/environment-monitor.png',
    },
    {
      label: '综合信息',
      value: 'comprehensive-info',
      image: '/src/assets/images/components/power-monitor.png',
    },
    {
      label: '设备列表',
      value: 'device-list',
      image: '/src/assets/images/components/network-monitor.png',
    },
    {
      label: '监控画面',
      value: 'video-surveillance',
      image: '/src/assets/images/components/network-monitor.png',
    },
    {
      label: '数据分析',
      value: 'data-analysis',
      image: '/src/assets/images/components/network-monitor.png',
    },
  ],
  // 机柜页面组件
  cabinet: [
    {
      label: '机柜信息',
      value: 'basic-info',
      image: '/src/assets/images/components/cabinet-info.png',
    },
    {
      label: '设备列表',
      value: 'device-list',
      image: '/src/assets/images/components/device-list.png',
    },
    {
      label: '告警统计',
      value: 'alarm-statistics',
      image: '/src/assets/images/components/device-list.png',
    },
    {
      label: '事件总览',
      value: 'event-overview',
      image: '/src/assets/images/components/device-list.png',
    },
    {
      label: '实时告警',
      value: 'real-time-alerts',
      image: '/src/assets/images/components/device-list.png',
    },
    {
      label: '设备信息',
      value: 'device-info',
      image: '/src/assets/images/components/device-list.png',
    },
  ],
};

/**
 * 驾驶舱布局状态管理
 */
export const useLayoutsStore = defineStore('layouts', {
  state: () => ({
    //园区布局配置
    parkConfig: parkDefaultOptions,
    //机房布局配置
    roomConfig: roomDefaultOptions,
    //设备布局配置
    cabinetConfig: cabinetDefaultOptions,
    //保存园区上一次布局配置
    parkConfigPrev: {},
  }),
  getters: {
    /**
     * 获取园区上一次布局配置
     */
    getParkConfigPrev(state) {
      return state.parkConfigPrev;
    },
    /**
     * 获取园区布局配置
     */
    getParkConfig(state) {
      return state.parkConfig;
    },
    /**
     * 获取机房布局配置
     */
    getRoomConfig(state) {
      return state.roomConfig;
    },
    /**
     * 获取设备布局配置
     */
    getCabinetConfig(state) {
      return state.cabinetConfig;
    },
    /**
     * 根据页面类型获取组件选项
     */
    getComponentOptionsByPage: () => (pageType: string) => {
      return componentOptions[pageType as keyof typeof componentOptions] || componentOptions.park;
    },
    /**
     * 根据布局值获取布局配置
     */
    getLayoutConfigByValue: () => (layoutValue: string) => {
      return layoutOptions.find((layout) => layout.value === layoutValue) || layoutOptions[0];
    },
    /**
     * 根据组件值获取组件信息
     */
    getComponentInfoByValue: () => (componentValue: string, pageType: string) => {
      const pageComponents =
        componentOptions[pageType as keyof typeof componentOptions] || componentOptions.park;
      return (
        pageComponents.find((component) => component.value === componentValue) || {
          label: '请选择组件',
          image: undefined,
        }
      );
    },
  },
  actions: {
    /**
     * 设置园区布局配置
     */
    setParkConfig(config) {
      this.parkConfig = config;
    },
    /**
     * 获取设备布局配置
     */
    setRoomConfig(config) {
      this.roomConfig = config;
    },
    /**
     * 获取设备布局配置
     */
    setCabinetConfig(config) {
      this.cabinetConfig = config;
    },
    /**
     * 保存园区上一次的布局配置
     */
    saveParkConfigPrev() {
      this.parkConfigPrev = this.parkConfig;
    },
  },
  persist: true,
});

export function useLayoutsStoreWithOut() {
  return useLayoutsStore(store);
}
