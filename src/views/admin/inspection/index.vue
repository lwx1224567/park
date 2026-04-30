<template>
  <BaseWrapper title="巡检任务">
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
                  title: `是否删除巡检任务[${record.name}]?`,
                  placement: 'left',
                  confirm: handleDelete.bind(null, record),
                },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <InspectionModal @register="registerModal" @reload="reload" />
  </BaseWrapper>
</template>

<script lang="ts" setup>
  import { BaseWrapper } from '@/components/Page';
  import { useModal } from '@/components/Modal';
  import { BasicTable, useTable, TableAction } from '@/components/Table';
  import type { BasicColumn } from '@/components/Table';
  import type { FormSchema } from '@/components/Form';
  import { list, remove } from '@/api/admin/inspectionManage';
  import InspectionModal from './components/InspectionModal.vue';
  import { Button1 } from '@/components/Button';
  const [registerModal, { openModal: openModal }] = useModal();
  //表单列
  const columns: BasicColumn[] = [
    { title: '任务名称', dataIndex: 'name', width: 160 },
    { title: '巡检时间间隔（单位：秒）', dataIndex: 'interval', width: 140 },
    { title: '上次巡检时间', dataIndex: 'lastRun', width: 180 },
    { title: '下次巡检时间', dataIndex: 'nextRun', width: 180 },
    { title: '任务状态', dataIndex: 'enabled', width: 90 },
    { title: '备注', dataIndex: 'remark', width: 200 },
  ];

  //表格查询表单
  const searchSchemas: FormSchema[] = [
    {
      field: 'name',
      label: '任务名称',
      component: 'Input',
      colProps: { span: 3 },
    },
    {
      field: 'enabled',
      label: '任务状态',
      component: 'Select',
      componentProps: {
        options: [
          { label: '启用', value: 1 },
          { label: '停用', value: 0 },
        ],
      },
      colProps: { span: 3 },
    },
  ];
  //表格配置
  const [registerTable, { reload }] = useTable({
    api: list,
    columns: columns,
    showIndexColumn: true,
    rowKey: 'id',
    useSearchForm: true,
    formConfig: {
      labelWidth: 100,
      schemas: searchSchemas,
    },
    actionColumn: {
      width: 160,
      title: '操作',
      dataIndex: 'action',
    },
  });
  /**
   * 编辑
   */
  const handleEdit = (record) => {
    openModal(true, { record, update: true });
  };
  /**
   * 新增
   */
  const handleAdd = () => {
    openModal(true, { update: false });
  };
  /**
   * 删除
   */
  const handleDelete = async (record) => {
    await remove(record.id);
    await reload();
  };
</script>

<style lang="less" scoped></style>
