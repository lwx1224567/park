import { withInstall } from '@/utils';
import basicUpload from './src/BasicUpload.vue';
import uploadImage from './src/components/ImageUpload.vue';
import fileUpload from './src/components/FileUpload.vue';

export const ImageUpload = withInstall(uploadImage);
export const BasicUpload = withInstall(basicUpload);
export const FileUpload = withInstall(fileUpload);

