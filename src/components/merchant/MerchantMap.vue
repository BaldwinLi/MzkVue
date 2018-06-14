<template>
  <div class="blank-page">
      <loading v-model="isLoading"></loading>
      <card style="margin-bottom: 6rem;">
        <div slot="header">
          <cell primary="content">
            <img slot="title"
                 style="height: 9rem; width: 9rem; border: 1px solid #999999;"
                 :src="detail.logoUrl" class="card-padding"
                 @error="setDefaultImg">
            <div style="text-align: left;height: 10rem; margin: 1rem;" slot>
              <p class="header-text" style="width: max-content;">
                {{detail.name}}
              </p>
              <p class="apostrophe content">
                {{ detail.address }}
              </p>
              <p class="apostrophe content">
                距您{{detail.distance}}km
              </p>
            </div>
          </cell>
          <cell primary="content" @click.native="callPhone(detail.tel)">
            <i class="fa fa-phone icon-preffix" style="font-size: 2rem;" aria-hidden="true" slot="title"></i>
            <div class="tel-phone-block" style="text-align: left;height: 2rem; margin: 1rem;overflow: hidden;" slot>
              <p class="apostrophe" style="margin-left: 2rem; font-size:1.5rem; color: #999999">
                商户电话： {{detail.tel}}
              </p>
            </div>
          </cell>
          <cell primary="content">
            <load-more :show-loading="false" :tip="'商家详情'" background-color="#fbf9fe"></load-more>
            <div :style="descrbStyle" v-html="detail.description"></div>
            <a v-if="showOpenDescrb" class="open-switch" @click="toggleDescription(true)">...展开</a>
            <a v-if="!showOpenDescrb" class="open-switch" @click="toggleDescription(false)">收起</a>
          </cell>
          <cell primary="content">
            <i class="fa fa-map-marker icon-preffix" style="font-size: 3rem; margin-right: 3rem; margin-left: 3rem;" aria-hidden="true" slot="title"></i>
            <div class="address-block" style="text-align: left;height: 2rem; width: 85%; margin: 1rem;overflow: hidden;" slot>
              <p class="apostrophe" style="margin-left: 2rem; font-size: 1.5rem; color: #999999;">
                {{detail.address}}
              </p>
              <p style="font-size: 1.2rem; margin-top: 0.5rem; margin-left: 2rem;">
                距您{{detail.distance/1000}}km
              </p>
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
      showOpenDescrb: true
    };
  },
  computed: {
    ...mapGetters(["appContextPath", "isLocal", "rootPath"])
  },
  methods: {
    refreshDataDetail() {
      this.isLoading = true;
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
      window.location.href = 'tel:' + event;
    },
    ...mapMutations(["updateTitle"])
  },
  mounted() {
    this.updateTitle("商家详情");
    this.refreshDataDetail();
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
  height: 2rem;
  width: 95%;
  margin-top: 0.5rem;
  overflow: hidden;
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
</style>
