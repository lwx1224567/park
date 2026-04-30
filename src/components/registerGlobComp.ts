import type { App } from 'vue';
import Antd from 'ant-design-vue';

import ECharts from 'vue-echarts';

export function registerGlobComp(app: App) {
  app.use(Antd);
  app.component('v-chart', ECharts);
}
