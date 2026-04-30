
// RadarShader.ts
import * as THREE from "three";  // 导入Three.js库

const RadarShader = {           // 定义雷达着色器对象
  // 顶点着色器
  RadarVertexShader: `          // 顶点着色器代码字符串开始
        varying vec2 vUv;       // 声明varying变量，用于传递顶点UV坐标到片元着色器
        varying vec3 vPosition; // 声明varying变量，用于传递顶点位置到片元着色器
        void main() {           // 顶点着色器主函数
            vUv = uv;           // 将当前顶点的UV坐标赋值给varying变量
            vPosition = position; // 将当前顶点的位置赋值给varying变量
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); // 计算顶点在裁剪空间中的位置
        }`,                     // 顶点着色器代码字符串结束

  // 片元着色器
  RadarFragmentShader:  `       // 片元着色器代码字符串开始
        #define uScanOrigin vec3(0.0, 0.0, 0.0)    // 定义扫描原点位置(世界坐标系原点)
        #define uScanWaveRatio1 3.2                // 定义第一个波浪效果的比例系数
        #define uScanWaveRatio2 2.8                // 定义第二个波浪效果的比例系数

        uniform float uFactor;                       // 时间均匀变量，用于动画效果
        uniform float uTime;                       // 时间均匀变量，用于动画效果
        uniform vec3 uScanColor;                   // 扫描主要颜色uniform变量
        uniform vec3 uScanColorDark;               // 扫描暗部颜色uniform变量
        
        varying vec2 vUv;                          // 接收从顶点着色器传递的UV坐标
        varying vec3 vPosition;                    // 接收从顶点着色器传递的顶点位置

        // 计算圆形波浪效果的函数
        float circleWave(vec3 p, vec3 origin, float distRatio) {
            float t = uTime;                       // 获取当前时间
            float dist = distance(p, origin) * distRatio;  // 计算点到原点的距离并乘以比例系数
            float radialMove = fract(dist - t);    // 计算径向移动值(小数部分)
            float fadeOutMask = 1.0 - smoothstep(1.0, 3.0, dist); // 创建随距离增加而淡出的遮罩
            radialMove *= fadeOutMask;             // 应用淡出遮罩到径向移动值
            float cutInitialMask = 1.0 - step(t, dist); // 创建初始切割遮罩(避免初始化时出现波浪)
            return radialMove * cutInitialMask;    // 返回应用遮罩后的波浪值
        }

        // 获取扫描颜色的函数
        vec3 getScanColor(vec3 worldPos, vec2 uv, vec3 col) {
            // 纹理采样(此处为空，可扩展纹理功能)
            
            // 波浪效果
            float cw = circleWave(worldPos, uScanOrigin, uScanWaveRatio1 * uFactor);  // 计算第一个波浪效果
            float cw2 = circleWave(worldPos, uScanOrigin, uScanWaveRatio2 * uFactor); // 计算第二个波浪效果
            
            // 扫描遮罩
            float mask1 = smoothstep(0.3, 0.0, 1.0 - cw);  // 创建第一个遮罩(反向平滑步进)
            
            float mask2 = smoothstep(0.07, 0.0, 1.0 - cw2) * 0.8; // 创建第二个遮罩并降低强度
            mask1 += mask2;                                // 将第二个遮罩叠加到第一个遮罩上
            
            float mask3 = smoothstep(0.09, 0.0, 1.0 - cw) * 1.5;  // 创建第三个遮罩并增强强度
            mask1 += mask3;                                // 将第三个遮罩叠加到总遮罩上

            // 颜色混合
            vec3 scanCol = mix(uScanColorDark, uScanColor, mask1); // 根据遮罩值混合深浅两种扫描颜色
            return scanCol * mask1;                        // 返回应用遮罩后的扫描颜色(实现透明效果)
        }

        // 片元着色器主函数
        void main() {
            vec3 col = vec3(0.0);                      // 初始化颜色为黑色
            col = getScanColor(vPosition, vUv * 10.0, col); // 获取扫描颜色(UV坐标放大10倍)
            
            // 计算alpha通道
            float alpha = length(col);                 // 根据颜色强度计算透明度(颜色越亮越不透明)
            
            gl_FragColor = vec4(col, alpha);           // 设置片元最终颜色和透明度
        }
    `                           // 片元着色器代码字符串结束
};

export {RadarShader};          // 导出雷达着色器对象
