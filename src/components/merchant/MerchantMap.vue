<template>
  <div>
      <loading v-model="isLoading"></loading>
      <div id="merchant-map-container"></div>
  </div>
</template>

<script>
import { Loading } from "vux";
import { mapGetters, mapMutations } from "vuex";
import initBaiduMap from "@/initBaiduMap";
import { geolocationOptions, geolocationErrorCallback } from "../config";

export default {
  name: "MerchantMap",
  components: {
    Loading
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
    ...mapGetters(["appContextPath", 'isLocal'])
  },
  methods: {
    refreshDataList(value) {
      this.longitude = (value && value.coords.longitude) || 0;
      this.latitude = (value && value.coords.latitude) || 0;
      this.isLoading = true;
      const coordsCondition = this.isLocal
        ? ""
        : `&lati=${this.latitude}&longi=${this.longitude}`;
      const scope = this;
      this.$http
        .get(
          `${this.appContextPath}appweb/allianceBusi/detail?id=${
            this.$route.params.id
          }${coordsCondition}`
        )
        .then(success => {
          scope.detail =
            (success &&
              success.data &&
              success.data.result &&
              success.data.result.detail) ||
            {};
          this.renderBMap(
            scope.detail.distance,
            scope.detail.latitude,
            scope.detail.longitude
          );
          this.isLoading = false;
        });
    },
    renderBMap(distance, latitude, longitude) {
      initBaiduMap().then(result => {
        if (result) {
          const map = new BMap.Map("merchant-map-container");
          // 创建地图实例
          const point = new BMap.Point(latitude, longitude);
          // 创建点坐标
          map.centerAndZoom(point, distance);
        }
      });
    },
    ...mapMutations(["updateTitle"])
  },
  mounted() {
    this.updateTitle("商家位置");
    if (this.isLocal) {
      this.refreshDataList();
      return;
    }
    const scope = this;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this.refreshDataList,
        value => {
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
        },
        geolocationOptions
      );
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#merchant-map-container {
  height: 100%;
}
</style>
