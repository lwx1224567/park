<template>
  <div class="box">
    <a-table
      :columns="columns"
      :data-source="parkList"
      rowKey="id"
      bordered
      :row-selection="rowSelection"
      :scroll="{ x: true, y: 800 }"
      class="scroll-table"
      :custom-row="handleRowDoubleClick"
      :expanded-row-keys="expandedRowKeys"
      @expand="handleExpand"
    >
      <template #bodyCell="{ column, text, record }">
        <template v-if="column.dataIndex.endsWith('X')">
          <div class="editable-cell">
            <a-input
              v-if="editableData[record.id]"
              v-model:value="editableData[record.id][column.dataIndex]"
              style=" width: 100%;margin: -5px 0"
              @change="onCoordinateChange(record.id, column.dataIndex, $event.target.value, 'x')"
              @keydown.enter="save(record.id)"
            />
            <template v-else>
              {{ getCoordinatePartValue(record, column.dataIndex, 'x') }}
            </template>
          </div>
        </template>
        <template v-else-if="column.dataIndex.endsWith('Y')">
          <div class="editable-cell">
            <a-input
              v-if="editableData[record.id]"
              v-model:value="editableData[record.id][column.dataIndex]"
              style=" width: 100%;margin: -5px 0"
              @change="onCoordinateChange(record.id, column.dataIndex, $event.target.value, 'y')"
              @keydown.enter="save(record.id)"
            />
            <template v-else>
              {{ getCoordinatePartValue(record, column.dataIndex, 'y') }}
            </template>
          </div>
        </template>
        <template v-else-if="column.dataIndex.endsWith('Z')">
          <div class="editable-cell">
            <a-input
              v-if="editableData[record.id]"
              v-model:value="editableData[record.id][column.dataIndex]"
              style=" width: 100%;margin: -5px 0"
              @change="onCoordinateChange(record.id, column.dataIndex, $event.target.value, 'z')"
              @keydown.enter="save(record.id)"
            />
            <template v-else>
              {{ getCoordinatePartValue(record, column.dataIndex, 'z') }}
            </template>
          </div>
        </template>
        <template
          v-else-if="column.dataIndex === 'isHoverOutline' || column.dataIndex === 'isClickOutline'"
        >
          <div class="editable-cell">
            <a-switch
              v-if="editableData[record.id]"
              v-model:checked="editableData[record.id][column.dataIndex]"
              size="small"
              @keydown.enter="save(record.id)"
            />
            <template v-else>
              <a-switch :checked="text" disabled size="small" />
            </template>
          </div>
        </template>
        <template v-else-if="!['operation'].includes(column.dataIndex)">
          <div class="editable-cell">
            <a-input
              v-if="editableData[record.id] && column.dataIndex != 'className'"
              v-model:value="editableData[record.id][column.dataIndex]"
              style=" width: 100%;margin: -5px 0"
              @keydown.enter="save(record.id)"
            />
            <template v-else>
              {{ text }}
            </template>
          </div>
        </template>
        <template v-else-if="column.dataIndex === 'operation'">
          <div class="editable-row-operations">
            <span v-if="editableData[record.id]">
              <a-typography-link @click="save(record.id)">保存</a-typography-link>
              <a-divider type="vertical" />
              <a-typography-link @click="cancel(record.id)">取消</a-typography-link>
            </span>
            <span v-else>
              <a @click="showDrawer(record.id)">详情</a>
            </span>
          </div>
        </template>
      </template>
    </a-table>

    <!--    侧边栏 -->
    <template>
      <a-drawer
        v-model:open="open"
        class="custom-class"
        root-class-name="root-class-name"
        :root-style="{ color: 'blue' }"
        style="color: red"
        title="'字段详情 - '"
        placement="right"
        @after-open-change="afterOpenChange"
        width="500"
      >
        <a-table
          :columns="fieldColumns"
          :data-source="fieldData"
          rowKey="fieldName"
          :pagination="false"
          size="small"
        >
          <template #bodyCell="{ column, text, record }">
            <template v-if="column.dataIndex === 'fieldName'">
              {{ text }}
            </template>
            <template v-else>
              <a-input
                v-model:value="record.attribute"
                style="margin: -5px 0"
                @keydown.enter="saveFieldAttribute(record)"
              />
            </template>
          </template>
        </a-table>
      </a-drawer>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { cloneDeep } from 'lodash-es';
  import { onMounted, reactive, ref } from 'vue';
  import type { UnwrapRef } from 'vue';
  import { message } from 'ant-design-vue';
  import {
    getTreeData,
    queryListByParkId,
    saveAttribute,
    savePark,
  } from '@/api/admin/adminManage';
  const open = ref<boolean>(false);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '模型名称',
      dataIndex: 'modelName',
      key: 'modelName',
    },
    {
      title: '类名',
      dataIndex: 'className',
      key: 'className',
    },
    {
      title: '位置X',
      dataIndex: 'positionX',
      key: 'positionX',
    },
    {
      title: '位置Y',
      dataIndex: 'positionY',
      key: 'positionY',
    },
    {
      title: '位置Z',
      dataIndex: 'positionZ',
      key: 'positionZ',
    },
    {
      title: '旋转X',
      dataIndex: 'rotationX',
      key: 'rotationX',
    },
    {
      title: '旋转Y',
      dataIndex: 'rotationY',
      key: 'rotationY',
    },
    {
      title: '旋转Z',
      dataIndex: 'rotationZ',
      key: 'rotationZ',
    },
    {
      title: '缩放X',
      dataIndex: 'scaleX',
      key: 'scaleX',
    },
    {
      title: '缩放Y',
      dataIndex: 'scaleY',
      key: 'scaleY',
    },
    {
      title: '缩放Z',
      dataIndex: 'scaleZ',
      key: 'scaleZ',
    },
    {
      title: '偏移X',
      dataIndex: 'baseOffsetX',
      key: 'baseOffsetX',
    },
    {
      title: '偏移Y',
      dataIndex: 'baseOffsetY',
      key: 'baseOffsetY',
    },
    {
      title: '偏移Z',
      dataIndex: 'baseOffsetZ',
      key: 'baseOffsetZ',
    },
    {
      title: '悬停轮廓',
      dataIndex: 'isHoverOutline',
      key: 'isHoverOutline',
    },
    {
      title: '点击轮廓',
      dataIndex: 'isClickOutline',
      key: 'isClickOutline',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      fixed: 'right',
    },
  ];

  // 添加字段表格列定义
  const fieldColumns = [
    {
      title: '字段名',
      dataIndex: 'fieldName',
      key: 'fieldName',
    },
    {
      title: '属性值',
      dataIndex: 'attribute',
      key: 'attribute',
    },
  ];

  const afterOpenChange = (bool: boolean) => {
    console.log('open', bool);
  };

  const showDrawer = (parkId: number) => {
    open.value = true;
    getFieldData(parkId);
  };

  // 园区数据项
  interface Park {
    id: string;
    name: string;
    modelName: string;
    className: string;
    position: Position;
    rotation: Position;
    scale: Position;
    baseOffset: Position;
    isHoverOutline: boolean;
    isClickOutline: boolean;
    index: number | null;
    children?: Park[];
    [key: string]: any; // 允许任何额外的属性
  }
  // 数据项
  interface Position {
    x: number;
    y: number;
    z: number;
  }
  // field数据项
  interface Field {
    id: string;
    attribute: string;
    fieldName: string;
    fieldRemark: string;
  }

  let parkList = ref<Park[]>([]);
  let fieldData = ref<Field[]>([]);

  const rowSelection = ref({
    checkStrictly: true,
    onChange: (selectedRowKeys: string[], selectedRows: Park[]) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    onSelect: (record: Park, selected: boolean, selectedRows: Park[]) => {
      console.log(record, selected, selectedRows);
    },
    onSelectAll: (selected: boolean, selectedRows: Park[], changeRows: Park[]) => {
      console.log(selected, selectedRows, changeRows);
    },
  });

  const editableData: UnwrapRef<Record<string, any>> = reactive({});
  const expandedRowKeys = ref<string[]>([]);

  const dataSource = ref(parkList);

  // 处理行双击事件
  const handleRowDoubleClick = (record: Park) => {
    return {
      onDblclick: (event) => {
        edit(record.id);
      },
    };
  };

  // 处理展开事件
  const handleExpand = (expanded: boolean, record: Park) => {
    if (expanded) {
      expandedRowKeys.value = [...expandedRowKeys.value, record.id];
    } else {
      expandedRowKeys.value = expandedRowKeys.value.filter((key) => key !== record.id);
    }
  };

  const edit = (id: string) => {
    const node = findNodeByKey(dataSource.value, id);
    if (node) {
      // 初始化编辑数据，将坐标对象展开为独立字段
      const editData = cloneDeep(node);
      editData.positionX = node.position?.x ?? '';
      editData.positionY = node.position?.y ?? '';
      editData.positionZ = node.position?.z ?? '';
      editData.rotationX = node.rotation?.x ?? '';
      editData.rotationY = node.rotation?.y ?? '';
      editData.rotationZ = node.rotation?.z ?? '';
      editData.scaleX = node.scale?.x ?? '';
      editData.scaleY = node.scale?.y ?? '';
      editData.scaleZ = node.scale?.z ?? '';
      editData.baseOffsetX = node.baseOffset?.x ?? '';
      editData.baseOffsetY = node.baseOffset?.y ?? '';
      editData.baseOffsetZ = node.baseOffset?.z ?? '';
      editableData[id] = editData;
    }
    console.log('触发编辑事件', node);
  };

  const save = async (id: string) => {
    const node = findNodeByKey(dataSource.value, id);
    if (node && editableData[id]) {
      // 更新基本字段
      Object.assign(node, editableData[id]);

      // 更新坐标对象
      node.position = {
        x: Number(editableData[id].positionX) || 0,
        y: Number(editableData[id].positionY) || 0,
        z: Number(editableData[id].positionZ) || 0,
      };

      node.rotation = {
        x: Number(editableData[id].rotationX) || 0,
        y: Number(editableData[id].rotationY) || 0,
        z: Number(editableData[id].rotationZ) || 0,
      };

      node.scale = {
        x: Number(editableData[id].scaleX) || 1,
        y: Number(editableData[id].scaleY) || 1,
        z: Number(editableData[id].scaleZ) || 1,
      };

      node.baseOffset = {
        x: Number(editableData[id].baseOffsetX) || 0,
        y: Number(editableData[id].baseOffsetY) || 0,
        z: Number(editableData[id].baseOffsetZ) || 0,
      };

      console.log('触发保存事件', node);

      let res = await savePark(node);
      console.log(412, res);
      if (res.code === 200) {
        message.success('保存成功');
      }

      delete editableData[id];
    }
  };

  const cancel = (id: string) => {
    delete editableData[id];
  };

  // 获取坐标值的通用方法
  const getCoordinatePartValue = (record: Park, dataIndex: string, part: string) => {
    // 将列名映射到对应的对象属性名
    const fieldMap: Record<string, string> = {
      positionX: 'position',
      positionY: 'position',
      positionZ: 'position',
      rotationX: 'rotation',
      rotationY: 'rotation',
      rotationZ: 'rotation',
      scaleX: 'scale',
      scaleY: 'scale',
      scaleZ: 'scale',
      baseOffsetX: 'baseOffset',
      baseOffsetY: 'baseOffset',
      baseOffsetZ: 'baseOffset',
    };

    const fieldName = fieldMap[dataIndex];
    if (
      fieldName &&
      record[fieldName] &&
      typeof record[fieldName] === 'object' &&
      part in record[fieldName]
    ) {
      return record[fieldName][part];
    }
    return '';
  };

  // 处理坐标输入变化
  const onCoordinateChange = (id: string, dataIndex: string, value: string, part: string) => {
    // 这里可以添加输入验证逻辑
    editableData[id][dataIndex] = value;
  };

  // 递归查找树中的节点
  const findNodeByKey = (nodes: Park[], id: string): Park | null => {
    for (const node of nodes) {
      if (node.id === id) {
        return node;
      }
      if (node.children) {
        const found = findNodeByKey(node.children, id);
        if (found) {
          return found;
        }
      }
    }
    return null;
  };

  // 获取数据
  async function getData() {
    try {
      const res = await getTreeData();
      parkList.value = res.scene || [];
    } catch (error) {
      // console.error('获取数据失败:', error);
      parkList.value = [];
    }
  }
  // 获取数据
  async function getFieldData(parkId: number) {
    try {
      const res = await queryListByParkId(parkId);
      fieldData.value = res;
    } catch (error) {
      // console.error('获取数据失败:', error);
    }
  }

  // 保存字段属性
  const saveFieldAttribute = async (record: Field) => {
    let res = await saveAttribute(record);
    if (res.code === 200) {
      message.success('保存成功');
    }
  };

  onMounted(async () => {
    await getData();
  });
</script>

<style lang="less" scoped>
  .box {
    padding: 20px;

    :deep(.scroll-table) {
      .ant-table-container {
        max-height: 80vh;
      }

      .ant-table-body {
        overflow: auto auto;
      }

      .ant-table-header {
        overflow: auto hidden;
      }
    }
  }

  .editable-cell {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    min-width: 0;

    .ant-input {
      flex: 1;
      width: 100%;
      margin: 0;
    }

    .ant-switch {
      margin: 0;
    }
  }

  .editable-cell {
    width: auto;
  }
</style>
