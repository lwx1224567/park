<template>
  <BaseWrapper title="资产管理">
    <template #action> <Button1 text="新增" @click="handleAdd"></Button1> </template>
    <BasicTable @register="registerTable">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              { label: '编辑', onClick: handleEdit.bind(null, record) },
              {
                label: '删除',
                danger: true,
                popConfirm: {
                  title: `是否删除资产[${record.name}]?`,
                  placement: 'left',
                  confirm: handleDelete.bind(null, record),
                },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <AssetModal @register="registerAssetModal" @reload="reload" />
  </BaseWrapper>
</template>

<script lang="ts" setup>
  import { useModal } from '@/components/Modal';
  import { BaseWrapper } from '@/components/Page';
  import { BasicTable, useTable, TableAction } from '@/components/Table';
  import type { BasicColumn } from '@/components/Table';
  import type { FormSchema } from '@/components/Form';
  import { fetchAssetList, deleteAsset } from '@/api/admin/assetManage';
  import AssetModal from './components/AssetModal.vue';
  import { Button1 } from '@/components/Button';
  const [registerAssetModal, { openModal: openAssetModal }] = useModal();

  /**
   * 编辑
   */
  const handleEdit = (record) => {
    openAssetModal(true, { record, update: true });
  };
  /**
   * 新增
   */
  const handleAdd = () => {
    openAssetModal(true, { update: false });
  };
  /**
   * 删除
   */
  const handleDelete = async (record) => {
    await deleteAsset(record.id);
    await reload();
  };

  //表单列
  const columns: BasicColumn[] = [
    { title: 'ID', dataIndex: 'id', width: 80, align: 'center' },
    { title: '名称', dataIndex: 'name', width: 160 },
    { title: '型号', dataIndex: 'model', width: 140 },
    { title: '资产编号', dataIndex: 'serialNumber', width: 180 },
    { title: '类型', dataIndex: 'type', width: 80 },
    { title: '状态', dataIndex: 'assetStatus', width: 90 },
    { title: 'IP 地址', dataIndex: 'ipAddress', width: 140 },
    { title: 'MAC 地址', dataIndex: 'macAddress', width: 170 },
    { title: '采购日期', dataIndex: 'purchaseDate', width: 160 },
    { title: '质保到期', dataIndex: 'warrantyEndDate', width: 160 },
    { title: '资产价值', dataIndex: 'assetValue', width: 120 },
    { title: '备注', dataIndex: 'remark', width: 200 },
  ];

  //表格查询表单
  const searchSchemas: FormSchema[] = [
    {
      field: 'name',
      label: '名称',
      component: 'Input',
      colProps: { span: 3 },
    },
    {
      field: 'model',
      label: '型号',
      component: 'Input',
      colProps: { span: 3 },
    },
    {
      field: 'ipAddress',
      label: 'IP 地址',
      component: 'Input',
      colProps: { span: 3 },
    },
    {
      field: 'assetStatus',
      label: '状态',
      component: 'Select',
      componentProps: {
        options: [
          { label: '全部', value: '' },
          { label: '在用', value: 1 },
          { label: '停用', value: 0 },
        ],
      },
      colProps: { span: 3 },
    },
  ];

  //表格配置
  const [registerTable, { reload }] = useTable({
    api: fetchAssetList,

    striped: true, //斑马纹
    showTableSetting: false, //表格设置
    columns: columns,
    showIndexColumn: true,
    rowKey: 'id',
    useSearchForm: true,
    formConfig: {
      labelWidth: 100,
      schemas: searchSchemas,
    },
    canResize: true, //自适应高度
    actionColumn: {
      width: 160,
      title: '操作',
      dataIndex: 'action',
    },
  });
</script>
