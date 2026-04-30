<template>
  <BaseWrapper title="设备端口连接管理">
    <div class="page">
      <BasicTable
        :columns="columns"
        :api="tableApi"
        rowKey="id"
        useSearchForm
        :formConfig="formConfig"
        showTableSetting
        :immediate="true"
        :bordered="true"
      />
    </div>
  </BaseWrapper>
</template>

<script lang="ts" setup>
  import { BaseWrapper } from '@/components/Page'
  import { BasicTable } from '@/components/Table';
  import type { BasicColumn } from '@/components/Table';
  import type { FormProps, FormSchema } from '@/components/Form';
  import { fetchParkList } from '@/api/admin/parkManage';

  const tableApi = async (params: Record<string, any>) => {
    // /smartpark/park/list returns array; BasicTable supports arrays via default fetchSetting
    return fetchParkList(params);
  };

  const columns: BasicColumn[] = [
    { title: 'ID', dataIndex: 'id', width: 220, align: 'center' },
    { title: '名称', dataIndex: 'name', width: 160 },
    { title: '父级ID', dataIndex: 'parentId', width: 160 },
    { title: '排序', dataIndex: 'orderNum', width: 80 },
    { title: '地址', dataIndex: 'address', width: 200 },
    // { title: '位置X', dataIndex: 'positionX', width: 100 },
    // { title: '位置Y', dataIndex: 'positionY', width: 100 },
    // { title: '位置Z', dataIndex: 'positionZ', width: 100 },
    // { title: '旋转X', dataIndex: 'rotationX', width: 100 },
    // { title: '旋转Y', dataIndex: 'rotationY', width: 100 },
    // { title: '旋转Z', dataIndex: 'rotationZ', width: 100 },
    { title: '缩放X', dataIndex: 'scaleX', width: 100 },
    { title: '缩放Y', dataIndex: 'scaleY', width: 100 },
    { title: '缩放Z', dataIndex: 'scaleZ', width: 100 },
    { title: '模型名称', dataIndex: 'modelName', width: 140 },
    { title: '分类ID', dataIndex: 'categoryId', width: 200 },
    // { title: '偏移X', dataIndex: 'baseOffsetX', width: 100 },
    // { title: '偏移Y', dataIndex: 'baseOffsetY', width: 100 },
    // { title: '偏移Z', dataIndex: 'baseOffsetZ', width: 100 },
    { title: '备注', dataIndex: 'remark', width: 200 },
  ];

  const searchSchemas: FormSchema[] = [
    {
      field: 'name',
      label: '名称',
      component: 'Input',
      colProps: { span: 3 },
    },
    {
      field: 'modelName',
      label: '模型名称',
      component: 'Input',
      colProps: { span: 3 },
    },
    {
      field: 'address',
      label: '地址',
      component: 'Input',
      colProps: { span: 3 },
    },
    {
      field: 'categoryId',
      label: '分类ID',
      component: 'Input',
      colProps: { span: 3 },
    },
  ];

  const formConfig: Partial<FormProps> = {
    labelWidth: 90,
    showAdvancedButton: false,
    showActionButtonGroup: true,
    actionColOptions: { span: 6 },
    schemas: searchSchemas,
  };
</script>

<style lang="less" scoped>
  .page {
    //padding: 20px;
  }
</style>


