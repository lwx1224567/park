import { defHttp } from '@/utils/http/axios';

/**
 * Park cockpit APIs
 */

/**
 * @description: 园区-综合信息（大屏）
 */
export function getParkDashboardComprehensive(id: string) {
  return defHttp.get({ url: `/smartpark/park/dashboardComprehensive/${id}` });
}


/**
 * @description: 园区-能效管理（PUE趋势 + 分项能耗）
 */
export function getParkEnergyEfficiency(id: string) {
  return defHttp.get({ url: `/smartpark/park/energyEfficiency/${id}` });
}

/**
 * @description: 园区-动态事件滚动窗口
 */
export function getParkAlarmEventFlow(id: string) {
  return defHttp.get({ url: `/smartpark/park/alarmEventFlow/${id}` });
}

/**
 * @description: 园区-告警统计预览（级别分布 + TOP5 类型）
 */
export function getParkAlarmPreview(id: string) {
  return defHttp.get({ url: `/smartpark/park/alarmPreview/${id}` });
}

/**
 * @description: 停车位信息
 */
export function getParkParkingSpaceInfo(id: string) {
  return defHttp.get({ url: `/smartpark/park/parkingSystem/${id}` });
}

/**
 * @description: 用电-能耗分析
 */
export function getParkElectricTrend(id: string) {
  return defHttp.get({ url: `/smartpark/park/electricTrend/${id}` });
}

/**
 * @description: 用水-能耗分析
 */
export function getParkWaterTrend(id: string) {
  return defHttp.get({ url: `/smartpark/park/waterTrend/${id}` });
}

/**
 * @description: 天然气-能耗分析
 */
export function getParkGasTrend(id: string) {
  return defHttp.get({ url: `/smartpark/park/gasTrend/${id}` });
}

/**
 * @description: 访客系统统计
 */
export function getParkVisitorStatistics(id: string) {
  return defHttp.get({ url: `/smartpark/park/visitorStatistics/${id}` });
}

/**
 * @description: 访客系统流量趋势
 */
export function getParkVisitorTrends(id: string) {
  return defHttp.get({ url: `/smartpark/park/visitorTrends/${id}` });
}

/**
 * @description: 维保系统统计
 */
export function getParkMaintenanceStatistics(id: string) {
  return defHttp.get({ url: `/smartpark/park/maintenance/${id}` });
}

/**
 * @description: 安防状态
 */
export function getParkSecurityStatus(id: string) {
  return defHttp.get({ url: `/smartpark/park/securitySystem/${id}` });
}


