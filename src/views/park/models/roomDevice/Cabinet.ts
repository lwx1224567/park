import { TKBaseObject } from '@/utils/TKThree/TKBaseObject';
import gsap from 'gsap';
import * as THREE from 'three';
import { TKEvenBus } from '@/utils/TKThree/TKEvenBus';
import { RoomDevice } from './RoomDevice';
import { random, toRadians } from '@/utils/TKThree/TKUtil';
import { BaseDevice } from '@/views/park/models/cabinetDevice/BaseDevice';
import { Storey } from '@/views/park/models/parkDevice/Storey';
import { useCabinetStore } from '@/store/modules/cabinet';
import { Build } from '@/views/park/models/parkDevice/Build';

enum LayerView {
  Main = 0,
  RemainCapacity = 1,
  Energy = 2,
}

const colors = {
  0.1: 0x2a85b8,
  0.2: 0x16b0a9,
  0.3: 0x29cf6f,
  0.4: 0x5ce182,
  0.5: 0x7df675,
  0.6: 0xfff100,
  0.7: 0xfaa53f,
  0.8: 0xfa803f,
  0.9: 0xfa553f,
  1.0: 0xd04343,
};

/**
 * 机柜
 */
class Cabinet extends RoomDevice {
  // 门的状态
  private isDoorOpen: boolean = false;
  door: THREE.Object3D;

  // 用于存储主视图、剩余空间视图、能耗视图
  private layerMain: THREE.Group = new THREE.Group();
  private layerRemainCapacity: THREE.Group = new THREE.Group();
  private layerEnergy: THREE.Group = new THREE.Group();
  private currentLayer: LayerView = LayerView.Main;
  /**
   * 当前弹出设备
   * @private
   */
  private currentPulloutDevice: BaseDevice | undefined;

  constructor(config, model) {
    super(config, model);
    this.door = model?.getObjectByName('JG02_low');

    this.layerMain.name = 'Main';
    this.layerRemainCapacity.name = 'RemainCapacity';
    this.layerEnergy.name = 'Energy';
    this.scene.remove(model);
    this.layerMain.add(model);
    this.scene.add(this.layerMain);
  }

  override start() {
    super.start();
    this.initRemainCapacity();
    this.initEnergy();
    this.addEventListener('devicePortConnect', this.connect.bind(this)); //处理机柜的连接关系
    //关闭所有机柜的门
    this.addEventListener('closeCabinetDoorAll', () => {
      const parent = this.getParent() as Storey;
      if (parent.hasRoomDeviceFocused(this)) {
        parent.cancelFocusedRoomDevice(false);
        this.isFocused = false; // 默认不聚焦
        this.isHoverOutline = this.config.isHoverOutline; // 默认悬停高亮
        this.isClickOutline = this.config.isClickOutline; // 默认点击高亮
      }
      this.closeDoor();
    });
  }

  override update(delta: number) {
    super.update(delta);
  }

  override handleClickEvent(event) {
    super.handleClickEvent(event);
  }

  override handleDblClickEvent(event) {
    if (this.currentLayer === LayerView.Main) {
      super.handleDblClickEvent(event);
    }
  }

