import {TKBaseObject} from '@/utils/TKThree/TKBaseObject';

// ** 模型类 ** //
import {Park} from '@/views/park/models/Park';
import {Back} from '@/views/park/models/parkDevice/Back';
import {GeoFence} from '@/views/park/models/parkDevice/GeoFence';
import {Storey} from '@/views/park/models/parkDevice/Storey';
import {SkyBox} from '@/views/park/models/SkyBox';
import {OutdoorCamera} from '@/views/park/models/parkDevice/OutdoorCamera';
import {Cabinet} from '@/views/park/models/roomDevice/Cabinet';
import {Build} from '@/views/park/models/parkDevice/Build';
import {Aircondition} from '@/views/park/models/roomDevice/Aircondition';
import {Workbenches} from '@/views/park/models/roomDevice/Workbenches';
import {Ups} from '@/views/park/models/roomDevice/Ups';
import {IndoorCamera} from '@/views/park/models/roomDevice/IndoorCamera';
import {BaseDevice} from '@/views/park/models/cabinetDevice/BaseDevice';
import {Switch_1U} from '@/views/park/models/cabinetDevice/Switch_1U';
import {Switch_2U} from '@/views/park/models/cabinetDevice/Switch_2U';
import {Switch_3U} from '@/views/park/models/cabinetDevice/Switch_3U';
import {Parking} from '@/views/park/models/parkDevice/Parking';
import {ParkingSpace} from '@/views/park/models/parkDevice/ParkingSpace';
import {ChargePoint} from '@/views/park/models/parkDevice/ChargePoint';
import {StreetLamp} from '@/views/park/models/parkDevice/StreetLamp';
import {StreetLampSystem} from '@/views/park/models/parkDevice/StreetLampSystem';
import {SecuritySystem} from "@/views/park/models/parkDevice/SecuritySystem";


import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass.js';
import {OutlinePass} from 'three/examples/jsm/postprocessing/OutlinePass.js';
import {GammaCorrectionShader} from 'three/examples/jsm/shaders/GammaCorrectionShader.js';
import {ShaderPass} from 'three/examples/jsm/postprocessing/ShaderPass.js';
import {TKClassFactory} from '@/utils/TKThree/TKClassFactory';
import {TKCamera} from '@/utils/TKThree/TKCamera';
import {ModelType, RGBEModelLoader} from '@/utils/TKThree/TKModelLoader';
import {TKEvenBus} from '@/utils/TKThree/TKEvenBus';
import {CSS2DRenderer, CSS2DObject} from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import {RoomDevice} from '@/views/park/models/roomDevice/RoomDevice';
// 引入lodash的防抖函数
import {debounce} from 'lodash';
import {TKAlarmManager} from '@/utils/TKThree/TKAlarmManager';
import {TKLineManager} from '@/utils/TKThree/TKLineManager';

// 引入GSAP动画库

class TKThree {
  objects: Map<string, TKBaseObject> = new Map<string, TKBaseObject>();
  dom: HTMLElement;
  scene: THREE.Scene;
  camera: TKCamera;
  renderer: THREE.WebGLRenderer;
  cssRenderer: CSS2DRenderer;
  control: OrbitControls;
  clock: THREE.Clock = new THREE.Clock();

  composer: EffectComposer;
  renderPass: RenderPass;
  hoverOutlinePass: OutlinePass;
  clickOutlinePass: OutlinePass;

  // 鼠标事件处理
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();
  hoverSelectedObjects: Array<any> = [];
  clickSelectedObjects: Array<any> = [];

  // 当前双击事件对象
  curDblclickObject: TKBaseObject | null = null;

  // 点击计数
  clickCount: number = 0;
  // 轮廓告警管理器
  alarmManager: TKAlarmManager;
  // 连线管理器
  lineManager: TKLineManager;
  // 场景是否已渲染完成（第一帧渲染完成）
  private isSceneReady: boolean = false;

