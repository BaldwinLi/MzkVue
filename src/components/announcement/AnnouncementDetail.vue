<template>
  <div>
    <card>
      <div slot="header" class="weui-panel__hd" style="padding: 1.1rem 1.2rem 0.8rem;">
        <p class="header-text" style="text-align: center;">{{detail.title}}</p>
        <p v-if="detail.createTs" style= "font-size: 2.5rem; text-align: center; color: #999999;">{{detail.createTs | dateFormat}}</p>
      </div>
      <div slot="content" style="padding: 1.1rem 1.2rem 0.8rem; font-size: 3rem; color: #999999;" v-html="detail.content"></div>
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
  filters: {
    dateFormat: function(value) {
      const date = parseInt(dateFormat(new Date(value), "YYYYMMDD"));
      const today = parseInt(dateFormat(Date.now(), "YYYYMMDD"));
      if (date === today) return "今天 " + dateFormat(new Date(value), "hh:mm");
      else return dateFormat(new Date(value), "YYYY/MM/DD hh:mm");
    }
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
  margin: 0 0.9rem;
}
a {
  color: #42b983;
}
</style>
