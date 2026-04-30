import type { AppRouteRecordRaw, Menu } from '@/router/types';
import { defineStore } from 'pinia';
import { store } from '@/store';
import { asyncRoutes } from '@/router/routes';
import { flatMultiLevelRoutes } from '@/router/helper/routeHelper';
import { transformRouteToMenu } from '@/router/helper/menuHelper';
import { filter } from '@/utils/helper/treeHelper';
import { duplicateRoutesChecker } from '@/router/helper/duplicateRoutes';

interface PermissionState {
  // Permission code list
  // 权限代码列表
  permCodeList: string[] | number[];
  // Whether the route has been dynamically added
  // 路由是否动态添加
  isDynamicAddedRoute: boolean;
  // To trigger a menu update
  // 触发菜单更新
  lastBuildMenuTime: number;
  // Backstage menu list
  // 菜单列表
  menuList: Menu[];
}

export const usePermissionStore = defineStore({
  id: 'app-permission',
  state: (): PermissionState => ({
    // 权限代码列表
    permCodeList: [],
    // Whether the route has been dynamically added
    // 路由是否动态添加
    isDynamicAddedRoute: false,
    // To trigger a menu update
    // 触发菜单更新
    lastBuildMenuTime: 0,
    // Backstage menu list
    // 菜单列表
    menuList: [],
  }),
  getters: {
    getIsDynamicAddedRoute(state): boolean {
      return state.isDynamicAddedRoute;
    },
    getMenuList(state): Menu[] {
      return state.menuList;
    },
  },
  actions: {
    setMenuList(list: Menu[]) {
      this.menuList = list;
    },
    setDynamicAddedRoute(added: boolean) {
      this.isDynamicAddedRoute = added;
    },
    async buildRoutesAction(): Promise<AppRouteRecordRaw[]> {
      let routes: AppRouteRecordRaw[] = [];

      // 不再进行角色权限过滤,直接使用所有路由
      const routeRemoveIgnoreFilter = (route: AppRouteRecordRaw) => {
        const { meta } = route;
        // ignoreRoute 为true 则路由仅用于菜单生成，不会在实际的路由表中出现
        const { ignoreRoute } = meta || {};
        // arr.filter 返回 true 表示该元素通过测试
        return !ignoreRoute;
      };

      // 直接使用所有异步路由
      routes = [...asyncRoutes];
      
      // 将路由转换成菜单
      const menuList = transformRouteToMenu(routes, true);
      // 对菜单进行排序
      menuList.sort((a, b) => {
        return (a.meta?.orderNo || 0) - (b.meta?.orderNo || 0);
      });
      // 设置菜单列表
      this.setMenuList(menuList);
      
      // 移除掉 ignoreRoute: true 的路由 非一级路由
      routes = filter(routes, routeRemoveIgnoreFilter);
      // 移除掉 ignoreRoute: true 的路由 一级路由；
      routes = routes.filter(routeRemoveIgnoreFilter);
      // 将多级路由转换为 2 级路由
      routes = flatMultiLevelRoutes(routes);
      // 检测是否存在重复的路由 给出提示
      duplicateRoutesChecker(routes);
      
      return routes;
    },
  },
});

// Need to be used outside the setup
// 需要在设置之外使用
export function usePermissionStoreWithOut() {
  return usePermissionStore(store);
}
