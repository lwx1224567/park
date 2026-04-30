import * as THREE from "three";

const CameraConeShader = {
  vertexShader: `
    // 顶点着色器 CameraConeShader.vertexShader
    varying vec3 vWorldPosition;
    varying vec3 vNormal;
    varying vec4 vPosition;
    
    void main() {
      vPosition = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
      vNormal = normalize(normalMatrix * normal);
      gl_Position = vPosition;
    }
  `,

  fragmentShader: `
    uniform vec3 uColor;
    uniform float uLength;
    uniform vec3 uCameraPosition;
    uniform sampler2D uDepthTexture;  // 添加深度纹理
    uniform mat4 uProjectionMatrix;   // 投影矩阵
    uniform mat4 uViewMatrix;         // 视图矩阵
    uniform float uNear;              // 近裁剪面
    uniform float uFar;               // 远裁剪面
    
    varying vec3 vWorldPosition;
    varying vec3 vNormal;
    varying vec4 vPosition;
    
    // 深度转换函数
    float perspectiveDepthToViewZ(const in float invClipZ, const in float near, const in float far) {
      return (near * far) / ((far - near) * invClipZ - far);
    }
    
    float viewZToOrthographicDepth(const in float viewZ, const in float near, const in float far) {
      return (viewZ + near) / (near - far);
    }
    
    // 从深度纹理获取线性深度
    float getLinearDepth(vec2 uv) {
      float depth = texture2D(uDepthTexture, uv).r;
      float viewZ = perspectiveDepthToViewZ(depth, uNear, uFar);
      return viewZToOrthographicDepth(viewZ, uNear, uFar);
    }
    
    void main() {
      // 计算当前片元的世界坐标到相机的距离
      float distanceToCamera = distance(vWorldPosition, uCameraPosition);
      
      // 将世界坐标转换为屏幕坐标
      vec4 clipSpace = uProjectionMatrix * uViewMatrix * vec4(vWorldPosition, 1.0);
      vec3 ndc = clipSpace.xyz / clipSpace.w;
      vec2 screenCoord = ndc.xy * 0.5 + 0.5;
      
      // 获取该屏幕坐标的深度
      float sceneDepth = getLinearDepth(screenCoord);
      float currentDepth = viewZToOrthographicDepth(distanceToCamera, uNear, uFar);
      
      // 如果当前片元比场景中对应位置的深度更远，则丢弃
      if (currentDepth > sceneDepth + 0.01) {
        discard;
      }
      
      gl_FragColor = vec4(uColor, 0.3);
    }
  `,

  uniforms: {
    uColor: { value: new THREE.Color(0x00ffff) }, // 默认青色
    uLength: { value: 20.0 }, // 锥形长度
    uCameraPosition: { value: new THREE.Vector3(0, 0, 0) } // 摄像头位置
  }
};

export { CameraConeShader };
