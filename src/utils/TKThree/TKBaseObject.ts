import * as THREE from "three";
import {TKEvenBus} from "@/utils/TKThree/TKEvenBus";
import {TKCamera} from "@/utils/TKThree/TKCamera";
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {TextureLoader} from "@/utils/TKThree/TKModelLoader"
import {
  colorMaterialFlicker,
  stopColorFlicker,
  stopColorFlickerGroup,
  stopAllColorFlicker,
  toRadians
} from '@/utils/TKThree/TKUtil'
import {delay} from 'xe-utils';

/**
 * TK库的基类，所有对象均继承于该类
 */
export abstract class TKBaseObject {

  name: string = '';
  /**
   * 存放该类的所有模型
   */
  scene: THREE.Group;
  /**
   * 摄像头类，集成所有摄像头操作
   */
  camera: TKCamera;
  control: OrbitControls;
  /**
   * 父节点
   */
  private parent: TKBaseObject;
  /**
   * 所有子节点
   */
  protected children: TKBaseObject[] = [];
  /**
   * 实例化该类时传入的参数
   */
  config: any = null;

  /**
   * 鼠标移入时是否高亮
   */
  isHoverOutline: boolean = false;
  /**
   * 鼠标点击时是否高亮
   */
  isClickOutline: boolean = false;


  /**
   * 初始模型
   */
  mainModel: THREE.Object3D = null;
  /**
   * 点击事件，如果模型有点击事件，则需给该方法赋值
   */
  public clickEvent: Function | null = null;
  /**
   * 双击事件，如果模型有双击事件，则需给该方法赋值
   */
  public dblclickEvent: Function | null = null;
  /**
   * 鼠标覆盖事件，如果模型有鼠标覆盖事件，则需给该方法赋值
   */
  public hoverEvent: Function | null = null;

  /**
   * 模型的尺寸
   * @private
   */
  protected size: THREE.Vector3 = new THREE.Vector3();
  /**
   * 模型的中心位置
   * @private
   */
  private center: THREE.Vector3 = new THREE.Vector3();

  /**
   * 模型的标签
   * @private
   */
  private sprite: THREE.Sprite;

  protected constructor(config: any, model: THREE.Object3D) {
    this.scene = new THREE.Group();
    // 将当前对象保存在scene中
    this.scene.tkObject = this;
    this.config = config;
    this.name = config?.name || '';
    this.isHoverOutline = config?.isHoverOutline || false;
    this.isClickOutline = config?.isClickOutline || false;

    // 部分类不需要加载模型，例如电子围栏
    if (model) {
      model.name = this.name;
      this.scene.add(model);

      this.mainModel = model;
    }
    this.scene.rotation.set(toRadians(config.rotation.x), toRadians(config.rotation.y), toRadians(config.rotation.z));
    this.scene.position.set(config.position.x, config.position.y, config.position.z);
    this.scene.scale.set(config.scale.x, config.scale.y, config.scale.z);

    // 计算物体的大小和位置
    const box = new THREE.Box3().setFromObject(this.scene);
    box.getSize(this.size);
    box.getCenter(this.center);

    // 初始化模型标签，因标签不参与模型大小计算，需要在位置大小计算完成后添加
    this.initSprite(config.spriteName);

  }


  /**
   * 类创建时调用，只调用一次
   */
  abstract start(): void;

  /**
   * 实时更新，循环调用
   * @param delta 时间间隔，大小取决与当前的帧率
   */
  abstract update(delta: number): void;

  addEventListener(eventName: string, callback: Function) {
    if ('click' === eventName) {
      this.clickEvent = callback;
    } else if ('dblclick' === eventName) {
      this.dblclickEvent = callback;
    } else {
      TKEvenBus.getInstance().on(eventName, callback);
    }
  }


  triggerEvent(eventName: string, event: any = null) {
    if ('click' === eventName) {
      this.clickEvent && this.clickEvent(event);
    } else if ('dblclick' === eventName) {
      this.dblclickEvent && this.dblclickEvent(event);
    } else {
      TKEvenBus.getInstance().emit(eventName, event);
    }
  }

  /**
   * 添加子节点
   * @param child
   */
  addChild(child: TKBaseObject): void {
    this.children.push(child);
  }

  getChildren(): TKBaseObject[] {
    return this.children;
  }

  /**
   * 根据子节点ID获取子节点对象
   */
  getChildById(id: string) {
    return this.children.find(child => child.config.id === id) || null;
  }

  /**
   * 设置父节点
   * @param parent
   */
  setParent(parent: TKBaseObject): void {
    this.parent = parent;
  }

  getParent(): TKBaseObject {
    return this.parent;
  }

