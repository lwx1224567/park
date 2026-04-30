import type { Router, RouteRecordRaw } from 'vue-router';

import { usePermissionStoreWithOut } from '@/store/modules/permission';

import { PAGE_NOT_FOUND_ROUTE } from '@/router/routes/basic';

import { RootRoute } from '@/router/routes';

const ROOT_PATH = RootRoute.path;

export function createPermissionGuard(router: Router) {
  const permissionStore = usePermissionStoreWithOut();
  router.beforeEach(async (to, from, next) => {
    // 动态路由加载（首次）
    if (!permissionStore.getIsDynamicAddedRoute) {
      const routes = await permissionStore.buildRoutesAction();
      [...routes, PAGE_NOT_FOUND_ROUTE].forEach((route) => {
        router.addRoute(route as unknown as RouteRecordRaw);
      });
      // 记录动态路由加载完成
      permissionStore.setDynamicAddedRoute(true);
      // 现在的to动态路由加载之前的，可能为PAGE_NOT_FOUND_ROUTE（例如，登陆后，刷新的时候）
      // 此处应当重定向到fullPath，否则会加载404页面内容
      next({ path: to.fullPath, replace: true, query: to.query });
      return;
    }
    // 正常访问
    next();
  });
}
