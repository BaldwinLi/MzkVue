export default () => {
  if (!BMap) {
    const scriptEl = document.createElement('script');
    scriptEl.setAttribute('type', 'text/javascript');
    scriptEl.setAttribute('src', '//api.map.baidu.com/api?ak=您的密钥&type=lite&v=1.0');
    document.getElementsByTagName('head')[0].appendChild(scriptEl);
  }
};
