<template>
  <div ref="wrapRef" :class="getWrapperClass">
    <BasicForm
      ref="formRef"
      submitOnReset
      v-bind="getFormProps"
      v-if="getBindValues.useSearchForm"
      :tableAction="tableAction"
      @register="registerForm"
      @submit="handleSearchInfoChange"
      @advanced-change="redoHeight"
    >
      <template #[replaceFormSlotKey(item)]="data" v-for="item in getFormSlotKeys">
        <slot :name="item" v-bind="data || {}"></slot>
      </template>
    </BasicForm>

    <Table
      ref="tableElRef"
      v-bind="getBindValues"
      :rowClassName="getRowClassName"
      v-show="getEmptyDataIsShowTable"
      @change="handleTableChange"
      @resize-column="setColumnWidth"
      @expand="handleTableExpand"
    >
      <template #[item]="data" v-for="item in Object.keys($slots)" :key="item">
        <slot :name="item" v-bind="data || {}"></slot>
      </template>
      <template #headerCell="{ column }">
        <slot name="headerCell" v-bind="{ column }">
          <HeaderCell :column="column" />
        </slot>
      </template>
      <template #bodyCell="data">
        <slot name="bodyCell" v-bind="data || {}"></slot>
      </template>
    </Table>
  </div>
</template>
<script lang="ts" setup>
  import type {
    BasicTableProps,
    TableActionType,
    SizeType,
    ColumnChangeParam,
  } from './types/table';
  import { ref, computed, unref, toRaw, inject, watch, useAttrs, useSlots } from 'vue';
  import { Table } from 'ant-design-vue';
  import { BasicForm, useForm } from '@/components/Form';
  import { PageWrapperFixedHeightKey } from '@/enums/pageEnum';
  import HeaderCell from './components/HeaderCell.vue';
  import { InnerHandlers, InnerMethods } from './types/table';
  import { usePagination } from './hooks/usePagination';
  import { useColumns } from './hooks/useColumns';
  import { useDataSource } from './hooks/useDataSource';
  import { useLoading } from './hooks/useLoading';
  import { useRowSelection } from './hooks/useRowSelection';
  import { useTableScroll } from './hooks/useTableScroll';
  import { useTableScrollTo } from './hooks/useScrollTo';
  import { useCustomRow } from './hooks/useCustomRow';
  import { useTableStyle } from './hooks/useTableStyle';
  import { useTableHeader } from './hooks/useTableHeader';
  import { useTableExpand } from './hooks/useTableExpand';
  import { createTableContext } from './hooks/useTableContext';
  import { useTableFooter } from './hooks/useTableFooter';
  import { useTableForm } from './hooks/useTableForm';
  import { useDesign } from '@/hooks/web/useDesign';
  import { omit, debounce } from 'lodash-es';
  import { useElementSize } from '@vueuse/core';
  import { basicProps } from './props';
  import { isFunction } from '@/utils/is';

  defineOptions({ name: 'BasicTable' });

  const props = defineProps(basicProps);

  const emit = defineEmits([
    'fetch-success',
    'fetch-error',
    'selection-change',
    'register',
    'row-click',
    'row-dbClick',
    'row-contextmenu',
    'row-mouseenter',
    'row-mouseleave',
    'edit-end',
    'edit-cancel',
    'edit-row-end',
    'edit-change',
    'expanded-rows-change',
    'change',
    'columns-change',
  ]);

  const attrs = useAttrs();
  const slots = useSlots();

  const tableElRef = ref(null);
  const tableData = ref([]);

  const wrapRef = ref(null);
  const formRef = ref(null);
  const innerPropsRef = ref<Partial<BasicTableProps>>();

  const { height } = useElementSize(wrapRef);

  const { prefixCls } = useDesign('basic-table');
  const [registerForm, formActions] = useForm();

  const getProps = computed(() => {
    return { ...props, ...unref(innerPropsRef) } as BasicTableProps;
  });

  const isFixedHeightPage = inject(PageWrapperFixedHeightKey, false);

  const { getLoading, setLoading } = useLoading(getProps);
  const { getPaginationInfo, getPagination, setPagination, setShowPagination, getShowPagination } =
    usePagination(getProps);

  const {
    getRowSelection,
    getRowSelectionRef,
    getSelectRows,
    setSelectedRows,
    clearSelectedRowKeys,
    getSelectRowKeys,
    deleteSelectRowByKey,
    setSelectedRowKeys,
  } = useRowSelection(getProps, tableData, emit);

  const {
    handleTableChange: onTableChange,
    getDataSourceRef,
    getDataSource,
    getRawDataSource,
    getSearchInfo,
    setTableData,
    updateTableDataRecord,
    deleteTableDataRecord,
    insertTableDataRecord,
    findTableDataRecord,
    fetch,
    getRowKey,
    reload,
    getAutoCreateKey,
    updateTableData,
  } = useDataSource(
    getProps,
    {
      tableData,
      getPaginationInfo,
      setLoading,
      setPagination,
      getFieldsValue: formActions.getFieldsValue,
      clearSelectedRowKeys,
    },
    emit,
  );

  function handleTableChange(pagination: any, filters: any, sorter: any, extra: any) {
    onTableChange(pagination, filters, sorter);
    emit('change', pagination, filters, sorter);
    // 解决通过useTable注册onChange时不起作用的问题
    const { onChange } = unref(getProps);
    onChange && isFunction(onChange) && onChange(pagination, filters, sorter, extra);
  }

  const {
    getViewColumns,
    getColumns,
    setCacheColumnsByField,
    setCacheColumns,
    setColumnWidth,
    setColumns,
    getColumnsRef,
    getCacheColumns,
  } = useColumns(getProps, getPaginationInfo);

  const { getScrollRef, redoHeight } = useTableScroll(
    getProps,
    tableElRef,
    getColumnsRef,
    getRowSelectionRef,
    getDataSourceRef,
    wrapRef,
    formRef,
  );
  const debounceRedoHeight = debounce(redoHeight, 50);

  const { scrollTo } = useTableScrollTo(tableElRef, getDataSourceRef);

  const { customRow } = useCustomRow(getProps, {
    setSelectedRowKeys,
    getSelectRowKeys,
    clearSelectedRowKeys,
    getAutoCreateKey,
    emit,
  });

  const { getRowClassName } = useTableStyle(getProps, prefixCls);

  const { getExpandOption, expandAll, expandRows, collapseRows, collapseAll, handleTableExpand } =
    useTableExpand(getProps, tableData, emit);

  const handlers: InnerHandlers = {
    onColumnsChange: (data: ColumnChangeParam[]) => {
      emit('columns-change', data);
      // support useTable
      unref(getProps).onColumnsChange?.(data);
    },
  };

  const methods: InnerMethods = {
    clearSelectedRowKeys,
    getSelectRowKeys,
  };

  const { getHeaderProps } = useTableHeader(getProps, slots, handlers, methods);

  const { getFooterProps } = useTableFooter(getProps, getScrollRef, tableElRef, getDataSourceRef);

  const { getFormProps, replaceFormSlotKey, getFormSlotKeys, handleSearchInfoChange } =
    useTableForm(getProps, slots, fetch, getLoading);

  const getBindValues = computed(() => {
    const dataSource = unref(getDataSourceRef);
    let propsData: any = {
      ...attrs,
      customRow,
      ...unref(getProps),
      ...unref(getHeaderProps),
      scroll: unref(getScrollRef),
      loading: unref(getLoading),
      tableLayout: 'fixed',
      rowSelection: unref(getRowSelectionRef),
      rowKey: unref(getRowKey),
      columns: toRaw(unref(getViewColumns)),
      pagination: toRaw(unref(getPaginationInfo)),
      dataSource,
      footer: unref(getFooterProps),
      ...unref(getExpandOption),
    };
    // if (slots.expandedRowRender) {
    //   propsData = omit(propsData, 'scroll');
    // }

    propsData = omit(propsData, ['class', 'onChange']);
    return propsData;
  });

  const getWrapperClass = computed(() => {
    const values = unref(getBindValues);
    return [
      prefixCls,
      attrs.class,
      {
        [`${prefixCls}-form-container`]: values.useSearchForm,
        [`${prefixCls}--inset`]: values.inset,
      },
    ];
  });

  const getEmptyDataIsShowTable = computed(() => {
    const { emptyDataIsShowTable, useSearchForm } = unref(getProps);
    if (emptyDataIsShowTable || !useSearchForm) {
      return true;
    }
    return !!unref(getDataSourceRef).length;
  });

  watch(height, () => {
    unref(isFixedHeightPage) && props.canResize && debounceRedoHeight();
  });

  function setProps(props: Partial<BasicTableProps>) {
    innerPropsRef.value = { ...unref(innerPropsRef), ...props };
  }

  const tableAction: TableActionType = {
    reload,
    getSelectRows,
    setSelectedRows,
    clearSelectedRowKeys,
    getSelectRowKeys,
    deleteSelectRowByKey,
    setPagination,
    setTableData,
    updateTableDataRecord,
    deleteTableDataRecord,
    insertTableDataRecord,
    findTableDataRecord,
    redoHeight,
    setSelectedRowKeys,
    setColumns,
    setLoading,
    getDataSource,
    getRawDataSource,
    getSearchInfo,
    setProps,
    getRowSelection,
    getPaginationRef: getPagination,
    getColumns,
    getCacheColumns,
    emit,
    updateTableData,
    setShowPagination,
    getShowPagination,
    setCacheColumnsByField,
    expandAll,
    collapseAll,
    expandRows,
    collapseRows,
    scrollTo,
    getSize: () => {
      return unref(getBindValues).size as SizeType;
    },
    setCacheColumns,
  };
  createTableContext({ ...tableAction, wrapRef, getBindValues });

  emit('register', tableAction, formActions);

  defineExpose({ tableElRef, ...tableAction });
