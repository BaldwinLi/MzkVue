<template>
    <div>
        <loading v-model="isLoading"></loading>
        <cell title="当前可用积分">
          <div>
            <span style="color: #DC143C">{{ pointBalance }}</span>
          </div>
        </cell>
        <cell title="查看积分兑换历史记录" @click.native="goPointCostHistory" is-link></cell>
        <card style="margin-bottom: 30px;">
            <img slot="header" :src="detail.picUrl" style="width:100%;display:block;">
            <div slot="content" class="card-padding">
                <div>
                    <i class="fa fa-map-marker" style="float: left;margin-top: 12px;"></i>
                    <x-input title="邮寄地址" v-model="detail.address"></x-input>
                </div>
                <div>
                  <i class="fa fa-user" style="float: left;margin-top: 12px;"></i>
                  <x-input title="收件人" v-model="detail.receiver"></x-input>
                </div>
                <div>
                  <i class="fa fa-phone" style="float: left;margin-top: 12px;"></i>
                  <x-input title="收件人联系方式" mask="999 9999 9999" v-model="detail.tel" :max="13" is-type="china-mobile"></x-input>
                </div>
                <p class="card-padding" style="font-size:18px;">{{detail.name}}</p>
                <p class="card-padding" style="font-size:14px;line-height:1 ;color:#999;">{{detail.description}}</p>
                <p class="card-padding" style="font-size:16px;color:#FF0000;">{{detail.pointCost}} 积分</p>
                <p class="card-padding" style="font-size:12px;color:#EEC900;">参考价格：¥ {{detail.price}}</p>
                <!-- <x-address title="请选择地址" @on-hide="selectedAddress" v-model="detail.address" :list="addressData" placeholder="请选择地址">
                    <template slot="title" slot-scope="props">
                        <span style="vertical-align:middle;"><i class="fa fa-map-marker"></i> 邮寄地址</span>
                    </template>
                </x-address> -->
            </div>
        </card>
        <div slot="footer" style="position: fixed; bottom: 0px; width: 100%;">
            <x-button @click.native="queryReceiveHistory" style="background: #4682B4; color: #fff; width: 50%; float: left; margin-top: 15px;">查看历史收获信息</x-button>
            <x-button @click.native="submit" style="background: #FF6347; color: #fff; width: 50%; float: left; margin-top: 15px;">确认下单</x-button>
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
          title: "提交失败",
          content: "请填入您的邮寄地址、收件人、收件人联系方式"
        });
        return;
      }
      const scope = this;
      this.isLoading = true;
      this.$http
        .get(
          `${
            this.appContextPath
          }appweb/pointExchange/exchangeItem?id=10&address=${
            this.detail.address
          }&receiver=${this.detail.receiver}&tel=${this.detail.tel}`
        )
        .then(success => {
          if (success && success.data && success.data.status) {
            scope.$vux.alert.show({
              content: "提交成功"
            });
          }
          scope.$router.push({ path: `/commodity_list` });
          scope.isLoading = false;
        });
    },
    queryReceiveHistory() {
      this.$router.push({ path: `/order_history` });
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
              success.data.result.point) ||
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
        this.isLoading = false;
      });
    this.getPointBalance();
    this.updateTitle("商品详情");
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.card-padding {
  padding: 8px;
}
</style>
