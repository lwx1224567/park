import 'uno.css';
import '@/design/index.less';
import 'ant-design-vue/dist/reset.css';
import 'virtual:svg-icons-register';
import 'echarts';
import 'echarts-liquidfill';
// import autofit from 'autofit.js';

import { createApp } from 'vue';

import { registerGlobComp } from '@/components/registerGlobComp';
// import { setupGlobDirectives } from '@/directives';
// import { initAppConfigStore } from '@/logics/initAppConfig';
import { router, setupRouter } from '@/router';
import { setupRouterGuard } from '@/router/guard';
import { setupStore } from '@/store';
import 'wow.js/css/libs/animate.css';

import App from './App.vue';

async function bootstrap() {
  const app = createApp(App);

  // 配置 store
  setupStore(app);

  // 注册全局组件
  registerGlobComp(app);

  // 配置路由
  setupRouter(app);

  // 路由守卫
  setupRouterGuard(router);

  // 注册全局指令
  // setupGlobDirectives(app);

  app.mount('#app');

  // const ScreenSize = {
  //   big: [3072, 1920],
  //   normal: [1920, 1080],
  //   small: [1280, 720],
  // }['normal'];

  // autofit.init({
  //   el: '#app',
  //   dw: ScreenSize[0],
  //   dh: ScreenSize[1],
  //   resize: true,
  //   limit: 0.1, // 缩放阈值
  // });
}

bootstrap();
