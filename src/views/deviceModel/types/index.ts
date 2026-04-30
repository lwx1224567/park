import type { InjectionKey, Ref } from 'vue';
export type DeviceWorkMode = 'lowPower' | 'normal' | 'highPerformance';
export type InterfaceStatus = 'normal' | 'warning' | 'error' | 'unused' | 'active';

export enum DeviceType {
  SERVER = '服务器',
  SWITCH = '网络交换机'
}

export interface DeviceBasicInfo {
  deviceId: string;
  deviceName: string;
  deviceModel: string;
  deviceType: DeviceType;
  status: string;
  location: string;
  ipAddress: string;
  manufacturer: string;
  firmwareVersion: string;
  portSummary: string;
}

export interface DeviceMetricItem {
  key: 'cpu' | 'memory' | 'temperature' | 'windSpeed';
  label: string;
  value: number;
  unit: string;
  max: number;
  strokeColor: string;
}

export interface DeviceControlState {
  workMode: DeviceWorkMode;
  powerOn: boolean;
  healthScore: number;
}

export interface InterfaceItem {
  id: string;
  name: string;
  status: InterfaceStatus;
  description?: string;
}

export interface InterfaceGroup {
  name: string;
  interfaces: InterfaceItem[];
}

export interface GaugeSummaryItem {
  label: string;
  value: number;
  unit: string;
  color: string;
}

export interface AnalysisBarItem {
  name: string;
  planned: number;
  actual: number;
}

export interface OperationLogItem {
  operation: string;
  time: string;
  operator: string;
}

export interface DeviceModelContext {
  basicInfo: Ref<DeviceBasicInfo>;
  controlState: DeviceControlState;
  updateWorkMode: (mode: DeviceWorkMode) => void;
  updatePower: (powerOn: boolean) => void;
  setHealthScore: (score: number) => void;
  isServer: Ref<boolean>;
}

export const deviceModelContextKey: InjectionKey<DeviceModelContext> = Symbol(
  'device-model-context',
) as InjectionKey<DeviceModelContext>;
