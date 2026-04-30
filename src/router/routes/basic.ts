import type { AppRouteRecordRaw } from '@/router/types';
import { REDIRECT_NAME, LAYOUT, PAGE_NOT_FOUND_NAME } from '@/router/constant';

// 404页面
export const PAGE_NOT_FOUND_ROUTE: AppRouteRecordRaw = {
  path: '/:path(.*)*',
  name: PAGE_NOT_FOUND_NAME,
  component: () => import('@/views/sys/error/index.vue'),
  meta: {
    title: 'ErrorPage',
    hideBreadcrumb: true,
    hideMenu: true,
  },
  // children: [
  //   {
  //     path: '/:path(.*)*',
  //     name: PAGE_NOT_FOUND_NAME,
  //     component: () => import('@/views/sys/error/index.vue'),
  //     meta: {
  //       title: 'ErrorPage',
  //       hideBreadcrumb: true,
  //       hideMenu: true,
  //     },
  //   },
  // ],
};

export const REDIRECT_ROUTE: AppRouteRecordRaw = {
  path: '/redirect',
  component: LAYOUT,
  name: 'RedirectTo',
  meta: {
    title: REDIRECT_NAME,
    hideBreadcrumb: true,
    hideMenu: true,
  },
  children: [
    {
      path: '/redirect/:path(.*)/:_redirect_type(.*)/:_origin_params(.*)?',
      name: REDIRECT_NAME,
      component: () => import('@/views/sys/redirect/index.vue'),
      meta: {
        title: REDIRECT_NAME,
        hideBreadcrumb: true,
      },
    },
  ],
};
