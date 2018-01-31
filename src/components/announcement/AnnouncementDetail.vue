<template>
  <div v-html="detail">
      <loading v-model="isLoading"></loading>
  </div>
</template>

<script>
import {Loading} from 'vux';
import { mapGetters } from "vuex";

export default {
  name: 'AnnouncementDetail',
  components: {
      Loading
  },
  data () {
    return {
      detail: {},
      isLoading: false
    }
  },
  computed: {
      ...mapGetters([
          'appContextPath'
      ])
  },
  mounted() {
    const scope = this;
    this.isLoading = true;
    this.$http.get(`${this.appContextPath}appweb/bulletin/detail?id=${this.$route.params.id}`)
    .then(
      success => {
        scope.detail = (success &&
          success.data &&
          success.data.result &&
          success.data.result.detail &&
          success.data.result.detail.content) || {
          content: "无数据"
        };
        this.isLoading = false;
      }
    );
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
