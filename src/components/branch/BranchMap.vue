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
  name: "BranchMap",
  components: {
    Loading
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
    ...mapMutations(["updateTitle"])
  },
  mounted() {
    const scope = this;
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
        this.isLoading = false;
      });
    this.updateTitle("网点位置");
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
