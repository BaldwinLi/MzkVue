// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import router from './router'
import Vuex from 'vuex'
import App from './App'
import Home from './components/Home'
import {
  AjaxPlugin
} from 'vux'
import store from './vuex/store';

Vue.use(Vuex)
Vue.use(AjaxPlugin)

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

const auth_token = window.sessionStorage.getItem('token');

// if (!auth_token) {
if (true && store) {
  Vue.http.defaults.headers.common['Authorization'] = auth_token;
  new Vue({
    render: h => h(App),
    router,
    store
  }).$mount('#app-box');
} else {
  Vue.http.get(
    `${store.getters.appContextPath}app-web/token/getTest?userId=huangmu`
  ).then(
    success => {
      window.sessionStorage.setItem('token', success.token);
      Vue.http.defaults.headers.common['Authorization'] = success.token;
      new Vue({
        router,
        store,
        render: h => h(App)
      }).$mount('#app-box');
    },
    error => {
      console.error('Get token failed');
      new Vue({
        router,
        store,
        render: h => h(App)
      }).$mount('#app-box');
    }
  );
}

/* eslint-disable no-new */
