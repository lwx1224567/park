import * as THREE from 'three';
import {CSS2DObject} from "three/addons/renderers/CSS2DRenderer";
import { TKColorFlickerManager } from './TKColorFlickerManager';

/**
 * 生成指定范围的随机小数
 * @param min
 * @param max
 */
function random(min, max) {
  return Math.random() * (max - min) + min;
}

/**
 * 给模型加上颜色
 * @param {模型} model
 * @param {要加上的颜色} modelColor
 */
function colorMaterial(model: THREE.Object3D, modelColor: string, opacity: number = 1) {
  model.traverse((child) => {
    if (child.isMesh) {
      if (modelColor) {
        child.material.color.setStyle(modelColor);
      }
      if (opacity) {
        child.material.opacity = opacity;
        child.material.transparent = true;
      }
    }
  });
}



/**
 * 给模型加上闪烁颜色
 * @param model 模型
 * @param startColor 变化开始颜色
 * @param targetColor 变化结束颜色
 * @param duration 动画时长
 * @param loop 是否循环
 * @param groupId 分组ID，用于批量管理动画（可选）
 */
function colorMaterialFlicker(
  model: THREE.Object3D, 
  startColor: string, 
  targetColor: string, 
  duration: number = 1, 
  loop: boolean = false,
  groupId?: string
) {
  const startTime = Date.now();
  const startColorHex = new THREE.Color(startColor);
  const targetColorHex = new THREE.Color(targetColor);

  // 如果提供了groupId，添加到管理器
  if (groupId) {
    TKColorFlickerManager.getInstance().addModel(groupId, model);
  }

  model.traverse((child) => {
    if (child.isMesh) {
      // 保存原始颜色和透明度（如果还没保存）
      if (!child.userData.originalColor) {
        child.userData.originalColor = child.material.color.clone();
      }
      if (child.userData.originalOpacity === undefined) {
        child.userData.originalOpacity = child.material.opacity;
      }
      if (child.userData.originalTransparent === undefined) {
        child.userData.originalTransparent = child.material.transparent;
      }

      const animate = () => {
        const elapsedTime = Date.now() - startTime;
        const progress = elapsedTime / (duration * 1000);

        const currentColor = new THREE.Color();
        currentColor.lerpColors(startColorHex, targetColorHex, progress % 1);

        child.material.color.copy(currentColor);

        if (loop || progress < 1) {
          (child as any).animateId = requestAnimationFrame(animate);
        }
      };

      animate();
    }
  });
}


/**
 * 停止颜色闪烁动画并恢复原始状态
 * @param model 模型
 * @param restoreOriginal 是否恢复到原始颜色，默认为 true
 */
function stopColorFlicker(model: THREE.Object3D, restoreOriginal: boolean = true) {
  model.traverse((child) => {
    if (child.isMesh) {
      // 清除动画
      if ((child as any).animateId) {
        cancelAnimationFrame((child as any).animateId);
        delete (child as any).animateId;
      }
      // 恢复原始材质属性
      if (restoreOriginal) {
        if (child.userData.originalColor) {
          child.material.color.copy(child.userData.originalColor);
        }
        if (child.userData.originalOpacity !== undefined) {
          child.material.opacity = child.userData.originalOpacity;
        }
        if (child.userData.originalTransparent !== undefined) {
          child.material.transparent = child.userData.originalTransparent;
        }
      }
    }
  });
}

/**
 * 停止指定组的所有闪烁动画
 * @param groupId 组ID
 * @param restoreOriginal 是否恢复到原始颜色
 */
function stopColorFlickerGroup(groupId: string, restoreOriginal: boolean = true) {
  TKColorFlickerManager.getInstance().stopGroup(groupId, restoreOriginal);
}

/**
 * 停止所有闪烁动画
 * @param restoreOriginal 是否恢复到原始颜色
 */
function stopAllColorFlicker(restoreOriginal: boolean = true) {
  TKColorFlickerManager.getInstance().stopAll(restoreOriginal);
}
/**
 * 给模型加上包围线条
 */
function surroundLine(model, scene, lineColor) {
  model.traverse((child) => {
    if (child.isMesh) {
      const geometry = new THREE.EdgesGeometry(child.geometry);
      const worldPosition = new THREE.Vector3();
      child.getWorldPosition(worldPosition);
      const material = new THREE.LineBasicMaterial({
        color: lineColor,
        linewidth: 0.5,
        linecap: 'round',
        linejoin: 'round',
      });
      const line = new THREE.LineSegments(geometry, material);
      line.scale.copy(child.scale);
      line.rotation.copy(child.rotation);
      line.position.copy(worldPosition);
      scene.add(line);
    }
  });
}


/**
 * 设置对象的不透明度
 * @param object 要设置的对象
 * @param isTransparent 是否透明处理
 */
function setModelOpacity(model: THREE.Object3D, isTransparent: boolean) {
  model.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      if (isTransparent) {
        child.userData.transparentMaterial && (child.material = child.userData.transparentMaterial);
      } else {
        child.userData.originalMaterial && (child.material = child.userData.originalMaterial);
      }
    }
  });
}

/**
 * 角度转弧度
 * @param angle 角度
 */
function toRadians(angle) {
  return angle * (Math.PI / 180);
}


/**
 * 获取模型的高度
 * @param {模型} model
 */
function getHeight(model: THREE.Object3D) {
  // 计算模型的包围盒
  const box = new THREE.Box3().setFromObject(model);

  // 获取模型的最大和最小 y 坐标
  const maxY = box.max.y;
  const minY = box.min.y;

  // 计算模型的高度
  return maxY - minY;
}

/**
 * 根据坐标数组创建连线
 * @param points 坐标数组， [[x1, y1, z1], [x2, y2, z2], ...]
 * @param color 线的颜色
 * @returns THREE.Line
 */
function createLineFromPoints(points: [number, number, number][], color: number | string = 0xffffff, linewidth: number = 1): THREE.Line {
  const vectors = points.map(point => new THREE.Vector3(point[0], point[1], point[2]));
  const geometry = new THREE.BufferGeometry().setFromPoints(vectors);
  const material = new THREE.LineBasicMaterial({
    color,
    linewidth,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const line = new THREE.Line(geometry, material);
  return line;
}

/**
 * 创建一个标签
 * @param text
 */
function createCSS2DLabel(text: string) : CSS2DObject {
  // 创建一个 HTML 元素（标签）
  const div = document.createElement('div');
  div.className = 'sprite-tag';
  // /*给标签设置你想要的的样式*/
  // div.style.width = '200px';
  // div.style.height = '100px';
  // div.style.background = 'rgba(10,18,51,0.8)';
  // div.style.color = '#fff'
  div.textContent = text;
  // 创建一个 2D 物体来渲染 HTML 元素
  return new CSS2DObject(div);
}

export {
  random,
  colorMaterial,
  surroundLine,
  toRadians,
  getHeight,
  setModelOpacity,
  colorMaterialFlicker,
  stopColorFlicker,
  stopColorFlickerGroup,
  stopAllColorFlicker,

  createLineFromPoints,
  createCSS2DLabel
};
