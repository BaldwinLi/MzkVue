<template>
  <div class="blank-page">
    <loading v-model="isLoading"></loading>
    <search
      style="position: static"
      v-model="searchValue"
      position="relative"
      placeholder="搜网点"
      auto-scroll-to-top
      top="0"
      @on-focus="onFocus"
      @on-cancel="hideList"
      @on-submit="refreshDataList"
      ref="search">
      <!-- cancel-text="取消" -->
      <!-- <i slot="left" v-if="!isShowList" @click="hideList" class="fa fa-angle-left" style="font-size: 2.5rem; margin-right: 1rem;" aria-hidden="true"></i> -->
    </search>
      <!-- :results="results"
      @result-click="resultClick"
      @on-change="getResult"
      @on-submit="onSubmit" -->
    <grid style="width: 102%;" v-if="!isShowList">
      <card v-for="(item, index) in recommodKeywordList" :key="index" :header="{ title: item.name}" class="key-words-panel">
        <div slot="content">
          <badge class="key-word" v-for="(item, index) in item.keywords" :key="index" :text="item" @click.native="selectKeyWord(item)"></badge>
        </div>
      </card>
    </grid>
    <grid style="width: 102%;" v-if="isShowList">
      <cell class="type-block" @click.native="openGroupRadio(0)">
        <div slot="title">网点分类&nbsp;<i class="fa fa-chevron-down" aria-hidden="true"></i></div>
      </cell>
      <!-- <cell class="type-block" @click.native="openGroupRadio(1)">
        <div slot="title">所在地区&nbsp;<i class="fa fa-chevron-down" aria-hidden="true"></i></div>
      </cell> -->
      <!-- <cell class="type-block" @click.native="openGroupRadio(2)">
        <div slot="title">智能排序&nbsp;<i class="fa fa-chevron-down" aria-hidden="true"></i></div>
      </cell> -->
    </grid>
    <load-more v-if="!isLoading && list.length === 0" :show-loading="false" :tip="'暂无数据'" background-color="#fbf9fe"></load-more>
    <group v-if="isShowList && list.length > 0">
      <scroller :lock-x=true
                :scrollbar-y=true
                :pulldown-config="pulldownConfig" 
                :pullup-config="pullupConfig"
                ref="scrollerEvent"
                height="-120"
                :use-pulldown=true 
                :use-pullup="enablePullup"
                @on-pulldown-loading="invokenavigator(refreshDataList)" 
                @on-pullup-loading="invokenavigator(refreshMoreData)">
        <div>
          <cell v-for="item in list" :key="item.id" primary="content" @click.native="goBranchMap($event, item)" is-link>
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
        </div>
      </scroller>
    </group>
    <group v-show="showMerchantGroup" style="left: 0" class="search-type-radio" gutter="5px">
      <radio style="border:1px solid #d3d3d3;" :options="merchantOptions.map(v=>v.value)" @on-change="queryMerchant" v-model="selectMerchantItem">
        <p style="font-size: 1.3rem;" slot-scope="props" slot="each-item">{{merchantOptions.map(v=>v.name)[props.index]}}</p>
      </radio>
    </group>
    <!-- <group v-show="showRegionGroup" style="left: 33.33%" class="search-type-radio" gutter="5px">
      <radio style="border:1px solid #d3d3d3;" :options="regionOptions.map(v=>v.value)" @on-change="queryRegion" v-model="selectRegionItem">
        <p style="font-size: 1.3rem;" slot-scope="props" slot="each-item">{{regionOptions.map(v=>v.name)[props.index]}}</p>
      </radio>
    </group> -->
    <group v-show="showSortGroup" style="left: 50%" class="search-type-radio" gutter="5px">
      <radio style="border:1px solid #d3d3d3;" :options="sortOptions.map(v=>v.value)" @on-change="querySort" v-model="selectSortItem">
        <p style="font-size: 1.3rem;" slot-scope="props" slot="each-item">{{sortOptions.map(v=>v.name)[props.index]}}</p>
      </radio>
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
  Radio
} from "vux";
import { mapGetters, mapMutations, mapState } from "vuex";
import {
  branchTypeList,
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
    Group,
    Card,
    Grid,
    Search,
    Radio
  },
  data() {
    return {
      pageNum: 1,
      pageSize: 15,
      isLoading: false,
      pulldownConfig,
      pullupConfig,
      searchValue: "",
      selectMerchantItem: "",
      selectRegionItem: "",
      selectSortItem: "",
      showMerchantGroup: false,
      showRegionGroup: false,
      showSortGroup: false,
      // groupRadioStyle: {
      //   left: 0
      // },
      // results: [],
      isShowList: true,
      // topLoading: false,
      // bottomLoading: false,
      list: [],
      recommodKeywordList: recommodKeywordList,
      branchTypeList: [],
      merchantOptions: [],
      regionOptions: [],
      sortOptions: [{
        name: '距离近',
        value: 1
      }],
      enablePullup: false
    };
  },
  computed: {
    ...mapState(["currentPosition"]),
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
    ...mapMutations(["updateTitle", "updateCurrentPosition"]),
    goBranchMap(event, item) {
      this.$router.push({ path: `/branch_map/${item.id}` });
    },
    refreshDataList(value) {
      document.activeElement.blur();  
      this.showMerchantGroup = false;
      this.showRegionGroup = false;
      this.showSortGroup = false;
      this.isShowList = true;
      this.isLoading = true;
      this.updateCurrentPosition({
        longitude:
          (value && value.position && value.position.lng) ||
          this.currentPosition.longitude,
        latitude:
          (value && value.position && value.position.lat) ||
          this.currentPosition.latitude
      });
      const scope = this;
      const coordsCondition = `&lati=${this.currentPosition.latitude}&longi=${
        this.currentPosition.longitude
      }`;
      this.$http
        .get(
          `${
            this.appContextPath
          }appweb/branch/list?pageSize=15&pageNum=1&keyWord=${
            this.searchValue
          }&type=${this.selectMerchantItem}${coordsCondition}`
        )
        .then(
          success => {
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
          },
          error => {
            scope.isLoading = false;
          }
        );
    },
    refreshMoreData(value) {
      this.updateCurrentPosition({
        longitude:
          (value && value.position && value.position.lng) ||
          this.currentPosition.longitude,
        latitude:
          (value && value.position && value.position.lat) ||
          this.currentPosition.latitude
      });
      const scope = this;
      const coordsCondition = `&lati=${this.currentPosition.latitude}&longi=${
        this.currentPosition.longitude
      }`;
      this.$http
        .get(
          `${this.appContextPath}appweb/branch/detail?pageSize=${
            this.pageSize
          }&pageNum=${++this.pageNum}&keyWord=${this.searchValue}&type=${
            this.selectMerchantItem
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
            this.isLoading = false;
          },
          error => {
            scope.isLoading = false;
          }
        );
    },
    invokenavigator(func) {
      this.isLoading = true;
      const scope = this;
      // if (this.isLocal) {
      //   func();
      //   return;
      // }
      initAMap().then(result => {
        if (result) {
          geolocation.getCurrentPosition();
          AMap.event.addListener(geolocation, "complete", func.bind(this)); //返回定位信息
          AMap.event.addListener(geolocation, "error", value => {
            if (
              this.currentPosition.latitude &&
              this.currentPosition.longitude
            ) {
              func({
                coords: {
                  longitude: this.currentPosition.longitude,
                  latitude: this.currentPosition.latitude
                }
              });
            } else {
              geolocationErrorCallback(value, scope.$vux.alert);
            }
            this.isLoading = false;
          }); //返回定位出错信息
        }
      });
      // const scope = this;
      // if (navigator.geolocation) {
      //   navigator.geolocation.getCurrentPosition(
      //     func.bind(this),
      //     value => {
      //       if (this.latitude && this.longitude) {
      //         func({
      //           coords: {
      //             longitude: this.longitude,
      //             latitude: this.latitude
      //           }
      //         });
      //       } else {
      //         geolocationErrorCallback(value, scope.$vux.alert);
      //       }
      //       this.isLoading = false;
      //     },
      //     geolocationOptions
      //   );
      // }
    },
    hideList() {
      // this.showRadioGroup = false;
      this.isShowList = true;
    },
    onFocus() {
      this.showMerchantGroup = false;
      this.showRegionGroup = false;
      this.showSortGroup = false;
      this.isShowList = false;
    },
    selectKeyWord($event) {
      this.searchValue = $event;
      this.refreshDataList();
    },
    setDefaultImg(event) {
      event.target.src = `${this.rootPath}static/default_img.jpg`;
    },
    queryMerchant(value) {
      this.selectMerchantItem = value;
      this.refreshDataList();
    },
    queryRegion(value) {
      this.selectRegionItem = value;
      this.refreshDataList();
    },
    querySort(value) {
      this.selectSortItem = value;
      this.refreshDataList();
    },
    openGroupRadio(type) {
      // this.groupRadioStyle.left = (33.33*type).toFixed(2) + '%';
      switch (type) {
        case 0:
          this.showMerchantGroup = !this.showMerchantGroup;
          this.showRegionGroup = false;
          this.showSortGroup = false;
          break;
        case 1:
          this.showRegionGroup = !this.showRegionGroup;
          this.showMerchantGroup = false;
          this.showSortGroup = false;
          break;
        case 2:
          this.showSortGroup = !this.showSortGroup;
          this.showMerchantGroup = false;
          this.showRegionGroup = false;
          break;
      }
    }
  },
  mounted() {
    this.invokenavigator(this.refreshDataList);
    this.updateTitle("附近网点");
    branchTypeList.then(result => {
      this.merchantOptions = this.regionOptions = this.branchTypeList = result.map(
        v => {
          return {
            name: v.className,
            value: v.classId
          };
        }
      );
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
  width: 50%;
  float: left;
  font-size: 1.4rem;
  padding: 10px 0;
  text-align: center;
  background-color: #ffffff;
}
/* .type-block:after {
  content: "|";
  float: right;
  color: #999999;
} */
.key-words-panel {
  display: inline-block;
  width: 100%;
}
.key-word {
  padding: 0.5rem;
  margin: 0.5rem;
  background: #999999;
}
p.content {
  font-size: 1.2rem;
  height: 2.5rem;
  width: 95%;
  margin-top: 0.5rem;
  overflow: hidden;
}
.search-type-radio {
  position: absolute;
  width: 50%;
  top: 70px;
  border-top: 0;
}
.search-type-radio:before {
  content: "";
  border-right: 90px solid transparent;
  border-bottom: 70px solid #999;
  border-left: 90px solid transparent;
}
</style>
