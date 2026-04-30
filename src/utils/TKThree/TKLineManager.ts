import * as THREE from 'three';
import { TKEvenBus } from './TKEvenBus';
import { createLineFromPoints } from './TKUtil';

/**
 * @interface AnimatingLine
 * @description 用于存储正在进行动画的线条及其状态
 */
interface AnimatingLine {
  // 主体管线 Mesh。使用 TubeGeometry 表达立体管道
  mesh: THREE.Mesh;
  // 用于根据进度定位末端位置（生长头）
  curve: THREE.Curve<THREE.Vector3>;
  // 外发光的壳体 Mesh（可选）
  glow?: THREE.Mesh;
  // 着色所需的动态参数（通过 onBeforeCompile 注入 shader.uniforms）
  uniforms: {
    // 整条管线的长度，用于把速度与条纹周期做归一化
    totalLength: { value: number };
    // 条纹沿长度方向的偏移量（0~1），不断累加实现“流动”
    stripeOffset: { value: number };
    // 条纹宽度（与 spacing 共同决定周期）
    stripeWidth: { value: number };
    // 条纹间距
    stripeSpacing: { value: number };
    // 条纹颜色（与底色混合）
    stripeColor: { value: THREE.Color };
    // 生长进度（0~1），通过丢弃进度之外片元实现“从头到尾长出”
    growProgress: { value: number };
    // 条纹密度倍增系数（1 为原样，>1 更密集）
    frequency?: { value: number };
  };
  // 流动的速度系数（配合 totalLength 归一化）
  speedFactor: number;
  // 每秒增加的生长进度（0~1/秒）。为 0 表示不再增长
  growSpeed: number;
  // 生长头部的小球（可选），用于明确可视化“连线头部”
  head?: THREE.Mesh;
}

// 支持二维数组拐角格式：
// - LinePoint: 普通点 [x,y,z]
// - CornerPoints: 至少 3 个点的数组，表示一个圆滑拐角
type LinePoint = [number, number, number];
type CornerPoints = LinePoint[];
type MixedPoints = Array<LinePoint | CornerPoints>;

// Tube 着色器材质：基于 MeshLambertMaterial 的 onBeforeCompile 注入条纹流动效果
function createFlowTubeMaterial(
  baseColor: string | number,
  uniforms: AnimatingLine['uniforms']
) {
  const material = new THREE.MeshBasicMaterial({
    color: baseColor,
    side: THREE.DoubleSide,
    transparent: true,
  });

  material.onBeforeCompile = (shader) => {
    shader.uniforms.totalLength = uniforms.totalLength;
    shader.uniforms.stripeOffset = uniforms.stripeOffset;
    shader.uniforms.stripeWidth = uniforms.stripeWidth;
    shader.uniforms.stripeSpacing = uniforms.stripeSpacing;
    shader.uniforms.stripeColor = uniforms.stripeColor;
    shader.uniforms.growProgress = uniforms.growProgress;
    shader.uniforms.frequency = (uniforms as any).frequency ?? { value: 1.0 };

    // 注入 fragment 段，按文章思路基于 vUv.x 构造条纹并混色，加入 frequency 调整密度
    shader.fragmentShader = `
      uniform float totalLength;
      uniform float stripeOffset;
      uniform float stripeWidth;
      uniform float stripeSpacing;
      uniform vec3 stripeColor;
      uniform float growProgress;
      uniform float frequency;
      ${shader.fragmentShader}
    `.replace(
      `#include <color_fragment>`,
      `#include <color_fragment>
          // 生长裁剪：沿长度方向(vUv.x)裁剪
        if (vUv.x > growProgress) discard;
        // 条纹流动：沿长度方向(vUv.x)
        float totalSize = stripeWidth + stripeSpacing;
        float p = fract((vUv.x - stripeOffset) * totalLength / totalSize * frequency);
        float mask = step(p, stripeWidth / totalSize);
        diffuseColor.rgb = mix(diffuseColor.rgb, stripeColor, mask);
      `
    );
  };
  // 确保有 UV
  (material as any).defines = Object.assign((material as any).defines || {}, { USE_UV: '' });
  // 避免色调映射导致的变暗
  (material as any).toneMapped = false;
  return material;
}

/**
 * @class TKLineManager
 * @description 连线管理器
 * 通过事件总线监听指令，负责在3D场景中创建、销毁、并以动画形式管理所有连线。
 */
