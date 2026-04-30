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
  import { addDevice, getDevice, list } from '@/api/admin/inspectionManage';
  import { BasicForm, useForm, FormSchema } from '@/components/Form';
  import { computed, ref, unref } from 'vue';
  const emit = defineEmits(['reload', 'register']);
  const isUpdate = ref<boolean>(false);
  const modalTitle = computed<string>(() => {
    return isUpdate.value ? '编辑' : '新增';
  });
  const modalSchemas: FormSchema[] = [
    {
      label: '任务',
      field: 'inspectionId',
      component: 'Select',
      componentProps: {
        disabled: true,
        options: [],
      },
    },
    {
      label: '关联设备',
      field: 'parkId',
      component: 'Select',
      required: true,
      componentProps: {
        options: [],
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
    baseColProps: { span: 24 },
    name: 'inspection_modal',
  });
  /**
   * @description: 注册内部弹窗
   */
  const [registerInnerModal, { modalLoading, closeModal }] = useModalInner(
    async (data: { inspectionId?: string; update: boolean }) => {
      modalLoading(true);
      const { inspectionId, update } = data;
      isUpdate.value = update;
      const res = await getDevice();
      const task = await list({});
      updateSchema({
        field: 'inspectionId',
        componentProps: {
          options: task.rows.map((item) => {
            return { label: item.name, value: item.id };
          }),
        },
      });
      updateSchema({
        field: 'parkId',
        componentProps: {
          options: res.map((item) => {
            return { label: item.name, value: item.id };
          }),
        },
      });
      setFieldsValue({ inspectionId });
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
        // await update(data);
      } else {
        await addDevice(data);
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
