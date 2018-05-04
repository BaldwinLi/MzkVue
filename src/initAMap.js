import store from './vuex/store';
import {
  geolocationErrorCallback
} from "./components/config";
import {
  AlertModule
} from 'vux'


export default () => {
  const mapContainer = document.getElementById('map-container');
  if (!window['AMap']) {
    const amapKey = store.getters.isLocal ? 'd4db416574e2ca922626865111063378' : 'f69ddd4d557dfb18205003a019e59035'
    const scriptEl = document.createElement('script');
    scriptEl.setAttribute('type', 'text/javascript');
    scriptEl.setAttribute('src', `http://webapi.amap.com/maps?v=1.4.6&key=${amapKey}`);
    document.getElementsByTagName('head')[0].appendChild(scriptEl);
    return new Promise(function (resolve, reject) {
      scriptEl.onload = () => {
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
            showMarker: true, //定位成功后在定位到的位置显示点标记，默认：true
            showCircle: true, //定位成功后用圆圈表示定位精度范围，默认：true
            panToLocation: true, //定位成功后将定位到的位置作为地图中心点，默认：true
            zoomToAccuracy: true //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
          });
          window['IMap'].addControl(geolocation);
          resolve(true);
        });
      }
    });
  } else {
    return new Promise(function (resolve, reject) {
      window['IMap'] = new AMap.Map('map-container');
      window['IMap'].plugin('AMap.Geolocation', function () {
        window['geolocation'] = new AMap.Geolocation({
          enableHighAccuracy: true, //是否使用高精度定位，默认:true
          timeout: 5000, //超过10秒后停止定位，默认：无穷大
          maximumAge: 0, //定位结果缓存0毫秒，默认：0
          convert: true, //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
          showButton: true, //显示定位按钮，默认：true
          buttonPosition: 'LB', //定位按钮停靠位置，默认：'LB'，左下角
          buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
          showMarker: true, //定位成功后在定位到的位置显示点标记，默认：true
          showCircle: true, //定位成功后用圆圈表示定位精度范围，默认：true
          panToLocation: true, //定位成功后将定位到的位置作为地图中心点，默认：true
          zoomToAccuracy: true //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
        });
        window['IMap'].addControl(geolocation);
        resolve(true);
      });
    });
  }
};


export const markerMap = (title, longitude, latitude) => {
  // geolocation.getCurrentPosition();
  // AMap.event.addListener(geolocation, "complete", value => {
  //   new AMap.Marker({
  //     position: [value.position.lng, value.position.lat],
  //     title: '当前位置',
  //     map: IMap
  //   });
  // const distance = Math.sqrt(
  //   Math.pow(
  //     longitude - store.state.currentPosition.longitude,
  //     2) +
  //   Math.pow(
  //     latitude - store.state.currentPosition.latitude,
  //     2)
  // )
  // 48000/(distance*111320)
  IMap.setZoom(11);
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
    map: IMap
  });
  new AMap.Marker({
    position: [longitude, latitude],
    title,
    content: `<i class="fa fa-map-marker map-mark" aria-hidden="true"></i>`,
    // offset: new AMap.Pixel(-12, -12),
    map: IMap
  });
}
