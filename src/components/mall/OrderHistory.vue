<template>
  <div class="blank-page">
    <group>
      <load-more v-if="!isLoading && list.length === 0" :show-loading="false" :tip="'暂无数据'" background-color="#fbf9fe"></load-more>
      <scroller v-if="list.length > 0"
                :lock-x=true
                :scrollbar-y=true>
                <!-- :pulldown-config="pulldownConfig" 
                :pullup-config="pullupConfig"
                ref="scrollerEvent" 
                :use-pulldown=true 
                :use-pullup=true 
                @on-pulldown-loading="refreshDataList" 
                @on-pullup-loading="refreshMoreData" -->
        <div>
            <cell v-for="(item, index) in list" :key="index" @click.native="goBackOrder(item)" is-link>
                <div slot="inline-desc" class="card-padding">
                  <p style="padding: 0.5rem; font-size:1.4rem;">收件人: {{item.receiver}}</p>
                  <p style="padding: 0.5rem; font-size:1.4rem; color:#0000EE;">收件人联系方式: {{item.tel}}</p>
                  <p style="padding: 0.5rem; font-size:1.4rem; color:#999;">收件地址: {{item.address}}</p>
                </div>
            </cell>
          <!-- <load-more v-if="bottomLoading" :show-loading="bottomLoading" tip="加载更多" background-color="#fbf9fe"></load-more> -->
        </div>
      </scroller>
    </group>
  </div>
</template>

<script>
import { Badge, Cell, Scroller, LoadMore, Group, dateFormat } from "vux";
import { mapState, mapGetters, mapMutations } from "vuex";
import { pulldownConfig, pullupConfig } from "../config";

export default {
  name: "order_history",
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
      pulldownConfig,
      pullupConfig,
      // topLoading: false,
      // bottomLoading: false,
      list: []
    };
  },
  filters: {
    dateFormat: function(value) {
      return dateFormat(new Date(value), "YYYY-MM-DD");
    }
  },
  computed: {
    ...mapState(["isLoading"]),
    ...mapGetters(["appContextPath", "isLocal"])
  },
  methods: {
    goBackOrder(item) {
      this.$router.push({
        path: `/commodity_order/${this.$route.params.id}`,
        query: {
          receiver: item.receiver,
          tel: item.tel,
          address: item.address
        }
      });
    },
    refreshDataList() {
      // this.topLoading = true;
      this.updateLoadingStatus({ isLoading: true });
      const scope = this;
      this.$http
        .get(
          `${
            this.appContextPath
          }appweb/pointExchange/listHisAdress?pageSize=10&pageNum=1`
        )
        .then(success => {
          scope.list =
            (success &&
              success.data &&
              success.data.result &&
              success.data.result.list.map(v => {
                return {
                  receiver: v.recName,
                  tel: v.recPhone,
                  address: v.cityName + v.commName + v.recAddr,
                  isDefault: v.ifDefault
                };
              })) ||
            [];
          // if (scope.$refs.scrollerEvent) {
          //   scope.$refs.scrollerEvent.donePulldown();
          //   scope.$refs.scrollerEvent.reset({ top: 0 });
          // }
          if (scope.list.length === 0) {
            scope.$vux.alert.show({
              title: "您还没有添加地址信息",
              content: "请到个人中心通过地址管理功能添加地址信息。"
            });
          }
          scope.updateLoadingStatus({ isLoading: false });
        });
    },
    // refreshMoreData() {
    //   // this.bottomLoading = true;
    //   const scope = this;
    //   this.$http
    //     .get(
    //       `${
    //         this.appContextPath
    //       }appweb/pointExchange/listHisAdress?pageSize=10&pageNum=${++this
    //         .pageNum}`
    //     )
    //     .then(success => {
    //       scope.list = scope.list.concat(
    //         (success &&
    //           success.data &&
    //           success.data.result &&
    //           success.data.result.list) ||
    //           []
    //       );
    //       if (scope.$refs.scrollerEvent) {
    //         scope.$refs.scrollerEvent.donePullup();
    //         scope.$refs.scrollerEvent.reset();
    //       }
    //     });
    // },
    ...mapMutations(["updateTitle", "updateLoadingStatus"])
  },
  mounted() {
    this.refreshDataList();
    this.updateTitle("历史收货信息");
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.card-padding {
  padding: 1.5rem;
}
</style>
