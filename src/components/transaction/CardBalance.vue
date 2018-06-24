<template>
  <div class="blank-page">
    <group>
      <x-input title="卡号" ref="cardNo" placeholder="请输入明珠卡卡号" type="number" :min="12" :max="12"
               @on-change="onInputNo"
               text-align="right" v-model="cardNo"></x-input>
      <div style="height: 16rem; background-color: rgb(251, 249, 254)">
        <box gap="2rem 2rem">
          <divider style="color: #999; font-size: 1.4rem;">
            <i style="color:#FF0000;">注：</i>请输入12位数字卡号后点击查询
          </divider>
          <!-- <x-button @click.native="searchBalance" class="search-balance">余额查询</x-button> -->
          <x-button @click.native="refreshDataList" class="search-details">消费记录查询</x-button>
          <divider style="color: #999; font-size: 1.3rem;">
            因结算周期延迟，数据仅供参考，以实际入账为准。
          </divider>
        </box>
      </div>
      <group  v-if="showBalance">
        <!-- <divider style="color: #999; font-size: 1.3rem;">
          明珠卡余额查询因系统清分结算会有延迟，数据仅供参考
        </divider> -->
        <cell title="账户余额（元）">
          <div style="color: #FF0000; font-size: 2rem;">{{balance | moneyFormat}}</div>
        </cell>
      </group>
      <group v-if="!showBalance">
        <load-more v-if="list.length === 0 && !!balance" :show-loading="false" :tip="'暂无消费记录'" background-color="#fbf9fe"></load-more>
        <scroller v-if="list.length > 0"
                :lock-x=true
                :scrollbar-y=true
                :pulldown-config="pulldownConfig" 
                :pullup-config="pullupConfig"
                height="-213"
                ref="scrollerEvent" 
                :use-pulldown=true 
                :use-pullup="enablePullup" 
                @on-pulldown-loading="refreshDataList" 
                @on-pullup-loading="refreshMoreData">
          <div>
            <card v-for="(item, index) in list" :key="index">
                <div slot="content" class="card-padding" style="margin: 1rem;">
                  <span>
                    <div style="width: 55%;float: left;font-size: 1.5rem;height: 2rem;overflow: hidden">{{item.description}}</div>
                    <div style="color:#FF0000; width: 45%; display: inline-block; text-align: right;">
                      <i style="font-size:1.2rem;color: #999999">交易：</i>{{item.amount}}
                    </div>
                  </span>
                  <!-- <p style="font-size:10px;line-height:1 ;color:#999;">{{item.description}}</p> -->
                  <span>
                    <div style="width: 55%; font-size: 1.3rem; padding-top: 6px;color: #999; float: left;">{{item.ts | dateFormat}}</div>
                    <div style="color:#0181ca; width: 45%; display: inline-block; text-align: right;">
                      <i style="font-size:1.2rem;color: #999999">余额：</i>{{item.balance}}
                    </div>
                  </span>
                </div>
            </card>
          <!-- <load-more v-if="bottomLoading" :show-loading="bottomLoading" tip="加载更多" background-color="#fbf9fe"></load-more> -->
          </div>
        </scroller>
      </group>
    </group>
  </div>
</template>

<script>
import {
  XInput,
  Group,
  Cell,
  XButton,
  Box,
  Divider,
  Card,
  Scroller,
  LoadMore,
  numberComma,
  dateFormat
} from "vux";
import { pulldownConfig, pullupConfig } from "../config";
import { mapState, mapGetters, mapMutations } from "vuex";

