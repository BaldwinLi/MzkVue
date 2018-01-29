import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const proxyedHostNames = [
  'localhost',
  '127.0.0.1',
]

export default new Vuex.Store({ // 名字自己定义
  state: {
    isLoading: false
  },
  mutations: {
    updateLoadingStatus(state, payload) {
      state.isLoading = payload.isLoading;
    }
  },
  getters: {
    isLocal: () => proxyedHostNames.includes(window.location.hostname),
    appContextPath: () => proxyedHostNames.includes(window.location.hostname) ? `${window.location.origin}/dev_api/` : (window.location.origin + '/'),
  }
}); // 这里你可能已经有其他 module

// store.registerModule('vux', { // 名字自己定义
//   state: {
//     isLoading: false
//   },
//   mutations: {
//     updateLoadingStatus(state, payload) {
//       state.isLoading = payload.isLoading;
//     }
//   },
//   getters: {
//     isLocal: () => proxyedHostNames.includes(window.location.hostname),
//     appContextPath: () => proxyedHostNames.includes(window.location.hostname) ? `${window.location.origin}/dev_api/` : (window.location.origin + '/'),
//   }
// });
