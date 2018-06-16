import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component(resolve) {
        require(['../components/Home'], resolve)
      }
    },
    {
      path: '/announcement_list',
      component(resolve) {
        require(['../components/announcement/AnnouncementList'], resolve)
      }
    },
    {
      path: '/announcement_detail/:id',
      component(resolve) {
        require(['../components/announcement/announcementDetail'], resolve)
      }
    },
    {
      path: '/commodity_list',
      component(resolve) {
        require(['../components/mall/CommodityList'], resolve)
      }
    },
    {
      path: '/commodity_order/:id',
      component(resolve) {
        require(['../components/mall/CommodityOrder'], resolve)
      }
    },
    {
      path: '/order_history/:id',
      component(resolve) {
        require(['../components/mall/OrderHistory'], resolve)
      }
    },
    {
      path: '/point_cost_history',
      component(resolve) {
        require(['../components/mall/PointCostHistory'], resolve)
      }
    },
    {
      path: '/merchant_list',
      component(resolve) {
        require(['../components/merchant/MerchantList'], resolve)
      }
    },
    {
      path: '/merchant_map/:id',
      component(resolve) {
        require(['../components/merchant/MerchantMap'], resolve)
      }
    },
    {
      path: '/branch_list',
      component(resolve) {
        require(['../components/branch/BranchList'], resolve)
      }
    },
    {
      path: '/branch_map/:id',
      component(resolve) {
        require(['../components/branch/BranchMap'], resolve)
      }
    },
    {
      path: '/transaction',
      component(resolve) {
        require(['../components/transaction/Transaction'], resolve)
      }
    },
    {
      path: '/card_balance',
      component(resolve) {
        require(['../components/transaction/CardBalance'], resolve)
      }
    },
    {
      path: '/transaction_history',
      component(resolve) {
        require(['../components/transaction/TransactionHistory'], resolve)
      }
    },
    {
      path: '/reconciliation',
      component(resolve) {
        require(['../components/transaction/Reconciliation'], resolve)
      }
    },
    {
      path: '/invoice',
      component(resolve) {
        require(['../components/invoice/Invoice'], resolve)
      }
    }
  ]
})
