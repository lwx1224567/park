//这个 index.ts 文件是 Basic 组件库的门面，它通过 withInstall 包装组件，
// 既保持了单个组件的独立性，又提供了便捷的全局注册能力。
// 在项目中，开发者只需从这个入口导入，就能使用箭头、标题、帮助提示等基础 UI 元素
import { withInstall } from '@/utils';
import basicArrow from './src/BasicArrow.vue';
import basicTitle from './src/BasicTitle.vue';
import basicHelp from './src/BasicHelp.vue';

export const BasicArrow = withInstall(basicArrow);
export const BasicTitle = withInstall(basicTitle);
export const BasicHelp = withInstall(basicHelp);