  /**
   * 处理机柜的连接关系
   */
  async connect(event) {
    // console.log('event:', event);
    if (event.startParkVo.parentId == this.config.id) {
      const eventBus = TKEvenBus.getInstance();
      // console.log('event.startParkVo.parentId:', event.startParkVo.parentId);
      // console.log('this.config.id:', this.config.id);

      // 获取起始机柜ID
      const startCabinetID = event.startCabinetVo.id;
      const endCabinetID = event.endCabinetVo.id;
      const startDeviceID = event.startParkVo.id;
      const endDeviceID = event.endParkVo.id;
      const starFloorID = event.startFloorVo.parentId; //楼的上级
      const categoryId = event.endParkVo.id;
      // console.log('event.startFloorVo:', event.startFloorVo.id);
      // console.log('event.endFloorVo:', event.endFloorVo.id);

      // // 调取机柜 / 设备 的XYZ
      // console.log('开始机柜ID：' + startCabinetID, '__结束机柜ID：' + endCabinetID + '__开始设备ID：' + startDeviceID, '__结束设备ID：' + endDeviceID,);
      // console.log('event:', event);

      // 依次获取起始/结束机柜与设备的世界坐标
      const storey = this.getParent();
      // 获取起始/结束机柜与设备 当前模型内坐标
      const startCabinet = storey?.getChildById(startCabinetID) as Cabinet;
      const endCabinet = storey?.getChildById(endCabinetID) as Cabinet;
      const startDevice = startCabinet?.getChildById(startDeviceID) as BaseDevice;
      const endDevice = endCabinet?.getChildById(endDeviceID) as BaseDevice;

      console.log('starFloorID---------' + starFloorID);
      const starFloorPos = storey.getWorldPosition();

      // 获取机柜、设备的世界坐标
      const startCabinetPos = startCabinet?.getWorldPosition();
      const endCabinetPos = endCabinet?.getWorldPosition();
      const startDevicePos = startDevice?.getWorldPosition();
      const endDevicePos = endDevice?.getWorldPosition();

      console.log('starFloorPos', starFloorPos);
      // console.log('startFloorPos:', startFloorPos);
      // console.log('endFloorPos:', endFloorPos);
      console.log('startCabinetPos:', startCabinetPos);
      // console.log('endCabinetPos:', endCabinetPos);
      // console.log('startDevicePos:', startDevicePos);
      // console.log('endDevicePos:', endDevicePos);

      // 一些模拟接口传来的数据
      const points: [number, number, number][] = [];

      // 按照 [开始设备, 开始机柜, 结束机柜, 结束设备] 的顺序拼装为 [x,y,z] 数组
      if (startDevicePos && startCabinetPos && endCabinetPos && endDevicePos) {
        //数据拼装 把接口拿到的数据 放来中间 即可实现路径
        points.push([startDevicePos.x, startDevicePos.y, startDevicePos.z]);
        points.push([startDevicePos.x, startDevicePos.y, startDevicePos.z + 0.8]);
        points.push([startCabinetPos.x, startCabinetPos.y + 0.1, startDevicePos.z + 0.8]);
        //------ 这里可以随时插入自定义路径点 -------
        if (event.startPath && Array.isArray(event.startPath) && event.startFloorVo) {
          event.startPath.slice(1, -1).forEach(([x, z]) => {
            points.push([
              starFloorPos.x + x + (event.startFloorVo.baseOffsetX ?? 0),
              startCabinetPos.y + 0.1,
              starFloorPos.z + z + (event.startFloorVo.baseOffsetZ ?? 0),
            ]);
          });
        }
        // ... 用户自定义插值 ...
        points.push([endCabinetPos.x, endCabinetPos.y + 0.1, endDevicePos.z + 0.8]);
        points.push([endDevicePos.x, endDevicePos.y, endDevicePos.z + 0.8]);
        points.push([endDevicePos.x, endDevicePos.y, endDevicePos.z]);
        console.log('points1111:', points);
        // === 动态流动管线（可不传 options，全部走默认值）===
        // 调用签名：eventBus.emit('tk-line-create', id, points, color?, linewidth?, smooth?, options?)
        // 参数依次为：
        //   id:         唯一标识，建议 `${startDevice}_${endDevice}`
        //   points:     路径点数组  [ [x,y,z], ... ]
        //   color?:     底色（默认 '#00ffff'），条纹色见 options.stripeColor
        //   linewidth?: 旧的线宽占位（现用不到，可忽略）
        //   smooth?:    是否平滑曲线（默认 false），true 更圆滑
        //   options?:   可选配置（全部可省略，均有默认值）：
        //     - flowSpeed:    流动速度系数（默认 50；<0 反向）
        //     - stripeWidth:  条纹宽度（默认 60）
        //     - stripeSpacing:条纹间距（默认 90）
        //     - stripeColor:  条纹颜色（默认 '#096be3'）
        //     - radius:       管半径（默认 0.6）
        //     - tubularSegments: 沿长度细分（默认 200）
        //     - radialSegments:  圆截面细分（默认 16）
        //     - growDuration/growSpeed: 生长时间/速度（默认 2s 长满）
        //     - glow:         是否外发光（默认 true）
        //     - glowColor:    外发光颜色（默认取 stripeColor）
        //     - glowScale:    外发光半径倍数（默认 1.8）
        //     - glowOpacity:  外发光透明度（默认 0.35）
        // filletRadius  调大更圆
        // filletAngleThresholdDeg  需要时提高到 10~15
        // tubularSegments:   细分更密更顺滑
        // radialSegments:  截面更圆
        eventBus.emit(
          'tk-line-create',
          startDevice + '_' + endDevice,
          points,
          'rgba(79,209,79,0.7)',
          1,
          false,
          {
            stripeWidth: 10,
            stripeSpacing: 10,
            stripeColor: 'rgba(12,92,184,0.8)',
            flowSpeed: 0.6,
            radius: 0.1,
            filletRadius: 130, // 调大更圆
            filletAngleThresholdDeg: 15, // 需要时提高到 10~15
            tubularSegments: 400, // 细分更密更顺滑
            radialSegments: 150, // 截面更圆
            frequency: 6,
          },
        );
        //取消显示
        // eventBus.emit("tk-line-remove-all");
      }

      // console.log(event);
      //视图切换
      await this.triggerEvent('storeySelected', {
        id: this.getParent().config.id,
        isHideCockpit: true,
      });
    }
  }

  /**
   * 聚焦机柜
   */
  override focus() {
    super.focus();
    this.openDoor();
  }

  /**
   * 取消聚焦
   */
  override cancelFocus() {
    super.cancelFocus();
    this.triggerEvent('toggleCockpit', 'room'); // 触发切换机房视图
    this.closeDoor();
  }

  /**
   * 开门
   */
  async openDoor() {
    if (!this.isDoorOpen) {
      const cabinetStore = useCabinetStore();
      cabinetStore.initCabinetData(this.config.id); //初始化机柜驾驶舱数据
      this.isDoorOpen = true;
      gsap.to(this.door.rotation, {
        duration: 1,
        ease: 'power2.out',
        y: (-Math.PI / 180) * 170,
      });
    }
  }

