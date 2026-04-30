// 类注册器
import {TKBaseObject} from "@/utils/TKThree/TKBaseObject";
import * as THREE from 'three';
import {ModelLoader, ModelType} from "@/utils/TKThree/TKModelLoader";
import {TKEvenBus} from "@/utils/TKThree/TKEvenBus";

/**
 * 类工厂
 */
class TKClassFactory {
  private static classes: { [key: string]: new () => TKBaseObject } = {};
  private static models: { [key: string]: THREE.Object3D } = {};

  public static transparentMaterial = new THREE.MeshPhongMaterial({
    color: 0x00BFFF, // 绿色，你可以根据需要调整颜色
    transparent: true, // 启用透明度
    opacity: 0.01, // 设置透明度，0.0是完全透明，1.0是完全不透明
    side: THREE.DoubleSide // 如果需要两面都可见的话
  });

  /**
   * 注册类
   * @param className 类名
   * @param clazz 类的构造函数名
   */
  static registerClass(className: string, clazz: new () => TKBaseObject) {
    this.classes[className] = clazz;
  }

  /**
   * 注册模型
   * @param modelName
   * @param modelType
   * @param onProgress 进度回调函数
   */
  static async registerModel(modelName: string, modelType: ModelType, onProgress?: (progress: number) => void) {
    try {
      const result = await ModelLoader(modelName, modelType, onProgress);
      // const result = await ModelLoader('/models/园区模型/' + modelName + '.glb', modelType);
      this.models[result.name] = result.model;
    } catch (error) {
      throw error;
    }
  }

  /**
   * 批量注册模型（并行加载）
   * @param modelNameList 模型列表，包含模型名称和类型
   * @param onTotalProgress 总体进度回调函数，接收0-100的总体进度值
   */
  static async registerModels(
    modelNameList: Array<{ modelName: string, modelType: ModelType }>,
    onTotalProgress?: (totalProgress: number) => void
  ) {
    const totalModels = modelNameList.length; // 模型总数
    const modelProgress: { [key: string]: number } = {}; // 存储每个模型的加载进度
    let completedCount = 0; // 已完成的模型数量

    // 为每个模型创建加载任务和进度追踪
    const list = modelNameList.map((item, index) => {
      const { modelName, modelType } = item;
      // 初始化每个模型的进度为0
      modelProgress[modelName] = 0;

      // 为每个模型创建独立的进度回调函数
      const onProgress = (progress: number) => {
        const previousProgress = modelProgress[modelName] || 0;
        // 更新当前模型的进度
        modelProgress[modelName] = progress;

        // 计算所有模型的平均进度（总体进度）
        // 将每个模型的进度相加，然后除以模型总数
        const totalProgress = Object.values(modelProgress).reduce((sum, p) => sum + p, 0) / totalModels;

        // 通过事件总线发送总体加载进度事件，供UI组件监听显示
        TKEvenBus.getInstance().emit('totalModelLoadingProgress', {
          totalProgress,  // 总体进度百分比
          loadedCount: Object.values(modelProgress).filter(p => p >= 100).length, // 已加载完成的模型数量
          totalCount: totalModels, // 模型总数
        });

        // 如果提供了总体进度回调函数，则调用它
        if (onTotalProgress) {
          onTotalProgress(totalProgress);
        }

        // 如果模型从非完成状态变为完成状态，增加完成计数
        if (progress >= 100 && previousProgress < 100) {
          completedCount++;
        }
      };

      // 返回每个模型的加载Promise
      return ModelLoader(modelName, modelType, onProgress);
    });

    // 等待所有模型加载完成（并行加载）
    await Promise.all(list).then((values) => {
      // 将加载完成的模型存储到models对象中
      values.forEach((value) => this.models[value['name']] = value['model'])

      // 所有模型加载完成，确保总体进度为100%
      TKEvenBus.getInstance().emit('totalModelLoadingProgress', {
        totalProgress: 100,
        loadedCount: totalModels,
        totalCount: totalModels,
      });

      // 调用总体进度回调，通知加载完成
      if (onTotalProgress) {
        onTotalProgress(100);
      }
    }).catch((error) => {
      console.error(error);
    });
  }

  /**
   * 根据类名动态创建类实例
   * @param className 类名
   * @param config  类的构造函数传参
   */
  static createInstance(className: string, config: any = null): TKBaseObject {
    const TargetClass = this.classes[className];
    if (!TargetClass) {
      throw new Error(`Class ${className} is not registered`);
    }

    // 如果配置中有modelName，则使用已注册的模型
    if (config && config.modelName) {
      if (!this.models[config.modelName]) {
        throw new Error(`Model ${config.modelName} is not registered`);
      }
      // 克隆模型并传递给构造函数
      const clonedModel = this.models[config.modelName].clone();

      // 给每个注册的模型添加一个透明材质，后续虚化的时候使用
      clonedModel.traverse((child) => {
        // 克隆不会复制材质，需要对材质克隆
        if (child.material) {
          child.material = child.material.clone();
        }
        if (child.isMesh) {
          child.userData.transparentMaterial = TKClassFactory.transparentMaterial;
          child.userData.originalMaterial = child.material;
        }
      });

      return new TargetClass(config, clonedModel);
    }

    return new TargetClass(config);
  }

  /**
   * 判断对象是否是某个类型的实例
   * @param obj 对象
   * @param className 类名
   */
  static instanceof(obj: any, className: string): boolean {
    return obj instanceof this.classes[className];
  }

  /**
   * 根据模型名称获取模型
   * @param modelName
   */
  static getModelByName(modelName: string): THREE.Object3D | undefined {
    return this.models[modelName].clone();
  }
}

export {TKClassFactory}
