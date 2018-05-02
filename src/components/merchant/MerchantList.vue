<template>
  <div>
    <loading v-model="isLoading"></loading>
    <search
      style="position: static"
      cancel-text="搜索"
      v-model="searchValue"
      position="relative"
      placeholder="搜商户"
      auto-scroll-to-top
      top="0"
      @on-focus="onFocus"
      @on-cancel="refreshDataList"
      ref="search">
      <i slot="left" @click="hideList" class="fa fa-angle-left" style="font-size: 2.5rem; margin-right: 1rem;" aria-hidden="true"></i>
    </search>
      <!-- :results="results"
      @result-click="resultClick"
      @on-change="getResult"
      @on-submit="onSubmit" -->
    <grid style="width: 102%;" v-if="!isShowList">
      <popup-picker class="type-block" title="商户分类" popup-title="商户分类" :data="allianceBusiTypeList" :columns="1" v-model="selectTypeItem" @on-change="refreshDataList" show-name>
        <!-- <i slot="footer" class="popup-footer"></i> -->
      </popup-picker>
      <popup-picker class="type-block" title="所在地区" popup-title="所在地区" :data="allianceBusiTypeList" :columns="1" v-model="selectTypeItem" @on-change="refreshDataList" show-name>
        <!-- <i slot="footer" class="popup-footer"></i> -->
      </popup-picker>
      <popup-picker class="type-block" title="智能排序" popup-title="智能排序" :data="autoSortList" :columns="1" v-model="selectTypeItem" @on-change="refreshDataList" show-name>
        <!-- <i slot="footer" class="popup-footer"></i> -->
      </popup-picker>
      <card v-for="(item, index) in recommodKeywordList" :key="index" :header="{ title: item.name}" class="key-words-panel">
        <div slot="content">
          <badge class="key-word" v-for="(item, index) in item.keywords" :key="index" :text="item" @click.native="selectKeyWord(item)"></badge>
        </div>
      </card>
    </grid>
    <load-more v-if="!isLoading && list.length === 0" :show-loading="false" :tip="'暂无数据'" background-color="#fbf9fe"></load-more>
    <group v-if="isShowList && list.length > 0">
      <scroller :lock-x=true
                :scrollbar-y=true
                :pulldown-config="pulldownConfig" 
                :pullup-config="pullupConfig"
                ref="scrollerEvent" 
                :use-pulldown=true 
                :use-pullup="enablePullup" 
                @on-pulldown-loading="invokenavigator(refreshDataList)" 
                @on-pullup-loading="invokenavigator(refreshMoreData)">
          <cell v-for="item in list" :key="item.id" primary="content" @click.native="goMerchantMap($event, item)" is-link>
            <img slot="title"
                 style="height: 8rem; width: 8rem; border: 1px solid #999999;"
                 :src="item.logoUrl" class="card-padding"
                 @error="setDefaultImg">
            <div style="text-align: left;height: 10rem; margin: 1rem;" slot>
              <p class="header-text" style="width: 85%;font-size:1.5rem;">
                {{item.name}}
              </p>
              <p class="apostrophe content">
                <i class="fa fa-phone icon-preffix" aria-hidden="true"></i>{{ item.tel }}
              </p>
              <p class="apostrophe content">
                <i class="fa fa-map-marker icon-preffix" aria-hidden="true"></i>{{ item.address }}
                <i style="font-size: 1.1rem; color: #999999; right: 0; bottom: 0; position: absolute; font-weight: normal;">{{item.distance/1000}}km</i>
              </p>
            </div>
          </cell>
          <!-- <load-more v-if="bottomLoading" :show-loading="bottomLoading" tip="加载更多" background-color="#fbf9fe"></load-more> -->
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
  Card,
  Grid,
  Search,
  PopupPicker
} from "vux";
import { mapGetters, mapMutations } from "vuex";
import {
  allianceBusiTypeList,
  autoSortList,
  recommodKeywordList
} from "../../initKeyList";
import {
  pulldownConfig,
  pullupConfig,
  geolocationOptions,
  geolocationErrorCallback
} from "../config";
import initAMap from "@/initAMap";

