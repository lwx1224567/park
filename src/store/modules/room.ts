import { defineStore } from 'pinia';
import { store } from '@/store';
import {
  getComprehensiveInformation,
  getEnvironmentMonitoring,
  getPowerDistribution,
  getRoomOperation,
  getDeviceList,
  getDataAnalysis,
  getAlarmEventFlow,
  getAlarmPreview,
} from '@/api/cockpit/roomManage';
import { TKEvenBus } from '@/utils/TKThree/TKEvenBus';

/**
 * 机房驾驶舱数据状态管理
 */
export const useRoomStore = defineStore('room', {
  state: () => ({
    //机房ID
    roomId: '1984079776758837251',
    //环境监测数据
    environmentData: {},
    //配电详情数据
    pistributionDetailData: {},
    //机房运维数据
    roomOperationData: {},
    //实时告警数据
    alarmData: [],
    //告警统计数据
    alarmStatisticsData: [],
    //事件总览数据
    eventPreviewData: [],
    //设备列表数据
    deviceListData: [],
    //综合信息数据
    comprehensiveInformationData: {},
    //数据分析数据
    dataAnalysisData: {},
  }),
  getters: {
    // 获取机房环境数据
    getEnvironmentData(state) {
      return state.environmentData;
    },
    // 获取配电详情数据
    getPistributionDetailData(state) {
      return state.pistributionDetailData;
    },
    // 获取机房运维数据
    getRoomOperationData(state) {
      return state.roomOperationData;
    },
    //获取实时告警数据
    getAlarmData(state) {
      return state.alarmData;
    },
    // 获取告警
    getAlarmStatisticsData(state) {
      return state.alarmStatisticsData;
    },
    // 获取事件总览数据
    getEventPreviewData(state) {
      return state.eventPreviewData;
    },
    // 获取设备列表数据
    getDeviceListData(state) {
      return state.deviceListData;
    },
    // 获取综合信息数据
    getComprehensiveInformationData(state) {
      return state.comprehensiveInformationData;
    },
    // 获取数据分析数据
    getDataAnalysisData(state) {
      return state.dataAnalysisData;
    },
  },
  actions: {
    /**
     * 初始化获取数据
     */
    async initData(id) {
      TKEvenBus.getInstance().emit('toggleCockpit', 'room');
      await this.requestEnvironmentData(id);
      await this.requestPistributionDetailData(id);
      await this.requestRoomOperationData(id);
      await this.requestDeviceListData(id);
      await this.requestComprehensiveInformationData(id);
      await this.requestDataAnalysisData(id);
      await this.requestAlarmData(id);
      await this.requestAlarmPreviewData(id);
    },
    /**
     * 获取机房环境数据
     */
    async requestEnvironmentData(id) {
      const data = await getEnvironmentMonitoring(id);
      this.environmentData = data;
    },
    /**
     * 获取配电详情数据
     */
    async requestPistributionDetailData(id) {
      const data = await getPowerDistribution(id);
      this.pistributionDetailData = data;
    },
    /**
     * 获取机房运维数据
     */
    async requestRoomOperationData(id) {
      const data = await getRoomOperation(id);
      this.roomOperationData = data;
    },
    /**
     * 获取实时告警数据
     */
    async requestAlarmData(id) {
      const data = await getAlarmEventFlow(id);
      this.alarmData = data;
    },
    /**
     * 告警与事件总览
     */
    async requestAlarmPreviewData(id) {
      const data = await getAlarmPreview(id);
      this.alarmStatisticsData = data.alarmPreview;
      this.eventPreviewData = data.alarmClassifyTop5;
    },
    /**
     * 获取设备列表数据
     */
    async requestDeviceListData(id) {
      const data = await getDeviceList(id);
      this.deviceListData = data || [];
    },
    /**
     * 获取综合信息数据
     */
    async requestComprehensiveInformationData(id) {
      const data = await getComprehensiveInformation(id);
      this.comprehensiveInformationData = data || {};
    },
    /**
     * 获取数据分析数据
     */
    async requestDataAnalysisData(id) {
      const data = await getDataAnalysis(id);
      this.dataAnalysisData = data || {};
    },
  },
  persist: false,
});

export function useRoomStoreWithOut() {
  return useRoomStore(store);
}
