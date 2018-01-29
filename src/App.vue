<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
// import { mapGetters } from "vuex";
export default {
  name: "app"
  // computed: {
  //   ...mapGetters(["appContextPath"])
  // }
};
</script>

<style lang="less">
@import "~vux/src/styles/reset.less";

body {
  background-color: #fbf9fe;
}
</style>
