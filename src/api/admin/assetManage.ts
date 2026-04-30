import { defHttp } from '@/utils/http/axios';

export interface AssetItem {
  id: number;
  parkId: number | null;
  name: string;
  model: string;
  serialNumber: string;
  type: number;
  assetStatus: number;
  purchaseDate: string | null;
  assetValue: string | number | null;
  discoverySource: number;
  isValid: number;
  ipAddress: string | null;
  macAddress: string | null;
  warrantyEndDate: string | null;
  deptId: number | null;
  remark: string | null;
}

export interface AssetListResponse {
  total: number;
  rows: AssetItem[];
}

export function fetchAssetList(params: { pageSize?: number; pageNum?: number } & Record<string, any>) {
  return defHttp.get<AssetListResponse>({
    url: '/smartpark/assets/list',
    params,
  });
}

export function createAsset(data) {
  return defHttp.post({
    url: '/smartpark/assets',
    data,
  });
}

export function updateAsset(data) {
  return defHttp.put({
    url: '/smartpark/assets',
    data,
  });
}

export function deleteAsset(id: string | number) {
  return defHttp.delete({
    url: `/smartpark/assets/${id}`,
  });
}


