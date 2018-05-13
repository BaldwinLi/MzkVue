<template>
  <div>
    <search
      style="position: static"
      v-model="searchValue"
      position="relative"
      placeholder="搜商品"
      auto-scroll-to-top
      top="0"
      @on-focus="onFocus"
      @on-cancel="hideList"
      @on-submit="refreshDataList"
      ref="search">
      <!-- cancel-text="搜索" -->
      <!-- <i slot="left" @click="hideList" class="fa fa-angle-left" style="font-size: 2.5rem; margin-right: 1rem;" aria-hidden="true"></i> -->
    </search>
      <!-- :results="results"
      @result-click="resultClick"
      @on-change="getResult"
      @on-submit="onSubmit" -->
    <grid style="width: 102%;" v-if="!isShowList">
      <cell class="type-block" @click.native="openGroupRadio(0)">
        <div slot="title">商户分类&nbsp;<i class="fa fa-chevron-down" aria-hidden="true"></i></div>
      </cell>
      <cell class="type-block" @click.native="openGroupRadio(1)">
        <div slot="title">智能排序&nbsp;<i class="fa fa-chevron-down" aria-hidden="true"></i></div>
      </cell>
      <card v-for="(item, index) in recommodKeywordList" :key="index" :header="{ title: item.name}" class="key-words-panel">
        <div slot="content">
          <badge class="key-word" v-for="(item, index) in item.keywords" :key="index" :text="item" @click.native="selectKeyWord(item)"></badge>
        </div>
      </card>
    </grid>
    
    <load-more v-if="list.length === 0" :show-loading="false" :tip="'暂无数据'" background-color="#fbf9fe"></load-more>
    <x-button v-if="isShowList && list.length > 0" class="sign-in"  @click.native="signIn">签到</x-button>
    <!-- <a v-if="isShowList && list.length > 0" class="sign-in" @click="signIn">签到</a> -->
    <group style="top: 4rem;" v-if="isShowList && list.length > 0" title="积分兑换商品列表">
      <scroller :lock-x=true 
                :scrollbar-y=true
                :pulldown-config="pulldownConfig" 
                :pullup-config="pullupConfig"
                ref="scrollerEvent"
                height="-60"
                :use-pulldown=true 
                :use-pullup="enablePullup"
                @on-pulldown-loading="refreshDataList" 
                @on-pullup-loading="refreshMoreData">
        <div>
          <flexbox :gutter="0" wrap="wrap">
            <flexbox-item :span="1/2" v-for="item in list" :key="item.id">
              <card @click.native="goCommodityOrder(item.id)">
                <div slot="header">
                  <img :src="item.picUrl" style="width: 90%;height: 11rem;display:block;margin: 5%;border: 1px solid #999999;" @error="setDefaultImg">
                </div>
                <div slot="content" class="card-padding">
                  <span>
                    <div style="width: 55%;float: left;font-size: 1.5rem;height: 2rem;overflow: hidden">{{item.name}}</div>
                    <div style="color:#FF0000; width: 45%; display: inline-block; text-align: right;">
                      {{item.pointCost}}
                      <i style="font-size:1.05rem;color: #999999">积分</i>
                    </div>
                  </span>
                  <!-- <p style="font-size:10px;line-height:1 ;color:#999;">{{item.description}}</p> -->
                  <span style="font-size:1rem;color:#999999;">
                    <div style="width: 70%;float: left;">参考价格：¥ {{item.price}}</div>
                    <div style="width: 30%; float: left; text-align: right;">
                     库存：{{item.stockCount}}
                    </div>
                  </span>
                </div>
              </card>
            </flexbox-item>
          </flexbox>
          <!-- <load-more v-if="bottomLoading" :show-loading="bottomLoading" tip="加载更多" background-color="#fbf9fe"></load-more> -->
        </div>
      </scroller>
    </group>
    <group v-show="showRadioGroup" :style="groupRadioStyle" class="search-type-radio" gutter="0">
      <radio :options="radioOptions.map(v=>v.value)" @on-change="refreshDataList" v-model="selectTypeItem">
        <p style="font-size: 1.5rem;" slot-scope="props" slot="each-item">{{radioOptions.map(v=>v.name)[props.index]}}</p>
      </radio>
    </group>
  </div>
</template>

<script>
import {
  Flexbox,
  FlexboxItem,
  Card,
  LoadMore,
  Scroller,
  Group,
  XButton,
  Grid,
  Cell,
  Search,
  Radio,
  Badge
} from "vux";
import {
  commodityTypeList,
  autoSortList,
  recommodKeywordList
} from "../../initKeyList";
import { mapState, mapGetters, mapMutations } from "vuex";
import { pulldownConfig, pullupConfig } from "../config";

