import { defineStore } from 'pinia';
import { store } from '@/store';
import {
  getCabinetDeviceList,
  getCabinetComprehensiveInformation,
  getDeviceComprehensiveInformation,
  getCabinetAlarmPreview,
  getCabinetRealTimeAlarm,
} from '@/api/cockpit/cabinetManage';
import { TKEvenBus } from '@/utils/TKThree/TKEvenBus';

/**
 * 机柜驾驶舱数据状态管理
 */
export const useCabinetStore = defineStore('cabinet', {
  state: () => ({
    //机柜ID
    cabinetId: '1984079776758837252',
    //设备ID
    deviceId: '1984079776821751809',
    //机柜综合信息数据
    cabinetComprehensiveInformationData: {},
    //设备列表数据
    deviceListData: [],
    //设备信息数据
    deviceInfoData: [],
    //机柜告警统计
    cabinetAlarmStatisticsData: [],
    //机柜事件总览数据
    cabinetEventPreviewData: [],
    //机柜实时告警数据
    cabinetRealTimeAlarmData: [],
  }),
  getters: {
    // 获取机柜综合信息数据
    getCabinetComprehensiveInformationData(state) {
      return state.cabinetComprehensiveInformationData;
    },
    // 获取设备列表数据
    getDeviceListData(state) {
      return state.deviceListData;
    },
    // 获取设备列表数据
    getDeviceInfoData(state) {
      return state.deviceInfoData;
    },
    // 获取机柜告警统计数据
    getCabinetAlarmStatisticsData(state) {
      return state.cabinetAlarmStatisticsData;
    },
    // 获取机柜事件总览数据
    getCabinetEventPreviewData(state) {
      return state.cabinetEventPreviewData;
    },
    // 获取机柜实时告警数据
    getCabinetRealTimeAlarmData(state) {
      return state.cabinetRealTimeAlarmData;
    },
  },
  actions: {
    /**
     * 初始化机柜数据
     */
    async initCabinetData(id) {
      await this.requestDeviceListData(id);
      await this.requestCabinetComprehensiveInformationData(id);
      await this.requestCabinetAlarmStatisticsData(id);
      await this.requestCabinetRealTimeAlarmData(id);
      TKEvenBus.getInstance().emit('toggleCockpit', 'cabinet');// 机柜驾驶舱视图
    },
    /**
     * 初始化设备数据
     */
    async initDeviceIdData(id) {
      await this.requestDeviceInfoData(id);
      TKEvenBus.getInstance().emit('toggleDeviceView', true);// 设备驾驶舱视图
    },
    /**
     * 获取机柜综合信息数据
     */
    async requestCabinetComprehensiveInformationData(id) {
      const data = await getCabinetComprehensiveInformation(id);
      this.cabinetComprehensiveInformationData = data || {};
    },
    /**
     * 获取设备列表数据
     */
    async requestDeviceListData(id) {
      const data = await getCabinetDeviceList(id);
      this.deviceListData = data || [];
    },
    /**
     * 获取设备信息数据
     */
    async requestDeviceInfoData(id) {
      const data = await getDeviceComprehensiveInformation(id);
      this.deviceInfoData = data || [];
    },
    /**
     * 获取告警与事件总览数据
     */
    async requestCabinetAlarmStatisticsData(id) {
      const data = await getCabinetAlarmPreview(id);
      this.cabinetAlarmStatisticsData = data.alarmPreview || [];
      this.cabinetEventPreviewData = data.alarmClassifyTop5 || [];
    },
    /**
     * 获取机柜实时告警数据
     */
    async requestCabinetRealTimeAlarmData(id) {
      const data = await getCabinetRealTimeAlarm(id);
      this.cabinetRealTimeAlarmData = data || [];
    },
  },
  persist: false,
});

export function useCabinetStoreWithOut() {
  return useCabinetStore(store);
}