export default {
  name: "CardBalance",
  components: {
    XInput,
    Group,
    Cell,
    XButton,
    Box,
    Divider,
    Card,
    Scroller,
    LoadMore
  },
  data() {
    return {
      cardNo: "",
      balance: 0,
      pageNum: 1,
      pageSize: 10,
      pulldownConfig,
      pullupConfig,
      // topLoading: false,
      // bottomLoading: false,
      list: [],
      enablePullup: false,
      showBalance: false
    };
  },
  computed: {
    ...mapGetters(["appContextPath", "isLocal"]),
    ...mapState(["isLoading"])
  },
  filters: {
    moneyFormat: function(value) {
      const count = parseFloat(value).toFixed(2);
      return "¥ " + numberComma(count);
    },
    dateFormat: function(value) {
      return dateFormat(new Date(parseInt(value)), "YYYY-MM-DD");
    }
  },
  methods: {
    searchBalance() {
      if (!this.cardNo) {
        this.$vux.alert.show({
          content: "请输入明珠卡号"
        });
        return;
      }
      this.showBalance = true;
      if (this.$refs.cardNo.hasErrors) {
        this.$vux.alert.show({
          title: "卡号有误",
          content: this.$refs.cardNo.errors.min || this.$refs.cardNo.errors.max
        });
        return;
      }
      const scope = this;
      this.updateLoadingStatus({ isLoading: true });
      this.$http
        .get(
          `${this.appContextPath}appweb/cardQuery/balance?cardNo=${this.cardNo}`
        )
        .then(success => {
          if (success && success.data && success.data.status === "OK") {
            scope.balance =
              (success &&
                success.data &&
                success.data.result &&
                success.data.result.balance) ||
              0;
          } else if (
            success &&
            success.data &&
            success.data.status === "FAIL"
          ) {
            scope.$vux.alert.show({
              content:
                (success &&
                  success.data &&
                  success.data.result &&
                  success.data.result.description) ||
                ""
            });
          }
          this.updateLoadingStatus({ isLoading: false });
        });
    },
    refreshDataList() {
      if (!this.cardNo) {
        this.$vux.alert.show({
          content: "请输入明珠卡号"
        });
        return;
      }
      this.showBalance = false;
      // this.topLoading = true;
      this.updateLoadingStatus({ isLoading: true });
      const scope = this;
      this.$http
        .get(
          `${this.appContextPath}appweb/cardQuery/listChange?cardNo=${
            this.cardNo
          }&pageSize=10&pageNum=1`
        )
        .then(success => {
          if (success && success.data && success.data.status === "OK") {
            scope.list =
              (success &&
                success.data &&
                success.data.result &&
                success.data.result.list) ||
              [];
            if (scope.list.length === 10) {
              scope.enablePullup = true;
            }
            if (scope.$refs.scrollerEvent) {
              scope.$refs.scrollerEvent.donePulldown();
              scope.$refs.scrollerEvent.reset({ top: 0 });
            }
          } else if (
            success &&
            success.data &&
            success.data.status === "FAIL"
          ) {
            scope.$vux.alert.show({
              content:
                (success &&
                  success.data &&
                  success.data.result &&
                  success.data.result.description) ||
                ""
            });
          }
          this.updateLoadingStatus({ isLoading: false });
        });
    },
    refreshMoreData() {
      // this.bottomLoading = true;
      const scope = this;
      this.$http
        .get(
          `${this.appContextPath}appweb/cardQuery/listChange?cardNo=${
            this.cardNo
          }&pageSize=10&pageNum=${++this.pageNum}`
        )
        .then(success => {
          if (success && success.data && success.data.status === "OK") {
            scope.list = scope.list.concat(
              (success &&
                success.data &&
                success.data.result &&
                success.data.result.list) ||
                []
            );
            if (scope.$refs.scrollerEvent) {
              scope.$refs.scrollerEvent.donePullup();
              scope.$refs.scrollerEvent.reset();
            }
          } else if (
            success &&
            success.data &&
            success.data.status === "FAIL"
          ) {
            scope.$vux.alert.show({
              content:
                (success &&
                  success.data &&
                  success.data.result &&
                  success.data.result.description) ||
                ""
            });
          }
        });
    },
    goToDetail() {
      if (this.$refs.cardNo.hasErrors) {
        this.$vux.alert.show({
          title: "卡号有误",
          content: this.$refs.cardNo.errors.min || this.$refs.cardNo.errors.max
        });
        return;
      }
      this.$router.push({
        path: `/transaction_history`,
        query: {
          cardNo: this.cardNo
        }
      });
    },
    onInputNo(value, event) {
      if (value && value.length > 12) {
        const scope = this;
        setTimeout(() => {
          scope.cardNo = value = value.slice(0, 12);
        });
      }
    },
    ...mapMutations(["updateTitle", "updateLoadingStatus"])
  },
  mounted() {
    this.updateTitle("明珠卡消费记录查询");
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.search-balance {
  background-color: #0181ca;
  color: #fff;
}
.search-details {
  background-color: #00bfff;
  color: #fff;
}
</style>
