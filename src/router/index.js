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
      path: '/announcement_list',
      component: function (resolve) {
        require(['../components/announcement/AnnouncementList'], resolve)
      }
    },
    {
      path: '/announcement_detail/:id',
      component: function (resolve) {
        require(['../components/announcement/announcementDetail'], resolve)
      }
    },
    {
      path: '/commodity_list',
      component: function (resolve) {
        require(['../components/mall/CommodityList'], resolve)
      }
    },
    {
      path: '/commodity_detail/:id',
      component: function (resolve) {
        require(['../components/mall/CommodityDetail'], resolve)
      }
    },
    {
      path: '/merchant_list',
      component: function (resolve) {
        require(['../components/merchant/MerchantList'], resolve)
      }
    },
    {
      path: '/merchant_map/:id',
      component: function (resolve) {
        require(['../components/merchant/MerchantMap'], resolve)
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
      path: '/card_balance',
      component: function (resolve) {
        require(['../components/transaction/CardBalance'], resolve)
      }
    },
    {
      path: '/transaction_history',
      component: function (resolve) {
        require(['../components/transaction/TransactionHistory'], resolve)
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
