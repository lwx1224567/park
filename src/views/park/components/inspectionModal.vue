<template>
  <BasicModal
    v-bind="$attrs"
    @register="register"
    :title="title"
    :showCancelBtn="false"
    :showOkBtn="false"
    :mask="false"
    width="700px"
  >
    <ul class="inspection-container">
      <li class="item-task" v-for="(task, index) in inspectionData" :key="index">
        <div class="task-head">
          <div class="task-icon"><Icon size="24" icon="ic:outline-safety-check" /></div>
          <div class="task-name">
            <span>{{ task.name }}</span>
          </div>
          <a-tooltip title="开始巡检" color="#108ee9">
            <a-button
              type="primary"
              shape="circle"
              :icon="h(PlayCircleOutlined)"
              @click="handleexecuteInspection(task.id)"
            />
          </a-tooltip>
        </div>
        <ul class="device-container" v-if="task.inspectionDeviceVoList.length > 0">
          <li class="device-item" v-for="(device, idx) in task.inspectionDeviceVoList" :key="idx">
            <a-tag color="#108ee9">{{ device.parkVo?.name || '-' }}</a-tag>
          </li>
        </ul>
      </li>
    </ul>
  </BasicModal>
</template>

<script setup lang="ts">
  import { ref, h } from 'vue';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { PlayCircleOutlined } from '@ant-design/icons-vue';
  import Icon from '@/components/Icon/Icon.vue';
  import { TKEvenBus } from '@/utils/TKThree/TKEvenBus';
  const title = ref('巡检任务列表');
  const inspectionData = ref<any[]>([]);

  /**
   * @description: 执行巡检任务
   */
  const handleexecuteInspection = async (id: string) => {
    TKEvenBus.getInstance().emit('inspectionDetail', id);
    closeModal();
  };

  const [register, { closeModal }] = useModalInner((data) => {
    if (!data) return;
    inspectionData.value = data;
  });
</script>

<style scoped lang="less">
  .inspection-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 100%;
    height: 100%;

    .item-task {
      padding: 10px;
      border: 1px solid rgb(59 130 246 / 25%);
      border-radius: 10px;
      background: linear-gradient(90deg, rgb(17 66 122 / 50%), rgb(17 66 122 / 30%));

      .task-head {
        display: flex;
        align-items: center;
        font-size: 16px;
        gap: 10px;

        .task-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 6px;
          background: linear-gradient(135deg, #22c55e, #16a34a);
        }

        .task-name {
          flex: 1;
          overflow: hidden;
          font-size: 18px;
          font-weight: bold;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }

      .device-container {
        display: flex;
        position: relative;
        flex-wrap: wrap;
        margin-top: 20px;
        padding: 15px 5px 5px;
        border: 1px solid rgb(59 130 246 / 25%);
        border-radius: 8px;
        background: linear-gradient(90deg, rgb(17 66 122 / 70%), rgb(17 66 122 / 50%));
        gap: 10px;

        &::before {
          content: '巡检设备列表';
          position: absolute;
          top: -13px;
          left: -1px;
          padding: 0 5px;
          border: 1px solid rgb(59 130 246 / 25%);
          border-radius: 5px;
          background: linear-gradient(90deg, rgb(17 66 122 / 50%), rgb(17 66 122 / 30%));
        }
      }
    }
  }
</style>
