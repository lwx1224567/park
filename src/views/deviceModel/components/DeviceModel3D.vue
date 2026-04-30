<template>
  <div class="device-model-3d">
    <div class="three-container" ref="containerRef"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const containerRef = ref<HTMLElement>();

let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let controls: OrbitControls;
let animationId: number;
let deviceModel: THREE.Object3D;

const SIZE = 40;

function init() {
  const dom = containerRef.value!;

  // 1. 场景
  scene = new THREE.Scene();

  // 2. 相机
  camera = new THREE.PerspectiveCamera(45, dom.clientWidth / dom.clientHeight, 0.1, 1000);
  // 初始位置，加载模型后会重新计算
  camera.position.set(20, 10, 20);

  // 3. 渲染器
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(dom.clientWidth, dom.clientHeight);
  renderer.setClearColor(0x000000, 0);
  dom.appendChild(renderer.domElement);

  // 4. 控制器
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  // 5. 灯光
  scene.add(new THREE.AmbientLight(0xffffff, 0.8));
  const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
  mainLight.position.set(10, 20, 10);
  scene.add(mainLight);

  // 6. 房间网格
  createGridRoom();

  // 7. 加载模型
  const loader = new GLTFLoader();
  loader.load(
    '/models/园区模型/server_rack.glb',
    (gltf) => {
      deviceModel = gltf.scene;
      deviceModel.scale.set(3, 3, 3);
      
      // 设置模型底部接触网格地面
      const baseY = -SIZE / 2;
      deviceModel.position.set(0, baseY, 0);
      scene.add(deviceModel);

      // --- 核心修正逻辑 ---
      
      // A. 计算模型的包围盒中心
      const box = new THREE.Box3().setFromObject(deviceModel);
      const center = new THREE.Vector3();
      box.getCenter(center); // 这才是模型真正的视觉中心点

      // B. 让控制器看向这个中心点 (非常重要！)
      // 这会让相机旋转的轴心从原点(0,0,0)变为物体的中心
      controls.target.copy(center);

      // C. 设置相机位置，实现平视
      // y 轴与中心点 y 轴一致即为平视
      camera.position.set(center.x + 25, center.y, center.z + 25);

      // D. 更新控制器
      controls.update();
      
      console.log('相机已对准物体中心:', center);
    }
  );

  animate();
}

function createGridRoom() {
  const gridColor = 0x016578;
  const divisions = 10;
  const createGrid = (pos: [number, number, number], rot: [number, number, number]) => {
    const grid = new THREE.GridHelper(SIZE, divisions, gridColor, gridColor);
    grid.position.set(...pos);
    grid.rotation.set(...rot);
    (grid.material as THREE.LineBasicMaterial).transparent = true;
    (grid.material as THREE.LineBasicMaterial).opacity = 0.3;
    scene.add(grid);
  };
  createGrid([0, -SIZE / 2, 0], [0, 0, 0]); // 底
  createGrid([0, 0, -SIZE / 2], [Math.PI / 2, 0, 0]); // 背
  createGrid([-SIZE / 2, 0, 0], [0, 0, Math.PI / 2]); // 左
}

function animate() {
  animationId = requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

function onResize() {
  const dom = containerRef.value!;
  camera.aspect = dom.clientWidth / dom.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(dom.clientWidth, dom.clientHeight);
}

onMounted(() => {
  init();
  window.addEventListener('resize', onResize);
});

onBeforeUnmount(() => {
  cancelAnimationFrame(animationId);
  renderer.dispose();
  window.removeEventListener('resize', onResize);
});
</script>

<style scoped>
.device-model-3d { width: 100%; height: 100%; }
.three-container { width: 100%; height: 100%; }
</style>