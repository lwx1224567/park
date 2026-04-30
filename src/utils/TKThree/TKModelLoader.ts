/**
 * 3D模型加载器
 * 提供GLTF/GLB、OBJ等格式的模型加载功能，支持加载进度追踪
 */
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader.js';
import {useGlobSetting} from '@/hooks/setting';

const globSetting = useGlobSetting();

import * as THREE from 'three';

/**
 * 模型类型枚举
 */
enum ModelType {
  GLTF,  // GLTF格式
  GLB,   // GLB格式（二进制GLTF）
  OBJ,   // OBJ格式
}

// 模型文件基础路径
const modelsUrl = globSetting.modelsUrl + '/models_new/';
// 纹理文件基础路径
const texturesUrl = globSetting.modelsUrl + '/textures/';

/**
 * 异步加载GLTF或GLB类型的模型
 * @param modelName 模型名称（不含扩展名）
 * @param onProgress 进度回调函数，接收0-100的进度值
 * @returns Promise 返回包含模型名称和场景对象的Promise
 */
async function GLTFModelLoader(modelName: string, onProgress?: (progress: number) => void): Promise<any> {
  const loader = new GLTFLoader();
  try {
    return new Promise((resolve, reject) => {
      loader.load(
        modelsUrl + modelName + '.glb', // 拼接完整的模型文件路径
        // 加载成功回调
        function (gltf) {
          console.log(`Model ${modelName} registered successfully`);
          // 模型加载完成，通知进度100%
          if (onProgress) {
            onProgress(100);
          }
          // 返回模型名称和场景对象
          resolve({name: modelName, model: gltf.scene});
        },
        // 加载进度回调
        function (xhr) {
          if (xhr.total > 0) {
            // 计算加载进度百分比
            const progress = (xhr.loaded / xhr.total) * 100;
            // 仅调用进度回调，不再触发单模型事件
            if (onProgress) {
              onProgress(progress);
            }
          }
        },
        // 加载失败回调
        function (error) {
          console.error(`Failed to load model ${modelName}:`, error);
          reject(error);
        },
      );
    });
  } catch (error) {
    console.error('An error happened', error);
    throw error;
  }
}

/**
 * 加载HDR环境贴图
 * @param path 模型路径
 * @param callback
 */
function RGBEModelLoader(path, callback) {
  const hdrLoader = new RGBELoader();
  hdrLoader.loadAsync(texturesUrl + path).then((texture) => {
    callback(texture);
  });
}

/**
 *
 * @param path
 * @param callback
 * @constructor
 */
function ImageLoader(path, callback) {
  const loader = new THREE.TextureLoader();
  loader.load(texturesUrl + path,
    (texture) => {
      callback(texture);
    },
    undefined,
    (error) => {
      console.error('An error happened', error);
    }
  );
}

/**
 * 异步加载OBJ类型的模型
 * @param modelName 模型名称（不含扩展名）
 * @param onProgress 进度回调函数，接收0-100的进度值
 * @returns Promise 返回包含模型名称和模型对象的Promise
 */
async function OBJModelLoader(modelName: string, onProgress?: (progress: number) => void): Promise<any> {
  const loader = new OBJLoader();
  try {
    return new Promise((resolve, reject) => {
      loader.load(
        modelsUrl + modelName + '.obj', // 拼接完整的模型文件路径
        // 加载成功回调
        function (obj) {
          // 模型加载完成，通知进度100%
          if (onProgress) {
            onProgress(100);
          }
          // 返回模型名称和模型对象
          resolve({name: modelName, model: obj});
        },
        // 加载进度回调
        function (xhr) {
          if (xhr.total > 0) {
            // 计算加载进度百分比
            const progress = (xhr.loaded / xhr.total) * 100;
            // 调用进度回调
            if (onProgress) {
              onProgress(progress);
            }
          }
        },
        // 加载失败回调
        function (error) {
          reject(error);
        },
      );
    });
  } catch (error) {
    console.error('An error happened', error);
    throw error;
  }
}

/**
 * 根据模型类型统一加载模型
 * @param modelName 模型名称（不含扩展名）
 * @param modelType 模型文件类型（GLTF/GLB/OBJ）
 * @param onProgress 进度回调函数，接收0-100的进度值
 * @returns Promise 返回包含模型名称和模型对象的Promise
 */
function ModelLoader(modelName: string, modelType: ModelType, onProgress?: (progress: number) => void): Promise<any> {
  switch (modelType) {
    case ModelType.GLB:
    case ModelType.GLTF:
      // GLB和GLTF格式使用相同的加载器
      return GLTFModelLoader(modelName, onProgress);
    case ModelType.OBJ:
      // OBJ格式使用OBJ加载器
      return OBJModelLoader(modelName, onProgress);
    default:
      // 不支持的类型抛出错误
      return Promise.reject(new Error(`Unsupported model type: ${modelType}`));
  }
}

/**
 * 加载纹理贴图
 * @param path 纹理文件路径（不含扩展名）
 * @returns THREE.Texture 返回Three.js纹理对象
 */
function TextureLoader(path) {
  return new THREE.TextureLoader().load(globSetting.modelsUrl + '/sprite_imgs/' + path + '.png');
}

export {
  ModelLoader,
  GLTFModelLoader,
  OBJModelLoader,
  ModelType,
  RGBEModelLoader,
  TextureLoader,
  ImageLoader
};
