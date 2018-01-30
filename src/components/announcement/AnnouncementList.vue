<template>
  <div>
    <group title="公告列表">
      <load-more  v-if="topLoading" :show-loading="topLoading" tip="加载中" background-color="#fbf9fe"></load-more>
      <scroller lock-x scrollbar-y @on-scroll="onCellsListScroll" @on-scroll-bottom="onScrollBottom" ref="scrollerEvent" :scroll-bottom-offset="-100">
        <div>
          <cell v-for="item in list" :key="item.id" primary="content" @click.native="goAnnouncementDetail($event, item)" is-link>
            <p slot="title" v-if="item.title" class="card-padding">{{ item.title }} <badge></badge></p>
            <div style="text-align: left;" v-html="item.content" slot></div>
          </cell>
          <load-more v-if="bottomLoading" :show-loading="bottomLoading" tip="加载更多" background-color="#fbf9fe"></load-more>
        </div>
      </scroller>
    </group>
  </div>
</template>

<script>
import { Badge, Cell, Scroller, LoadMore, Group } from "vux";
import { mapGetters } from "vuex";

export default {
  name: "AnnouncementList",
  components: {
    Badge,
    Cell,
    Scroller,
    LoadMore,
    Group
  },
  data() {
    return {
      pageNum: 1,
      pageSize: 10,
      topLoading: false,
      bottomLoading: false,
      list: []
    };
  },
  computed: {
    ...mapGetters(["appContextPath", "isLocal"])
  },
  methods: {
    onCellsListScroll(event) {
      const scope = this;
      if (event.top < this.$refs["scrollerEvent"].$el.clientTop - 100) {
        this.refreshDataList();
      }
    },
    onScrollBottom() {
      const scope = this;
      this.refreshMoreData();
    },
    goAnnouncementDetail(event, item) {
      this.$router.push({ path: `/announcementDetail/${item.id}` });
    },
    refreshDataList() {
      this.topLoading = true;
      const scope = this;
      this.$http
        .get(`${this.appContextPath}appweb/bulletin/list?pageSize=10&pageNum=1`)
        .then(success => {
          scope.list = (success &&
            success.data &&
            success.data.result &&
            success.data.result.list) || {
            content: "无数据"
          };
          this.topLoading = false;
        });
    },
    refreshMoreData() {
      this.bottomLoading = true;
      const scope = this;
      this.$http
        .get(
          `${
            this.appContextPath
          }appweb/bulletin/list?pageSize=10&pageNum=${++this.pageNum}`
        )
        .then(success => {
          scope.list = scope.list.concat(
            (success &&
              success.data &&
              success.data.result &&
              success.data.result.list) ||
              []
          );
          scope.bottomLoading = false;
        });
    }
  },
  mounted() {
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
