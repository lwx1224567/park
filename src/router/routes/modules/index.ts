import type { AppRouteModule } from '@/router/types';
import { LAYOUT } from '@/router/constant';

const smartPark: AppRouteModule = {
  path: '/',
  name: 'SmartPark',
  component: LAYOUT,
  props: () => ({
    showMenu: false,
    menuType: 'top',
    headPosition: 'fixed',
  }),
  redirect: '/park',
  meta: {
    orderNo: 1,
    icon: 'ion:grid-outline',
    title: '智慧园区',
    hideChildrenInMenu: true,
    keepAlive: true,
  },
  children: [
    // 第一个子路由
    {
      path: 'park',
      name: 'Park',
      component: () => import('@/views/park/index.vue'),
      meta: {
        title: '园区驾驶舱',
        keepAlive: true,
      },
    },  
    // 第二个子路由 
    {
      path: 'park/device-detail/:deviceId',
      name: 'DeviceDetail',
      component: () => import('@/views/deviceModel/index.vue'),
      meta: {
        title: '设备精模详情',
        hideMenu: true,
        keepAlive: false,
      },
    },
  ],
};

export default smartPark;