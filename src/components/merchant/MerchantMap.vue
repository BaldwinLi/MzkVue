<template>
  <div>
      <loading v-model="isLoading"></loading>
      <card style="margin-bottom: 6rem;">
        <div slot="footer" id="map-container"></div>
      </card>
  </div>
</template>

<script>
import { Loading, Card } from "vux";
import { mapGetters, mapMutations } from "vuex";
import initAMap from "@/initAMap";
import { geolocationOptions, geolocationErrorCallback } from "../config";

export default {
  name: "MerchantMap",
  components: {
    Loading,
    Card
  },
  data() {
    return {
      longitude: 0,
      latitude: 0,
      detail: {},
      isLoading: false
    };
  },
  computed: {
    ...mapGetters(["appContextPath", "isLocal"])
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
        });
    },
    renderAMap(distance, latitude, longitude) {
      initAMap().then(result => {
        // if (result) {
        //   const map = new BMap.Map("merchant-map-container");
        //   // 创建地图实例
        //   const point = new BMap.Point(latitude, longitude);
        //   // 创建点坐标
        //   map.centerAndZoom(point, distance);
        // }
      });
    },
    ...mapMutations(["updateTitle"])
  },
  mounted() {
    this.updateTitle("商家位置");
    this.refreshDataDetail();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#merchant-map-container {
  height: 100%;
}
</style>
