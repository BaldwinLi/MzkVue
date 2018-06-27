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
  loadingContent: '正在加载...',
  height: 15
}

export const geolocationOptions = {
  enableHighAccuracy: true,
  maximumAge: 1000,
  timeout: 3000
}

export const geolocationErrorCallback = (value, alert, func) => {
  let title = "定位失败";
  let content = "";
  const messages = value.message.split(',');
  const states = messages[0].split('.');
  const results = messages[1].split('.')
  for (const e of states) {
    switch (e) {
      case 'Get address fail':
        alert.show({
          title,
          content: "精确地址获取失败，请检查网络环境。"
        });
        func(value);
        return;
    }
    if (e.indexOf('fail') > -1) {
      // 捕获了些异常 判断设备GPS 和IP那个出现异常 会相应弹窗 
      title += (" " + e);
    }
  }
  results.forEach(e => {
    content += (e + ' ');
  });
  alert.show({
    title,
    content
  });
  return;

}
