import {TKBaseObject} from '@/utils/TKThree/TKBaseObject';
import * as THREE from 'three';
import {GeoFenceShader} from '../../shaders/GeoFenceShader';
import {RadarShader} from '../../shaders/RadarShader';
import {Box3} from "three";

/**
 * 电子围栏
 */
class GeoFence extends TKBaseObject {
  private geofenceMaterial: THREE.ShaderMaterial = null;
  private radarMaterial: THREE.ShaderMaterial = null;
  private geoFence: THREE.Mesh = null;
  private radar: THREE.Mesh;
  /**
   * 入侵状态
   * @private
   */
  private isInvade: boolean = false;

  constructor(config, model) {
    super(config, model);
  }

  override start() {
    // console.log('GeoFence start() 方法被调用');
    this.initGeoFence();
    this.initRadar();
  }

  private initGeoFence() {
    if (this.config.shapePoints && this.config.shapePoints.length > 0) {
      const shape = new THREE.Shape();
      shape.moveTo(this.config.shapePoints[0][0], this.config.shapePoints[0][1]);
      for (let i = 1; i < this.config.shapePoints.length; i++) {
        shape.lineTo(this.config.shapePoints[i][0], this.config.shapePoints[i][1]);
      }
      // 不需要连接回第一个点，Shape会自动闭合

      const extrudeSettings = {
        depth: this.config.height || 20,
        bevelEnabled: false,
        steps: 2,
      };

      const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

      // 创建自定义着色器材质
      this.geofenceMaterial = new THREE.ShaderMaterial({
        vertexShader: GeoFenceShader.vertexShader,
        fragmentShader: GeoFenceShader.fragmentShader,
        uniforms: {
          uColor: {value: new THREE.Color(this.config.color || 0x00ff00)},
          uHeight: {value: this.config.height || 20},
          uTime: {value: 0.0},
        },
        transparent: true,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false, // 关键：允许透明度正确渲染
      });

      const mesh = new THREE.Mesh(geometry, this.geofenceMaterial);
      mesh.position.y = this.config.height || 20;
      mesh.rotateX(Math.PI / 2);
      // 关闭射线检测
      mesh.userData.raycastable = false;
      mesh.renderOrder = 9999; // 确保最后渲染
      // mesh.visible = false;
      // this.scene.add(mesh);
      this.geoFence = mesh;
    }
  }

  override update(delta: number) {
    // TODO 入侵检测  后续完善
    // 检测到入侵
    if (this.isInvade) {
      // 更新着色器中的时间变量以实现动画效果
      if (this.geofenceMaterial && this.geofenceMaterial.uniforms) {
        // 可以添加随时间变化的效果
        this.geofenceMaterial.uniforms.uColor.value.setHex(0xff0000);
      }
    }

    if (this.geofenceMaterial && this.geofenceMaterial.uniforms) {
      // 可以添加随时间变化的效果
      this.geofenceMaterial.uniforms.uTime.value += delta;
    }

    if (this.radarMaterial) {
      // 更新时间_uniform
      this.radarMaterial.uniforms.uTime.value += 0.01;
    }
  }

  /**
   * 显示电子围栏
   */
  showGeoFence() {
    if (this.geoFence) {
      this.scene.add(this.geoFence);
    }
    if (this.radar) {
      this.scene.add(this.radar);
    }
  }

  /**
   * 隐藏电子围栏
   *
   *
   */
  hideGeoFence() {
    if (this.geoFence) {
      this.scene.remove(this.geoFence);
    }
    if (this.radar) {
      this.scene.remove(this.radar);
    }
  }

  /**
   * 初始化雷达扫描效果
   */
  initRadar() {
    const box = new Box3().setFromObject(this.geoFence);
    const size = new THREE.Vector3();
    box.getSize(size);
    // 创建扇形几何体
    const planeWidth = Math.max(size.x, size.z) * 1.5;
    const geometry = new THREE.PlaneGeometry(planeWidth, planeWidth);

    // 创建着色器材质
    this.radarMaterial = new THREE.ShaderMaterial({
      vertexShader: RadarShader.RadarVertexShader,
      fragmentShader: RadarShader.RadarFragmentShader,
      uniforms: {
        uTime: {value: 0.0},
        uFactor: {value: 1.0 / planeWidth},    // 放大比例系数 = 平面的长和宽
        uScanColor: {value: new THREE.Color(0x00ffff)},    // 主要扫描颜色
        uScanColorDark: {value: new THREE.Color(0x0088ff)} // 暗部扫描颜色
      },
      side: THREE.DoubleSide,
      transparent: true,
      blending: THREE.AdditiveBlending, // 添加混合模式让效果更亮
    });

    this.radar = new THREE.Mesh(geometry, this.radarMaterial);
    this.radar.rotation.x = Math.PI / 2; // 使扇形面向水平面
    this.radar.position.y = 4;
  }
}

export {GeoFence};
