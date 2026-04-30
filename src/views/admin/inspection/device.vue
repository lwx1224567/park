<template>
  <BaseWrapper title="关联设备">
    <template #action>
      <Button1 text="新增" @click="handleAdd" v-if="inspectionId"></Button1>
    </template>
    <a-row :gutter="30" class="h-full w-full">
      <a-col :span="4" class="h-full">
        <div class="border-container">
          <ScrollContainer ref="scrollRef">
            <div class="task-list">
              <div
                class="task-item"
                v-for="(item, index) in taskData"
                :key="index"
                @click="handleClick(item)"
                :class="{ active: item.id == inspectionId }"
              >
                {{ item.name }}
              </div>
            </div>
          </ScrollContainer>
        </div>
      </a-col>
      <a-col :span="20" class="h-full">
        <div class="border-container">
          <BasicTable @register="registerTable">
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'action'">
                <TableAction
                  :actions="[
                    {
                      label: '删除',
                      danger: true,
                      popConfirm: {
                        title: `是否删除设备[${record.name}]?`,
                        placement: 'left',
                        confirm: handleDelete.bind(null, record),
                      },
                    },
                  ]"
                />
              </template>
            </template>
          </BasicTable>
        </div>
      </a-col>
    </a-row>
    <DeviceModal @register="registerModal" @reload="reload" />
  </BaseWrapper>
</template>

<script lang="ts" setup>
  import { BaseWrapper } from '@/components/Page';
  import { useModal } from '@/components/Modal';
  import { ScrollContainer, ScrollActionType } from '@/components/Container';
  import { BasicTable, useTable, TableAction } from '@/components/Table';
  import type { BasicColumn } from '@/components/Table';
  import { list, removeDevice, device } from '@/api/admin/inspectionManage';
  import DeviceModal from './components/DeviceModal.vue';
  import { Button1 } from '@/components/Button';
  import { onMounted, ref } from 'vue';
  const [registerModal, { openModal: openModal }] = useModal();
  const scrollRef = ref<Nullable<ScrollActionType>>(null);
  const taskData = ref<any[]>([]); //任务列表
  const inspectionId = ref(''); //任务id

  /**
   * 点击任务
   */
  const handleClick = async (item) => {
    inspectionId.value = item.id;
    await reload();
  };

  //获取任务列表
  const getTaskList = async () => {
    const res = await list({});
    taskData.value = res.rows;
    if (taskData.value.length > 0) {
      inspectionId.value = taskData.value[0].id;
      await reload();
    }
  };
  //表单列
  const columns: BasicColumn[] = [
    { title: '设备名称', dataIndex: 'name', width: 300 },
    { title: '模型名称', dataIndex: 'modelName', width: 140 },
    { title: '位置', dataIndex: 'address', width: 'auto' },
  ];

  //表格配置
  const [registerTable, { reload }] = useTable({
    api: device,
    columns: columns,
    beforeFetch(params: Recordable) {
      if (inspectionId.value) {
        params.inspectionId = inspectionId.value;
      }
      return params;
    },
    afterFetch(data) {
      return data.map((item) => {
        return {
          ...item,
          name: item.parkVo.name,
          modelName: item.parkVo.name,
          address: item.parkVo.address,
        };
      });
    },
    showIndexColumn: true,
    rowKey: 'id',
    useSearchForm: false,
    actionColumn: {
      width: 160,
      title: '操作',
      dataIndex: 'action',
    },
  });
  /**
   * 新增
   */
  const handleAdd = () => {
    openModal(true, { update: false, inspectionId: inspectionId.value });
  };
  /**
   * 删除
   */
  const handleDelete = async (record) => {
    await removeDevice(record.id);
    await reload();
  };
  onMounted(() => {
    getTaskList();
  });
</script>

<style lang="less" scoped>
  .border-container {
    width: 100%;
    height: 100%;
    padding: 10px;
    border: 1px solid rgb(0 123 255 / 40%);
    border-radius: 5px;

    .task-list {
      display: flex;
      flex-direction: column;
      gap: 10px;

      .task-item {
        padding: 15px;
        border-radius: 10px;
        background: linear-gradient(0deg, rgb(5 20 63 / 60%), rgb(5 20 63 / 60%));
        font-size: 16px;
        font-weight: bold;
        text-align: center;
        cursor: pointer;

        &:hover,
        &.active {
          background: linear-gradient(0deg, rgb(5 20 63 / 100%), rgb(5 20 63 / 100%));
          color: aqua;
        }
      }
    }
  }
</style>