export default {
  name: "BranchList",
  components: {
    Badge,
    Cell,
    Scroller,
    Loading,
    LoadMore,
    Search,
    Group,
    Grid,
    Card,
    PopupPicker
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
      searchValue: "",
      selectTypeItem: [""],
      // results: [],
      isShowList: true,
      // topLoading: false,
      // bottomLoading: false,
      list: [],
      recommodKeywordList: recommodKeywordList,
      allianceBusiTypeList: [],
      autoSortList,
      enablePullup: false
    };
  },
  computed: {
    ...mapGetters(["appContextPath", "isLocal", "rootPath"])
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
      this.isShowList = true;
      this.isLoading = true;
      this.longitude =
        (value && value.position && value.position.lng) || this.longitude;
      this.latitude =
        (value && value.position && value.position.lat) || this.latitude;
      const scope = this;
      const coordsCondition = `&lati=${this.latitude}&longi=${this.longitude}`;
      this.$http
        .get(
          `${
            this.appContextPath
          }appweb/branch/list?pageSize=15&pageNum=1&keyWord=${
            this.searchValue
          }&type=${this.selectTypeItem[0]}${coordsCondition}`
          //
        )
        .then(
          success => {
            scope.list =
              (success &&
                success.data &&
                success.data.result &&
                success.data.result.list) ||
              [];
            scope.enablePullup = scope.list.length === 15 ? true : false;
            if (scope.$refs.scrollerEvent) {
              scope.$refs.scrollerEvent.donePulldown();
              scope.$refs.scrollerEvent.reset({ top: 0 });
            }
            scope.isLoading = false;
          },
          error => {
            scope.isLoading = false;
          }
        );
    },
    refreshMoreData(value) {
      this.longitude =
        (value && value.position && value.position.lng) || this.longitude;
      this.latitude =
        (value && value.position && value.position.lat) || this.latitude;
      const scope = this;
      const coordsCondition = `&lati=${this.latitude}&longi=${this.longitude}`;
      this.$http
        .get(
          `${this.appContextPath}appweb/branch/list?pageSize=${
            this.pageSize
          }&pageNum=${++this.pageNum}&keyWord=${this.searchValue}&type=${
            this.selectTypeItem[0]
          }${coordsCondition}`
        )
        .then(
          success => {
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
            scope.isLoading = false;
          },
          error => {
            scope.isLoading = false;
          }
        );
    },
    invokenavigator(func) {
      this.isLoading = true;
      initAMap().then(result => {
        if (result) {
          geolocation.getCurrentPosition();
          AMap.event.addListener(geolocation, "complete", func.bind(this)); //返回定位信息
          AMap.event.addListener(geolocation, "error", value => {
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
          }); //返回定位出错信息
        }
      });
    },
    hideList() {
      this.isShowList = true;
    },
    onFocus() {
      this.isShowList = false;
    },
    selectKeyWord($event) {
      this.searchValue = $event;
      this.refreshDataList();
    },
    // onChange() {},
    // onCancel() {},
    // onSubmit() {},
    // getResult(val) {
    //   let rs = [];
    //   allianceBusiTypeList.forEach(e => {
    //     if (e.className.indexOf(val) > -1) {
    //       rs.push({
    //         title: e.className,
    //         other: e.classId
    //       });
    //     }
    //   });
    //   return rs;
    // },
    // resultClick() {},
    setDefaultImg(event) {
      event.target.src = `${this.rootPath}static/default_img.jpg`;
    },
    ...mapMutations(["updateTitle"])
  },
  mounted() {
    this.invokenavigator(this.refreshDataList);
    this.updateTitle("附近联盟商家");
    allianceBusiTypeList.then(result => {
      this.allianceBusiTypeList = result.map(v => {
        return {
          name: v.className,
          value: v.classId
        };
      });
    });
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.card-padding {
  padding: 1.5rem;
}
.type-block {
  width: 33.33%;
  float: left;
  font-size: 1.4rem;
}
.type-block:after {
  content: "|";
  float: right;
  margin-top: -3.2rem;
  color: #999999;
}
.key-words-panel {
  display: inline-block;
  width: 100%;
}
.key-word {
  padding: 0.5rem;
  margin: 0.5rem;
  background: #999999;
}
/* .popup-footer:after {
  content: '|';
} */
p.content {
  font-size: 1.2rem;
  height: 2.5rem;
  width: 95%;
  margin-top: 0.5rem;
  overflow: hidden;
}
</style>