</script>
<style lang="less">
  @border-color: #cecece4d;

  @prefix-cls: ~'@{namespace}-basic-table';

  .@{prefix-cls} {
    max-width: 100%;
    height: 100%;

    //表格包装器
    .ant-table-wrapper {
      padding: 6px 0;
      border-radius: 2px;
      background-color: @component-background;

      .ant-table-title {
        padding: 0 0 8px !important;
      }

      .ant-table.ant-table-bordered .ant-table-title {
        border: none !important;
      }

      // 表格容器
      .ant-table {
        width: 100%;
        overflow-x: hidden;
        background-color: @component-background;
        // 表头
        .ant-table-header {
          .ant-table-thead {
            //设置表格头部背景色
            background-color: #0e51ab;

            tr {
              th,
              td {
                padding: 8px 5px; // 设置表格头部内间距,可控制表头高度
                background-color: @component-background;
                //移除表头间隔线
                &:not(:last-child):not(.ant-table-selection-column):not(
                    .ant-table-row-expand-icon-cell
                  ):not([colspan])::before {
                  width: 0;
                }
                // 移除表头右侧竖线
                &.ant-table-cell-scrollbar:not([rowspan]) {
                  box-shadow: none;
                }
              }
            }
          }
        }

        // 表格内容
        .ant-table-body {
          .ant-table-tbody {
            tr.ant-table-row {
              td {
                padding: 8px;
                // 固定列背景色
                &.ant-table-cell-fix-left,
                &.ant-table-cell-fix-right {
                  background: transparent;
                }
                //鼠标移入高亮
                &.ant-table-cell-row-hover {
                  background: rgb(0 0 0 / 30%);
                }
              }
              //鼠标移入高亮
              &:hover {
                td {
                  background: rgb(0 0 0 / 30%);
                }
              }
            }
            // 展开行表格样式
            tr.ant-table-expanded-row {
              .ant-table {
                margin-inline: 0;

                .ant-table-thead {
                  //设置表格头部背景色
                  background-color: #033e8b;

                  tr {
                    th,
                    td {
                      padding: 5px; // 设置表格头部内间距,可控制表头高度
                      background-color: @component-background;
                      //移除表头间隔线
                      &:not(:last-child):not(.ant-table-selection-column):not(
                          .ant-table-row-expand-icon-cell
                        ):not([colspan])::before {
                        width: 0;
                      }
                      // 移除表头右侧竖线
                      &.ant-table-cell-scrollbar:not([rowspan]) {
                        box-shadow: none;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      // 分页器
      .ant-pagination {
        margin: 5px 0 0;
      }
    }

    // 斑马纹
    &-row__striped,
    .ant-table-row-striped {
      td {
        background-color: rgb(0 0 0 / 20%) !important;
      }
    }

    &-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 6px;
      border-bottom: none;
    }

    &-form-container {
      padding: 0;

      .ant-form {
        width: 100%;
        background-color: @component-background;
      }
    }

    .ant-table-cell {
      .ant-tag {
        margin-right: 0;
      }
    }

    .ant-table-wrapper .ant-table-footer {
      padding: 0;

      .ant-table-wrapper {
        padding: 0;
      }

      table {
        border: none !important;
      }

      .ant-table-body {
        overflow-x: hidden !important;
      }

      td {
        padding: 12px 8px;
      }
    }

    &--inset {
      .ant-table-wrapper {
        padding: 0;
      }
    }
  }
</style>
