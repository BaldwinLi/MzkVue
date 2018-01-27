import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: function (resolve) {
        require(['../components/Home'], resolve)
      }
    },
    {
      path: '/announcement',
      component: function (resolve) {
        require(['../components/Announcement'], resolve)
      }
    },
    {
      path: '/mall',
      component: function (resolve) {
        require(['../components/Mall'], resolve)
      }
    },
    {
      path: '/merchant',
      component: function (resolve) {
        require(['../components/Merchant'], resolve)
      }
    },
    {
      path: '/search',
      component: function (resolve) {
        require(['../components/Search'], resolve)
      }
    },
    {
      path: '/transaction',
      component: function (resolve) {
        require(['../components/Transaction'], resolve)
      }
    },
    {
      path: '/invoice',
      component: function (resolve) {
        require(['../components/Invoice'], resolve)
      }
    }
  ]
})
