<template>
  <div class="w-80 h-full bg-color">
    <div>
      <div class="title">访客系统</div>
      <ul class="menu-list">
        <li class="menu" v-for="menu in menuData" :key="menu.path">
          <router-link :to="menu.path" custom v-slot="{ isActive, navigate }">
            <div class="bg" :class="{ active: isActive }" @click="navigate">{{ menu.title }}</div>
          </router-link>
        </li>
      </ul>
    </div>
    <div class="exit-button-wrapper">
      <div class="exit-button" @click="handleExit">退出访客系统</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useMenuStore } from '@/store/modules/menu';
  import { computed } from 'vue';
  import { useRouter } from 'vue-router';

  const menuStore = useMenuStore();
  const menuData = computed(() => menuStore.getVisitorMenu);

  const router = useRouter();
  const handleExit = () => {
    router.push('/tkzw/park');
  };
</script>
<style lang="less" scoped>
  .bg-color {
    display: flex;
    flex-direction: column;
    border-radius: 10px;
    background: linear-gradient(0deg, rgb(5 20 63 / 70%), rgb(5 20 63 / 70%));

    .title {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 15px;
      padding: 15px;
      border: 1px solid #00d8ff;
      background: linear-gradient(0deg, rgb(5 20 63 / 70%), rgb(5 20 63 / 100%));
      color: #d8effc;
      font-size: 22px;
      font-weight: bold;
      user-select: none;
    }

    .menu-list {
      display: flex;
      flex-direction: column;
      gap: 15px;

      .menu {
        width: 100%;

        .bg {
          padding: 15px;
          overflow: hidden;
          transition: all 0.2s;
          background: linear-gradient(to right, rgb(34 68 125 / 90%), rgb(5 20 63 / 70%));
          font-size: 18px;
          font-weight: bold;
          text-overflow: ellipsis;
          white-space: nowrap;
          cursor: pointer;

          &.active {
            background: linear-gradient(to right, rgb(0 91 204 / 90%), rgb(5 20 63 / 70%));
          }

          &:hover {
            background: linear-gradient(to right, rgb(0 91 204 / 90%), rgb(5 20 63 / 70%));
          }
        }
      }
    }

    .exit-button-wrapper {
      display: flex;
      justify-content: center;
      margin-top: auto;
      padding: 15px;

      .exit-button {
        padding: 10px 20px;
        transition: all 0.3s ease;
        border-radius: 6px;
        background-color: #0a3779;
        box-shadow: inset 0 0 10px rgb(24 144 255 / 50%);
        color: #d8effc;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;

        &:hover {
          background-color: #0c4a9e;
          box-shadow: inset 0 0 20px rgb(24 144 255 / 80%);
        }
      }
    }
  }
</style>
