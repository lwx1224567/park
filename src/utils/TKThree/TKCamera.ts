import * as THREE from 'three';
import gsap from 'gsap';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

/**
 * 摄像头类，集成摄像头所有操作
 */
class TKCamera extends THREE.PerspectiveCamera {
  control: OrbitControls;
  clock: THREE.Clock;
  roamAnimationId: number | null;
  isRoaming: boolean;
  constructor(fov = 50, aspect = 1, near = 0.1, far = 2000) {
    super(fov, aspect, near, far);
    this.clock = new THREE.Clock(); // 确保正确初始化
    this.roamAnimationId = null;
    this.isRoaming = false;
  }

  /**
   * 移动摄像头
   * @param tarPos    移动到的目标位置
   * @param obsPos    观测的目标位置
   * @param duration    动画持续事件，默认1s
   * @param callback  移动完成后回调函数
   */
  setView(tarPos, obsPos, duration = 1, callback=()=>{}) {
    const tl = gsap.timeline();
    this.lookAt(obsPos);
    tl.to(this.position, {
      x: tarPos.x,
      y: tarPos.y,
      z: tarPos.z,
      duration: duration, // 持续时间
      onComplete: () => {
        callback && callback();
      },
    });
    tl.to(
      this.control.target,
      {
        x: obsPos.x,
        y: obsPos.y,
        z: obsPos.z,
        duration: duration, // 持续时间
      },
      '<',
    );
  }
  /**
   * 场景漫游
   * @param center    圆形路径的中心点
   * @param radius    圆形路径的半径
   * @param height    圆形路径的高度
   * @param lookAtTarget  摄像头始终朝向的目标点
   * @param duration    漫游动画的总时长（秒）
   * @param speedFactor  速度因子
   */
  roam(center, radius, height, lookAtTarget, duration = 20, speedFactor = 1) {
    this.control.enabled = false;
    this.isRoaming = true;
    let t = 0;
    const targetPosition = lookAtTarget || new THREE.Vector3(0, 0, 0);
    const currentLookAt = new THREE.Vector3().copy(targetPosition);
    if (this.roamAnimationId) {
      cancelAnimationFrame(this.roamAnimationId);
      this.roamAnimationId = null;
    }
    const roamLoop = () => {
      if (!this.isRoaming) return;
      t += (this.clock.getDelta() / duration) * speedFactor;
      if (t > 1) t = 0;
      const position = new THREE.Vector3(
        center.x + radius * Math.sin(t * Math.PI * 2),
        height,
        center.z + radius * Math.cos(t * Math.PI * 2),
      );
      this.position.copy(position);
      currentLookAt.lerp(targetPosition, 0.05); // 0.05 是渐变速度，可调
      this.lookAt(currentLookAt);
      this.control.target.copy(currentLookAt);
      this.roamAnimationId = requestAnimationFrame(roamLoop);
    };
    roamLoop();
  }
  /**
   * 停止漫游
   */
  stopRoam() {
    this.isRoaming = false;
    if (this.roamAnimationId) {
      cancelAnimationFrame(this.roamAnimationId);
      this.roamAnimationId = null;
    }
    this.control.enabled = true;
  }
}

export { TKCamera };
