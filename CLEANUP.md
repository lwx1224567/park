# 项目清理说明

## 需要手动删除的目录

由于权限限制,以下目录需要手动删除:

### API层 (src/api/)
```
src/api/admin/
src/api/antiDrone/
src/api/cockpit/
src/api/home/
src/api/system/
src/api/visitor/
```

### 视图层 (src/views/)
```
src/views/admin/
src/views/antiDrone/
src/views/home/
src/views/visitorSystem/
```

## 删除命令

在项目根目录运行:

```cmd
rmdir /s /q src\api\admin
rmdir /s /q src\api\antiDrone
rmdir /s /q src\api\cockpit
rmdir /s /q src\api\home
rmdir /s /q src\api\system
rmdir /s /q src\api\visitor
rmdir /s /q src\views\admin
rmdir /s /q src\views\antiDrone
rmdir /s /q src\views\home
rmdir /s /q src\views\visitorSystem
```

## 保留的目录

- `src/api/park/` - 园区API接口(空)
- `src/views/park/` - 智慧园区驾驶舱页面
- `src/views/sys/` - 系统页面(404等)
- `src/components/` - 所有组件
- `src/layouts/` - 布局组件

## 清理后的项目结构

```
src/
├── api/
│   └── park/          # 园区接口(空)
├── components/        # 组件库(完整保留)
│   ├── CockpitLayouts/
│   ├── MenuPanel/
│   └── ...
├── layouts/          # 布局(完整保留)
│   └── header/
├── views/
│   ├── park/        # 智慧园区驾驶舱
│   └── sys/         # 系统页面
└── ...
```
