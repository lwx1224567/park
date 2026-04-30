// vite.config.ts
import { defineApplicationConfig } from "file:///E:/project1/%E8%AE%BE%E5%A4%87%E7%B2%BE%E6%A8%A13/internal/vite-config/dist/index.mjs";
var vite_config_default = defineApplicationConfig({
  overrides: {
    optimizeDeps: {
      include: [
        "echarts/core",
        "echarts/charts",
        "echarts/components",
        "echarts/renderers",
        "qrcode",
        "@iconify/iconify",
        "ant-design-vue/es/locale/zh_CN",
        "ant-design-vue/es/locale/en_US"
      ]
    },
    server: {
      // proxy: {
      //   '/basic-api': {
      //     target: 'http://tcm.tkzw.678999999.xyz:8080',
      //     changeOrigin: true,
      //     ws: true,
      //     rewrite: (path) => path.replace(new RegExp(`^/basic-api`), ''),
      //   },
      // },
      open: true,
      // 项目启动后，自动打开
      warmup: {
        clientFiles: ["./index.html", "./src/{views,components}/*"]
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFxwcm9qZWN0MVxcXFxcdThCQkVcdTU5MDdcdTdDQkVcdTZBMjEzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJFOlxcXFxwcm9qZWN0MVxcXFxcdThCQkVcdTU5MDdcdTdDQkVcdTZBMjEzXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9FOi9wcm9qZWN0MS8lRTglQUUlQkUlRTUlQTQlODclRTclQjIlQkUlRTYlQTglQTEzL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQXBwbGljYXRpb25Db25maWcgfSBmcm9tICdAdmJlbi92aXRlLWNvbmZpZyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVBcHBsaWNhdGlvbkNvbmZpZyh7XHJcbiAgb3ZlcnJpZGVzOiB7XHJcbiAgICBvcHRpbWl6ZURlcHM6IHtcclxuICAgICAgaW5jbHVkZTogW1xyXG4gICAgICAgICdlY2hhcnRzL2NvcmUnLFxyXG4gICAgICAgICdlY2hhcnRzL2NoYXJ0cycsXHJcbiAgICAgICAgJ2VjaGFydHMvY29tcG9uZW50cycsXHJcbiAgICAgICAgJ2VjaGFydHMvcmVuZGVyZXJzJyxcclxuICAgICAgICAncXJjb2RlJyxcclxuICAgICAgICAnQGljb25pZnkvaWNvbmlmeScsXHJcbiAgICAgICAgJ2FudC1kZXNpZ24tdnVlL2VzL2xvY2FsZS96aF9DTicsXHJcbiAgICAgICAgJ2FudC1kZXNpZ24tdnVlL2VzL2xvY2FsZS9lbl9VUycsXHJcbiAgICAgIF0sXHJcbiAgICB9LFxyXG4gICAgc2VydmVyOiB7XHJcbiAgICAgIC8vIHByb3h5OiB7XHJcbiAgICAgIC8vICAgJy9iYXNpYy1hcGknOiB7XHJcbiAgICAgIC8vICAgICB0YXJnZXQ6ICdodHRwOi8vdGNtLnRrencuNjc4OTk5OTk5Lnh5ejo4MDgwJyxcclxuICAgICAgLy8gICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcclxuICAgICAgLy8gICAgIHdzOiB0cnVlLFxyXG4gICAgICAvLyAgICAgcmV3cml0ZTogKHBhdGgpID0+IHBhdGgucmVwbGFjZShuZXcgUmVnRXhwKGBeL2Jhc2ljLWFwaWApLCAnJyksXHJcbiAgICAgIC8vICAgfSxcclxuICAgICAgLy8gfSxcclxuICAgICAgb3BlbjogdHJ1ZSwgLy8gXHU5ODc5XHU3NkVFXHU1NDJGXHU1MkE4XHU1NDBFXHVGRjBDXHU4MUVBXHU1MkE4XHU2MjUzXHU1RjAwXHJcbiAgICAgIHdhcm11cDoge1xyXG4gICAgICAgIGNsaWVudEZpbGVzOiBbJy4vaW5kZXguaHRtbCcsICcuL3NyYy97dmlld3MsY29tcG9uZW50c30vKiddLFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICB9LFxyXG59KTtcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUEyUSxTQUFTLCtCQUErQjtBQUVuVCxJQUFPLHNCQUFRLHdCQUF3QjtBQUFBLEVBQ3JDLFdBQVc7QUFBQSxJQUNULGNBQWM7QUFBQSxNQUNaLFNBQVM7QUFBQSxRQUNQO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsSUFDQSxRQUFRO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLE1BU04sTUFBTTtBQUFBO0FBQUEsTUFDTixRQUFRO0FBQUEsUUFDTixhQUFhLENBQUMsZ0JBQWdCLDRCQUE0QjtBQUFBLE1BQzVEO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
