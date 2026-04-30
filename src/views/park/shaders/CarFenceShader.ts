import * as THREE from "three";

const CarFenceShader = {
  vertexShader: `
    varying vec3 vPosition;
    varying vec3 vNormal;
    
    void main() {
      vPosition = position;
      vNormal = normal;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 uColor;
    uniform float uHeight;
    varying vec3 vPosition;
    varying vec3 vNormal;
    
    void main() {
      // 获取当前片元的法线和位置
      vec3 normal = normalize(vNormal);
      vec3 pos = vPosition;
      
      // 判断是否为顶部或底部面（根据法线方向）
      bool isTopOrBottom = (abs(normal.y) > 0.99);
      
      // 如果是顶部或底部，则完全透明
      if (isTopOrBottom) {
        discard;
      }
      
      // 计算渐变因子 - 基于Y坐标位置
      float gradientFactor = 0.6 - (pos.y / uHeight);
      
      // 确保透明度在合理范围内
      float alphaFactor = clamp(gradientFactor, 0.0, 1.0); // 乘以一个小于1的系数
      alphaFactor = pow(gradientFactor, 4.0); // 调整平滑步进参数
      gl_FragColor = vec4(uColor, alphaFactor);
    }
  `,
};

export { CarFenceShader };

