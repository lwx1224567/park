<template>
  <div class="log-card">
    <div class="table-head">
      <div class="col-no">序号</div>
      <div class="col-op">操作</div>
      <div class="col-time">时间</div>
      <div class="col-user">操作人</div>
    </div>

    <div class="table-body">
      <div class="table-row" v-for="item in processedTableData" :key="item.serialNo">
        <div class="col-no">{{ item.serialNo }}</div>
        <div class="col-op operation">{{ item.operation }}</div>
        <div class="col-time">{{ item.time }}</div>
        <div class="col-user">{{ item.operator }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

// 定义接口
interface OperationLogItem {
  operation: string;
  time: string;
  operator: string;
}

// 模拟数据
const mockLogs: OperationLogItem[] = [
  { operation: '插入接口01', time: '2026/04/07 09:21', operator: '张伟' },
  { operation: '拔出接口05', time: '2026/04/07 09:16', operator: '李航' },
  { operation: '插入接口02', time: '2026/04/07 08:58', operator: '欧阳锋' },
  { operation: '拔出接口01', time: '2026/04/07 08:35', operator: '赵明' },
  { operation: '插入接口03', time: '2026/04/07 08:10', operator: '刘静' },
  { operation: '插入接口11', time: '2026/04/07 07:45', operator: '陈宇' },
  { operation: '插入接口09', time: '2026/04/07 07:20', operator: '孙凯' },
];

/**
 * 数据处理：仅处理序号补零
 */
const processedTableData = computed(() => {
  return mockLogs.map((item, index) => ({
    ...item,
    serialNo: String(index + 1).padStart(2, '0'),
  }));
});
</script>

<style scoped>
.log-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  min-width: 300px; /* 增加最小宽度保护，防止列被挤消失 */
  padding: 5px 0;
  box-sizing: border-box;
  color: #effbff;
  /*background-color: #0a1a2a; /* 建议添加背景色以便调试 */
}

/* 核心布局配置 */
.table-head,
.table-row {
  display: grid;
  /**
   * 优化：使用 minmax 确保操作列至少有 100px 宽度
   * 1. 32px: 序号
   * 2. minmax(100px, 1fr): 操作名（最小100px，剩余空间自适应）
   * 3. 120px: 时间
   * 4. 60px: 操作人
   */
  grid-template-columns: 30px 85px 120px 60px;
  column-gap: 6px; 
  align-items: center;
  padding: 0 12px;
  width: 100%;
  box-sizing: border-box;
}

.table-head {
  height: 24px;
  font-size: 14px;
  font-weight: bold;
  border-bottom: 1px solid rgba(46, 150, 255, 0.3);
 /* background-color: rgba(46, 150, 255, 0.05); /* 稍微加点底色方便区分 */
}

/* 统一设置文本处理 */
.table-head > div,
.table-row > div {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left; /* 显式声明对齐方式 */
}

.table-body {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

.table-row {
  min-height: 36px;
  border-bottom: 1px solid rgba(46, 150, 255, 0.3);
  font-size: 13px;
}

.table-row:hover {
  background-color: rgba(46, 150, 255, 0.1);
}

/* 滚动条美化 */
.table-body::-webkit-scrollbar {
  width: 4px;
}
.table-body::-webkit-scrollbar-thumb {
  background: rgba(52, 169, 255, 0.3);
  border-radius: 2px;
}
</style>