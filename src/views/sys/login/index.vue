<template>
  <div class="login-container w-full h-full">
    <!-- <Earth3D /> -->
    <div class="login-content rounded-md shadow-md px-8 pt-6 pb-2 w-120">
      <a-form :model="formData" :rules="getFormRules" ref="formRef" @keypress.enter="handleLogin">
        <div class="title pb-6 enter-x"> 用户登录 </div>
        <a-form-item name="username" class="enter-x">
          <a-input
            size="large"
            v-model:value="formData.username"
            placeholder="账号"
            class="fix-auto-fill"
          >
            <template #prefix> <UserOutlined /> </template>
          </a-input>
        </a-form-item>
        <a-form-item name="password" class="enter-x">
          <a-input-password
            size="large"
            v-model:value="formData.password"
            placeholder="密码"
            class="fix-auto-fill"
          >
            <template #prefix> <UnlockOutlined /> </template>
          </a-input-password>
        </a-form-item>
        <a-form-item class="enter-x">
          <a-checkbox v-model:checked="rememberMe" size="small">记住我</a-checkbox>
        </a-form-item>
        <a-form-item class="enter-x">
          <a-button type="primary" size="large" block @click="handleLogin" :loading="loading">
            登录
          </a-button>
        </a-form-item>
      </a-form>
    </div>
    <div class="footer">
      <!-- <span></span> -->
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { UserOutlined, UnlockOutlined } from '@ant-design/icons-vue';
  import { useFormValid, useFormRules } from './useLogin';
  import { reactive, ref, onMounted } from 'vue';
  import { createLocalStorage } from '@/utils/cache';
  import { useUserStore } from '@/store/modules/user';
  import { useMessage } from '@/hooks/web/useMessage';

  const userStore = useUserStore();
  const { notification, createErrorModal } = useMessage();

  const formRef = ref();
  const loading = ref(false);
  const { getFormRules } = useFormRules();

  // prod环境默认加密 RUOYI_PLUS__PRODUCTION__版本__REMEMBERME
  const storage = createLocalStorage();
  const cacheKey = 'rememberMe';
  const rememberMe = ref<boolean>(!!storage.get(cacheKey));

  function handleRememberMe(data: Recordable) {
    const { username, password, role } = data;
    const rememberMeData = { username, password, role };
    if (rememberMe.value) {
      storage.set(cacheKey, rememberMeData);
    } else {
      storage.remove(cacheKey);
    }
  }

  function setRememberMeData() {
    const data = storage.get(cacheKey);
    if (data) {
      const { username = '', password = ''} = data;
      formData.username = username;
      formData.password = password;
    }
  }

  onMounted(async () => {
    // 设置记住我数据
    setRememberMeData();
  });

  const { validForm } = useFormValid(formRef);
  const formData = reactive({
    username: 'admin',
    password: 'admin123',
  });
  async function handleLogin() {
    const data = await validForm();
    if (!data) return;
    try {
      loading.value = true;
      const userInfo = await userStore.login(data);
      if (userInfo) {
        handleRememberMe(formData);
        notification.success({
          message: '登录成功！',
          description: `欢迎回来: ${userInfo.userName}`,
          duration: 3,
        });
      }
    } catch (error) {
      createErrorModal({
        title: '错误提示',
        content: (error as unknown as Error).message || '网络异常，请检查您的网络连接是否正常！',
        getContainer: () => document.body,
      });
    } finally {
      loading.value = false;
    }
  }
</script>
<style lang="less" scoped>
  .login-container {
    position: relative;
    background: url('@/assets/images/layouts/login-bg.png') no-repeat center;
    background-size: cover;

    .login-content {
      position: absolute;
      top: 50%;
      right: 150px;
      transform: translateY(-50%);
      background-color: rgb(255 255 255 / 10%);

      .title {
        color: #1770e6;
        font-size: 28px;
        font-weight: bold;
        text-align: center;
      }
    }

    .footer {
      position: fixed;
      bottom: 0;
      width: 100%;
      color: #fff;
      font-family: Arial;
      font-size: 12px;
      letter-spacing: 1px;
      line-height: 40px;
      text-align: center;
    }
  }
</style>
