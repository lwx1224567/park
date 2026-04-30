import { defineStore } from 'pinia';
import { store } from '@/store';
import {
  getParkDashboardComprehensive,
  getParkAlarmEventFlow,
  getParkAlarmPreview,
  getParkParkingSpaceInfo,
  getParkElectricTrend,
  getParkWaterTrend,
  getParkGasTrend,
  getParkVisitorStatistics,
  getParkVisitorTrends,
  getParkMaintenanceStatistics,
  getParkSecurityStatus,
} from '@/api/cockpit/parkManage';

/**
 * 园区驾驶舱数据状态管理
 */
export const useParkStore = defineStore('park', {
  state: () => ({
    //园区ID
    parkId: '1986382935426564098',
    //综合信息
    basicInfo: {},
    //动态事件
    dynamicEvent: [],
    //告警统计
    alarmStatistics: [],
    //告警排行榜TOP5
    alarmRankingTop5: [],
    //停车位信息
    parkingSpaceInfo: {},
    //用电-能耗分析
    electricTrend: {},
    //用水-能耗分析
    waterTrend: {},
    //天然气-能耗分析
    gasTrend: {},
    //访客系统统计
    visitorStatistics: {},
    //访客系统流量趋势
    visitorTrends: [],
    //维保系统统计
    maintenanceStatistics: {},
    //安防状态
    securityStatus: {},
  }),
  getters: {
    // 获取综合信息
    getBasicInfo(state) {
      return state.basicInfo;
    },
    // 获取动态事件
    getDynamicEvent(state) {
      return state.dynamicEvent;
    },
    // 获取告警统计
    getAlarmStatistics(state) {
      return state.alarmStatistics;
    },
    // 获取告警排行榜TOP5
    getAlarmRankingTop5(state) {
      return state.alarmRankingTop5;
    },
    // 获取停车位信息
    getParkingSpaceInfo(state) {
      return state.parkingSpaceInfo;
    },
    // 获取用电-能耗分析
    getElectricTrend(state) {
      return state.electricTrend;
    },
    // 获取用水-能耗分析
    getWaterTrend(state) {
      return state.waterTrend;
    },
    // 获取天然气-能耗分析
    getGasTrend(state) {
      return state.gasTrend;
    },
    // 获取访客系统统计
    getVisitorStatistics(state) {
      return state.visitorStatistics;
    },
    // 获取访客系统流量趋势
    getVisitorTrends(state) {
      return state.visitorTrends;
    },
    // 获取维保系统统计
    getMaintenanceStatistics(state) {
      return state.maintenanceStatistics;
    },
    // 获取安防状态
    getSecurityStatus(state) {
      return state.securityStatus;
    },
  },
  actions: {
    /**
     * 初始化获取数据
     */
    initData() {
      this.requestBasicInfo();
      this.requestDynamicEvent();
      this.requestAlarmEventOverview();
      this.requestParkingSpaceInfo();
      this.requestElectricTrend();
      this.requestWaterTrend();
      this.requestGasTrend();
      this.requestVisitorStatistics();
      this.requestVisitorTrends();
      this.requestMaintenanceStatistics();
      this.requestSecurityStatus();
    },
    /**
     * 获取园区基础信息
     */
    async requestBasicInfo() {
      const data = await getParkDashboardComprehensive(this.parkId);
      this.basicInfo = data;
    },
    /**
     * 获取动态事件
     */
    async requestDynamicEvent() {
      const data = await getParkAlarmEventFlow(this.parkId);
      this.dynamicEvent = data;
    },
    /**
     * 告警与事件总览
     */
    async requestAlarmEventOverview() {
      const data = await getParkAlarmPreview(this.parkId);
      this.alarmStatistics = data.alarmPreview;
      this.alarmRankingTop5 = data.alarmClassifyTop5;
    },
    /**
     * 获取停车位信息
     */
    async requestParkingSpaceInfo() {
      const data = await getParkParkingSpaceInfo(this.parkId);
      this.parkingSpaceInfo = data;
    },
    /**
     * 获取用电-能耗分析
     */
    async requestElectricTrend() {
      const data = await getParkElectricTrend(this.parkId);
      this.electricTrend = data;
    },
    /**
     * 获取用水-能耗分析
     */
    async requestWaterTrend() {
      const data = await getParkWaterTrend(this.parkId);
      this.waterTrend = data;
    },
    /**
     * 获取天然气-能耗分析
     */
    async requestGasTrend() {
      const data = await getParkGasTrend(this.parkId);
      this.gasTrend = data;
    },
    /**
     * 获取访客系统统计
     */
    async requestVisitorStatistics() {
      const data = await getParkVisitorStatistics(this.parkId);
      this.visitorStatistics = data;
    },
    /**
     * 获取访客系统流量趋势
     */
    async requestVisitorTrends() {
      const data = await getParkVisitorTrends(this.parkId);
      this.visitorTrends = data;
    },
    /**
     * 获取维保系统统计
     */
    async requestMaintenanceStatistics() {
      const data = await getParkMaintenanceStatistics(this.parkId);
      this.maintenanceStatistics = data;
    },
    /**
     * 获取安防状态
     */
    async requestSecurityStatus() {
      const data = await getParkSecurityStatus(this.parkId);
      this.securityStatus = data;
    },

  },
  persist: false,
});

export function useParkStoreWithOut() {
  return useParkStore(store);
}
