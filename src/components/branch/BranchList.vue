<template>
  <div>
    <loading v-model="isLoading"></loading>
    <group>
      <!-- <load-more  v-if="topLoading" :show-loading="topLoading" tip="加载中" background-color="#fbf9fe"></load-more> -->
      <scroller :lock-x=true 
                :pulldown-config="{downContent: '下拉刷新', upContent: '释放后更新', loadingContent: '正在刷新...',}" 
                :pullup-config="{upContent:'上拉加载更多', downContent: '释放后加载', loadingContent: '正在加载...',}" 
                ref="scrollerEvent" 
                :use-pulldown=true 
                :use-pullup=true 
                @on-pulldown-loading="invokenavigator(refreshDataList)" 
                @on-pullup-loading="invokenavigator(refreshMoreData)">
        <div>
          <cell v-for="item in list" :key="item.id" primary="content" @click.native="goBranchMap($event, item)" is-link>
            <img slot="title" style="height: 50px" :src="item.logoUrl" class="card-padding">
            <div slot>
              <p style="text-align: left;color: #000">{{item.name}}</p>
              <p style="text-align: left;font-size:12px">{{item.description}}</p>
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

export default {
  name: "BranchList",
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
      latitude: 0,
      longitude: 0,
      isLoading: false,
      // topLoading: false,
      // bottomLoading: false,
      list: []
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
      this.$http
        .get(
          `${
            this.appContextPath
          }appweb/allianceBusi/list?pageSize=15&pageNum=1&keyWord=key&type=testType&lati=${
            this.latitude
          }&longi=${this.longitude}`
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
          this.isLoading = false;
        });
    },
    refreshMoreData(value) {
      this.longitude = (value && value.coords.longitude) || 0;
      this.latitude = (value && value.coords.latitude) || 0;
      const scope = this;
      this.$http
        .get(
          `${this.appContextPath}appweb/allianceBusi/detail?pageSize=${
            this.pageSize
          }&pageNum=${++this.pageNum}&keyWord=key&type=testType&lati=${
            this.latitude
          }&longi=${this.longitude}`
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
          this.isLoading = false;
        });
    },
    invokenavigator(func) {
      this.isLoading = true;
      const scope = this;
      if (navigator.geolocation) {
        const title = "地图加载失败";
        navigator.geolocation.getCurrentPosition(
          func,
          value => {
            switch (value.code) {
              case 1:
                scope.$vux.alert.show({
                  title,
                  content: "您的网络协议不允许使用定位服务"
                });
                break;
              case 2:
                scope.$vux.alert.show({
                  title,
                  content: "暂时获取不到位置信息"
                });
                break;
              case 3:
                scope.$vux.alert.show({
                  title,
                  content: "获取信息超时"
                });
                break;
              case 4:
                scope.$vux.alert.show({
                  title,
                  content: "未知错误"
                });
                break;
            }
            this.isLoading = false;
          },
          {
            enableHighAccuracy: true,
            maximumAge: 1000
          }
        );
      }
    }
  },
  mounted() {
    this.invokenavigator(this.refreshDataList);
    this.updateTitle("附近网点");
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.card-padding {
  padding: 15px;
}
</style>