  /**
   * 获取模型在世界坐标系中的位置
   */
  public getWorldPosition(): THREE.Vector3 {
    const pos = new THREE.Vector3(this.scene.position.x, this.scene.position.y, this.scene.position.z);
    if (this.parent) {
      const parentPos = this.parent.getWorldPosition();
      pos.x += parentPos.x;
      pos.y += parentPos.y;
      pos.z += parentPos.z;
    }
    return pos;
  }

  getSize(): THREE.Vector3 {
    return this.size;
  }

  getCenter(): THREE.Vector3 {
    return this.center;
  }

  public isAlarming: boolean = false;
  private baseSpriteName: string | null = null; // 用于存储基础标签名，如 'Cabinet.png'

  /**
   * 初始化模型标签
   * @param spriteName 基础标签名称 (例如 'Cabinet.png')
   */
  initSprite(spriteName: string): void {
    if (spriteName) {
      this.baseSpriteName = spriteName;
      // 初始化时，根据当前状态更新一次标签
      this.updateSpriteByAlarmState();
    }
  }

  /**
   * 根据当前的 isAlarming 状态更新或创建标签
   * 这是实现告警切换的核心方法
   */
  public updateSpriteByAlarmState(): void {
    if (!this.baseSpriteName) return; // 如果没有设置过基础标签，则不执行任何操作

    // 1. 根据 isAlarming 状态和命名约定，动态生成目标图片路径
    let targetSpritePath = this.baseSpriteName;
    if (this.isAlarming) {
      const parts = this.baseSpriteName.split('.');
      const base = parts.join('.');
      targetSpritePath = `${base}_Alarm`; // 例如 'Cabinet_Alarm.png'
    }

    // 2. 创建或更新 Sprite
    if (!this.sprite) {
      // 如果标签不存在，则创建
      const material = new THREE.SpriteMaterial({map: TextureLoader(targetSpritePath)});
      this.sprite = new THREE.Sprite(material);
      this.sprite.position.y += this.size.y + 1;
      this.sprite.scale.set(0.7, 0.7, 0.7);
      this.scene.add(this.sprite);
    } else {
      // 如果标签已存在，只更新它的贴图，性能更高
      this.sprite.material.map = TextureLoader(targetSpritePath);
      this.sprite.material.needsUpdate = true;
      this.sprite.visible = true; // 确保标签是可见的
    }
  }

  /**
   * 设置对象的告警状态
   * @param isAlarming 是否告警
   */
  public setAlarm(isAlarming: boolean): void {
    if (this.isAlarming === isAlarming) return; // 如果状态没有变化，则不执行任何操作

    this.isAlarming = isAlarming;
    this.updateSpriteByAlarmState(); // 调用核心方法更新视觉
  }

  /**
   * 告警触发
   * 处理颜色的变换
   * @param color
   * @constructor
   */
  // alarm(model:THREE.Object3D): void {
  //   //设置对象颜色
  //   if (model) {
  //     colorMaterial(model, '#fa3c3c',0.5);
  //   }
  // }
  /**
   * 告警显示
   * @param groupId 可选的分组ID，用于批量管理告警动画。默认使用 'alarm' 组
   */
  alarm(groupId: string = 'alarm'): void {
    //设置对象颜色
    if (this.mainModel) {
      colorMaterialFlicker(this.mainModel, '#fa3c3c', 'rgba(241,126,1,0)', 0.8, true, groupId);
    }
  }

  /**
   * 告警视角移动
   * @param groupId 可选的分组ID，用于批量管理告警动画。默认使用 'alarmMove' 组
   */
  alarmMove(groupId: string = 'alarmMove'): void {
    //设置对象颜色
    if (this.mainModel) {
      colorMaterialFlicker(this.mainModel, '#fa3c3c', 'rgba(241,126,1,0)', 0.8, true, groupId);
    }
  }

  /**
   * 停止告警动画
   * @param restoreOriginal 是否恢复到原始颜色，默认为 true
   */
  stopAlarm(restoreOriginal: boolean = true): void {
    if (this.mainModel) {
      stopColorFlicker(this.mainModel, restoreOriginal);
    }
  }

  /**
   * 停止指定组的所有告警动画（静态方法）
   * @param groupId 组ID，如 'alarm' 或 'alarmMove'
   * @param restoreOriginal 是否恢复到原始颜色
   */
  static stopAlarmGroup(groupId: string, restoreOriginal: boolean = true): void {
    stopColorFlickerGroup(groupId, restoreOriginal);
  }

  /**
   * 停止所有告警动画（静态方法）
   * @param restoreOriginal 是否恢复到原始颜色
   */
  static stopAllAlarms(restoreOriginal: boolean = true): void {
    stopAllColorFlicker(restoreOriginal);
  }

  showSprite(): void {
    this.sprite && this.scene.add(this.sprite)
  }

  hideSprite(): void {
    this.sprite && this.scene.remove(this.sprite)
  }
}

