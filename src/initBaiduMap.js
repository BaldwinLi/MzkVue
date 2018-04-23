export default () => {
  if (!window['BMap']) {
    const scriptEl = document.createElement('script');
    scriptEl.setAttribute('type', 'text/javascript');
    scriptEl.setAttribute('src', '//api.map.baidu.com/api?ak=mi3slB4ZEIbodHmHYkCIIB1iZ656zqmA&type=lite&v=1.0');
    document.getElementsByTagName('head')[0].appendChild(scriptEl);
    return new Promise(function (resolve, reject) {
      scriptEl.onload = () => {
        resolve(true);
      }
    });
  } else {
    return new Promise(function (resolve, reject) {
        resolve(true);
    }); 
  }
};
