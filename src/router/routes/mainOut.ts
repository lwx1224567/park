import type { AppRouteModule } from '@/router/types';

//位于主框架外的路由
export const mainOutRoutes: AppRouteModule[] = [];

export const mainOutRouteNames = mainOutRoutes.map((item) => item.name);
