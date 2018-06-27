<template>
  <div class="blank-page">
      <loading v-model="isLoading"></loading>
      <card style="margin-bottom: 6rem;">
        <div slot="header" class="detail-header">
          <cell primary="content">
            <!-- <img slot="title"
                 style="height: 9rem; width: 9rem; border: 1px solid #999999;"
                 :src="detail.logoUrl||'unknownUrl'" class="card-padding"
                 @error="setDefaultImg"> -->
            <div style="height: 9rem; width: 9rem; text-align: center; line-height: 11rem; border: 1px solid #999;" slot="title">
                <img 
                 style="max-height: -webkit-fill-available; max-width: -webkit-fill-available;"
                 :src="detail.logoUrl||'unknownUrl'" class="card-padding"
                 @error="setDefaultImg">
            </div>
            <div style="text-align: left;height: auto; margin: 1rem;" slot>
              <!-- <p class="header-text" style="width: max-content;">{{allianceBusiTypeList.find(e=>(detail.type == e.value)) && ((allianceBusiTypeList.find(e=>(detail.type == e.value)).name || '')) | trunceStr}}</p> -->
              <p class="header-text" style="font-size: 1.3rem;">
                {{detail.name}}
              </p>
              <p class="apostrophe content">
                {{ detail.address }}
              </p>
              <p class="apostrophe content">
                距您{{detail.distance}}km
              </p>
            </div>
            <div v-for="(item, index) in detail.tel && detail.tel.split(' ')" :key="index">
              <cell primary="content" @click.native="callPhone(item)">
                <i class="fa fa-phone icon-preffix" style="font-size: 2rem; margin:0" aria-hidden="true" slot="title"></i>
                <div class="tel-phone-block" style="text-align: left; margin: 1rem; overflow: visible;" slot>
                  <p class="apostrophe" style="margin-left: 2rem; font-size:1.2rem; color: #999999; word-break: break-word;">
                    {{item || "暂无电话"}}
                  </p>
                </div>
              </cell>
            </div>
            
          </cell>
          
          <!-- <cell primary="content">
            <load-more :show-loading="false" :tip="'商家详情'" background-color="#fbf9fe"></load-more>
            <div :style="descrbStyle" v-html="detail.description"></div>
            <a v-if="showOpenDescrb" class="open-switch" @click="toggleDescription(true)">...展开</a>
            <a v-if="!showOpenDescrb" class="open-switch" @click="toggleDescription(false)">收起</a>
          </cell> -->
          <cell primary="content">
            <i class="fa fa-map-marker icon-preffix" style="font-size: 3rem; margin-right: 1rem; margin-left: 1rem;" aria-hidden="true" slot="title"></i>
            <div class="address-block" style="text-align: left; width: 85%;" slot>
              <p class="apostrophe" style="margin-left: 2rem; font-size: 1.2rem; color: rgb(153, 153, 153);">
                {{detail.address}}
              </p>
              <!-- <p style="font-size: 1.2rem; margin-top: 0.5rem; margin-left: 2rem;">
                距您{{detail.distance/1000}}km
              </p> -->
            </div>
          </cell>
        </div>
        <div slot="footer" id="map-container"></div>
      </card>
  </div>
</template>

<script>
import { Loading, Card, Cell, LoadMore } from "vux";
import { mapGetters, mapMutations } from "vuex";
import initAMap from "@/initAMap";
import { markerMap } from "@/initAMap";
import { geolocationOptions, geolocationErrorCallback } from "../config";
import {
  allianceBusiTypeList
} from "../../initKeyList";

export default {
  name: "MerchantMap",
  components: {
    Loading,
    Card,
    Cell,
    LoadMore
  },
  data() {
    return {
      detail: {},
      isLoading: false,
      descrbStyle: {
        "max-height": "6.5rem",
        overflow: "hidden",
        "text-align": "left"
      },
      showOpenDescrb: true,
      allianceBusiTypeList: []
    };
  },
  computed: {
    ...mapGetters(["appContextPath", "isLocal", "rootPath"])
  },
  filters: {
    trunceStr(value) {
      if(!!value && value.length >= 13) {
        return value.substring(0, 12) + '...'
      } else {
        return value;
      }
    }
  },
  methods: {
    refreshDataDetail() {
      const scope = this;
      this.$http
        .get(
          `${this.appContextPath}appweb/allianceBusi/detail?id=${
            this.$route.params.id
          }`
        )
        .then(success => {
          scope.detail =
            (success &&
              success.data &&
              success.data.result &&
              success.data.result.detail) ||
            {};
          scope.renderAMap(
            scope.detail.distance,
            scope.detail.latitude,
            scope.detail.longitude
          );
          scope.isLoading = false;
          // scope.detail.description =
          //   "我怎么知道4我怎么知道4我怎么知道4我怎么知道4我怎么知道4我怎么知道4我怎么知道4我怎么知道4我怎么知道4我怎么知道4我怎么知道4我怎么知道4我怎么知道4我怎么知道4我怎么知道4我怎么知道4我怎么知道4我怎么知道4我怎么知道4我怎么知道4我怎么知道4我怎么知道4我怎么知道4我怎么知道4我怎么知道4我怎么知道4我怎么知道4我怎么知道4我怎么知道4我怎么知道4我怎么知道4我怎么知道4我怎么知道4我怎么知道4我怎么知道4我怎么知道4我怎么知道4我怎么知道4我怎么知道4我怎么知道4我怎么知道4我怎么知道4我怎么知道4我怎么知道4我怎么知道4我怎么知道4我怎么知道4我怎么知道4我怎么知道4我怎么知道4我怎么知道4我怎么知道4我怎么知道4我怎么知道4我怎么知道4我怎么知道4我怎么知道4我怎么知道4我怎么知道4我怎么知道4我怎么知道4我怎么知道4我怎么知道4我怎么知道4我怎么知道4我怎么知道4我怎么知道4我怎么知道4我怎么知道4我怎么知道4";
        });
    },
    renderAMap(distance, latitude, longitude) {
      initAMap().then(result => {
        this.detail.distance = markerMap(this.detail.name, longitude, latitude);
        $('#map-container').height($('body').height() - $('.detail-header').height());
      });
    },
    toggleDescription(event) {
      this.descrbStyle["max-height"] = event ? "100%" : "6.5rem";
      this.showOpenDescrb = !event;
    },
    setDefaultImg(event) {
      event.target.src = `${this.rootPath}static/default_img.jpg`;
    },
    callPhone(event) {
      window.location.href = "tel:" + event;
    },
    ...mapMutations(["updateTitle"])
  },
  mounted() {
    this.updateTitle("商家详情");
    this.isLoading = true;
    allianceBusiTypeList.then(result => {
      this.refreshDataDetail();
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
#merchant-map-container {
  height: 100%;
}
p.content {
  font-size: 1.2rem;
  /* height: 2rem; */
  width: 95%;
  margin-top: 0.5rem;
  /* overflow: hidden; */
}
.tel-phone-block {
  border-left: 1px solid #999999;
}
.address-block {
  border-left: 1px solid #999999;
}
a.open-switch {
  position: absolute;
  right: 1.2rem;
  bottom: 0;
  font-size: 1.1rem;
  color: #00bfff;
  background: #fff;
}
.weui-cell {
  padding: 0 15px;
  position: relative;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
}
#map-container {
  overflow: hidden;
  position: relative;
  z-index: 0;
  background-color: rgb(243, 241, 236);
  color: rgb(0, 0, 0);
  text-align: left;
  height: 45rem;
}
</style>
