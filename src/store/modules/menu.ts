import { defineStore } from 'pinia';
import { store } from '@/store';

export const useMenuStore = defineStore('menu', {
  state: () => ({
    menuList: {
      admin: [
        { title: '资产管理', path: '/asset/index' },
        {
          title: '巡检管理',
          path: '/inspection',
          children: [
            { title: '巡检任务', path: '/inspection/task' },
            { title: '关联设备', path: '/inspection/device' },
          ],
        },
        { title: '告警管理', path: '/alarm' },
        { title: '场景配置', path: '/scene' },
      ],
      antiDrone: [
        {
          title: '资源设定',
          path: '/resource',
          children: [
            { title: '模型管理', path: '/resource/model' },
            { title: '特性管理', path: '/resource/ability' },
            { title: '资源组装', path: '/resource/entity' },
            { title: '资源特性配置', path: '/resource/featureConfig' },
            { title: '仿真列表', path: '/resource/simulation' },
            { title: '资源部署', path: '/resource/deploy' },
            // { title: '环境部署', path: '/resource/environment' },
          ],
        },
        {
          title: '事件设定',
          path: '/eventSetting',
          children: [
            { title: '事件配置', path: '/eventSetting/config' },
            { title: '事件管理', path: '/eventSetting/manage' },
            { title: '时间线', path: '/eventSetting/timeline' },
            { title: '事件关联', path: '/eventSetting/bindEntity' },
          ],
        },
        {
          title: '仿真推演',
          path: '/simulation',
          children: [
            { title: '仿真引擎核心', path: '/simulation/core' },
            { title: '物理型仿真', path: '/simulation/physics' },
            { title: '实时状态同步', path: '/simulation/realtime' },
            { title: '推演控制', path: '/simulation/control' },
          ],
        },
        {
          title: '分析评估',
          path: '/analysis',
          children: [
            { title: '数据回放', path: '/analysis/data' },
            { title: '数据分析', path: '/analysis/process' },
            { title: '统计与报告', path: '/analysis/statistics' },
            { title: '效能评估', path: '/analysis/evaluation' },
          ],
        },
        {
          title: '综合监控',
          path: '/unity',
          children: [],
        },
      ],
    },
    visitorMenu: [
      { title: '当日访客', path: '/visitor/list' },
      { title: '当日车辆', path: '/visitor/VisitorVehicleInformation' },
      { title: '历史审批', path: '/visitor/approval-history' },
      { title: '访客列表', path: '/visitor/application' },
    ],
  }),
  getters: {
    getMenuList(state) {
      return state.menuList;
    },
    // 访客菜单
    getVisitorMenu(state) {
      return state.visitorMenu;
    },
  },
  actions: {},
  persist: true,
});

export function useMenuStoreWithOut() {
  return useMenuStore(store);
}
