<template>
  <div id="GEOVISContainer" class="w-full h-full"></div>
</template>
<script lang="ts" setup>
  import { onMounted, computed, watch, ref } from 'vue';
  import { getIdealEditorRed, getIdealEditorBlue, getMissileAdress } from '@/api/zhc/zhcManage';
  import { useNotifyStoreWithOut } from '@/store/modules/notify';

  const useNotifyStore = useNotifyStoreWithOut();

  /**工作模式-start */
  const workMode = computed(() => {
    return useNotifyStore.getWorkMode;
  });
  watch(
    () => workMode.value,
    async (newValue) => {
      if (newValue == '1') {
        //清除所有标绘，重新绘制
        await clearMark();
      }
    },
    { deep: true },
  );
  /**工作模式-end */

  /**获取DD数据-start */
  const getMissileData: any = computed(() => {
    return useNotifyStore.getMissileData;
  });
  const isFlyTo = ref(false);
  /**监听DD数据变化 */
  watch(
    () => getMissileData.value,
    (newValue, oldValue) => {
      if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
        //清除可达区标绘
        window.reachEnvelopGroup.clear();
        getMissileData.value.forEach((item, index) => {
          loadMissile(item);
          //相机跟随至第一个D的位置
          if (!isFlyTo.value && index == 0) {
            isFlyTo.value = true;
            window.viewer.camera.flyTo({
              destination: window.Cesium.Cartesian3.fromDegrees(item.JD, item.WD, 500000),
            });
          }
        });
      }
    },
    { deep: true },
  );
  /**获取DD数据-end */

  /**获取目标数据-start */
  const getTargetData: any = computed(() => {
    return useNotifyStore.getTargetData;
  });
  /**监听目标数据变化 */
  watch(
    () => getTargetData.value,
    (newValue, oldValue) => {
      getTargetData.value.forEach((item) => {
        loadTarget(item);
      });
    },
    { deep: true },
  );
  /**获取目标数据-end */

  /**获取拦截弹数据-start */
  const InterceptData: any = computed(() => {
    return useNotifyStore.getInterceptData;
  });
  watch(
    () => InterceptData.value,
    (newValue, oldValue) => {
      InterceptData.value.forEach((item) => {
        loadIntercept(item);
      });
    },
    { deep: true },
  );
  /**获取拦截弹数据-end */

  /**加载导弹，实时轨迹 */
  function loadMissile(missileObj) {
    const { DDBH, JD, WD, GD, FW, ZT, hisGjList, kdqList } = missileObj;
    //绘制轨迹
    addTrajectory(DDBH, hisGjList, Cesium.Color.RED);
    reachEnvelop(kdqList);

    const missileTarget = window.targetLayer.getItemById(DDBH);
    if (!missileTarget) {
      var missile = new window.GV.TargetItem(
        DDBH,
        window.Cesium.Math.toDegrees(JD),
        window.Cesium.Math.toDegrees(WD),
        GD,
        0,
      );
      missile.name = DDBH;
      missile.style.color = '#0fff0f';
      missile.styleCode = 'default';

      missile.smoothTrack = true; //是否平滑
      missile.showTrack = false;
      missile.angle = FW + 180;
      missile.backwardPath.show = false;

      window.targetLayer.add(missile);
    } else {
      missileTarget.updatePosition(JD, WD, GD, 0);
      missileTarget.angle = FW + 180;
      // if (ZT == 2 && missileTarget.flame) {
      //   missileTarget.flame.show = true;
      // }
    }
  }

  /**加载目标，实时轨迹 */
  function loadTarget(targetObj) {
    const { MBBH, JD, WD, FW, hisGjList, LXBZ } = targetObj;

    const target = window.targetLayer.getItemById(MBBH);
    //添加目标
    if (!target) {
      var targetItem = new window.GV.TargetItem(
        MBBH,
        window.Cesium.Math.toDegrees(JD),
        window.Cesium.Math.toDegrees(WD),
        0,
        0,
      );
      // targetItem.name = MBBH;
      targetItem.style.color = '#46bcf3';
      targetItem.style.fontSize = 36;

      targetItem.styleCode = 'target';
      targetItem.smoothTrack = true; //是否平滑
      targetItem.showTrack = false;
      targetItem.angle = FW;
      targetItem.backwardPath.show = false;
      window.targetLayer.add(targetItem);
    } else {
      target.updatePosition(JD, WD, 0, 0);
      target.angle = FW;
    }

    const solidEntities = window.viewer.entities.getById(MBBH);
    //给目标添加雷达罩
    if (!solidEntities) {
      radarSolidScan({
        viewer: window.viewer,
        radius: 15000.0,
        position: [JD, WD],
        color: new window.Cesium.Color(0.0, 0.0, 1.0, 0.3),
        speed: 1.0,
        id: MBBH,
      });
    } else {
      solidEntities.position = new Cesium.Cartesian3.fromDegrees(JD, WD);
    }

    const labelGraphic = window.group.getById(`Label-${MBBH}`);
    //给目标添加名字
    if (!labelGraphic) {
      //目标类型标题颜色映射
      const colorMap = {
        0: '#1677ff',
        1: '#5adaa2',
        2: '#dd4d3a',
      };
      const label = new window.GV.LabelGraphic({
        position: new window.GV.GeoPoint(JD, WD),
        text: MBBH, //显示标题
        fillColor: colorMap[LXBZ], //颜色
        horizontalOrigin: 'right',
        verticalOrigin: 'bottom',
        scaleByDistance: [1.5e2, 2.0, 1.5e7, 0.5],
        id: `Label-${MBBH}`,
      });
      window.group.add(label);
    } else {
      labelGraphic.position = new window.GV.GeoPoint(JD, WD);
    }
  }

  /**加载拦截弹，实时轨迹 */
  function loadIntercept(interceptObj) {
    const { LJDBH, JD, WD, GD, FW, hisGjList } = interceptObj;
    //绘制轨迹
    addTrajectory(LJDBH, hisGjList, Cesium.Color.YELLOW);
    //判断当前导弹是否存在，已存在=>修改，不存在=>添加
    const interceptTarget = window.targetLayer.getItemById(LJDBH);
    if (!interceptTarget) {
      var intercept = new window.GV.TargetItem(
        LJDBH,
        window.Cesium.Math.toDegrees(JD),
        window.Cesium.Math.toDegrees(WD),
        GD,
        0,
      );
      intercept.name = LJDBH;
      intercept.style.color = '#ffb900';
      intercept.styleCode = 'intercept';
      intercept.smoothTrack = true; //是否平滑
      intercept.showTrack = false;
      intercept.angle = FW + 180;
      intercept.backwardPath.show = false;
      window.targetLayer.add(intercept);
    } else {
      interceptTarget.updatePosition(JD, WD, GD, 0);
      interceptTarget.angle = FW + 180;
    }
  }

  let polylinePrimitives = {}; //存储每个目标的轨迹对象
  /**画轨迹 */
  function addTrajectory(id, positions, color) {
    //轨迹绘制需要两个点以上
    if (positions.length < 2) return;
    //查找轨迹是否已经存在
    // let polylinePrimitive = window[id + '_polyline'];
    let polylinePrimitive = polylinePrimitives[id + '_polyline'];
    //删除已经存在的轨迹
    if (polylinePrimitive) {
      window.scene.primitives.remove(polylinePrimitive);
    }
    //轨迹点位处理
    const cesiumPositions = positions.map((pos) => {
      return new Cesium.Cartesian3.fromDegrees(pos.JD, pos.WD, pos.GD);
    });
    //轨迹绘制-start
    let polyline = new Cesium.PolylineGeometry({
      positions: cesiumPositions,
      width: 2.0, //轨迹宽度
      vertexFormat: Cesium.PolylineColorAppearance.VERTEX_FORMAT,
    });
    let GeometryInstance = new Cesium.GeometryInstance({
      geometry: polyline,
      attributes: {
        color: Cesium.ColorGeometryInstanceAttribute.fromColor(color),
      },
    });
    let primitive = new Cesium.Primitive({
      geometryInstances: GeometryInstance,
      appearance: new Cesium.PolylineColorAppearance({
        translucent: false,
      }),
      asynchronous: false,
    });
    window.scene.primitives.add(primitive); //将轨迹添加到场景中
    //轨迹绘制-end
    // window[id + '_polyline'] = primitive; //将轨迹保存到全局变量中
    polylinePrimitives[id + '_polyline'] = primitive;
  }

  /**清除所有轨迹线 */
  function clearAllTrajectory() {
    for (const id in polylinePrimitives) {
      const polylinePrimitive = polylinePrimitives[id];
      if (polylinePrimitive) {
        window.scene.primitives.remove(polylinePrimitive);
      }
    }
    polylinePrimitives = {};
  }

  /**立体雷达扫描效果 */
  function radarSolidScan(options) {
    /**
     * 半径:_radius
     * 扫描扇形颜色:_color
     * 扫描速度:_speed
     * 中心点坐标经纬度:position
     */
    const {
      viewer: _viewer,
      radius: _radius,
      color: _color,
      speed: _speed,
      position,
      id,
    } = options;
    const _cenLon = position[0];
    const _cenLat = position[1];
    let heading = 0;
    let positionArr = calculatePane(_cenLon, _cenLat, _radius, heading);

    // 先建立椭球体
    _viewer.entities.add({
      position: new Cesium.Cartesian3.fromDegrees(_cenLon, _cenLat),
      name: '立体雷达扫描',
      id,
      ellipsoid: {
        radii: new Cesium.Cartesian3(_radius, _radius, _radius),
        material: _color,
        outline: true,
        outlineColor: new Cesium.Color(0.0, 0.0, 1.0, 0.5),
        outlineWidth: 1,
        maximumCone: Cesium.Math.toRadians(90),
      },
    });

    // 每一帧刷新时调用
    _viewer.clock.onTick.addEventListener(() => {
      heading += _speed;
      positionArr = calculatePane(_cenLon, _cenLat, _radius, heading);
    });

    // 创建1/4圆形立体墙
    // _viewer.entities.add({
    //   id: `${id}-scan`,
    //   wall: {
    //     positions: new Cesium.CallbackProperty(() => {
    //       return Cesium.Cartesian3.fromDegreesArrayHeights(positionArr);
    //     }, false),
    //     material: _color,
    //   },
    // });

    // 计算平面扫描范围
    function calculatePane(x1, y1, radius, heading) {
      var m = Cesium.Transforms.eastNorthUpToFixedFrame(Cesium.Cartesian3.fromDegrees(x1, y1));
      var rx = radius * Math.cos((heading * Math.PI) / 180.0);
      var ry = radius * Math.sin((heading * Math.PI) / 180.0);
      var translation = Cesium.Cartesian3.fromElements(rx, ry, 0);
      var d = Cesium.Matrix4.multiplyByPoint(m, translation, new Cesium.Cartesian3());
      var c = Cesium.Cartographic.fromCartesian(d);
      var x2 = Cesium.Math.toDegrees(c.longitude);
      var y2 = Cesium.Math.toDegrees(c.latitude);
      return calculateSector(x1, y1, x2, y2);
    }

    // 计算竖直扇形
    function calculateSector(x1, y1, x2, y2) {
      let positionArr = [] as any;
      positionArr.push(x1);
      positionArr.push(y1);
      positionArr.push(0);
      var radius = Cesium.Cartesian3.distance(
        Cesium.Cartesian3.fromDegrees(x1, y1),
        Cesium.Cartesian3.fromDegrees(x2, y2),
      );
      // 扇形是1/4圆，因此角度设置为0-90
      for (let i = 0; i <= 90; i++) {
        let h = radius * Math.sin((i * Math.PI) / 180.0);
        let r = Math.cos((i * Math.PI) / 180.0);
        let x = (x2 - x1) * r + x1;
        let y = (y2 - y1) * r + y1;
        positionArr.push(x);
        positionArr.push(y);
        positionArr.push(h);
      }
      return positionArr;
    }
  }

  /** 初始化地球*/
  function onload() {
    window.viewer = new window.GV.GeoCanvas('GEOVISContainer', {
      baseLayerPicker: false,
      // fxaa: true, //抗锯齿
      // imageryProvider: window.GV.EarthTheme.getTheme(),
      orderIndependentTranslucency: false,
      contextOptions: {
        webgl: {
          alpha: true,
        },
      },
    });
    //初始化场景
    window.scene = window.viewer.scene;
    window.scene.skyBox.show = false;
    window.scene.backgroundColor = new window.Cesium.Color(0, 0, 0, 0);
    // 创建场景组
    window.group = new window.GV.GraphicGroup();
    //可达区场景组
    window.reachEnvelopGroup = new window.GV.GraphicGroup();
    window.viewer.graphicLayer.add(window.group);
    window.viewer.graphicLayer.add(window.reachEnvelopGroup);

    window.targetLayer = new window.GV.TargetLayer(window.viewer);
    //目标图层配置文件
    const config = {
      distanceDisplayCondition: {
        // point: [650000, 90000000],
        // icon: [350000, 650000],
        // label: [0, 650000],
        // model: [0, 90000000],
        point: [650000, 90000000],
        icon: [0, 0],
        label: [8000, 650000],
        model: [0, 800000],
      },
      showModel: true,
      styles: [
        {
          code: 'default',
          style: {
            modelUrl: '/model/GV_missile_1.glb',
            pointSize: 10,
            labeloffsetx: 10,
            labeloffsety: -10,
            color: '#ff0000',
          },
        },
        {
          code: 'target',
          style: {
            modelUrl: '/model/GV_qzj.glb',
            pointSize: 10,
            labeloffsetx: 10,
            labeloffsety: -10,
            color: '#46bcf3',
          },
        },
        {
          code: 'intercept',
          style: {
            modelUrl: '/model/GV_missile_1.glb',
            pointSize: 10,
            labeloffsetx: 10,
            labeloffsety: -10,
            color: '#ffb900',
          },
        },
      ],
    };
    //加载配置文件
    window.targetLayer.loadStyleConfig(config);
  }

  /**添加目标 */
  const addTarget = (longitude, latitude, height, type, name) => {
    //添加模型
    const modelGraphic = new GV.ModelGraphic({
      type: 'model',
      name: '驱逐舰',
      visible: true,
      url: '/model/GV_qzj.glb',
      position: new window.GV.GeoPoint(longitude, latitude, height),
      scale: 1000,
      pitch: 0,
      roll: 0,
      minimumPixelSize: 10000,
      maximumScale: 10000,
    });
    window.group.add(modelGraphic);
    //添加标签
    const labelGraphic = new window.GV.LabelGraphic({
      position: new window.GV.GeoPoint(longitude, latitude),
      text: name,
      fillColor: '#1677ff',
      horizontalOrigin: 'right',
      verticalOrigin: 'bottom',
      scaleByDistance: [1.5e2, 2.0, 1.5e7, 0.5],
    });
    window.group.add(labelGraphic);
    //添加雷达罩
    radarSolidScan({
      viewer: window.viewer,
      radius: 15000.0,
      position: [longitude, latitude],
      color: new window.Cesium.Color(0.0, 0.0, 1.0, 0.3),
      speed: 1.0,
      id: name,
    });
  };

  /**添加Missile交战区 */
  const addMissile = (longitude, latitude, height, type, name) => {
    //添加交战区
    const spreadCircle = new GV.SpreadCircleRingGraphic({
      position: new GV.GeoPoint(longitude, latitude, 1000),
      color: 'rgba(252, 0, 32, .2)',
      radius: 5000.0,
      count: 0.5,
      speed: 0,
      renderType: GV.SpreadCircleRingEnum.Ramp,
    });
    window.group.add(spreadCircle);
    //添加标签
    const labelGraphic = new window.GV.LabelGraphic({
      position: new window.GV.GeoPoint(longitude, latitude),
      text: name,
      fillColor: '#FF0033',
      horizontalOrigin: 'right',
      verticalOrigin: 'bottom',
      scaleByDistance: [1.5e2, 2.0, 1.5e7, 0.5],
    });
    window.group.add(labelGraphic);
  };

  /**加载数据 */
  const getData = async () => {
    /**获取目标数据-start */
    const { rows: target } = await getIdealEditorBlue(null);
    for (let index = 0; index < target.length; index++) {
      addTarget(target[index].longitude, target[index].latitude, 0, 1, target[index].identifier);
    }
    /**获取目标数据-end */

    /**获取Missile数据-start */
    const { rows: missile } = await getIdealEditorRed(null);
    for (let index = 0; index < missile.length; index++) {
      addMissile(
        missile[index].longitude,
        missile[index].latitude,
        0,
        1,
        missile[index].identifier,
      );
    }
    /**获取Missile数据-end */

    // if (target.length > 0 || missile.length > 0) {
    //   window.viewer.camera.flyTo({
    //     destination: window.Cesium.Cartesian3.fromDegrees(
    //       target[0]?.longitude || missile[0]?.longitude,
    //       target[0]?.latitude || missile[0]?.latitude,
    //       2000000,
    //     ),
    //   });
    // }
  };

  /**绘制当前仿真弹簇交战区 */
  const missileAddress = async () => {
    const { rows } = await getMissileAdress();
    rows.forEach((element) => {
      const { longitude, latitude, identifier } = element;
      addMissile(longitude, latitude, 0, 0, identifier);
    });
  };

  /**清除所有标绘 */
  const clearMark = async () => {
    //清除不是当前任务的标绘
    window.group.clear();
    //清除可达区标绘
    window.reachEnvelopGroup.clear();
    //清除不是当前任务的雷达罩
    window.viewer.entities.removeAll();
    //清除所有目标
    window.targetLayer.removeAll();
    //清除所有轨迹线
    clearAllTrajectory();
    //绘制当前仿真任务交战区
    await missileAddress();
  };

  /**可达区标绘 */
  const reachEnvelop = (list) => {
    //贴地多边形
    let polygon1 = new GV.PolygonGraphic({
      positions: list.map((coord) => new GV.GeoPoint(coord.JD, coord.WD)), //设置坐标
      color: 'rgba(255, 255, 0, 0.1)', //填充色
      clampToGround: true,
    });
    window.reachEnvelopGroup.add(polygon1); //添加到场景
  };

  onMounted(async () => {
    onload();
    //判断是否在仿真过程中
    if (workMode.value == '1') {
      //清除所有标绘，重新绘制
      await clearMark();
    } else {
      await getData();
    }
  });
</script>
