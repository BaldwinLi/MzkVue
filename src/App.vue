<template>
  <div id="app">
    <x-header style="background-color:#0181ca;">
      {{title}}
      <a slot="right" @click="signIn">签到</a>
    </x-header>
    <loading v-model="isLoading"></loading>
    <router-view></router-view>
  </div>
</template>

<script>
import { Loading, XHeader } from "vux";
import { mapState, mapGetters, mapMutations } from "vuex";

export default {
  name: "app",
  components: {
    Loading,
    XHeader
  },
  data() {
    return {};
  },
  methods: {
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
    ...mapMutations(["updateLoadingStatus"])
  },
  computed: {
    ...mapState({
      isLoading: state => state.isLoading,
      title: state => state.title
    }),
    ...mapGetters(["appContextPath"])
  }
};
</script>

<style lang="less">
@import "~vux/src/styles/reset.less";

body {
  background-color: #fbf9fe;
}
</style>