class TKLineManager {
  private scene: THREE.Scene;
  private eventBus: TKEvenBus;
  // 管理创建的管线 Mesh，便于按 id 增删
  private lines: Map<string, THREE.Mesh> = new Map();
  private animatingLines: Map<string, AnimatingLine> = new Map();
  private boundCreateLine: (id: string, points: MixedPoints, color: number | string, linewidth: number, smooth?: boolean, options?: { flowSpeed?: number; stripeWidth?: number; stripeSpacing?: number; stripeColor?: number | string; tubularSegments?: number; radius?: number; radialSegments?: number; growDuration?: number; growSpeed?: number; glow?: boolean; glowColor?: number | string; glowScale?: number; glowOpacity?: number; frequency?: number; }) => void;
  private boundRemoveLine: (id: string) => void;
  private boundRemoveAllLines: () => void;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.eventBus = TKEvenBus.getInstance();
    this.boundCreateLine = this.createLine.bind(this);
    this.boundRemoveLine = this.removeLine.bind(this);
    this.boundRemoveAllLines = this.removeAllLines.bind(this);
    this.registerEvents();
  }
  private registerEvents() {
    this.eventBus.on('tk-line-create', this.boundCreateLine);
    this.eventBus.on('tk-line-remove', this.boundRemoveLine);
    this.eventBus.on('tk-line-remove-all', this.boundRemoveAllLines);
  }
  public update(delta: number) {
    for (const [, anim] of this.animatingLines.entries()) {
      const total = anim.uniforms.totalLength.value;
      if (total <= 0) continue;
      // 归一化速度：速度系数 / 管线长度；保持不同长度管线的视觉速度一致
      const normalizedSpeed = (anim.speedFactor / total) * 10.0;
      anim.uniforms.stripeOffset.value = (anim.uniforms.stripeOffset.value + delta * normalizedSpeed) % 1.0;
      // 生长进度推进
      if (anim.growSpeed > 0 && anim.uniforms.growProgress.value < 1.0) {
        anim.uniforms.growProgress.value = Math.min(1.0, anim.uniforms.growProgress.value + anim.growSpeed * delta);
        if (anim.uniforms.growProgress.value >= 1.0) {
          anim.growSpeed = 0;
        }
      }
      // 同步生长头位置
      if (anim.head) {
        const t = Math.max(0, Math.min(1, anim.uniforms.growProgress.value));
        const pos = anim.curve.getPointAt(t);
        anim.head.position.copy(pos);
        anim.head.visible = t > 0 && t < 1;
      }
    }
  }
  public createLine(
    id: string,
    points: MixedPoints,
    color: number | string = '#00ffff',
    linewidth: number = 3,
    smooth: boolean = false,
    options?: {
      flowSpeed?: number;
      stripeWidth?: number;
      stripeSpacing?: number;
      stripeColor?: number | string;
      tubularSegments?: number;
      radius?: number; // 若提供则覆盖以往 linewidth 的意义
      radialSegments?: number;
      growDuration?: number; // 生长用时(秒)，与 growSpeed 二选一
      growSpeed?: number; // 生长速度(0-1/秒)
      glow?: boolean; // 是否启用外发光
      glowColor?: number | string; // 外发光颜色
      glowScale?: number; // 外发光半径放大倍数
      glowOpacity?: number; // 外发光不透明度
      frequency?: number; // 条纹密度倍增系数（1 原样，>1 更密集）
    }
  ) {
    if (!id || !points || points.length < 2) return;
    if (this.lines.has(id)) this.removeLine(id);
    // 兼容拐角二维数组：使用 CurvePath 由直线和圆滑拐角拼接
    const curvePath = new THREE.CurvePath<THREE.Vector3>();
    let prevPoint: THREE.Vector3 | null = null;
    for (const current of points as MixedPoints) {
      if (Array.isArray(current) && typeof current[0] === 'number') {
        const p = current as LinePoint;
        const point = new THREE.Vector3(p[0], p[1], p[2]);
        if (prevPoint === null) {
          prevPoint = point;
        } else {
          curvePath.add(new THREE.LineCurve3(prevPoint, point));
          prevPoint = point;
        }
      } else if (Array.isArray(current) && Array.isArray((current as any)[0])) {
        const cps = (current as CornerPoints).map((pt) => new THREE.Vector3(pt[0], pt[1], pt[2]));
        if (prevPoint !== null) {
          if (!prevPoint.equals(cps[0])) {
            curvePath.add(new THREE.LineCurve3(prevPoint, cps[0]));
          }
        }
        const cornerCurve = new THREE.CatmullRomCurve3(cps);
        curvePath.add(cornerCurve);
        prevPoint = cps[cps.length - 1];
      }
    }
    const curve: THREE.Curve<THREE.Vector3> = curvePath;

    // Tube 几何参数
    const tubularSegments = options?.tubularSegments ?? 200; // 沿长度细分数
    // 默认半径：按你提供的示例使用 0.1
    const radius = options?.radius ?? 0.1; // 管半径（可由调用处覆盖）
    const radialSegments = options?.radialSegments ?? 16;
    const closed = false;
    const geometry = new THREE.TubeGeometry(curve, tubularSegments, radius, radialSegments, closed);

    const length = curve.getLength();
    const uniforms: AnimatingLine['uniforms'] = {
      totalLength: { value: length },
      stripeOffset: { value: 0 },
      // 默认条纹参数：采用你的示例
      stripeWidth: { value: options?.stripeWidth ?? 25 },
      stripeSpacing: { value: options?.stripeSpacing ?? 50 },
      stripeColor: { value: new THREE.Color(options?.stripeColor ?? '#096be3') },
      // growProgress 缺省按需开启（见下方 growSpeed 设置）
      growProgress: { value: 1 },
      frequency: { value: options?.frequency ?? 1.0 },
    };

    const material = createFlowTubeMaterial(color, uniforms);

    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = id;
    this.scene.add(mesh);
    this.lines.set(id, mesh);

    const speedFactor = options?.flowSpeed ?? 1; // 默认流速：采用你的示例（可正可负）
    // 生长参数：若指定 growDuration 或 growSpeed，则从 0 开始生长
    let growSpeed = 0;
    if (options?.growDuration && options.growDuration > 0) {
      uniforms.growProgress.value = 0;
      growSpeed = 1 / options.growDuration;
    } else if (options?.growSpeed && options.growSpeed > 0) {
      uniforms.growProgress.value = 0;
      growSpeed = options.growSpeed;
    } else {
      // 默认启用生长：2s 长满
      uniforms.growProgress.value = 0;
      growSpeed = 0.5;
    }
    const anim: AnimatingLine = {
      mesh,
      curve,
      uniforms,
      speedFactor,
      growSpeed,
    };
    // 外发光：创建一个放大半径的壳体，使用叠加混合与 Fresnel 软边
    if (options?.glow !== false) {
      const glowScale = options?.glowScale ?? 1.8;
      const glowRadius = radius * glowScale;
      const glowGeo = new THREE.TubeGeometry(curve, tubularSegments, glowRadius, radialSegments, closed);
      const glowMat = new THREE.MeshBasicMaterial({
        color: options?.glowColor ?? (options?.stripeColor ?? color),
        transparent: true,
        opacity: options?.glowOpacity ?? 0.35,
        blending: THREE.AdditiveBlending,
      });
      (glowMat as any).toneMapped = false;
      glowMat.depthWrite = false;
      // 使用简易 Fresnel 让发光靠边缘更强、中心更弱
      glowMat.onBeforeCompile = (shader) => {
        // 着色器——另一套编程语言
        shader.vertexShader = shader.vertexShader.replace(
          'void main() {',
          'varying vec3 vNormalW; varying vec3 vViewDir; void main(){ vNormalW = normalize(normalMatrix * normal); vec4 mvPos = modelViewMatrix * vec4(position,1.0); vViewDir = normalize(-mvPos.xyz);'
        );
        shader.fragmentShader = shader.fragmentShader.replace(
          'void main() {',
          'varying vec3 vNormalW; varying vec3 vViewDir; void main(){'
        ).replace(
          'gl_FragColor = vec4( outgoingLight, diffuseColor.a );',
          'float fresnel = pow(1.0 - clamp(abs(dot(normalize(vNormalW), normalize(vViewDir))), 0.0, 1.0), 2.0); gl_FragColor = vec4( outgoingLight, diffuseColor.a * fresnel );'
        );
      };
      const glow = new THREE.Mesh(glowGeo, glowMat);
      glow.name = id + ':glow';
      glow.renderOrder = (mesh.renderOrder || 0) + 1;
      this.scene.add(glow);
      anim.glow = glow;
    }
    // 生长头：仅在生长中创建
    if (growSpeed > 0) {
      const headRadius = Math.max(0.5 * radius, radius); // 与管径一致或略大
      const headGeo = new THREE.SphereGeometry(headRadius, 16, 16);
      const headMat = new THREE.MeshBasicMaterial({ color: uniforms.stripeColor.value, toneMapped: false });
      const head = new THREE.Mesh(headGeo, headMat);
      head.name = id + ':head';
      head.visible = true;
      head.position.copy(curve.getPointAt(0));
      this.scene.add(head);
      anim.head = head;
    }
    this.animatingLines.set(id, anim);
  }
  public removeLine(id: string) {
    const mesh = this.lines.get(id);
    if (mesh) {
      this.scene.remove(mesh);
      mesh.geometry.dispose();
      (mesh.material as THREE.Material).dispose();
      this.lines.delete(id);
      const anim = this.animatingLines.get(id);
      if (anim && anim.head) {
        this.scene.remove(anim.head);
        anim.head.geometry.dispose();
        (anim.head.material as THREE.Material).dispose();
      }
      if (anim && anim.glow) {
        this.scene.remove(anim.glow);
        anim.glow.geometry.dispose();
        (anim.glow.material as THREE.Material).dispose();
      }
      if (this.animatingLines.has(id)) this.animatingLines.delete(id);
    }
  }
  public removeAllLines() {
    this.lines.forEach((_, id) => this.removeLine(id));
  }
  public dispose() {
    this.removeAllLines();
    this.eventBus.off('tk-line-create', this.boundCreateLine);
    this.eventBus.off('tk-line-remove', this.boundRemoveLine);
    this.eventBus.off('tk-line-remove-all', this.boundRemoveAllLines);
  }
}
export { TKLineManager };
