<template>
    <div class="blank-page">
      <loading v-model="isLoading"></loading>
      <div v-if="!isDone">
          <cell style="font-size:1.3rem;padding: 10px 15px 0;" is-link @click.native="goPointCostHistory">
          <span slot="title">当前可用积分：<i style="color: #DC143C">{{ pointBalance }}</i></span>
          <div>
            <i class="fa fa-history" style="color: #00BFFF" aria-hidden="true"></i>查看积分兑换历史记录
          </div>
        </cell>
        <card style="margin-bottom: 6rem;">
            <img slot="header" :src="detail.picUrl" style="width:100%;display:block;" @error="setDefaultImg">
            <div slot="content" class="card-padding">
                <!-- <div style="font-size:1.5rem;">
                  <div v-if="detail.needAddress">
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
                </div> -->
                <p class="card-padding" style="font-size: 1.8rem;line-height: 2.2rem;">{{detail.name}}</p>
                <!-- <p class="card-padding" style="font-size:1.4rem;line-height: 1.8rem;color:#999;">{{detail.description}}</p> -->
                <div class="card-padding"  style="color:#FF0000;font-size: 1.8rem;height: 2.2rem;">
                    {{detail.pointCost}}<i style="font-size:1.05rem;color: #999999">积分</i>
                </div>
                <span style="displfont-size:1rem;color:#999999; display: flex; margin: 1rem;">
                    <div style="width: 70%;float: left;">参考价格：¥ {{detail.price}}</div>
                    <div style="width: 30%; float: left; text-align: right;">
                     库存：{{detail.stockCount}}
                    </div>
                </span>
                <p style="background-color: #F5F5F5; text-align: center;font-size: 1.3rem;">商品详情</p>
                <p style="color: #999999; text-align: left;margin:1rem" v-html="detail.description"></p>
                <!-- <x-address title="请选择地址" @on-hide="selectedAddress" v-model="detail.address" :list="addressData" placeholder="请选择地址">
                    <template slot="title" slot-scope="props">
                        <span style="vertical-align:middle;"><i class="fa fa-map-marker"></i> 邮寄地址</span>
                    </template>
                </x-address> -->
                <cell v-if="detail.needAddress" title="收货地址" style="font-size:1.6rem" is-link @click.native="queryReceiveHistory">
                  <div style="font-size:1.2rem; color: #999999; width: 20rem; overflow: hidden;">{{address}}</div>
                </cell>
                <x-number style="font-size:1.6rem" :title="'兑换数量'" :min="1" :value="1" v-model="count"></x-number>
            </div>
        </card>
        <div slot="footer" style="position: fixed; bottom: 0; width: 100%;">
          <cell class="card-footer">
            <span slot="title">所需积分：<i style="color:#FF0000;font-size: 1.8rem;">{{ total }}</i>积分</span>
            <x-button @click.native="submit" class="confirm-submit">确认兑换</x-button>
          </cell>
            <!-- <x-button @click.native="queryReceiveHistory" style="background: ; color: #fff; width: 60%; float: left; margin-top: 1.5rem;">查看历史收货信息</x-button> -->
        </div>
      </div>
      <div class="result-blank-page" v-if="isDone">
        <div :class="exchangeResultClass">
          <div class="exchange-result">
            <!-- <p v-if="exchangeResultClass === 'exchange-success'">兑换码：0</p> -->
            <p v-if="exchangeResultClass === 'exchange-fail'">{{ orderResult }}</p>
            <p>剩余积分：{{pointBalance}}</p>
          </div>
        </div>
        <cell primary="content">
            <img slot="title"
                 style="height: 6rem;width: 8rem;display:block;border: 1px solid #999999;"
                 :src="detail.picUrl" class="card-padding" @error="setDefaultImg">
            <div style="margin-left:1rem;" slot>
              <span class="line-margin">
                <div style="font-size:1.5rem; text-align: left; width: 55%; float: left;color: #000; overflow: hidden;height: 5rem;">{{detail.name}}</div>
                <div style="font-size:1.5rem; color:#FF0000; width: 45%; display: inline-block; text-align: right;">
                  {{detail.pointCost}}<i style="font-size:1.05rem;color: #999999">积分 ✖️ {{count}}</i>
                </div>
              </span>
              <span class="line-margin">
                <div style="text-align: right; display: inline-block;float: right;width: 45%;font-size:1.2rem;color:#999999;">参考价格：¥ {{detail.price}}</div>
              </span>
            </div>
        </cell>
        <div>
              <x-button @click.native="goCommodityList" class="continue-exchange-btn">继续换购</x-button>
              <x-button @click.native="goHome" class="back-to-home-btn" style="margin-top: 5%;">返回首页</x-button>
            <!-- <x-button @click.native="queryReceiveHistory" style="background: ; color: #fff; width: 60%; float: left; margin-top: 1.5rem;">查看历史收货信息</x-button> -->
            </div>
            <!-- <x-button @click.native="submit" class="confirm-submit">确认兑换</x-button> -->
            <!-- <x-button @click.native="queryReceiveHistory" style="background: ; color: #fff; width: 60%; float: left; margin-top: 1.5rem;">查看历史收货信息</x-button> -->
      </div>
  </div>
</template>

