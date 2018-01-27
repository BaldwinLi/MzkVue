// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import router from './router'
import App from './App'
import Home from './components/Home'
import {
  AjaxPlugin
} from 'vux'
import VuexStore from './vuex/store';

Vue.use(AjaxPlugin)

router.beforeEach(function (to, from, next) {
  VuexStore.commit('updateLoadingStatus', {
    isLoading: true
  })
  next();
});

router.afterEach(function (to) {
  VuexStore.commit('updateLoadingStatus', {
    isLoading: false
  });
});

FastClick.attach(document.body)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  router,
  VuexStore,
  render: h => h(App)
}).$mount('#app-box')
