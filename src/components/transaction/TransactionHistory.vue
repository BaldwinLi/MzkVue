<template>
  <div>
    <group>
      <x-input title="卡号" ref="cardNo" placeholder="请输入明珠卡号" type="number" :min="12" :max="12" text-align="right" v-model="cardNo"></x-input>
      <div style="height: 9rem; background-color: rgb(251, 249, 254)">
        <box gap="2rem 2rem">
          <divider style="color: #999; font-size: 1rem;">
            <i style="color:#FF0000;">注：</i>请输入12位卡号后点击查询，请不要输入空格或其他符号
          </divider>
          <x-button @click.native="refreshDataList" class="search-details">明细查询</x-button>
        </box>
      </div>
      <load-more v-if="list.length === 0" :show-loading="false" :tip="'暂无数据'" background-color="#fbf9fe"></load-more>
      <scroller v-if="list.length > 0"
                :lock-x=true
                :scrollbar-y=true
                :pulldown-config="pulldownConfig" 
                :pullup-config="pullupConfig"
                ref="scrollerEvent" 
                :use-pulldown=true 
                :use-pullup="enablePullup" 
                @on-pulldown-loading="refreshDataList" 
                @on-pullup-loading="refreshMoreData">
        <div>
            <card v-for="(item, index) in list" :key="index">
                <div slot="content" class="card-padding">
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
  </div>
</template>

<script>
import {
  XInput,
  XButton,
  Box,
  Divider,
  Card,
  Scroller,
  LoadMore,
  Group,
  dateFormat
} from "vux";
import { mapState, mapGetters, mapMutations } from "vuex";
import { pulldownConfig, pullupConfig } from "../config";

export default {
  name: "TransactionHistory",
  components: {
    XInput,
    XButton,
    Box,
    Divider,
    Card,
    Scroller,
    LoadMore,
    Group
  },
  data() {
    return {
      cardNo: "",
      pageNum: 1,
      pageSize: 10,
      pulldownConfig,
      pullupConfig,
      // topLoading: false,
      // bottomLoading: false,
      list: [],
      enablePullup: false
    };
  },
  filters: {
    dateFormat: function(value) {
      return dateFormat(new Date(value), "YYYY-MM-DD");
    }
  },
  computed: {
    ...mapGetters(["appContextPath", "isLocal"]),
    ...mapState(["isLoading"])
  },
  methods: {
    // onCellsListScroll(event) {
    //   const scope = this;
    //   if (event.top < this.$refs["scrollerEvent"].$el.clientTop - 100) {
    //     this.refreshDataList();
    //   }
    // },
    // onScrollBottom() {
    //   const scope = this;
    //   this.refreshMoreData();
    // },
    refreshDataList() {
      // this.topLoading = true;
      this.updateLoadingStatus({ isLoading: true });
      const scope = this;
      this.$http
        .get(
          `${this.appContextPath}appweb/cardQuery/listChange?cardNo=${
            this.cardNo
          }&pageSize=15&pageNum=1`
        )
        .then(success => {
          scope.list = (success &&
            success.data &&
            success.data.result &&
            success.data.result.list) || [];
          if (scope.list.length === 15) {
            scope.enablePullup = true;
          }
          if (scope.$refs.scrollerEvent) {
            scope.$refs.scrollerEvent.donePulldown();
            scope.$refs.scrollerEvent.reset({ top: 0 });
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
          }&pageSize=2&pageNum=${++this.pageNum}`
        )
        .then(success => {
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
        });
    },
    ...mapMutations(["updateTitle", "updateLoadingStatus"])
  },
  mounted() {
    this.cardNo = this.$route.query.cardNo;
    this.refreshDataList();
    this.updateTitle("交易明细");
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.card-padding {
  padding: 1.5rem;
}
.search-details {
  background-color: #0181ca;
  color: #fff;
}
</style>
