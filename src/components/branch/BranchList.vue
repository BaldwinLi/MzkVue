<template>
  <div>
    <loading v-model="isLoading"></loading>
    <group>
      <!-- <load-more  v-if="topLoading" :show-loading="topLoading" tip="加载中" background-color="#fbf9fe"></load-more> -->
      <p class="no-data" v-if="!isLoading && list.length === 0">暂无数据</p>
      <scroller v-if="list.length > 0"
                :lock-x=true
                :scrollbar-y=true
                :pulldown-config="pulldownConfig" 
                :pullup-config="pullupConfig"
                ref="scrollerEvent" 
                :use-pulldown=true 
                :use-pullup="enablePullup" 
                @on-pulldown-loading="invokenavigator(refreshDataList)" 
                @on-pullup-loading="invokenavigator(refreshMoreData)">
        <div>
          <cell v-for="item in list" :key="item.id" primary="content" @click.native="goBranchMap($event, item)" is-link>
            <img slot="title" style="height: 5rem" :src="item.logoUrl" class="card-padding">
            <div slot>
              <p style="text-align: left;color: #000">{{item.name}}</p>
              <p style="text-align: left;font-size:1.2rem">{{item.description}}</p>
              <p style="text-align: left;color: #008B8B">联系电话： {{ item.tel }}</p>
            </div>
          </cell>
          <!-- <load-more v-if="bottomLoading" :show-loading="bottomLoading" tip="加载更多" background-color="#fbf9fe"></load-more> -->
        </div>
      </scroller>
    </group>
  </div>
</template>

<script>
import { Badge, Cell, Scroller, Loading, LoadMore, Group } from "vux";
import { mapGetters, mapMutations } from "vuex";
import {
  pulldownConfig,
  pullupConfig,
  geolocationOptions,
  geolocationErrorCallback
} from "../config";

export default {
  name: "BranchList",
  components: {
    Badge,
    Cell,
    Scroller,
    Loading,
    pulldownConfig,
    pullupConfig,
    // LoadMore,
    Group
  },
  data() {
    return {
      pageNum: 1,
      pageSize: 15,
      latitude: 0,
      longitude: 0,
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
    ...mapGetters(["appContextPath", "isLocal"])
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
    ...mapMutations(["updateTitle"]),
    goBranchMap(event, item) {
      this.$router.push({ path: `/branch_map/${item.id}` });
    },
    refreshDataList(value) {
      this.longitude = (value && value.coords.longitude) || 0;
      this.latitude = (value && value.coords.latitude) || 0;
      const scope = this;
      const coordsCondition = this.isLocal
        ? ""
        : `&lati=${this.latitude}&longi=${this.longitude}`;
      this.$http
        .get(
          `${
            this.appContextPath
          }appweb/allianceBusi/list?pageSize=15&pageNum=1${coordsCondition}`
        )
        .then(success => {
          scope.list =
            (success &&
              success.data &&
              success.data.result &&
              success.data.result.list) ||
            [];
          if (scope.list.length === 15) scope.enablePullup = true;
          if (scope.$refs.scrollerEvent) {
            scope.$refs.scrollerEvent.donePulldown();
            scope.$refs.scrollerEvent.reset({ top: 0 });
          }
          this.isLoading = false;
        });
    },
    refreshMoreData(value) {
      this.longitude = (value && value.coords.longitude) || 0;
      this.latitude = (value && value.coords.latitude) || 0;
      const scope = this;
      const coordsCondition = this.isLocal
        ? ""
        : `&lati=${this.latitude}&longi=${this.longitude}`;
      this.$http
        .get(
          `${this.appContextPath}appweb/allianceBusi/detail?pageSize=${
            this.pageSize
          }&pageNum=${++this.pageNum}${coordsCondition}`
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
    invokenavigator(func) {
      this.isLoading = true;
      if (this.isLocal) {
        func();
        return;
      }
      const scope = this;
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          func.bind(this),
          value => {
            if (this.latitude && this.longitude) {
              func({
                coords: {
                  longitude: this.longitude,
                  latitude: this.latitude
                }
              });
            } else {
              geolocationErrorCallback(value, scope.$vux.alert);
            }
            this.isLoading = false;
          },
          geolocationOptions
        );
      }
    }
  },
  mounted() {
    // this.refreshDataList();
    this.invokenavigator(this.refreshDataList);
    this.updateTitle("附近网点");
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.card-padding {
  padding: 1.5rem;
}
</style>
