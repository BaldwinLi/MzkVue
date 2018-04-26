<template>
    <div>
        <loading v-model="isLoading"></loading>
        <cell title="当前可用积分">
          <div>
            <span style="color: #DC143C">{{ pointBalance }}</span>
          </div>
        </cell>
        <cell title="查看积分兑换历史记录" @click.native="goPointCostHistory" is-link></cell>
        <card style="margin-bottom: 6rem;">
            <img slot="header" :src="detail.picUrl" style="width:100%;display:block;">
            <div slot="content" class="card-padding">
                <div>
                    <i class="fa fa-map-marker" style="float: left;margin-top: 1.2rem;"></i>
                    <x-input title="邮寄地址" v-model="detail.address"></x-input>
                </div>
                <div>
                  <i class="fa fa-user" style="float: left;margin-top: 1.2rem;"></i>
                  <x-input title="收件人" v-model="detail.receiver"></x-input>
                </div>
                <div>
                  <i class="fa fa-phone" style="float: left;margin-top: 1.2rem;"></i>
                  <x-input title="收件人联系方式" ref="telNum" mask="999 9999 9999" v-model="detail.tel" :max="13" is-type="china-mobile"></x-input>
                </div>
                <p class="card-padding" style="font-size:1.8rem;">{{detail.name}}</p>
                <p class="card-padding" style="font-size:1.4rem;line-height:1rem ;color:#999;">{{detail.description}}</p>
                <p class="card-padding" style="font-size:1.6rem;color:#FF0000;">{{detail.pointCost}} 积分</p>
                <p class="card-padding" style="font-size:1.2ren;color:#EEC900;">参考价格：¥ {{detail.price}}</p>
                <!-- <x-address title="请选择地址" @on-hide="selectedAddress" v-model="detail.address" :list="addressData" placeholder="请选择地址">
                    <template slot="title" slot-scope="props">
                        <span style="vertical-align:middle;"><i class="fa fa-map-marker"></i> 邮寄地址</span>
                    </template>
                </x-address> -->
            </div>
        </card>
        <div slot="footer" style="position: fixed; bottom: 0; width: 100%;">
            <x-button @click.native="queryReceiveHistory" style="background: #4682B4; color: #fff; width: 60%; float: left; margin-top: 1.5rem;">查看历史收货信息</x-button>
            <x-button @click.native="submit" style="background: #FF6347; color: #fff; width: 40%; float: left; margin-top: 1.5rem;">确认下单</x-button>
        </div>
        <!-- <div v-transfer-dom>
            <alert v-model="show2" :title="$t('Congratulations')" :content="$t('Your Message is sent successfully~')"></alert>
        </div> -->
  </div>
</template>

<script>
import {
  Loading,
  Card,
  XButton,
  XInput,
  Cell,
  ChinaAddressV4Data
  //   AlertModule,
  //   Alert
  //   TransferDomDirective as TransferDom
} from "vux";
import { mapGetters, mapMutations } from "vuex";

export default {
  name: "CommodityDetail",
  //   directives: {
  //     TransferDom
  //   },
  components: {
    Loading,
    Card,
    Cell,
    XButton,
    // XAddress
    XInput
    // Alert
  },
  data() {
    return {
      detail: {},
      isLoading: false,
      addressData: ChinaAddressV4Data,
      pointBalance: 0
    };
  },
  computed: {
    ...mapGetters(["appContextPath"])
  },
  methods: {
    selectedAddress(str) {},
    submit() {
      if (!(this.detail.address && this.detail.receiver && this.detail.tel)) {
        this.$vux.alert.show({
          title: "下单失败",
          content: "请填入您的邮寄地址、收件人、收件人联系方式"
        });
        return;
      }
      if (this.$refs.telNum.hasErrors) {
        this.$vux.alert.show({
          title: "下单失败",
          content: this.$refs.telNum.errors.format
        });
        return;
      }
      const scope = this;
      this.$vux.confirm.show({
        title: '确认',
        content: '是否确认提交？',
        onConfirm() {
          scope.isLoading = true;
          scope.$http
            .get(
              `${
                scope.appContextPath
              }appweb/pointExchange/exchangeItem?id=${scope.$route.params.id}&address=${
                scope.detail.address
              }&receiver=${scope.detail.receiver}&tel=${scope.detail.tel}`
            )
            .then(success => {
              if (success && success.data && success.data.status !== 'FAIL') {
                scope.$vux.alert.show({
                  content: "下单成功"
                });
                scope.$router.push({ path: `/commodity_list` });
              } else {
                scope.$vux.alert.show({
                  content: success.data.result
                });
              }
              scope.isLoading = false;
            });
        }
      });
    },
    queryReceiveHistory() {
      this.$router.push({ path: `/order_history/${this.$route.params.id}` });
    },
    goPointCostHistory() {
      this.$router.push({ path: `/point_cost_history` });
    },
    getPointBalance() {
      this.isLoading = true;
      const scope = this;
      this.$http
        .get(`${this.appContextPath}appweb/pointExchange/queryPoint`)
        .then(success => {
          scope.pointBalance =
            (success &&
              success.data &&
              success.data.result &&
              success.data.result.point &&
              success.data.result.point.point) ||
            0;
          scope.isLoading = false;
        });
    },
    ...mapMutations(["updateTitle"])
  },
  mounted() {
    const scope = this;
    this.isLoading = true;
    this.$http
      .get(
        `${this.appContextPath}appweb/pointExchange/detailItem?id=${
          this.$route.params.id
        }`
      )
      .then(success => {
        scope.detail =
          (success &&
            success.data &&
            success.data.result &&
            success.data.result.detail) ||
          "无数据";
        scope.detail.receiver = scope.$route.query.receiver || "";
        scope.detail.tel = scope.$route.query.tel || "";
        scope.detail.address = scope.$route.query.address || "";
        scope.isLoading = false;
      });
    this.getPointBalance();
    this.updateTitle("商品详情");
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.card-padding {
  padding: 0.4rem;
}
</style>
