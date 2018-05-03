<template>
  <div>
      <loading v-model="isLoading"></loading>
      <card style="margin-bottom: 6rem;">
        <div slot="header">
          <cell primary="content">
            <img slot="title"
                 style="height: 9rem; width: 9rem; border: 1px solid #999999;"
                 :src="detail.logoUrl" class="card-padding"
                 @error="setDefaultImg">
            <div style="text-align: left;height: 10rem; margin: 1rem;" slot>
              <p class="header-text" style="width: 85%;font-size:1.5rem;">
                {{detail.name}}
              </p>
              <p class="apostrophe content">
                {{ detail.address }}
              </p>
              <p class="apostrophe content">
                距您{{detail.distance/1000}}km
              </p>
            </div>
          </cell>
          <cell primary="content" @click.native="callPhone(detail.tel)">
            <div class="tel-phone-block" style="text-align: left;height: 2rem; width: 85%; margin: 1rem;overflow: hidden;" slot="title">
              <p class="apostrophe" style="width: 28rem;font-size:1.5rem; color: #999999">
                商户电话： {{detail.tel}}
              </p>
            </div>
            <i class="fa fa-phone icon-preffix" style="font-size: 2rem;" aria-hidden="true" slot></i>
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

export default {
  name: "BranchMap",
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
        overflow: "hidden"
      },
      showOpenDescrb: true
    };
  },
  computed: {
    ...mapGetters(["appContextPath", "rootPath"])
  },
  methods: {
    ...mapMutations(["updateTitle"]),
    renderAMap(distance, latitude, longitude) {
      initAMap().then(result => {
        // if (result) {
        //   const map = new BMap.Map("branch-map-container");
        //   // 创建地图实例
        //   const point = new BMap.Point(latitude, longitude);
        //   // 创建点坐标
        //   map.centerAndZoom(point, distance);
        // }
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
    }
  },
  mounted() {
    const scope = this;
    // this.renderAMap(11, 116.404, 39.915);
    this.isLoading = true;
    this.$http
      .get(
        `${this.appContextPath}appweb/branch/detail?id=${this.$route.params.id}`
      )
      .then(success => {
        scope.detail =
          (success &&
            success.data &&
            success.data.result &&
            success.data.result.detail) ||
          {};
        this.renderAMap(
          scope.detail.distance,
          scope.detail.latitude,
          scope.detail.longitude
        );
        this.isLoading = false;
      });
    this.updateTitle("网点位置");
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#branch-map-container {
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
  border-right: 1px solid #999999;
}
.address-block {
  border-left: 1px solid #999999;
}
a.open-switch {
  position: absolute;
  right: 1.2rem;
  bottom: 1rem;
  font-size: 1.1rem;
  color: #00bfff;
  background: #fff;
}
</style>
