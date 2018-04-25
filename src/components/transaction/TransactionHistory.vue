<template>
  <div>
    <group>
      <!-- <load-more  v-if="topLoading" :show-loading="topLoading" tip="加载中" background-color="#fbf9fe"></load-more> -->
      <p class="no-data" v-if="!isLoading && list.length === 0">暂无数据</p>
      <scroller v-if="list.length > 0"
                :lock-x=true 
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
                  <p style="padding: 0.5rem; font-size:1.4rem;">{{item.description}}</p>
                  <p style="padding: 0.5rem; font-size:1.2rem; color:#0000EE;">明珠卡余额: ¥ {{item.balance}}</p>
                  <p style="padding: 0.5rem; font-size:1.2rem;color:#FF0000;">明珠卡消费金额: ¥ {{item.amount}}</p>
                  <p style="padding: 0.5rem; font-size:1.2rem; color:#999;">交易时间: {{item.ts | dateFormat}}</p>
                </div>
            </card>
          <!-- <load-more v-if="bottomLoading" :show-loading="bottomLoading" tip="加载更多" background-color="#fbf9fe"></load-more> -->
        </div>
      </scroller>
    </group>
  </div>
</template>

<script>
import { Badge, Card, Scroller, LoadMore, Group, dateFormat } from "vux";
import { mapState, mapGetters, mapMutations } from "vuex";
import { pulldownConfig, pullupConfig } from "../config";

export default {
  name: "TransactionHistory",
  components: {
    Badge,
    Card,
    Scroller,
    // LoadMore,
    Group
  },
  data() {
    return {
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
    goAnnouncementDetail(event, item) {
      this.$router.push({ path: `/announcementDetail/${item.id}` });
    },
    refreshDataList() {
      // this.topLoading = true;
      this.updateLoadingStatus({ isLoading: true });
      const scope = this;
      this.$http
        .get(
          `${
            this.appContextPath
          }appweb/cardQuery/listChange?cardNo=10&pageSize=15&pageNum=1`
        )
        .then(success => {
          scope.list =
            (success &&
              success.data &&
              success.data.result &&
              success.data.result.list) ||
            [];
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
          `${
            this.appContextPath
          }appweb/cardQuery/listChange?cardNo=10&pageSize=2&pageNum=${++this
            .pageNum}`
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
    this.refreshDataList();
    this.updateTitle("明珠卡缴费记录");
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.card-padding {
  padding: 1.5rem;
}
</style>
