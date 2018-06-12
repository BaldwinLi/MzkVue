// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import $ from 'jquery'
import 'font-awesome/css/font-awesome.min.css'
import '@/assets/mzkfont/iconfont.css'
import '@/assets/custom.css'
import Vue from 'vue'
import FastClick from 'fastclick'
import router from './router'
import Vuex from 'vuex'
import App from './App'
import Home from './components/Home'
import {
  AjaxPlugin,
  AlertPlugin,
  ConfirmPlugin,
  AlertModule
} from 'vux'
import store from './vuex/store';
import cordova from './initCordova';
// import { initKeyList } from './initKeyList';

// cordova(App);

Vue.use(Vuex)
Vue.use(AjaxPlugin)
Vue.use(AlertPlugin)
Vue.use(ConfirmPlugin)

router.beforeEach(function (to, from, next) {
  store.commit('updateLoadingStatus', {
    isLoading: true
  })
  next();
});

router.afterEach(function (to) {
  store.commit('updateLoadingStatus', {
    isLoading: false
  });
});

FastClick.attach(document.body)

Vue.config.productionTip = false

const runVueInstance = () => {
  Vue.http.defaults.headers.common['Content-Type'] = 'application/json;charset=UTF-8';
  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app-box');
}

let _token = window.location.hash.match(/token=.*$/g);
if (_token) {
  _token = _token[0];
  _token = _token && _token.replace('token=', '') || '';
  window.sessionStorage.setItem('token', _token);
  
  Vue.http.defaults.headers.common['web-token'] = _token;
  // initKeyList(store);
  runVueInstance
} else {
  const auth_token = window.sessionStorage.getItem('token');
  if (auth_token && auth_token !== 'undefined') {
    Vue.http.defaults.headers.common['web-token'] = auth_token;
    // initKeyList(store);
    // new Vue({
    //   render: h => h(App),
    //   router,
    //   store
    // }).$mount('#app-box');
    runVueInstance();
  } else {
    if (store.getters.isLocal) {
      Vue.http.get(
        store.getters.appContextPath + "appweb/testtoken/getTest?userId=huangmu"
      ).then(
        success => {
          window.sessionStorage.setItem('token', success.data.result.token);
          Vue.http.defaults.headers.common['web-token'] = success.data.result.token;
          // initKeyList(store);
          // new Vue({
          //   router,
          //   store,
          //   render: h => h(App)
          // }).$mount('#app-box');
          runVueInstance();
        },
        error => {
          console.error('Get token failed');
          // new Vue({
          //   router,
          //   store,
          //   render: h => h(App)
          // }).$mount('#app-box');
          runVueInstance();
        }
      );
    }
  }
}

Vue.http.interceptors.response.use(data => data,
  error => {
    if (error && error.response && error.response.status === 401) {
      AlertModule.show({
        content: '登录超时，请重新登录！',
      });
    }
  })

/* eslint-disable no-new */
