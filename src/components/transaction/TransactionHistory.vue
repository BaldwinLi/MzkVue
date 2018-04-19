<template>
  <div>
    <group>
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
            <card v-for="(item, index) in list" :key="index">
                <div slot="content" class="card-padding">
                  <p style="padding: 5px; font-size:14px;">{{item.description}}</p>
                  <p style="padding: 5px; font-size:12px; color:#0000EE;">明珠卡余额: ¥ {{item.balance}}</p>
                  <p style="padding: 5px; font-size:12px;color:#FF0000;">明珠卡消费金额: ¥ {{item.amount}}</p>
                  <p style="padding: 5px; font-size:12px; color:#999;">交易时间: {{item.ts | dateFormat}}</p>
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
import { mapGetters, mapMutations } from "vuex";

export default {
  name: "AnnouncementList",
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
      // topLoading: false,
      // bottomLoading: false,
      list: []
    };
  },
  filters: {
    dateFormat: function(value) {
      return dateFormat(new Date(value), 'YYYY-MM-DD')
    }
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
    goAnnouncementDetail(event, item) {
      this.$router.push({ path: `/announcementDetail/${item.id}` });
    },
    refreshDataList() {
      // this.topLoading = true;
      const scope = this;
      this.$http
        .get(
          `${
            this.appContextPath
          }appweb/cardQuery/listChange?cardNo=10&pageSize=15&pageNum=1`
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
          scope.$refs.scrollerEvent.donePullup();
          scope.$refs.scrollerEvent.reset();
        });
    },
    ...mapMutations(["updateTitle"])
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
  padding: 15px;
}
</style>
