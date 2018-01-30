<template>
  <div>
    <group title="商品列表">
      <!-- <load-more  v-if="topLoading" :show-loading="topLoading" tip="加载中" background-color="#fbf9fe"></load-more> -->
     <scroller :lock-x=true 
               :pulldown-config="{downContent: '下拉刷新', upContent: '释放后更新', loadingContent: '正在刷新...',}" 
               :pullup-config="{upContent:'上拉加载更多', downContent: '释放后加载', loadingContent: '正在加载...',}" 
               ref="scrollerEvent" 
               :use-pulldown=true 
               :use-pullup=true 
               @on-pulldown-loading="refreshDataList" 
               @on-pullup-loading="refreshMoreData">
        <div>
          <flexbox :gutter="0" wrap="wrap">
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
          <!-- <load-more v-if="bottomLoading" :show-loading="bottomLoading" tip="加载更多" background-color="#fbf9fe"></load-more> -->
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
