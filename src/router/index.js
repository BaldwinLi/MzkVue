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
      path: '/commodity_order/:id',
      component: function (resolve) {
        require(['../components/mall/CommodityOrder'], resolve)
      }
    },
    {
      path: '/order_history',
      component: function (resolve) {
        require(['../components/mall/OrderHistory'], resolve)
      }
    },
    {
      path: '/point_cost_history',
      component: function (resolve) {
        require(['../components/mall/PointCostHistory'], resolve)
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
      path: '/branch_list',
      component: function (resolve) {
        require(['../components/branch/BranchList'], resolve)
      }
    },
    {
      path: '/branch_map/:id',
      component: function (resolve) {
        require(['../components/branch/BranchMap'], resolve)
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
