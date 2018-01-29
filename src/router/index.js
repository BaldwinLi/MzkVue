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
        require(['../components/announcement/AnnouncementList'], resolve)
      }
    },
    {
      path: '/announcementDetail/:id',
      component: function (resolve) {
        require(['../components/announcement/announcementDetail'], resolve)
      }
    },
    {
      path: '/mall',
      component: function (resolve) {
        require(['../components/mall/Mall'], resolve)
      }
    },
    {
      path: '/merchant',
      component: function (resolve) {
        require(['../components/merchant/Merchant'], resolve)
      }
    },
    {
      path: '/search',
      component: function (resolve) {
        require(['../components/search/Search'], resolve)
      }
    },
    {
      path: '/transaction',
      component: function (resolve) {
        require(['../components/transaction/Transaction'], resolve)
      }
    },
    {
      path: '/invoice',
      component: function (resolve) {
        require(['../components/invoice/Invoice'], resolve)
      }
    }
  ]
})
