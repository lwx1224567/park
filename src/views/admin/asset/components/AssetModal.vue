<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerInnerModal"
    :title="modalTitle"
    width="600px"
    @ok="handleSubmit"
    @close="resetForm"
  >
    <BasicForm @register="registerForm"></BasicForm>
  </BasicModal>
</template>

<script setup lang="ts">
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { createAsset, updateAsset } from '@/api/admin/assetManage';
  import { BasicForm, useForm, FormSchema } from '@/components/Form';
  import { computed, ref, unref } from 'vue';
  const emit = defineEmits(['reload', 'register']);
  const isUpdate = ref<boolean>(false);
  const modalTitle = computed<string>(() => {
    return isUpdate.value ? '编辑' : '新增';
  });
  const modalSchemas: FormSchema[] = [
    {
      label: 'ID',
      field: 'id',
      component: 'Input',
      show: false,
    },
    {
      label: '名称',
      field: 'name',
      component: 'Input',
      required: true,
    },
    {
      label: '关联设备',
      field: 'parkId`',
      component: 'Input',
      required: false,
    },
    {
      label: '型号',
      field: 'model',
      component: 'Input',
      required: true,
    },
    {
      label: '资产编号',
      field: 'serialNumber',
      component: 'Input',
      required: true,
    },
    {
      label: '类型',
      field: 'type',
      component: 'Select',
      required: true,
      componentProps: {
        options: [
          {
            label: '服务器',
            value: 1,
          },
          {
            label: '存储设备',
            value: 2,
          },
          {
            label: '网络设备',
            value: 3,
          },
          {
            label: '办公设备',
            value: 4,
          },
          {
            label: '其他',
            value: 5,
          },
        ],
      },
    },
    {
      label: 'IP地址',
      field: 'ipAddress',
      component: 'Input',
      // required: true,
    },
    {
      label: 'MAC地址',
      field: 'macAddress',
      component: 'Input',
      // required: true,
    },
    {
      label: '采购日期',
      field: 'purchaseDate',
      component: 'DatePicker',
      required: true,
      componentProps: {
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
        format: 'YYYY-MM-DD',
      },
    },
    {
      label: '质保到期',
      field: 'warrantyEndDate',
      component: 'DatePicker',
      required: true,
      componentProps: {
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
        format: 'YYYY-MM-DD',
      },
    },
    {
      label: '资产价值',
      field: 'assetValue',
      component: 'InputNumber',
      required: true,
    },
    {
      label: '备注',
      field: 'remark',
      component: 'InputTextArea',
      colProps: { span: 24 },
      componentProps: {
        rows: 3,
      },
    },
  ];
  /**
   * @description: 注册表单控件
   */
  const [registerForm, { validate, setFieldsValue, resetForm, updateSchema }] = useForm({
    schemas: modalSchemas,
    showActionButtonGroup: false,
    labelWidth: 80,
    baseColProps: { span: 12 },
    name: 'asset_modal',
  });
  /**
   * @description: 注册内部弹窗
   */
  const [registerInnerModal, { modalLoading, closeModal }] = useModalInner(
    async (data: { record?: Recordable; update: boolean }) => {
      modalLoading(true);
      const { record, update } = data;
      isUpdate.value = update;
      if (update && record) {
        setFieldsValue(record);
      }
      modalLoading(false);
    },
  );
  /**
   * @description: 提交表单
   */
  const handleSubmit = async () => {
    try {
      modalLoading(true);
      const data = await validate();
      if (unref(isUpdate)) {
        await updateAsset(data);
      } else {
        await createAsset(data);
      }
      emit('reload');
      closeModal();
      await resetForm();
    } catch (e) {
      console.warn(e);
    } finally {
      modalLoading(false);
    }
  };
</script>

<style scoped lang="less"></style>
