import { withInstall } from '@/utils';

import pageWrapper from './src/PageWrapper.vue';
import page1Wrapper from './src/Page1Wrapper.vue';
import page2Wrapper from './src/Page2Wrapper.vue';
import baseWrapper from './src/BaseWrapper.vue';
import visitorWrapper from './src/VisitorWrapper.vue';

export const PageWrapper = withInstall(pageWrapper);
export const Page1Wrapper = withInstall(page1Wrapper);
export const Page2Wrapper = withInstall(page2Wrapper);
export const BaseWrapper = withInstall(baseWrapper);
export const VisitorWrapper = withInstall(visitorWrapper);
