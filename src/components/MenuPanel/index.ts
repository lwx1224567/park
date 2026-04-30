import { withInstall } from '@/utils';
import basicMenu from './src/BasicMenu.vue';
import menuItem from './src/MenuItem.vue';

export const BasicMenu = withInstall(basicMenu);
export const MenuItem = withInstall(menuItem);