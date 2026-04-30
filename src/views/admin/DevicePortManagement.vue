<template>
  <BaseWrapper title="设备端口管理">
    <div class="page">
      <div class="two-col">
        <div class="left">
          <BasicTable
            :columns="leftColumns"
            :api="leftApi"
            rowKey="modelName"
            :immediate="true"
            :bordered="true"
            size="small"
            @row-click="onLeftRowClick"
          />
        </div>
        <div class="right">
          <BasicTable
            :columns="rightColumns"
            :api="rightApi"
            rowKey="id"
            :searchInfo="{ modelName: currentModelName }"
            :immediate="false"
            :bordered="true"
            size="small"
            @register="onRegisterRight"
          />
        </div>
      </div>
    </div>
  </BaseWrapper>
</template>

<script lang="ts" setup>
  import { BaseWrapper } from '@/components/Page'
  import { BasicTable } from '@/components/Table';
  import type { BasicColumn, TableActionType } from '@/components/Table';
  import { fetchModelList, fetchPortList } from '@/api/admin/parkPortManage';
  import { ref } from 'vue';

  const leftApi = (params: Record<string, any>) => fetchModelList(params);
  const rightApi = (params: { pageSize?: number; pageNum?: number; modelName: string }) => fetchPortList(params);

  const currentModelName = ref<string>('');
  const rightAction = ref<Partial<TableActionType> | null>(null);
  function onRegisterRight(action: TableActionType) {
    rightAction.value = action;
  }

  function onLeftRowClick(record) {
    currentModelName.value = record?.modelName || '';
    rightAction.value?.reload?.({ page: 1, searchInfo: { modelName: currentModelName.value } });
  }

  const leftColumns: BasicColumn[] = [
    { title: '模型名称', dataIndex: 'modelName', width: 180 },
    { title: '中文名', dataIndex: 'nameZh', width: 140 },
    { title: '英文名', dataIndex: 'nameEn', width: 140 },
  ];

  const rightColumns: BasicColumn[] = [
    // { title: 'ID', dataIndex: 'id', width: 80, align: 'center' },
    { title: '模型名称', dataIndex: 'modelName', width: 160 },
    { title: '端口名称', dataIndex: 'portName', width: 120 },
    { title: '类型', dataIndex: 'type', width: 80 },
    { title: '是否前面板', dataIndex: 'isFront', width: 110 },
    { title: '备注', dataIndex: 'remark', width: 200 },
  ];
</script>

<style lang="less" scoped>
  .two-col {
    display: grid;
    grid-template-columns: 540px 1fr;
    gap: 10px;
  }
  .left,
  .right {
    background: transparent;
  }
</style>


