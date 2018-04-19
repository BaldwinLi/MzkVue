<template>
  <div id="app">
    <!-- <x-header style="background-color:#0181ca;">
      {{title}}
      <a slot="right" @click="signIn">签到</a>
    </x-header> -->
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
