import * as THREE from 'three';
import {CameraConeShader} from '../../shaders/CameraConeShader';
import {BaseParkDevice} from "@/views/park/models/parkDevice/BaseParkDevice";


/**
 * 摄像头
 */
class OutdoorCamera extends BaseParkDevice{

  private cone: THREE.Group = new THREE.Group();
  private isShowCone: boolean = false;


  constructor(config, model) {
    super(config, model);
  }


  override start() {
    super.start();
    // 初始化照射范围锥形
    this.createCone();

    this.addEventListener('click', (event) => {
      this.triggerEvent('openCameraModal', true);// 打开摄像头监控弹窗
      // this.isShowCone = !this.isShowCone;
      // this.isShowCone ? this.showCone() : this.hideCone();
    });
  }

  override update(delta: number) {
    super.update(delta);
    if(this.cone) {
      // 将角度规范化到 [-Math.PI, Math.PI] 区间
      this.scene.rotation.y = (this.scene.rotation.y - 0.01) % (Math.PI * 2);
    }
  }

  /**
   * 创建锥形对象
   */
  private createCone(): void {
      const radius = 16;
      const height = 40;
      // 创建锥形几何体（半径5，高度10）
      const coneGeometry = new THREE.ConeGeometry(radius, height, 32);
      // 创建自定义着色器材质
      const coneMaterial = new THREE.ShaderMaterial({
        vertexShader: CameraConeShader.vertexShader,
        fragmentShader: CameraConeShader.fragmentShader,
        uniforms: {
          uColor: {value: new THREE.Color(0x00ffff)},
          uLength: {value: 20.0},
          uCameraPosition: {value: new THREE.Vector3()},
          uDepthTexture: {value: null},  // 深度纹理
          uProjectionMatrix: {value: new THREE.Matrix4()},  // 投影矩阵
          uViewMatrix: {value: new THREE.Matrix4()},  // 视图矩阵
          uNear: {value: 0.1},  // 近裁剪面
          uFar: {value: 1000.0}  // 远裁剪面
        },
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.NormalBlending
      });

      // 创建锥形网格
      const coneMesh = new THREE.Mesh(coneGeometry, coneMaterial);
      // 调整锥形方向：默认锥形沿Y轴正方向，需要旋转使其指向Z轴负方向
      coneMesh.position.y = -height / 2;
      // 设置渲染顺序，确保正确渲染
      coneMesh.renderOrder = -1;
      this.cone.add(coneMesh);
      this.cone.rotation.x = -Math.PI / 4;
      this.cone.position.y = -(this.size.y / 2);
      // this.scene.add(this.cone);
  }

  /**
   * 显示摄像头照射锥体
   */
  showCone() {
    this.scene.add(this.cone)
  }

  /**
   * 隐藏摄像头照射锥体
   */
  hideCone() {
    this.scene.remove(this.cone)
  }
}

export {OutdoorCamera};
