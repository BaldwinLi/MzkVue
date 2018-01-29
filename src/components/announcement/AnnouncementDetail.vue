<template>
  <div v-html="detail">
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: 'AnnouncementDetail',
  data () {
    return {
      detail: `<h1>未找到数据</h1>`
    }
  },
  computed: {
      ...mapGetters([
          'appContextPath'
      ])
  },
  mounted() {
    const scope = this;
    this.$http.get(`${this.appContextPath}appweb/bulletin/detail?id=${this.$route.params.id}`)
    .then(
      success => {
        scope.detail = success.detail.content;
      }
    );
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
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
