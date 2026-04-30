import * as THREE from "three";

const GeoFenceShader = {
  vertexShader: `
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying vec2 vUv;
    void main() {
      vUv = uv;
      vPosition = position;
      vNormal = normal;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,

  fragmentShader: `
    uniform vec3 uColor;
    uniform float uTime;
    uniform float uHeight;
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying vec2 vUv;
    
    void main() {
      vec3 normal = normalize(vNormal);
      bool isTopOrBottom = (abs(normal.z) > 0.99);
      
      if (isTopOrBottom) {
        discard;
      }
      
      // 可调节参数
      float frequency = 0.15;    // 条纹数量
      float speed = 0.3;         // 滚动速度
      float smoothness = 0.05;    // 过渡平滑度 (0-1)
      float stripeWidth = 0.1;   // 彩色条纹宽度 (0-1)
      
      // 创建动态波浪
      float wave = fract(vUv.y * frequency - uTime * speed);
      
      // 计算平滑的alpha过渡
      float fadeIn = smoothstep(0.0, smoothness, wave);
      float fadeOut = smoothstep(stripeWidth, stripeWidth + smoothness, wave);
      float alpha = fadeIn - fadeOut;
      
      // 可选：给颜色添加一些动态变化
      vec3 dynamicColor = uColor * (0.9 + 0.1 * sin(uTime * 2.0));
      
      gl_FragColor = vec4(dynamicColor, alpha);
    }
  `,
};

export { GeoFenceShader };
