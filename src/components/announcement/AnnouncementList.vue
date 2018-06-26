<template>
  <div class="blank-page">
    <loading v-model="isLoading"></loading>
    <load-more v-if="!isLoading && list.length === 0" :show-loading="false" :tip="'暂无数据'" background-color="#fbf9fe"></load-more>
    <group v-if="list.length > 0">
      <scroller :lock-x=true
                :scrollbar-y=true
                :pulldown-config="pulldownConfig" 
                :pullup-config="pullupConfig"
                ref="scrollerEvent" 
                :use-pulldown=true 
                :use-pullup="enablePullup"
                @on-pulldown-loading="refreshDataList" 
                @on-pullup-loading="refreshMoreData">
        <div>
          <cell v-for="item in list" :key="item.id" primary="content" @click.native="goAnnouncementDetail($event, item)" is-link>
            <p slot="title" v-if="item.title" class="card-padding"><i class="fa fa-bullhorn" style="font-size: 1.6rem;" aria-hidden="true"></i></p>
            <div style="text-align: left;" slot>
              <p class="header-text title-clip">
                {{ item.title | trunceStr }}
                <i style="font-size: 1.1rem; -webkit-text-fill-color: #999999; right: 0; top: -1.5rem; position: absolute; font-weight: normal;" aria-hidden="true">{{item.createTs | dateFormat}}</i>
              </p>
              <!-- <p class="apostrophe" style="font-size: 1.2rem; height: 1.5rem; overflow: hidden; width: 95%;" v-html="item.content"></p> -->
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
  Loading,
  Badge,
  Cell,
  Scroller,
  LoadMore,
  Group,
  dateFormat
} from "vux";
import { mapGetters, mapMutations } from "vuex";
import { pulldownConfig, pullupConfig } from "../config";
// import { announcementlist } from "../../mock/mockData";

export default {
  name: "AnnouncementList",
  components: {
    Badge,
    Cell,
    Loading,
    Scroller,
    LoadMore,
    Group
  },
  data() {
    return {
      isLoading: false,
      pageNum: 1,
      pageSize: 10,
      pulldownConfig,
      pullupConfig,
      list: [],
      enablePullup: false
    };
  },
  filters: {
    dateFormat: function(value) {
      const date = parseInt(dateFormat(new Date(value), "YYYYMMDD"));
      const today = parseInt(dateFormat(Date.now(), "YYYYMMDD"));
      if (date === today) return "今天";
      else
        //  + dateFormat(new Date(value), "hh:mm");
        return dateFormat(new Date(value), "YYYY-MM-DD");
    },
    trunceStr(value) {
      if(!!value && value.length >= 15) {
        return value.substring(0, 14) + '...'
      } else {
        return value;
      }
    }
  },
  computed: {
    ...mapGetters(["appContextPath", "isLocal"])
  },
  methods: {
    ...mapMutations(["updateTitle"]),
    goAnnouncementDetail(event, item) {
      this.$router.push({ path: `/announcement_detail/${item.id}` });
    },
    refreshDataList() {
      this.isLoading = true;
      const scope = this;
      this.$http
        .get(`${this.appContextPath}appweb/bulletin/list?pageSize=10&pageNum=1`)
        .then(
          success => {
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
            if (scope.list.length === 10) scope.enablePullup = true;
            this.isLoading = false;
          },
          error => {
            this.isLoading = false;
          }
        );
    },
    refreshMoreData() {
      // this.bottomLoading = true;
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
          if (scope.$refs.scrollerEvent) {
            scope.$refs.scrollerEvent.donePullup();
            scope.$refs.scrollerEvent.reset({ bottom: -40 });
          }
        });
    }
  },
  mounted() {
    this.refreshDataList();
    this.updateTitle("公告列表");
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.card-padding {
  padding: 0.6rem;
  margin: 0.8rem;
  background-color: #eedfcc;
  border-radius: 2rem;
  text-align: center;
  width: 2.5rem;
  height: 2.5rem;
}
.apostrophe:before {
  content: "...";
  position: absolute;
  right: 1.7rem;
}
.title-clip {
  content: attr(data-text);
  /* background: -webkit-gradient(
    linear,
    70% bottom,
    100% bottom,
    from(#000),
    to(#fff)
  ); */
  /* background-image: -webkit-gradient(
    linear,
    70% bottom,
    100% bottom,
    from(#000),
    to(#fff)
  ); */
  /* -webkit-background-clip: text;
  -webkit-text-fill-color: transparent; */
  width: 100%;
  font-weight: normal;
  overflow: hidden;
  height: 2rem;
}
/* .title-clip:after {
  content: "...";
  height: 2rem;
  width: 0.6rem;
  position: absolute;
  z-index: 9999;
  top: 0;
  right: 10px;
  background-image: -webkit-gradient(
    linear,
    0% bottom,
    100% bottom,
    from(transparent),
    to(#fff)
  );
} */
</style>
