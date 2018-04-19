<template>
  <div>
    <a class="sign-in" @click="signIn">签到</a>
    <group title="积分兑换商品列表">
      <!-- <load-more  v-if="topLoading" :show-loading="topLoading" tip="加载中" background-color="#fbf9fe"></load-more> -->
      <p style="text-align: center;color: #000" v-if="list.length === 0">找不到信息</p>
      <scroller v-if="list.length > 0"
                :lock-x=true 
               :pulldown-config="{content: '下拉刷新', downContent: '下拉刷新', upContent: '释放后更新', loadingContent: '正在刷新...',}" 
               :pullup-config="{content: '上拉加载更多', upContent:'上拉加载更多', downContent: '释放后加载', loadingContent: '正在加载...',}" 
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
                  <p style="font-size:14px;">{{item.name}}</p>
                  <!-- <p style="font-size:10px;line-height:1 ;color:#999;">{{item.description}}</p> -->
                  <p style="font-size:12px;color:#FF0000;">{{item.pointCost}} 积分</p>
                  <p style="font-size:10px;color:#EEC900;">参考价格：¥ {{item.price}}</p>
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
import { mapGetters, mapMutations } from "vuex";

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
      // topLoading: false,
      // bottomLoading: false,
      list: []
    };
  },
  computed: {
    ...mapGetters(["appContextPath"])
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
      // this.topLoading = true;
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
            success.data.result.list) || {
            content: "无数据"
          };
          scope.$refs.scrollerEvent.donePulldown();
          scope.$refs.scrollerEvent.reset({ top: 0 });
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
          scope.$refs.scrollerEvent.donePullup();
          scope.$refs.scrollerEvent.reset();
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
  padding: 15px;
}
.sign-in {
  float: right;
  line-height: 20px;
  padding-left: 15px;
  padding-right: 15px;
  color: #528b8b;
  font-size: 14px;
}
</style>
