export const pulldownConfig = {
  content: '下拉刷新',
  downContent: '下拉刷新',
  upContent: '释放后更新',
  loadingContent: '正在刷新...'
}

export const pullupConfig = {
  content: '上拉加载更多',
  upContent: '上拉加载更多',
  downContent: '释放后加载',
  loadingContent: '正在加载...'
}

export const geolocationOptions = {
  enableHighAccuracy: true,
  maximumAge: 1000,
  timeout: 3000
}

export const geolocationErrorCallback = (value, alert) => {
  const title = "地图加载失败";
  switch (value.code) {
    case 1:
      alert.show({
        title,
        content: "您的网络协议不允许使用定位服务"
      });
      break;
    case 2:
      alert.show({
        title,
        content: "暂时获取不到位置信息"
      });
      break;
    case 3:
      alert.show({
        title,
        content: "获取信息超时"
      });
      break;
    case 4:
      alert.show({
        title,
        content: "未知错误"
      });
      break;
  }
}
