import { TKBaseObject } from '@/utils/TKThree/TKBaseObject';
import * as THREE from 'three';

/**
 * 巡检围栏
 * 可独立于电子围栏使用，提供巡检动画与事件控制
 */
class InspectionFence extends TKBaseObject {
  private material: THREE.ShaderMaterial = null;
  private mesh: THREE.Mesh = null;
  private elapsed: number = 0;
  private isRunning: boolean = false;

  constructor(config, model) {
    super(config, model);
  }

  override start() {
    const shape = new THREE.Shape();

    if (this.config.shapePoints && this.config.shapePoints.length > 0) {
      shape.moveTo(this.config.shapePoints[0][0], this.config.shapePoints[0][1]);
      for (let i = 1; i < this.config.shapePoints.length; i++) {
        shape.lineTo(this.config.shapePoints[i][0], this.config.shapePoints[i][1]);
      }

      const extrudeSettings = {
        depth: this.config.height || 20,
        bevelEnabled: false,
        steps: 2,
      };

      const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

      // 使用基础材质先实现巡检亮带，通过不透明度和颜色控制
      this.material = new THREE.ShaderMaterial({
        vertexShader: `
          varying vec3 vPosition;
          void main() {
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float uHeight;
          uniform float uTime;
          uniform vec3 uColor;
          uniform float uBandWidth; // 亮带宽度
          uniform float uSpeed;     // 巡检速度
          varying vec3 vPosition;

          void main() {
            float bandCenter = mod(uTime * uSpeed, uHeight);
            float dist = abs(vPosition.y - bandCenter);
            float alpha = smoothstep(uBandWidth, 0.0, dist);
            gl_FragColor = vec4(uColor, alpha);
          }
        `,
        uniforms: {
          uColor: { value: new THREE.Color(this.config.color || 0x3fd1ff) },
          uHeight: { value: this.config.height || 20 },
          uTime: { value: 0 },
          uBandWidth: { value: this.config.bandWidth || 2.5 },
          uSpeed: { value: this.config.speed || 6.0 },
        },
        transparent: true,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const mesh = new THREE.Mesh(geometry, this.material);
      mesh.position.y = this.config.height || 20;
      mesh.rotateX(Math.PI / 2);
      mesh.userData.raycastable = false;
      mesh.renderOrder = 9999;
      this.mesh = mesh;

      // 事件控制
      this.addEventListener('inspection.start', () => this.startInspection());
      this.addEventListener('inspection.stop', () => this.stopInspection());
      this.addEventListener('inspection.speed', (val: number) => this.setSpeed(val));
      this.addEventListener('inspection.show', () => this.show());
      this.addEventListener('inspection.hide', () => this.hide());
    }
  }

  override update(delta: number) {
    if (!this.mesh || !this.material) return;
    if (this.isRunning) {
      this.elapsed += delta;
      this.material.uniforms.uTime.value = this.elapsed;
    }
  }

  public startInspection() {
    if (this.mesh && !this.mesh.parent) {
      this.scene.add(this.mesh);
    }
    this.isRunning = true;
  }

  public stopInspection() {
    this.isRunning = false;
  }

  public setSpeed(speed: number) {
    if (this.material && this.material.uniforms) {
      this.material.uniforms.uSpeed.value = speed > 0 ? speed : 0.1;
    }
  }

  public show() {
    if (this.mesh && !this.mesh.parent) {
      this.scene.add(this.mesh);
    }
  }

  public hide() {
    if (this.mesh && this.mesh.parent) {
      this.scene.remove(this.mesh);
    }
  }
}

export { InspectionFence };



