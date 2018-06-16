<template>
  <div class="blank-page">
    <loading v-model="isLoading"></loading>
    <group>
      <load-more v-if="!isLoading && list.length === 0" :show-loading="false" :tip="'暂无数据'" background-color="#fbf9fe"></load-more>
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
          <cell v-for="item in list" :key="item.id" primary="content">
            <img slot="title"
                 style="height: 4rem;width: 6rem;display:block;border: 1px solid #999999;"
                 :src="item.picUrl" class="card-padding" @error="setDefaultImg">
            <div style="margin-left:1rem;" slot>
              <span class="line-margin">
                <div style="text-align: left; width: 55%; float: left;color: #000;height: 2.5rem;overflow: hidden;">{{item.name}}</div>
                <div style="color:#FF0000; width: 45%; display: inline-block; text-align: right;">
                  {{item.pointCost}}<i style="font-size:1.05rem;color: #999999">积分 ✖️ {{item.exchangeCount}}</i>
                </div>
              </span>
              <span class="line-margin">
                <div style="text-align: left; font-size:1.2rem; width: 40%;float: left;color:#999;">{{item.orderTs | dateFormat}}</div>
                <div style="text-align: right; display: inline-block;float: right;width: 60%;font-size:1.2rem;color:#999999;">参考价格：¥ {{item.price}}</div>
              </span>
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
    LoadMore,
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
      list: [],
      enablePullup: false
    };
  },
  computed: {
    ...mapGetters(["appContextPath", "isLocal", "rootPath"])
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
          if (scope.list.length === 15) {
            scope.enablePullup = true;
          }
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
    setDefaultImg(event) {
      event.target.src = `${this.rootPath}static/default_img.jpg`;
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
.line-margin {
  margin-top: 1.5rem;
  display: block;
}
</style>