<script>
import {
  Loading,
  Card,
  XButton,
  XInput,
  XNumber,
  Cell,
  ChinaAddressV4Data
  //   AlertModule,
  //   Alert
  //   TransferDomDirective as TransferDom
} from "vux";
import { assign } from "lodash";
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
    XInput,
    XNumber
    // Alert
  },
  data() {
    return {
      detail: {},
      count: 1,
      total: 0,
      exchangeResultClass: "",
      isLoading: false,
      addressData: ChinaAddressV4Data,
      pointBalance: 0,
      isDone: false,
      orderResult: "",
      address: ""
    };
  },
  computed: {
    ...mapGetters(["appContextPath", "rootPath", "agentType"])
  },
  watch: {
    count(count) {
      this.total = parseInt(this.detail.pointCost || 0) * parseInt(count || 0);
    }
  },
  methods: {
    selectedAddress(str) {},
    submit() {
      if (
        this.detail.needAddress &&
        (!this.detail.receiver || !this.detail.tel || !this.detail.address)
      ) {
        this.$vux.alert.show({
          title: "",
          content: "收货地址不能为空，请输入收货地址相关信息"
        });
        return;
      }
      // if (this.$refs.telNum.hasErrors) {
      //   this.$vux.alert.show({
      //     title: "下单失败",
      //     content: this.$refs.telNum.errors.format
      //   });
      //   return;
      // }
      const scope = this;
      this.$vux.confirm.show({
        title: "确认",
        content: "是否确认兑换？",
        onConfirm() {
          scope.isLoading = true;
          const optionalCondition = scope.detail.needAddress
            ? `&address=${scope.detail.address}&receiver=${
                scope.detail.receiver
              }&tel=${scope.detail.tel}&count=${scope.count}`
            : `&count=${scope.count}`;
          scope.$http
            .get(
              `${
                scope.appContextPath
              }appweb/pointExchange/exchangeItem?id=${scope.$route.params.id +
                optionalCondition}`
            )
            .then(
              success => {
                scope.isDone = true;
                scope.getPointBalance();
                if (success && success.data && success.data.status !== "FAIL") {
                  // scope.$vux.alert.show({
                  //   content: "下单成功"
                  // });
                  // scope.$router.push({ path: `/commodity_list` });
                  scope.exchangeResultClass = "exchange-success";
                  scope.refreshData();
                  scope.updateTitle("积分兑换成功");
                } else {
                  // scope.$vux.alert.show({
                  //   content: success.data.result
                  // });
                  scope.orderResult =
                    (success && success.data && success.data.result) ||
                    "未知原因";
                  scope.exchangeResultClass = "exchange-fail";
                  scope.updateTitle("积分兑换失败");
                }
                scope.isLoading = false;
              },
              error => {
                scope.orderResult = "服务器异常";
                scope.exchangeResultClass = "exchange-fail";
                scope.updateTitle("积分兑换失败");
                scope.isLoading = false;
              }
            );
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
    goHome() {
      if(this.agentType === 'Android') window.android.closeActivity();
    },
    goCommodityList(){
      this.$router.push({ path: `/commodity_list` });
    },
    setDefaultImg(event) {
      event.target.src = `${this.rootPath}static/default_img.jpg`;
    },
    // getTotalCount() {
    //   return parseInt(this.detail.pointCost || 0) * parseInt(this.detail.count || 0);
    // },
    refreshData() {
      this.isLoading = true;
      const scope = this;
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
            {};
          scope.total =
            parseInt(scope.detail.pointCost || 0) * parseInt(scope.count || 0);
          if (Object.keys(scope.$route.query).length > 0) {
            scope.detail = assign(scope.detail, {
              receiver: scope.$route.query.receiver || "",
              tel: scope.$route.query.tel || "",
              address: (this.address = scope.$route.query.address || "")
            });
          } else {
            scope.$http
              .get(`${scope.appContextPath}appweb/pointExchange/listHisAdress`)
              .then(
                result => {
                  const detail =
                    result &&
                    result.data &&
                    result.data.result &&
                    result.data.result.list.find(v => v.ifDefault === 1);
                  if (detail) {
                    scope.detail = assign(scope.detail, {
                      receiver: detail.recName,
                      tel: detail.recPhone,
                      address: (this.address =
                        detail.cityName + detail.commName + detail.recAddr)
                    });
                  }
                  // else {
                  //   scope.detail = assign(scope.detail, {
                  //     receiver: "",
                  //     tel: "",
                  //     address: this.address = "shsajhfgsjhfdsf"
                  //   });
                  // }
                  scope.isLoading = false;
                },
                error => {
                  scope.isLoading = false;
                }
              );
          }
        });
      this.getPointBalance();
    },
    ...mapMutations(["updateTitle"])
  },
  mounted() {
    this.refreshData();
    this.updateTitle("商品详情");
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.card-padding {
  padding: 0.4rem;
}
.card-footer {
  background-color: rgb(255, 255, 255);
  border-top: 1px solid #999999;
  height: 2.4rem;
  font-size: 1.6rem;
}
.confirm-submit {
  background: #0181ca;
  color: #fff;
  width: 115%;
  border-radius: 0;
}
div.exchange-success {
  background-image: url("../../../static/exchange_success.jpeg");
  background-size: 100% 100%;
  height: 50%;
  background-repeat: no-repeat;
}
div.exchange-fail {
  background-image: url("../../../static/exchange_fail.jpeg");
  background-size: 100% 100%;
  height: 50%;
  background-repeat: no-repeat;
}
/* .card-padding {
  padding: 1.5rem;
} */
.line-margin {
  margin-top: 1.5rem;
  display: block;
}
.exchange-result {
  top: 55%;
  position: relative;
  text-align: center;
  font-size: 1.5rem;
  color: #0181ca;
}
.continue-exchange-btn {
  width: 40%;
  margin: 5%;
  float: left;
  background-color: #0181ca;
  color: #fff;
  /* display: inline-block; */
}
.back-to-home-btn {
  width: 40%;
  margin: 5%;
  display: inline-block;
  border: 1px solid #0181ca;
  background-color: #fff;
  color: #0181ca;
}
div.result-blank-page {
  height: inherit;
  width: inherit;
}
</style>
