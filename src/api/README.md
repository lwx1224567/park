# API 接口层

此目录用于存放所有API接口定义。

## 目录结构

- `park/` - 园区相关接口

## 使用示例

```typescript
import { defHttp } from '@/utils/http/axios';

export function getDataList() {
  return defHttp.get({ url: '/api/data/list' });
}
```
