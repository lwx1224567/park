<template>
  <BaseWrapper title="告警管理">
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
                  title: `是否删除告警[${record.configName}]?`,
                  placement: 'left',
                  confirm: handleDelete.bind(null, record),
                },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <AlarmModal @register="registerModal" @reload="reload" />
  </BaseWrapper>
</template>

<script lang="ts" setup>
  import { BaseWrapper } from '@/components/Page';
  import { useModal } from '@/components/Modal';
  import { BasicTable, useTable, TableAction } from '@/components/Table';
  import type { BasicColumn } from '@/components/Table';
  import type { FormSchema } from '@/components/Form';
  import { list, remove } from '@/api/admin/alarmManage';
  import AlarmModal from './components/AlarmModal.vue';
  import { Button1 } from '@/components/Button';
  const [registerModal, { openModal: openModal }] = useModal();
  //表单列
  const columns: BasicColumn[] = [
    { title: '告警规则名称', dataIndex: 'configName', width: 160 },
    { title: '配置类型', dataIndex: 'type', width: 80 },
    { title: '告警等级', dataIndex: 'level', width: 100 },
    { title: '告警内容', dataIndex: 'content', width: 200 },
    { title: '状态', dataIndex: 'status', width: 80 },
    { title: '告警表达式', dataIndex: 'exp', width: 180 },
    { title: '备注', dataIndex: 'remark', width: 200 },
  ];

  //表格查询表单
  const searchSchemas: FormSchema[] = [
    {
      field: 'configName',
      label: '告警规则名称',
      component: 'Input',
      colProps: { span: 3 },
    },
    {
      field: 'type',
      label: '配置类型',
      component: 'Select',
      componentProps: {
        options: [
          { label: '设备', value: 1 },
          { label: '分类', value: 0 },
        ],
      },
      colProps: { span: 3 },
    },
    {
      field: 'level',
      label: '告警等级',
      component: 'Select',
      componentProps: {
        options: [
          { label: '紧急告警', value: 1 },
          { label: '次要告警', value: 2 },
          { label: '一般告警', value: 3 },
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