  constructor(dom) {
    this.dom = dom;

    // 注册类
    TKClassFactory.registerClass('Park', Park);
    TKClassFactory.registerClass('Back', Back);
    TKClassFactory.registerClass('GeoFence', GeoFence);
    TKClassFactory.registerClass('OutdoorCamera', OutdoorCamera);
    TKClassFactory.registerClass('SkyBox', SkyBox);
    TKClassFactory.registerClass('Storey', Storey);
    TKClassFactory.registerClass('Cabinet', Cabinet);
    TKClassFactory.registerClass('Build', Build);
    TKClassFactory.registerClass('Aircondition', Aircondition);
    TKClassFactory.registerClass('Workbenches', Workbenches);
    TKClassFactory.registerClass('Ups', Ups);
    TKClassFactory.registerClass('IndoorCamera', IndoorCamera);
    TKClassFactory.registerClass('BaseDevice', BaseDevice);
    TKClassFactory.registerClass('Switch_1U', Switch_1U);
    TKClassFactory.registerClass('Switch_2U', Switch_2U);
    TKClassFactory.registerClass('Switch_3U', Switch_3U);
    TKClassFactory.registerClass('Parking', Parking);
    TKClassFactory.registerClass('ParkingSpace', ParkingSpace);
    TKClassFactory.registerClass('ChargePoint', ChargePoint);
    TKClassFactory.registerClass('StreetLamp', StreetLamp);
    TKClassFactory.registerClass('StreetLampSystem', StreetLampSystem);
    TKClassFactory.registerClass('SecuritySystem', SecuritySystem);
  }

  async init(data) {
    await this.initModel();
    // 初始化告警管理器
    this.alarmManager = TKAlarmManager.getInstance();
    this.initScene();
    this.initCamera();
    this.initLight();
    this.initRenderer();
    this.initControl();
    this.initComposer();
    this.initData(this.scene, data.scene, null);

    this.start();
    this.render();

    this.dom.addEventListener('mousemove', this.onMouseMove.bind(this), false);
    this.dom.addEventListener('click', this.handleClick.bind(this), false);
    this.dom.addEventListener('dblclick', (e) => e.preventDefault(), {passive: false});
    window.addEventListener('resize', this.onWindowResize.bind(this), false);
  }

  // 在应用初始化时注册模型
  async initModel() {
    // 注册模型
    // let t1 = new Date().getTime();
    // await TKClassFactory.registerModel('Park', ModelType.GLB);
    // await TKClassFactory.registerModel('Back', ModelType.GLB);
    // await TKClassFactory.registerModel('Bottom', ModelType.GLB);
    // await TKClassFactory.registerModel('1F', ModelType.GLB);
    // await TKClassFactory.registerModel('2F', ModelType.GLB);
    // await TKClassFactory.registerModel('3F', ModelType.GLB);

    await TKClassFactory.registerModels([
      {modelName: 'Park', modelType: ModelType.GLB},
      {modelName: 'Back', modelType: ModelType.GLB},
      {modelName: 'Bottom', modelType: ModelType.GLB},
      {modelName: '1F', modelType: ModelType.GLB},
      {modelName: '2F', modelType: ModelType.GLB},
      {modelName: '3F', modelType: ModelType.GLB},
      {modelName: 'Top', modelType: ModelType.GLB},
      {modelName: 'ChargePoint', modelType: ModelType.GLB},
      {modelName: 'ParkingSpace', modelType: ModelType.GLB},
      {modelName: 'StreetLamp', modelType: ModelType.GLB},
      {modelName: 'OutdoorCamera', modelType: ModelType.GLB},

      {modelName: 'Cabinet_42U', modelType: ModelType.GLB},
      {modelName: 'FWQ_1U', modelType: ModelType.GLB},
      {modelName: 'FWQ_2U', modelType: ModelType.GLB},
      {modelName: 'FWQ_3U', modelType: ModelType.GLB},
      {modelName: 'FWQ_4U', modelType: ModelType.GLB},
      {modelName: 'KongTiao', modelType: ModelType.GLB},
      {modelName: 'Ups', modelType: ModelType.GLB},
      {modelName: 'IndoorCamera', modelType: ModelType.GLB},
      {modelName: 'Workbenches', modelType: ModelType.GLB},
      {modelName: 'Car', modelType: ModelType.GLB},
    ]);
  }

  initScene() {
    this.scene = new THREE.Scene();
    this.lineManager = new TKLineManager(this.scene);
    const axesHelper = new THREE.AxesHelper(5000);
    // this.scene.add(axesHelper);// 显示坐标轴
    // this.scene.background = new THREE.Color(0xaaaaaa); // 设置背景颜色
    RGBEModelLoader('sky.hdr', (texture) => {
      this.scene.background = texture;
      this.scene.environment = texture;
      this.scene.environment.mapping = THREE.EquirectangularReflectionMapping;
    });
  }

