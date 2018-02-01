<template>
  <div>
    <group title="附近网点">
      <!-- <load-more  v-if="topLoading" :show-loading="topLoading" tip="加载中" background-color="#fbf9fe"></load-more> -->
      <scroller :lock-x=true>
        <div>
          <cell v-for="item in list" :key="item.id" primary="content" @click.native="goMerchantMap($event, item)" is-link>
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
import { Badge, Cell, Scroller, LoadMore, Group } from "vux";
import { mapGetters } from "vuex";

export default {
  name: "MerchantList",
  components: {
    Badge,
    Cell,
    Scroller,
    // LoadMore,
    Group
  },
  data() {
    return {
      latitude: 0,
      longitude: 0,
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
    goMerchantMap(event, item) {
      this.$router.push({ path: `/merchant_map/${item.id}` });
    },
    refreshDataList(value) {
      const longitude = value && value.coords.longitude || 0;
      const latitude = value && value.coords.latitude || 0;
      const scope = this;
      this.$http
        .get(
          `${
            this.appContextPath
          }appweb/branch/list?pageSize=2&pageNum=2&keyWord=key&type=testType&lati=${latitude}&longi=${longitude}`
        )
        .then(success => {
          scope.list = (success &&
            success.data &&
            success.data.result &&
            success.data.result.list) || {
            content: "无数据"
          };
        });
    }
  },
  mounted() {
    const scope = this;
    if (navigator.geolocation) {
      const title = "地图加载失败";
      navigator.geolocation.getCurrentPosition(
        this.refreshDataList,
        value => {
          switch (value.code) {
            case 1:
              scope.$vux.alert.show({
                title,
                content: "坐标不得为空"
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
        },
        {
          enableHighAccuracy: true,
          maximumAge: 1000
        }
      );
    }
    this.refreshDataList();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.card-padding {
  padding: 15px;
}
</style>
