<template>
  <div>
    <loading v-model="isLoading"></loading>
    <group>
      <!-- <load-more  v-if="topLoading" :show-loading="topLoading" tip="加载中" background-color="#fbf9fe"></load-more> -->
      <p class="no-data" v-if="!isLoading && list.length === 0">暂无数据</p>
      <scroller v-if="list.length > 0"
                :lock-x=true 
                :pulldown-config="pulldownConfig" 
                :pullup-config="pullupConfig"
                ref="scrollerEvent" 
                :use-pulldown=true 
                :use-pullup=true 
                @on-pulldown-loading="refreshDataList" 
                @on-pullup-loading="refreshMoreData">
        <div>
          <cell v-for="item in list" :key="item.id" primary="content">
            <img slot="title" style="height: 5rem" :src="item.picUrl" class="card-padding">
            <div slot>
              <p style="text-align: left;color: #000">{{item.name}}</p>
              <p style="text-align: left;font-size:1.2rem">{{item.description}}</p>
              <p style="font-size:1.6rem;color:#FF0000;">{{item.pointCost}} 积分</p>
              <p style="font-size:1.2rem;color:#EEC900;">参考价格：¥ {{item.price}}</p>
              <p style="font-size:1.2rem; color:#999;">下单时间: {{item.orderTs | dateFormat}}</p>
            </div>
          </cell>
          <!-- <load-more v-if="bottomLoading" :show-loading="bottomLoading" tip="加载更多" background-color="#fbf9fe"></load-more> -->
        </div>
      </scroller>
    </group>
  </div>
</template>

<script>
import {
  Badge,
  Cell,
  Scroller,
  Loading,
  LoadMore,
  Group,
  dateFormat
} from "vux";
import { mapGetters, mapMutations } from "vuex";
import { pulldownConfig, pullupConfig } from "../config";

export default {
  name: "PointCostHistory",
  components: {
    Badge,
    Cell,
    Scroller,
    Loading,
    // LoadMore,
    Group
  },
  data() {
    return {
      pageNum: 1,
      pageSize: 15,
      isLoading: false,
      pulldownConfig,
      pullupConfig,
      // topLoading: false,
      // bottomLoading: false,
      list: []
    };
  },
  computed: {
    ...mapGetters(["appContextPath", "isLocal"])
  },
  filters: {
    dateFormat: function(value) {
      return dateFormat(new Date(value), "YYYY-MM-DD");
    }
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
      const scope = this;
      this.isLoading = true;
      this.$http
        .get(
          `${
            this.appContextPath
          }appweb/pointExchange/listOrder?pageSize=15&pageNum=1`
        )
        .then(success => {
          scope.list =
            (success &&
              success.data &&
              success.data.result &&
              success.data.result.list) ||
            [];
          if (scope.$refs.scrollerEvent) {
            scope.$refs.scrollerEvent.donePulldown();
            scope.$refs.scrollerEvent.reset({ top: 0 });
          }
          this.isLoading = false;
        });
    },
    refreshMoreData() {
      const scope = this;
      this.$http
        .get(
          `${this.appContextPath}appweb/pointExchange/listOrder?pageSize=${
            this.pageSize
          }&pageNum=${++this.pageNum}`
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
          this.isLoading = false;
        });
    },
    ...mapMutations(["updateTitle"])
  },
  mounted() {
    this.refreshDataList();
    this.updateTitle("历史下单记录");
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.card-padding {
  padding: 1.5rem;
}
</style>