  /**
   * 关门
   */
  closeDoor(callback: Function = () => {}) {
    if (this.isDoorOpen) {
      this.isDoorOpen = false;
      //清除所有连接线
      this.triggerEvent('tk-line-remove-all');
      // 机柜关门前收回弹出的设备
      if (this.currentPulloutDevice) {
        this.currentPulloutDevice.pushBack();
        this.currentPulloutDevice = undefined;
      }
      gsap.to(this.door.rotation, {
        duration: 1,
        ease: 'power2.out',
        y: 0,
        onComplete: () => {
          callback && callback();
        },
      });
    }
  }

  /**
   * 初始化剩余空间视图
   */
  initRemainCapacity() {
    // 创建一个和机柜同样大小的长方体替换机柜
    const remainCapacity = new THREE.Mesh(
      new THREE.BoxGeometry(this.size.x, this.size.y, this.size.z),
      new THREE.MeshBasicMaterial({
        color: '#34d8ed',
        transparent: true,
        opacity: 0.2,
      }),
    );
    remainCapacity.position.y += this.size.y / 2;
    this.layerRemainCapacity.add(remainCapacity);

    const geometry = new THREE.EdgesGeometry(
      new THREE.BoxGeometry(this.size.x, this.size.y, this.size.z),
    );
    const material = new THREE.LineBasicMaterial({
      color: '#34d8ed',
      linewidth: 50,
      linecap: 'round',
      linejoin: 'round',
    });
    const line = new THREE.LineSegments(geometry, material);
    line.position.y += this.size.y / 2;
    this.layerRemainCapacity.add(line);
  }

  /**
   * 初始化能耗视图
   */
  initEnergy() {
    // 创建一个和机柜同样大小的长方体替换机柜
    const remainCapacity = new THREE.Mesh(
      new THREE.BoxGeometry(this.size.x, this.size.y, this.size.z),
      new THREE.MeshBasicMaterial({
        color: '#34d8ed',
        transparent: true,
        opacity: 0.8,
      }),
    );
    remainCapacity.position.y += this.size.y / 2;
    this.layerEnergy.add(remainCapacity);

    const geometry = new THREE.EdgesGeometry(
      new THREE.BoxGeometry(this.size.x, this.size.y, this.size.z),
    );
    const material = new THREE.LineBasicMaterial({
      color: '#1f383a',
      linewidth: 50,
      linecap: 'round',
      linejoin: 'round',
    });
    const line = new THREE.LineSegments(geometry, material);
    line.position.y += this.size.y / 2;
    this.layerEnergy.add(line);
  }

  showMainView() {
    if (this.currentLayer !== LayerView.Main) {
      this.scene.remove(this.layerRemainCapacity);
      this.scene.remove(this.layerEnergy);
      this.scene.add(this.layerMain);
      // 恢复所有子节点设备视图为主视图
      this.getChildren().forEach((child) => (child as BaseDevice).showMainView());
      this.currentLayer = LayerView.Main;
      this.isHoverOutline = this.config.isHoverOutline;
      this.isClickOutline = this.config.isClickOutline;
    }
  }

  /**
   * 切换剩余空间视图
   */
  showRemainCapacity() {
    if (this.currentLayer !== LayerView.RemainCapacity) {
      this.scene.remove(this.layerMain);
      this.scene.remove(this.layerEnergy);
      this.scene.add(this.layerRemainCapacity);
      // 恢复所有子节点设备视图为能耗视图
      this.getChildren().forEach((child) => (child as BaseDevice).showRemainCapacity());
      this.currentLayer = LayerView.RemainCapacity;
      // 切换视图后禁止绘制包围线
      this.isHoverOutline = false;
      this.isClickOutline = false;
    }
  }

  /**
   * 切换能耗视图
   */
  showEnergy() {
    if (this.currentLayer !== LayerView.Energy) {
      this.scene.remove(this.layerMain);
      this.scene.remove(this.layerRemainCapacity);
      this.scene.add(this.layerEnergy);
      const energy = random(1000, 8000) / 8000;
      // 我随机生成了一个小数，现在需要根据小数获取对应范围的颜色
      const color = new THREE.Color(colors[Math.floor(energy * 10) / 10.0]);
      this.layerEnergy.children[0].material.color.set(color);
      // 恢复所有子节点设备视图为能耗视图
      this.currentLayer = LayerView.Energy;
      // 切换视图后禁止绘制包围线
      this.isHoverOutline = false;
      this.isClickOutline = false;
    }
  }

  /**
   * 记录当前弹出的设备
   * @param device
   */
  setPulloutDevice(device: BaseDevice) {
    this.currentPulloutDevice && this.currentPulloutDevice.pushBack();
    this.currentPulloutDevice = device;
  }

  /**
   * 取消当前记录的弹出设备
   */
  cancelPulloutDevice() {
    this.currentPulloutDevice = undefined;
  }
}

export { Cabinet, LayerView };
