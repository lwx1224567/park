<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerInnerModal"
    :title="modalTitle"
    width="600px"
    @ok="handleSubmit"
    @close="resetForm"
  >
    <BasicForm @register="registerForm">
      <template #categoryId="{ model, field }">
        <a-select v-model:value="model[field]" @change="handleCategoryChange" placeholder="请选择">
          <a-select-option v-for="item in categoryList" :value="item.id">
            {{ item.nameZh }}
          </a-select-option>
        </a-select>
      </template>
      <template #parkIdList="{ model, field }">
        <a-select v-model:value="model[field]" mode="multiple" placeholder="请选择">
          <a-select-option v-for="item in parkIdList" :value="item.id">
            {{ item.name }}
          </a-select-option>
        </a-select>
      </template>
    </BasicForm>
  </BasicModal>
</template>

<script setup lang="ts">
  import { BasicModal, useModalInner } from '@/components/Modal';
  import {
    add,
    update,
    getCategory,
    getCategoryDevice,
    getCategoryStatusKey,
  } from '@/api/admin/alarmManage';
  import { BasicForm, useForm, FormSchema } from '@/components/Form';
  import { computed, ref, unref } from 'vue';
  const emit = defineEmits(['reload', 'register']);
  const isUpdate = ref<boolean>(false);
  const modalTitle = computed<string>(() => {
    return isUpdate.value ? '编辑' : '新增';
  });
  const categoryList = ref<any[]>([]);
  const parkIdList = ref<any[]>([]);
  /**
   * @description: 分类改变
   */
  const handleCategoryChange = async (value) => {
    parkIdList.value = await getCategoryDevice(value);
    const statusKey = await getCategoryStatusKey(value);
    console.log(parkIdList.value);
    
    // updateSchema({
    //   field: 'parkList',
    //   componentProps: {
    //     options: parkList.map((item) => {
    //       return { label: item.name, value: item.id };
    //     }),
    //   },
    // });
    updateSchema({
      field: 'statusKey',
      componentProps: {
        options: statusKey.rows.map((item) => {
          return { label: item.zh, value: item.statusKey };
        }),
      },
    });
  };
  const modalSchemas: FormSchema[] = [
    {
      label: 'ID',
      field: 'id',
      component: 'Input',
      show: false,
    },
    {
      label: '告警规则名称',
      field: 'configName',
      component: 'Input',
      required: true,
    },
    {
      label: '配置类型',
      field: 'type',
      component: 'RadioGroup',
      required: true,
      componentProps: {
        options: [
          { label: '设备', value: 1 },
          { label: '分类', value: 0 },
        ],
      },
    },
    {
      label: '分类',
      field: 'categoryId',
      required: true,
      slot: 'categoryId',
    },
    {
      label: '状态key',
      field: 'statusKey',
      component: 'Select',
      required: true,
    },
    {
      label: '设备',
      field: 'parkIdList',
      required: true,
      ifShow: ({ values }) => {
        return values.type === 1;
      },
      slot: 'parkIdList',
    },
    {
      label: '告警等级',
      field: 'level',
      component: 'Select',
      required: true,
      componentProps: {
        options: [
          { label: '紧急告警', value: 1 },
          { label: '次要告警', value: 2 },
          { label: '一般告警', value: 3 },
        ],
      },
    },
    {
      label: '告警内容',
      field: 'content',
      component: 'InputTextArea',
      colProps: { span: 24 },
      required: true,
      componentProps: {
        rows: 3,
      },
    },
    {
      label: '任务状态',
      field: 'status',
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
      label: '告警表达式',
      field: 'exp',
      component: 'InputTextArea',
      colProps: { span: 24 },
      required: true,
      componentProps: {
        rows: 3,
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
        handleCategoryChange(record.categoryId);
      }
      const res = await getCategory(); //获取分类
      categoryList.value = res.rows;

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
