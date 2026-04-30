<template>
  <div>
    <slot name="insertFooter"></slot>
    <Button3 v-bind="cancelButtonProps" @click="handleCancel" v-if="showCancelBtn">
      {{ cancelText }}
    </Button3>
    <slot name="centerFooter"></slot>
    <Button3
      :type="okType"
      @click="handleOk"
      :loading="confirmLoading"
      v-bind="okButtonProps"
      v-if="showOkBtn"
    >
      {{ okText }}
    </Button3>
    <slot name="appendFooter"></slot>
  </div>
</template>
<script lang="ts" setup>
  import { basicProps } from '../props';
  import { Button3 } from '@/components/Button';

  defineOptions({ name: 'BasicModalFooter' });

  defineProps(basicProps);

  const emit = defineEmits(['ok', 'cancel']);

  function handleOk(e: Event) {
    emit('ok', e);
  }

  function handleCancel(e: Event) {
    emit('cancel', e);
  }
</script>