  /**
   * 初始化数据
   */
  initData(scene: THREE.Object3D, children: any[], parent: TKBaseObject): void {
    if (children && children.length > 0) {
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        const tkObject = TKClassFactory.createInstance(child.className, child);
        tkObject.camera = this.camera;
        tkObject.control = this.control;

        // 添加到场景中
        this.objects.set(child.id, tkObject);
        scene.add(tkObject.scene);

        tkObject.isHoverOutline && this.hoverSelectedObjects.push(tkObject.scene);
        tkObject.isClickOutline && this.clickSelectedObjects.push(tkObject.scene);

        // 添加到父节点中
        parent?.addChild(tkObject);
        tkObject.setParent(parent);
        // 递归调用
        this.initData(tkObject.scene, child.children, tkObject);
      }
    }
  }

  initCamera() {
    // 2. 创建透视相机
    this.camera = new TKCamera(75, this.dom.offsetWidth / this.dom.offsetHeight, 0.1, 1000);
    this.camera.position.set(-50, 50, 60);
  }

  initLight() {
    // // 环境光强度调大
    // const ambientLight = new THREE.AmbientLight(0xffffff, 1); // 颜色为白色，强度调大到1.0
    // this.scene.add(ambientLight);
    // const intensity = 1.0;
    // // 平行光强度调大
    // const directionalLight = new THREE.DirectionalLight(0xffffff, intensity); // 光源颜色和强度，强度调大到10
    // directionalLight.position.set(1000, 100, 1000); // 光源位置
    // this.scene.add(directionalLight);
    // const directionalLight2 = new THREE.DirectionalLight(0xffffff, intensity); // 光源颜色和强度，强度调大到10
    // directionalLight2.position.set(-1000, 100, 1000); // 光源位置
    // this.scene.add(directionalLight2);
    // const directionalLight3 = new THREE.DirectionalLight(0xffffff, intensity); // 光源颜色和强度，强度调大到10
    // directionalLight3.position.set(1000, 100, -1000); // 光源位置
    // this.scene.add(directionalLight3);
    // const directionalLight4 = new THREE.DirectionalLight(0xffffff, intensity); // 光源颜色和强度，强度调大到10
    // directionalLight4.position.set(-1000, 100, -1000); // 光源位置
    // this.scene.add(directionalLight4);
    // 点光源强度调大
    // const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0); // 光源颜色和强度，强度调大到20.0
    // directionalLight.position.set(0, 100, 50); // 光源位置
    // this.scene.add(directionalLight);
    // // 创建方向光辅助并添加到场景中
    // const helper = new THREE.DirectionalLightHelper(directionalLight, 50);
    // this.scene.add(helper);
  }

  initControl() {
    this.control = new OrbitControls(this.camera, this.renderer.domElement);
    this.camera.control = this.control;
    // this.control = new OrbitControls(this.camera, this.cssRenderer.domElement);
    this.control.target.copy(new THREE.Vector3(0, 0, -150));
    this.camera.lookAt(this.control.target);
    // this.control.enableDamping = true;
    // this.control.dampingFactor = 0.05;
    this.control.maxPolarAngle = Math.PI / 2;
    this.control.update();
  }

  initRenderer() {
    // 3. 创建渲染器
    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.setSize(this.dom.clientWidth, this.dom.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    // 启用物理正确光照（关键设置）
    this.renderer.physicallyCorrectLights = true;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // 启用色调映射以获得更好的光照效果
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;

    this.dom.appendChild(this.renderer.domElement);

    // 创建 CSS2DRenderer 渲染器
    this.cssRenderer = new CSS2DRenderer();
    this.cssRenderer.setSize(this.dom.offsetWidth, this.dom.offsetHeight);
    this.cssRenderer.domElement.style.position = 'absolute';
    this.cssRenderer.domElement.style.top = 0;
    this.cssRenderer.domElement.style.left = 0;
    this.cssRenderer.domElement.style.pointerEvents = 'none';
    this.cssRenderer.domElement.style.zIndex = '1'; // 确保标签在正确层级
    this.dom.appendChild(this.cssRenderer.domElement);
  }

  initComposer() {
    // 创建后处理流程
    this.composer = new EffectComposer(this.renderer);
    this.renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(this.renderPass);

    // 创建发光描边效果
    this.hoverOutlinePass = new OutlinePass(
      new THREE.Vector2(this.dom.offsetWidth, this.dom.offsetHeight),
      this.scene,
      this.camera,
    );
    // 设置发光描边的视觉效果
    this.hoverOutlinePass.edgeStrength = 8; // 轮廓强度
    this.hoverOutlinePass.edgeGlow = 2; // 轮廓发光强度
    this.hoverOutlinePass.edgeThickness = 4; // 轮廓厚度
    this.hoverOutlinePass.visibleEdgeColor.set('#2babff'); // 可见边缘颜色（发光颜色）
    this.hoverOutlinePass.hiddenEdgeColor.set('#000000'); // 隐藏边缘颜色
    this.hoverOutlinePass.selectedObjects = [];
    // 添加以下设置以确保轮廓不被遮挡
    // this.hoverOutlinePass.renderToScreen = true;
    this.composer.addPass(this.hoverOutlinePass);
    // 创建发光描边效果
    this.clickOutlinePass = new OutlinePass(
      new THREE.Vector2(this.dom.offsetWidth, this.dom.offsetHeight),
      this.scene,
      this.camera,
    );
    // 设置发光描边的视觉效果
    this.clickOutlinePass.edgeStrength = 8; // 轮廓强度
    this.clickOutlinePass.edgeGlow = 2; // 轮廓发光强度
    this.clickOutlinePass.edgeThickness = 4; // 轮廓厚度
    this.clickOutlinePass.visibleEdgeColor.set('#ea684b'); // 可见边缘颜色（发光颜色）
    this.clickOutlinePass.hiddenEdgeColor.set('#000000'); // 隐藏边缘颜色
    this.clickOutlinePass.selectedObjects = [];
    this.composer.addPass(this.clickOutlinePass);

    // 在创建EffectComposer并添加了其他通道（如RenderPass）后
    const gammaCorrection = new ShaderPass(GammaCorrectionShader);
    this.composer.addPass(gammaCorrection);
  }

  start = () => {
    for (const val of this.objects.values()) {
      val.start();
    }

    // 初始化事件监听
    this.initEventListeners();
  };

  /**
   * 初始化事件监听
   */
  initEventListeners() {
    // 监听设备查找事件
    TKEvenBus.getInstance().on('findDevice', this.handleFindDevice.bind(this));
  }

  /**
   * 处理设备查找事件
   * @param payload 查找参数
   */
  handleFindDevice(payload: any) {
    const {deviceId, callback} = payload;
    if (!deviceId || !callback) return;

    // 递归查找设备
    const device = this.findDeviceById(deviceId);
    callback(device);
  }

  /**
   * 根据ID查找设备
   * @param deviceId 设备ID
   * @returns 设备对象或null
   */
  findDeviceById(deviceId: string): TKBaseObject | null {
    // 首先在直接对象中查找
    for (const obj of this.objects.values()) {
      if (obj.config?.id === deviceId) {
        return obj;
      }

      // 递归查找子对象
      const found = this.findDeviceInObject(obj, deviceId);
      if (found) {
        return found;
      }
    }

    return null;
  }

  /**
   * 在对象中递归查找设备
   * @param obj 对象
   * @param deviceId 设备ID
   * @returns 设备对象或null
   */
  private findDeviceInObject(obj: TKBaseObject, deviceId: string): TKBaseObject | null {
    // 检查当前对象
    if (obj.config?.id === deviceId) {
      return obj;
    }
    // 检查子对象
    if (obj.scene && obj.scene.children) {
      for (const child of obj.scene.children) {
        if (child.userData && child.userData.object) {
          const found = this.findDeviceInObject(child.userData.object, deviceId);
          if (found) {
            return found;
          }
        }
      }
    }

    return null;
  }

  /**
   * 渲染动画
   */
  render = () => {
    // 下一帧渲染回调
    requestAnimationFrame(this.render);
    const delta = this.clock.getDelta(); // 必须这样写，要保持每个动画都在一个时间上

    this.objects.forEach((obj) => obj.update(delta));
    this.lineManager?.update(delta); // 更新连线动画

    this.control.update();
    // 重新渲染
    // this.renderer.render(this.scene, this.camera);
    this.composer.render(); // 使用后处理渲染

    this.cssRenderer.render(this.scene, this.camera); // 渲染 CSS2D 元素

    // 第一帧渲染完成后，发送场景准备完成事件
    if (!this.isSceneReady) {
      this.isSceneReady = true;
      // 延迟一帧确保渲染真正完成
      requestAnimationFrame(() => {
        TKEvenBus.getInstance().emit('sceneReady');
      });
    }
  };

  onMouseDblClick = (event) => {
    this.selectIntersectObject(
      event,
      'dblclick',
      this.clickOutlinePass,
      this.scene.children,
      (selectedObj) => {
        selectedObj.dblclickEvent && selectedObj.dblclickEvent();
      },
    );
  };

  onMouseClick = (event) => {
    this.selectIntersectObject(
      event,
      'click',
      this.clickOutlinePass,
      this.scene.children,
      (selectedObj) => {
        selectedObj.clickEvent && selectedObj.clickEvent();
      },
    );
  };

  onMouseMove = (event) => {
    this.selectIntersectObject(
      event,
      'move',
      this.hoverOutlinePass,
      this.hoverSelectedObjects,
      (selectedObj) => {
        selectedObj.hoverEvent && selectedObj.hoverEvent();
      },
    );
  };

  onWindowResize = (event) => {

    this.renderer.setSize(this.dom.clientWidth, this.dom.clientHeight);
    this.camera.aspect = this.dom.clientWidth / this.dom.clientHeight;
    this.camera.updateProjectionMatrix();
  };

  // 创建防抖处理的单击函数
  debouncedSingleClick = debounce((event) => {
    // 如果在防抖期间只点击了一次，执行单击逻辑
    if (this.clickCount === 1) {
      this.onMouseClick(event);
    }
    // 重置点击计数
    this.clickCount = 0;
  }, 300);

  // 统一的点击处理函数
  handleClick(event) {
    this.clickCount++;
    // 如果是第二次点击，说明是双击
    if (this.clickCount === 2) {
      // 取消防抖的单击处理
      this.debouncedSingleClick.cancel();
      this.onMouseDblClick(event);
      // 重置点击计数
      this.clickCount = 0;
    } else {
      // 第一次点击，启动防抖的单击处理
      this.debouncedSingleClick(event);
    }
  }

  /**
   * 鼠标选择或覆盖物体
   * @param event 点击或覆盖事件参数
   * @param eventType   事件类型，click or move
   * @param outlinePass   对应的outlinePass
   * @param selectedObjects   所扫描的物体集合
   * @param onSelected  回调函数，选中物体后，需要做的其他操作
   * @private
   */
  private selectIntersectObject(event, eventType, outlinePass, selectedObjects, onSelected) {
    // 计算鼠标在归一化设备坐标中的位置
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    // 更新射线
    this.raycaster.setFromCamera(this.mouse, this.camera);
    // 计算射线与场景中模型的交点
    const intersects = this.raycaster.intersectObjects(selectedObjects, true);
    const filteredIntersects = intersects.filter(
      (intersect) => intersect.object.userData.raycastable !== false,
    );
    outlinePass.selectedObjects = [];
    if (filteredIntersects.length > 0) {
      let selected = filteredIntersects[0].object;
      while (selected.parent) {
        if (selected.parent instanceof THREE.Group && selected.parent.tkObject) {
          selected = selected.parent.tkObject;
          break;
        }
        selected = selected.parent;
      }
      if (selected && selected instanceof TKBaseObject) {
        onSelected && onSelected(selected);

        if (
          (eventType === 'click' && selected.isClickOutline) ||
          (eventType === 'move' && selected.isHoverOutline)
        ) {
          (selected as TKBaseObject).scene.traverse((child) => {
            if (
              child instanceof THREE.Mesh ||
              child instanceof THREE.Line ||
              child instanceof THREE.Points
            ) {
              outlinePass.selectedObjects.push(child);
            }
          });
        }
      }
    } else {
      // 如果鼠标没有悬浮在任何对象上，移除描边效果
      outlinePass.selectedObjects = [];
    }
  }
}

export {TKThree};
