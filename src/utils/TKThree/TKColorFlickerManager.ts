import * as THREE from 'three';

/**
 * 颜色闪烁管理器 - 用于统一管理所有闪烁动画
 */
export class TKColorFlickerManager {
  private static instance: TKColorFlickerManager;
  private flickeringModels: Map<string, Set<THREE.Mesh>> = new Map();

  private constructor() {}

  static getInstance(): TKColorFlickerManager {
    if (!TKColorFlickerManager.instance) {
      TKColorFlickerManager.instance = new TKColorFlickerManager();
    }
    return TKColorFlickerManager.instance;
  }

  /**
   * 添加闪烁模型
   * @param groupId 分组ID
   * @param model 模型对象
   */
  addModel(groupId: string, model: THREE.Object3D): void {
    if (!this.flickeringModels.has(groupId)) {
      this.flickeringModels.set(groupId, new Set());
    }
    model.traverse((child) => {
      if (child.isMesh) {
        this.flickeringModels.get(groupId)!.add(child as THREE.Mesh);
      }
    });
  }

  /**
   * 移除闪烁模型
   * @param groupId 分组ID
   * @param model 模型对象
   */
  removeModel(groupId: string, model: THREE.Object3D): void {
    const meshes = this.flickeringModels.get(groupId);
    if (meshes) {
      model.traverse((child) => {
        if (child.isMesh) {
          meshes.delete(child as THREE.Mesh);
        }
      });
      if (meshes.size === 0) {
        this.flickeringModels.delete(groupId);
      }
    }
  }

  /**
   * 停止指定组的所有闪烁动画
   * @param groupId 组ID
   * @param restoreOriginal 是否恢复到原始颜色
   */
  stopGroup(groupId: string, restoreOriginal: boolean = true): void {
    const meshes = this.flickeringModels.get(groupId);
    if (meshes) {
      meshes.forEach((mesh) => {
        // 清除动画
        if ((mesh as any).animateId) {
          cancelAnimationFrame((mesh as any).animateId);
          delete (mesh as any).animateId;
        }
        // 恢复原始材质属性
        if (restoreOriginal) {
          if (mesh.userData.originalColor) {
            mesh.material.color.copy(mesh.userData.originalColor);
          }
          if (mesh.userData.originalOpacity !== undefined) {
            mesh.material.opacity = mesh.userData.originalOpacity;
          }
          if (mesh.userData.originalTransparent !== undefined) {
            mesh.material.transparent = mesh.userData.originalTransparent;
          }
        }
      });
      this.flickeringModels.delete(groupId);
    }
  }

  /**
   * 停止所有闪烁动画
   * @param restoreOriginal 是否恢复到原始颜色
   */
  stopAll(restoreOriginal: boolean = true): void {
    this.flickeringModels.forEach((meshes, groupId) => {
      this.stopGroup(groupId, restoreOriginal);
    });
  }

  /**
   * 获取所有正在闪烁的组ID
   * @returns 组ID数组
   */
  getActiveGroups(): string[] {
    return Array.from(this.flickeringModels.keys());
  }

  /**
   * 检查指定组是否存在
   * @param groupId 组ID
   * @returns 是否存在
   */
  hasGroup(groupId: string): boolean {
    return this.flickeringModels.has(groupId);
  }

  /**
   * 获取指定组的模型数量
   * @param groupId 组ID
   * @returns 模型数量
   */
  getGroupSize(groupId: string): number {
    return this.flickeringModels.get(groupId)?.size || 0;
  }

  /**
   * 清空所有闪烁动画（不恢复颜色）
   */
  clear(): void {
    this.flickeringModels.forEach((meshes) => {
      meshes.forEach((mesh) => {
        if ((mesh as any).animateId) {
          cancelAnimationFrame((mesh as any).animateId);
          delete (mesh as any).animateId;
        }
      });
    });
    this.flickeringModels.clear();
  }
}

