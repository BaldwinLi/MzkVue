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

export default {
  name: "BranchMap",
  components: {
    Loading,
    Card
  },
  data() {
    return {
      detail: {},
      isLoading: false
    };
  },
  computed: {
    ...mapGetters(["appContextPath"])
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
        this.renderAMap(scope.detail.distance, scope.detail.latitude, scope.detail.longitude);
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
</style>
