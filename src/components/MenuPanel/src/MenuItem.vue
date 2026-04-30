<template>
  <div class="menu-item" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave">
    <StatusButton :text="menu.name" />
    <div class="dropdown-menu" :show="isChildren">
      <a-checkbox-group
        v-model:value="checkboxValue"
        @change="handleChange"
        v-if="type === 'checkbox'"
      >
        <TransitionGroup
          tag="ul"
          class="menu-list"
          name="list"
          :css="false"
          @before-enter="onBeforeEnter"
          @enter="onEnter"
          @leave="onLeave"
        >
          <li class="item" v-for="(item, index) in menuData" :key="index">
            <a-checkbox
              :value="item[valueKey]"
              @change="(e) => handleItemChange({ item, checked: e.target.checked })"
              >{{ item[labelKey] }}</a-checkbox
            >
          </li>
        </TransitionGroup>
      </a-checkbox-group>
      <TransitionGroup
        tag="ul"
        class="menu-list"
        name="list"
        :css="false"
        @before-enter="onBeforeEnter"
        @enter="onEnter"
        @leave="onLeave"
        v-if="type === 'normal'"
      >
        <li
          class="item"
          v-for="(item, index) in menuData"
          :key="index"
          @click="handleItemChange(item)"
        >
          {{ item.name }}
        </li>
      </TransitionGroup>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue';
  import gsap from 'gsap';
  import { StatusButton } from '@/components/Button';
  const props = defineProps({
    menu: {
      // 菜单
      type: Object,
      required: true,
      default: () => {},
    },
    type: {
      // 菜单类型
      type: String,
      default: () => 'normal', // normal 普通菜单， checkbox 多选菜单
    },
    children: {
      // 子菜单
      type: Array<any>,
      default: () => [],
    },
    valueKey: {
      // 多选框选中的key
      type: String,
      required: true,
      default: () => 'name',
    },
    labelKey: {
      // 多选框显示的值key
      type: String,
      required: true,
      default: () => 'name',
    },
    selectedItems: {
      // 选中的值
      type: Array<any>,
      default: () => [],
    },
  });
  // 定义 emit
  const emit = defineEmits(['change', 'update:selectedItems', 'itemChange']);
  const menuData = computed(() => (isChildren.value ? props.children : [])); // 菜单数据
  const checkboxValue = ref(props.selectedItems); // 选中的值

  /**
   * @description: 改变
   * @param {*} value
   * @return {*}
   */
  const handleChange = (value) => {
    emit('update:selectedItems', value); // 双向绑定
    emit('change', value); // 触发 change 事件
  };

  const handleItemChange = (e) => {
    emit('itemChange', e); // 触发 change 事件
  };

  const onBeforeEnter = (el) => {
    el.style.opacity = 0;
    el.style.transform = `translate(-10px, 0px)`;
  };

  /**
   * @description: 进入
   * @param {*}
   * @return {*}
   */
  const onEnter = (el, done) => {
    gsap.to(el, {
      opacity: 1,
      x: 0,
      duration: 0.15,
      delay: el.dataset.index * 0.05,
      onComplete: done,
    });
  };

  /**
   * @description: 离开
   * @param {*}
   * @return {*}
   */
  const onLeave = (el, done) => {
    gsap.to(el, {
      opacity: 0,
      x: -10,
      duration: 0.2,
      onComplete: done,
    });
  };

  const isChildren = ref(false);
  const onMouseEnter = () => {
    isChildren.value = true;
  };
  const onMouseLeave = () => {
    isChildren.value = false;
  };
</script>

<style lang="scss" scoped>
  .menu-item {
    position: relative;

    .dropdown-menu {
      display: block;
      position: absolute;
      z-index: 99999;
      left: 50%;
      box-sizing: border-box;
      min-width: 100%;
      transform: translateX(-50%);
      border-radius: 6px;

      .menu-list {
        display: flex;
        flex-direction: column;
        width: 100%;
        margin: 0;
        padding: 5px 0;
        gap: 8px;

        .checkbox-group {
          display: flex;
          flex-direction: column;
          width: 100%;
          gap: 5px;
        }

        .item {
          position: relative;
          width: 100%;
          padding: 8px;
          border-radius: 4px;
          background: rgb(34 178 242 / 40%);
          text-align: center;
          cursor: pointer;
        }
      }
    }
  }
</style>
