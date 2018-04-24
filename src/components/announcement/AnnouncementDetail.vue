<template>
  <div>
    <card :header="{title: detail.title || '' }" :footer="{title: detail.createTs ? ('发布时间：' + dateFormat(detail.createTs)) : ''}">
      <div slot="content" v-html="detail.content"></div>
    </card>
      <loading v-model="isLoading"></loading>
  </div>
</template>

<script>
import { Loading, Card, dateFormat } from "vux";
import { mapGetters, mapMutations } from "vuex";

export default {
  name: "AnnouncementDetail",
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
    dateFormat: function(value) {
      return dateFormat(new Date(value), "YYYY-MM-DD");
    }
  },
  mounted() {
    const scope = this;
    this.isLoading = true;
    this.$http
      .get(
        `${this.appContextPath}appweb/bulletin/detail?id=${
          this.$route.params.id
        }`
      )
      .then(success => {
        scope.detail = (success &&
          success.data &&
          success.data.result &&
          success.data.result.detail &&
          success.data.result.detail) || {
          content: `<p style="text-align: center">暂无数据</p>`
        };
        this.isLoading = false;
      });
    this.updateTitle("公告详情");
  }
};
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
