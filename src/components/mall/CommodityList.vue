<template>
  <div>
    <a class="sign-in" @click="signIn">签到</a>
    <group title="积分兑换商品列表">
      <!-- <load-more  v-if="topLoading" :show-loading="topLoading" tip="加载中" background-color="#fbf9fe"></load-more> -->
      <p class="no-data" v-if="!isLoading && list.length === 0">暂无数据</p>
      <scroller v-if="list.length > 0"
                :lock-x=true
                :scrollbar-y=true
               :pulldown-config="pulldownConfig" 
               :pullup-config="pullupConfig"
               ref="scrollerEvent" 
               :use-pulldown=true 
               :use-pullup=true 
               @on-pulldown-loading="refreshDataList" 
               @on-pullup-loading="refreshMoreData">
        <div>
          <flexbox :gutter="0" wrap="wrap">
            <flexbox-item :span="1/3" v-for="item in list" :key="item.id">
              <card @click.native="goCommodityOrder(item.id)">
                <img slot="header" :src="item.picUrl" style="width:100%;display:block;">
                <div slot="content" class="card-padding">
                  <p style="font-size:1.1rem;">{{item.name}}</p>
                  <!-- <p style="font-size:10px;line-height:1 ;color:#999;">{{item.description}}</p> -->
                  <p style="font-size:1.05rem;color:#FF0000;">{{item.pointCost}} 积分</p>
                  <p style="font-size:1rem;color:#EEC900;">参考价格：¥ {{item.price}}</p>
                </div>
              </card>
            </flexbox-item>
          </flexbox>
          <!-- <load-more v-if="bottomLoading" :show-loading="bottomLoading" tip="加载更多" background-color="#fbf9fe"></load-more> -->
        </div>
      </scroller>
    </group>
  </div>
</template>

<script>
import { Flexbox, FlexboxItem, Card, LoadMore, Scroller, Group } from "vux";
import { mapState, mapGetters, mapMutations } from "vuex";
import { pulldownConfig, pullupConfig } from "../config";

export default {
  name: "CommodityList",
  components: {
    Flexbox,
    FlexboxItem,
    Card,
    // LoadMore,
    Scroller,
    Group
  },
  data() {
    return {
      pageNum: 1,
      pageSize: 15,
      pulldownConfig,
      pullupConfig,
      // topLoading: false,
      // bottomLoading: false,
      list: []
    };
  },
  computed: {
    ...mapGetters(["appContextPath"]),
    ...mapState(["isLoading"])
  },
  methods: {
    ...mapMutations(["updateTitle", "updateLoadingStatus"]),
    signIn(event) {
      const scope = this;
      this.updateLoadingStatus({ isLoading: true });
      this.$http.get(`${this.appContextPath}appweb/pointExchange/signIn`).then(
        success => {
          // if (success && success.data && success.data.status === "OK") {
          scope.$vux.alert.show({
            content: (success && success.data && success.data.result) || ""
          });
          // }
          scope.updateLoadingStatus({ isLoading: false });
        },
        error => {
          if (error && error.data && error.data.status === "FAIL") {
            scope.$vux.alert.show({
              content: (error && error.data && error.data.result) || ""
            });
          }
          scope.updateLoadingStatus({ isLoading: false });
        }
      );
    },
    refreshDataList() {
      this.updateLoadingStatus({ isLoading: true });
      const scope = this;
      this.$http
        .get(
          `${
            this.appContextPath
          }appweb/pointExchange/listItem?pageSize=15&pageNum=1`
        )
        .then(success => {
          scope.list = (success &&
            success.data &&
            success.data.result &&
            success.data.result.list) || [];
          if (scope.$refs.scrollerEvent) {
            scope.$refs.scrollerEvent.donePulldown();
            scope.$refs.scrollerEvent.reset({ top: 0 });
          }
          scope.updateLoadingStatus({ isLoading: false });
        });
    },
    refreshMoreData() {
      // this.bottomLoading = true;
      const scope = this;
      this.$http
        .get(
          `${
            this.appContextPath
          }appweb/pointExchange/listItem?pageSize=15&pageNum=${++this.pageNum}`
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
            scope.$refs.scrollerEvent.reset({ bottom: 0 });
          }
        });
    },
    goCommodityOrder(id) {
      this.$router.push({ path: `/commodity_order/${id}` });
    }
  },
  mounted() {
    this.refreshDataList();
    this.updateTitle("积分兑换商城");
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.card-padding {
  padding: 1.5rem;
}
.sign-in {
  float: right;
  line-height: 2rem;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  color: #528b8b;
  font-size: 1.4rem;
}
</style>
