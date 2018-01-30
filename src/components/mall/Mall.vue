<template>
  <div>
    <group title="商品列表">
      <load-more  v-if="topLoading" :show-loading="topLoading" tip="加载中" background-color="#fbf9fe"></load-more>
      <scroller lock-x scrollbar-y @on-scroll="onCellsListScroll" @on-scroll-bottom="onScrollBottom" ref="scrollerEvent" :scroll-bottom-offset="-100">
        <div>
          <flexbox :gutter="0">
            <flexbox-item :span="1/3" v-for="item in list" :key="item.id">
              <card>
                <img slot="header" :src="item.picUrl" style="width:100%;display:block;">
                <div slot="content" class="card-padding">
                  <p style="font-size:14px;">{{item.name}}</p>
                  <p style="font-size:10px;line-height:1 ;color:#999;">{{item.description}}</p>
                  <p style="font-size:12px;color:#FF0000;">¥ {{item.price}}</p>
                </div>
              </card>
            </flexbox-item>
          </flexbox>
          <load-more v-if="bottomLoading" :show-loading="bottomLoading" tip="加载更多" background-color="#fbf9fe"></load-more>
        </div>
      </scroller>
    </group>
  </div>
</template>

<script>
import { Flexbox, FlexboxItem, Card, LoadMore, Scroller, Group } from "vux";
import { mapGetters } from "vuex";

export default {
  name: "Mall",
  components: {
    Flexbox,
    FlexboxItem,
    Card,
    LoadMore,
    Scroller,
    Group
  },
  data() {
    return {
      pageNum: 1,
      pageSize: 15,
      topLoading: false,
      bottomLoading: false,
      list: []
    };
  },
  computed: {
    ...mapGetters([
      'appContextPath'
    ])
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
    refreshDataList() {
      this.topLoading = true;
      const scope = this;
      this.$http
        .get(`${this.appContextPath}appweb/pointExchange/listItem?pageSize=15&pageNum=1`)
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
