import { defHttp } from '@/utils/http/axios';

export interface ModelItem {
  modelName: string;
  nameZh?: string | null;
  nameEn?: string | null;
}

export interface ModelListResponse {
  total: number;
  rows: ModelItem[];
}

export interface PortItem {
  id: number;
  modelName: string;
  portName: string;
  type: number;
  isFront: number;
  linkType?: number | null;
  remark?: string | null;
}

export interface PortListResponse {
  total: number;
  rows: PortItem[];
}

export function fetchModelList(params: { pageSize?: number; pageNum?: number }) {
  return defHttp.get<ModelListResponse>({
    url: '/smartpark/parkPort/modelNameList',
    params,
  });
}

export function fetchPortList(params: { pageSize?: number; pageNum?: number; modelName: string }) {
  return defHttp.get<PortListResponse>({
    url: '/smartpark/parkPort/list',
    params,
  });
}


