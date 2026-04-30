import { withInstall } from '@/utils';
import type { ExtractPropTypes } from 'vue';
import basicLayouts from './src/BasicLayouts.vue';
import roomLayouts from './src/RoomLayouts.vue';
import cabinetLayouts from './src/CabinetLayouts.vue';

export const BasicLayouts = withInstall(basicLayouts);
export const RoomLayouts = withInstall(roomLayouts);
export const CabinetLayouts = withInstall(cabinetLayouts);
