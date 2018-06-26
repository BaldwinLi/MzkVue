import store from './vuex/store';

const initAmap = (func) => {
  window['IMap'] = new AMap.Map('map-container');
  window['IMap'].plugin('AMap.Geolocation', function () {
    window['geolocation'] = new AMap.Geolocation({
      enableHighAccuracy: true, //是否使用高精度定位，默认:true
      timeout: 15000, //超过10秒后停止定位，默认：无穷大
      maximumAge: 0, //定位结果缓存0毫秒，默认：0
      convert: true, //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
      showButton: true, //显示定位按钮，默认：true
      buttonPosition: 'LB', //定位按钮停靠位置，默认：'LB'，左下角
      buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
      showMarker: false, //定位成功后在定位到的位置显示点标记，默认：true
      showCircle: true, //定位成功后用圆圈表示定位精度范围，默认：true
      panToLocation: true, //定位成功后将定位到的位置作为地图中心点，默认：true
      zoomToAccuracy: true //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
    });
    window['IMap'].addControl(geolocation);
    func();
  });
  // AMap.event.addListener(geolocation, "complete", value => {
  //   new AMap.Marker({
  //     position: [value.position.lng, value.position.lat],
  //     content: `<i class="mzk mzk-qidian map-mark" aria-hidden="true"></i>`,
  //     title: '当前位置',
  //     map: IMap
  //   });
  // });
};

export default () => {
  if (!window['AMap']) {
    const amapKey = store.getters.isLocal ? 'd4db416574e2ca922626865111063378' : 'f69ddd4d557dfb18205003a019e59035'
    const scriptEl = document.createElement('script');
    scriptEl.setAttribute('type', 'text/javascript');
    scriptEl.setAttribute('src', `http://webapi.amap.com/maps?v=1.4.6&key=${amapKey}`);
    document.getElementsByTagName('head')[0].appendChild(scriptEl);
    return new Promise(function (resolve) {
      scriptEl.onload = () => {
        initAmap(() => {
          resolve(true);
        });
      }
    });
  } else {
    return new Promise(function (resolve) {
      initAmap(() => {
        resolve(true);
      });
    });
  }
};

const getZoom = (distance) => {
  const zoom = [50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000, 25000, 50000, 100000, 200000, 500000, 1000000, 2000000] //级别18到3
  return 18 - zoom.findIndex(e => {
    return e - distance > 0
  }) + 1;
}


export const markerMap = (title, longitude, latitude) => {
  // geolocation.getCurrentPosition();
  // const distance = Math.sqrt(
  //   Math.pow(
  //     longitude - store.state.currentPosition.longitude,
  //     2) +
  //   Math.pow(
  //     latitude - store.state.currentPosition.latitude,
  //     2)
  // ) * 111320;
  const currentPosition = new AMap.LngLat(store.state.currentPosition.longitude, store.state.currentPosition.latitude);
  const targetPosition = new AMap.LngLat(longitude, latitude);
  const distance = currentPosition.distance(targetPosition);
  // 48000/(distance*111320)
  IMap.setZoom(getZoom(distance));
  let cLongitude, cLatitude;
  if (longitude > store.state.currentPosition.longitude) {
    cLongitude = store.state.currentPosition.longitude + (longitude - store.state.currentPosition.longitude) / 2
  } else {
    cLongitude = longitude + (store.state.currentPosition.longitude - longitude) / 2
  }
  if (latitude > store.state.currentPosition.latitude) {
    cLatitude = store.state.currentPosition.latitude + (latitude - store.state.currentPosition.latitude) / 2
  } else {
    cLatitude = latitude + (store.state.currentPosition.latitude - latitude) / 2
  }
  IMap.setCenter([cLongitude, cLatitude]);
  // });
  // IMap.setZoom(10);

  new AMap.Marker({
    position: [store.state.currentPosition.longitude, store.state.currentPosition.latitude],
    title: '当前位置',
    content: `<i class="mzk mzk-qidian map-mark" aria-hidden="true"></i>`,
    map: IMap
  });
  new AMap.Marker({
    position: [longitude, latitude],
    title,
    content: `<i class="mzk mzk-zhongdian map-mark" aria-hidden="true"></i>`,
    // offset: new AMap.Pixel(-12, -12),
    map: IMap
  });
  return (distance / 1000).toFixed(3);
}
