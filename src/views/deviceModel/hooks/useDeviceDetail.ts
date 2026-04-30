import { computed, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import type {
  DeviceBasicInfo,
  DeviceControlState,
  DeviceModelContext,
  DeviceWorkMode,
} from '../types/index';
import { DeviceType } from '../types/index';


const defaultServerBasicInfo: DeviceBasicInfo = {
  deviceId: 'SV-4U-225DX',
  deviceName: '4U-225DX',
  deviceModel: '4U-225DX',
  deviceType: DeviceType.SERVER,
  status: '正常运行',
  location: 'A区机房 2排 01柜',
  ipAddress: '192.168.10.10',
  manufacturer: 'OpenIOT Labs',
  firmwareVersion: 'FW-6.1.22',
  portSummary: '16 / 1000MBPS',
};

const defaultSwitchBasicInfo: DeviceBasicInfo = {
  deviceId: 'SW-1U-525DX',
  deviceName: '1U-525DX',
  deviceModel: '1U-525DX',
  deviceType: DeviceType.SWITCH,
  status: '正常运行',
  location: 'A区机房 3排 02柜',
  ipAddress: '192.168.10.25',
  manufacturer: 'OpenIOT Labs',
  firmwareVersion: 'FW-5.2.18',
  portSummary: '48 / 100MBPS',
};

const modeLabelMap: Record<DeviceWorkMode, string> = {
  lowPower: '低电源模式',
  normal: '正常模式',
  highPerformance: '高性能模式',
};

const modeHealthMap: Record<DeviceWorkMode, number> = {
  lowPower: 88,
  normal: 96,
  highPerformance: 100,
};

export function useDeviceDetail() {
  const route = useRoute();

  const routeDeviceId = computed(() => {
    const rawValue = route.params.deviceId ?? route.query.deviceId;
    return typeof rawValue === 'string' && rawValue.trim()
      ? rawValue
      : defaultServerBasicInfo.deviceId;
  });

  const isServer = computed(() => {
    return routeDeviceId.value.startsWith('SV-');
  });

  const basicInfo = ref<DeviceBasicInfo>({
    ...(isServer.value ? defaultServerBasicInfo : defaultSwitchBasicInfo),
    deviceId: routeDeviceId.value,
  });

  const controlState = reactive<DeviceControlState>({
    workMode: 'normal',
    powerOn: true,
    healthScore: 96,
  });

  const updateWorkMode = (mode: DeviceWorkMode) => {
    controlState.workMode = mode;
    basicInfo.value.status = controlState.powerOn ? modeLabelMap[mode] : '已关机';
    if (controlState.powerOn) {
      controlState.healthScore = modeHealthMap[mode];
    }
  };

  const updatePower = (powerOn: boolean) => {
    controlState.powerOn = powerOn;
    basicInfo.value.status = powerOn ? modeLabelMap[controlState.workMode] : '已关机';
    controlState.healthScore = powerOn ? modeHealthMap[controlState.workMode] : 0;
  };

  const setHealthScore = (score: number) => {
    const nextScore = Math.max(0, Math.min(100, Math.round(score)));
    controlState.healthScore = controlState.powerOn ? nextScore : 0;
  };

  const workModeLabel = computed(() => modeLabelMap[controlState.workMode]);
  const runningLabel = computed(() => (controlState.powerOn ? '在线运行' : '离线待机'));

  const context: DeviceModelContext = {
    basicInfo,
    controlState,
    updateWorkMode,
    updatePower,
    setHealthScore,
    isServer,
  };

  return {
    basicInfo,
    controlState,
    workModeLabel,
    runningLabel,
    isServer,
    context,
  };
}
