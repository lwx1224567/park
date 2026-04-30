import { withInstall } from '@/utils';
import type { ExtractPropTypes } from 'vue';
import button from './src/BasicButton.vue';
import button1 from './src/Button1.vue';
import button2 from './src/Button2.vue';
import button3 from './src/Button3.vue';
import button4 from './src/Button4.vue';

import popConfirmButton from './src/PopConfirmButton.vue';
import statusButton from './src/StatusButton.vue';
import menuButton from './src/MenuButton.vue';
import { buttonProps } from './src/props';

export const Button = withInstall(button);
export const Button1 = withInstall(button1);
export const Button2 = withInstall(button2);
export const Button3 = withInstall(button3);
export const Button4 = withInstall(button4);

export const PopConfirmButton = withInstall(popConfirmButton);
export const StatusButton = withInstall(statusButton);
export const MenuButton = withInstall(menuButton);
export declare type ButtonProps = Partial<ExtractPropTypes<typeof buttonProps>>;
