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
  import { add, update } from '@/api/admin/inspectionManage';
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
      label: '巡检时间间隔',
      field: 'interval',
      component: 'InputNumber',
      required: true,
    },
    {
      label: '上次巡检时间',
      field: 'lastRun',
      component: 'DatePicker',
      required: true,
      componentProps: {
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
        format: 'YYYY-MM-DD',
      },
    },
    {
      label: '下次巡检时间',
      field: 'nextRun',
      component: 'DatePicker',
      required: true,
      componentProps: {
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
        format: 'YYYY-MM-DD',
      },
    },
    {
      label: '任务状态',
      field: 'enabled',
      component: 'RadioGroup',
      required: true,
      componentProps: {
        options: [
          {
            label: '启用',
            value: 1,
          },
          {
            label: '停用',
            value: 0,
          },
        ],
      },
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
    labelWidth: 100,
    baseColProps: { span: 12 },
    name: 'inspection_modal',
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
        await update(data);
      } else {
        await add(data);
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