export default {
  name: "CommodityList",
  components: {
    Flexbox,
    FlexboxItem,
    Card,
    XButton,
    LoadMore,
    Scroller,
    Cell,
    Group,
    Grid,
    Search,
    Radio,
    Badge
  },
  data() {
    return {
      pageNum: 1,
      pageSize: 15,
      pulldownConfig,
      pullupConfig,
      // topLoading: false,
      // bottomLoading: false,
      searchValue: "",
      selectTypeItem: "",
      showRadioGroup: false,
      groupRadioStyle: {
        left: 0
      },
      // results: [],
      isShowList: true,
      // topLoading: false,
      // bottomLoading: false,
      list: [],
      recommodKeywordList: recommodKeywordList,
      commodityTypeList: [],
      autoSortList: autoSortList.filter(e => e.value !== 2),
      radioOptions: [],
      enablePullup: false
    };
  },
  computed: {
    ...mapGetters(["appContextPath", "rootPath"]),
    ...mapState(["isLoading"])
  },
  methods: {
    ...mapMutations(["updateTitle", "updateLoadingStatus"]),
    signIn(event) {
      const scope = this;
      this.updateLoadingStatus({ isLoading: true });
      this.$http.get(`${this.appContextPath}appweb/pointExchange/signIn`).then(
        success => {
          // if (success && success.data && success.data.status === "OK") {
          scope.$vux.alert.show({
            content: (success && success.data && success.data.result) || ""
          });
          // }
          scope.updateLoadingStatus({ isLoading: false });
        },
        error => {
          if (error && error.data && error.data.status === "FAIL") {
            scope.$vux.alert.show({
              content: (error && error.data && error.data.result) || ""
            });
          }
          scope.updateLoadingStatus({ isLoading: false });
        }
      );
    },
    refreshDataList() {
      this.showRadioGroup = false;
      this.updateLoadingStatus({ isLoading: true });
      this.isShowList = true;
      const scope = this;
      this.$http
        .get(
          `${
            this.appContextPath
          }appweb/pointExchange/listItem?pageSize=15&pageNum=1&keyWord=${
            this.searchValue
          }&type=${this.selectTypeItem}`
        )
        .then(
          success => {
            scope.list =
              (success &&
                success.data &&
                success.data.result &&
                success.data.result.list) ||
              [];
            if (scope.list.length === 15) {
              scope.enablePullup = true;
            }
            if (scope.$refs.scrollerEvent) {
              scope.$refs.scrollerEvent.donePulldown();
              scope.$refs.scrollerEvent.reset({ top: 0 });
            }
            scope.updateLoadingStatus({ isLoading: false });
          },
          error => {
            scope.updateLoadingStatus({ isLoading: false });
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
          }appweb/pointExchange/listItem?pageSize=15&pageNum=${++this
            .pageNum}&keyWord=${this.searchValue}&type=${
            this.selectTypeItem
          }`
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
            scope.$refs.scrollerEvent.reset({ bottom: 0 });
          }
        });
    },
    goCommodityOrder(id) {
      this.$router.push({ path: `/commodity_order/${id}` });
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
    setDefaultImg(event) {
      event.target.src = `${this.rootPath}static/default_img.jpg`;
    },
    openGroupRadio(type) {
      this.groupRadioStyle.left = (50*type).toFixed(2) + '%';
      switch(type) {
        case 0:
          this.radioOptions = this.commodityTypeList;
          break;
        case 1:
          this.radioOptions = this.autoSortList;
          break;
      }
      this.showRadioGroup = !this.showRadioGroup;
    }
  },
  mounted() {
    this.refreshDataList();
    this.updateTitle("积分兑换商城");
    commodityTypeList.then(result => {
      this.radioOptions = this.commodityTypeList = result.map(v => {
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
  height: 4rem;
}
.sign-in {
  float: right;
  line-height: 2.5rem;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  color: #fff;
  background-color: #00BFFF;
  font-size: 1.4rem;
  width: 6rem;
  margin: 0.55rem;
}
.type-block {
  width: 50%;
  float: left;
  font-size: 1.4rem;
  padding: 10px 0;
  text-align: center;
  background-color: #FFFFFF;
}
.type-block:after {
  content: "|";
  float: right;
  /* margin-top: -3.2rem; */
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
.search-type-radio {
  position: absolute;
  width: 30%;
  top: 80px;
  border: 1px solid #d3d3d3;
  border-top: 0;
}
</style>
