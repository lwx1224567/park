import { withInstall } from '@/utils';

import deviceModel3D from './DeviceModel3D.vue';
import leftTop from './LeftTop.vue';
import leftCenter from './LeftCenter.vue';
import leftBottom from './LeftBottom.vue';
import rightTop from './RightTop.vue';
import rightCenter from './RightCenter.vue';
import rightBottom from './RightBottom.vue';
import middleBottom from './MiddleBottom.vue';


export const DeviceModel3D = withInstall(deviceModel3D);
export const LeftTop = withInstall(leftTop);
export const LeftCenter = withInstall(leftCenter);
export const LeftBottom = withInstall(leftBottom);
export const RightTop = withInstall(rightTop);
export const RightCenter = withInstall(rightCenter);
export const RightBottom = withInstall(rightBottom);
export const MiddleBottom = withInstall(middleBottom);

