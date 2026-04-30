import { defHttp } from '@/utils/http/axios';

export interface ParkItem {
  id: string;
  name: string;
  parentId: string | null;
  ancestors: string;
  orderNum: number;
  address: string | null;
  positionX: number;
  positionY: number;
  positionZ: number;
  rotationX: number;
  rotationY: number;
  rotationZ: number;
  scaleX: number;
  scaleY: number;
  scaleZ: number;
  isHoverOutline: boolean;
  isClickOutline: boolean;
  modelName: string | null;
  categoryId: string | null;
  index: number | null;
  baseOffsetX: number;
  baseOffsetY: number;
  baseOffsetZ: number;
  deptId: number | null;
  remark: string | null;
  nameEn: string | null;
  nameZh: string | null;
  categoryVo: any;
  parkPortVoList: any[] | null;
}

export function fetchParkList(params?: Record<string, any>) {
  return defHttp.get<ParkItem[]>({
    url: '/smartpark/park/list',
    params,
  });
}


