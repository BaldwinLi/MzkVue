<template>
  <div>
      <loading v-model="isLoading"></loading>
      <div id="mapContainer"></div>
  </div>
</template>

<script>
import { Loading } from "vux";
import { mapGetters, mapMutations } from "vuex";

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
    ...mapGetters(["appContextPath"])
  },
  methods: {
    refreshDataList(value) {
      this.longitude = (value && value.coords.longitude) || 0;
      this.latitude = (value && value.coords.latitude) || 0;
      this.isLoading = true;
      const scope = this;
      this.$http
        .get(
          `${this.appContextPath}appweb/allianceBusi/detail?id=${
            this.$route.params.id
          }&lati=${this.latitude}&longi=${this.longitude}`
        )
        .then(success => {
          scope.detail =
            (success &&
              success.data &&
              success.data.result &&
              success.data.result.detail) ||
            {};
          this.isLoading = false;
        });
    },
    ...mapMutations(["updateTitle"])
  },
  mounted() {
    const scope = this;
    if (navigator.geolocation) {
      const title = "地图加载失败";
      navigator.geolocation.getCurrentPosition(
        this.refreshDataList,
        value => {
          switch (value.code) {
            case 1:
              scope.$vux.alert.show({
                title,
                content: "坐标不得为空"
              });
              break;
            case 2:
              scope.$vux.alert.show({
                title,
                content: "暂时获取不到位置信息"
              });
              break;
            case 3:
              scope.$vux.alert.show({
                title,
                content: "获取信息超时"
              });
              break;
            case 4:
              scope.$vux.alert.show({
                title,
                content: "未知错误"
              });
              break;
          }
        },
        {
          enableHighAccuracy: true,
          maximumAge: 1000
        }
      );
    }
    this.refreshDataList();
    this.updateTitle("商家位置");
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
