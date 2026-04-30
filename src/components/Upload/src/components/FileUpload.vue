<template>
  <div>
    <Upload
      v-bind="$attrs"
      v-model:file-list="fileList"
      :accept="getStringAccept"
      :multiple="multiple"
      :maxCount="maxNumber"
      :before-upload="beforeUpload"
      :custom-request="customRequest"
      :disabled="disabled"
      @remove="handleRemove"
    >
      <a-button type="primary" :disabled="maxNumber == fileList?.length">
        <UploadOutlined></UploadOutlined>上传
      </a-button>
    </Upload>
  </div>
</template>

<script lang="ts" setup>
  import { ref, toRefs, watch } from 'vue';
  import { UploadOutlined } from '@ant-design/icons-vue';
  import type { UploadFile, UploadProps } from 'ant-design-vue';
  import { Upload } from 'ant-design-vue';
  import { UploadRequestOption } from 'ant-design-vue/lib/vc-upload/interface';
  import { useMessage } from '@/hooks/web/useMessage';
  import { isFunction, isObject, isString } from '@/utils/is';
  import { warn } from '@/utils/log';
  import { useUploadType } from '../hooks/useUpload';
  import { uploadContainerProps } from '../props';
  import { UploadResultStatus } from '@/components/Upload/src/types/typing';
  import { get, omit } from 'lodash-es';
  import { useGlobSetting } from '@/hooks/setting';

  const globSetting = useGlobSetting();

  defineOptions({ name: 'FileUpload' });

  const emit = defineEmits(['change', 'update:value', 'delete']);
  const props = defineProps({
    ...omit(uploadContainerProps, ['previewColumns', 'beforePreviewData']),
  });
  const { createMessage } = useMessage();
  const { accept, helpText, maxNumber, maxSize } = toRefs(props);
  const isInnerOperate = ref<boolean>(false);
  const { getStringAccept } = useUploadType({
    acceptRef: accept,
    helpTextRef: helpText,
    maxNumberRef: maxNumber,
    maxSizeRef: maxSize,
  });

  const fileList = ref<UploadProps['fileList']>([]);
  const isLtMsg = ref<boolean>(true);
  const isFirstRender = ref<boolean>(true);

  watch(
    () => props.value,
    (v) => {
      if (isInnerOperate.value) {
        isInnerOperate.value = false;
        return;
      }
      if (v) {
        // 首先将值转为数组
        const list = Array.isArray(v) ? v : props.value.split(',');
        // 然后将数组转为对象数组
        fileList.value = list.map((item, index) => {
          if (item && isString(item)) {
            return {
              uid: -index + '',
              name: item.substring(item.lastIndexOf('/') + 1),
              status: 'done',
              url: globSetting.apiUrl + '/anti-uav/uploadFile/preview?filePath=' + item,
            };
          } else if (item && isObject(item)) {
            return item;
          } else {
            return;
          }
        }) as UploadProps['fileList'];
      } else {
        fileList.value = [];
        return [];
      }
      if (!isFirstRender.value) {
        isFirstRender.value = false;
      }
    },
    {
      immediate: true,
      deep: true,
    },
  );

  const handleRemove = async (file: UploadFile) => {
    if (fileList.value) {
      const index = fileList.value.findIndex((item) => item.uid === file.uid);
      index !== -1 && fileList.value.splice(index, 1);
      const value = getValue();
      isInnerOperate.value = true;
      emit('update:value', value);
      emit('change', value);
      emit('delete', file);
    }
  };

  // 上传文件前的钩子
  const beforeUpload = (file: File) => {
    const { maxSize } = props;
    const isLt = file.size / 1024 / 1024 > maxSize;
    if (isLt) {
      createMessage.error(`只能上传不超过${maxSize}MB的文件`);
      isLtMsg.value = false;
      // 防止弹出多个错误提示
      setTimeout(() => (isLtMsg.value = true), 1000);
    }
    return !isLt || Upload.LIST_IGNORE;
  };

  // 上传文件
  async function customRequest(info: UploadRequestOption<any>) {
    const { api, uploadParams = {}, name, filename, resultField } = props;
    if (!api || !isFunction(api)) {
      return warn('upload api must exist and be a function');
    }
    try {
      const res = await api?.({
        data: {
          ...uploadParams,
        },
        file: info.file,
        name: name,
        filename: filename,
      });

      if (props.resultField) {
        let result = get(res, resultField);
        info.onSuccess!(result);
      } else {
        // 不传入 resultField 的情况
        info.onSuccess!(res.data);
      }
      const value = getValue();
      isInnerOperate.value = true;
      emit('update:value', value);
      emit('change', value);
    } catch (e: any) {
      console.log(e);
      info.onError!(e);
    }
  }

  function getValue() {
    const prefix = `${globSetting.apiUrl}/anti-uav/uploadFile/preview?filePath=`;
    const list = (fileList.value || [])
      .filter((item) => item?.status === UploadResultStatus.DONE)
      .map((item: any) => {
        if (item?.response && props?.resultField) {
          return item?.response;
        }
        return (
          (item?.url && item?.url.startsWith(prefix)
            ? item?.url.slice(prefix.length)
            : item?.url) || item?.response?.data
        );
      })
      .join(',');
    return list;
  }
</script>

<style lang="less"></style>
