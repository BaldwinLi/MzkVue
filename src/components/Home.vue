<template>
  <div class="home-content">
    <box gap="10px 10px">
      <router-link to="/announcement_list">
        <x-button plain :gradients="['#1D62F0', '#19D5FD']" type="primary" class="x-button-style">公告管理</x-button>
      </router-link>
      <router-link to="/commodity_list">
        <x-button plain :gradients="['#A644FF', '#FC5BC4']" type="primary" class="x-button-style">积分商城</x-button>
      </router-link>
      <router-link to="/merchant_list">
        <x-button plain :gradients="['#FF2719', '#FF61AD']" type="primary" class="x-button-style">联盟商家信息展示</x-button>
      </router-link>
      <router-link to="/transaction">
        <x-button plain :gradients="['#6F1BFE', '#9479DF']" type="primary" class="x-button-style">明珠卡余额、交易明细查询</x-button>
      </router-link>
      <router-link to="/branch_list">
        <x-button plain :gradients="['#FF5E3A', '#FF9500']" type="primary" class="x-button-style">查询服务</x-button>
      </router-link>
      <router-link to="/invoice">
        <x-button plain :gradients="['#FF5E3A', '#FF9500']" type="primary" class="x-button-style">电子发票</x-button>
      </router-link>
    </box>
  </div>
</template>

<script>
import { XButton, Box } from "vux";

export default {
  components: {
    XButton,
    Box
  },
  data() {
    return {};
  }
};
</script>

<style scoped>
.home-content {
  text-align: center;
  margin-top: 35%;
}
.x-button-style {
  border-radius: 10rem !important;
  margin: 2rem 2rem 0 0;
}
</style>