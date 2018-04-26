<template>
  <div>
    <card>
      <div slot="header" class="weui-panel__hd" style="padding: 0.55rem 0.6rem 0.4rem;">
        <p class="header-text" style="text-align: center;">{{detail.title}}</p>
        <p v-if="detail.createTs" style= "font-size: 1.2rem; text-align: center; color: #999999;">{{detail.createTs | dateFormat}}</p>
      </div>
      <div slot="content" style="padding: 0.6rem 0.55rem 0.4rem; font-size: 1.5rem; color: #999999;" v-html="detail.content"></div>
      <div slot="footer" style="padding: 0.6rem 0.55rem 0.4rem; font-size: 1.6rem;">
        <div class="footer-inscribe" style="color: #999999;">
          <p class="footer-text" style="margin-top: 3rem;">大连明珠卡公司</p>
          <p class="footer-text">{{detail.createTs | dateFormat}}</p>
        </div>
      </div>
    </card>
      <loading v-model="isLoading"></loading>
  </div>
</template>

<script>
import { Loading, Card, dateFormat } from "vux";
import { mapGetters, mapMutations } from "vuex";
// import { announcementDetail } from "../../mock/mockData";

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
      // const date = parseInt(dateFormat(new Date(value), "YYYYMMDD"));
      // const today = parseInt(dateFormat(Date.now(), "YYYYMMDD"));
      // if (date === today) return "今天 " + dateFormat(new Date(value), "hh:mm");
      // else
      return dateFormat(new Date(value), "YYYY/MM/DD");
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
      .then(
        success => {
          scope.detail = (success &&
            success.data &&
            success.data.result &&
            success.data.result.detail &&
            success.data.result.detail) || {
            content: `<p style="text-align: center">暂无数据</p>`
          };
          this.updateTitle(scope.detail.title);
          this.isLoading = false;
        }
        // error => {
        //   scope.detail = (announcementDetail &&
        //     announcementDetail.result &&
        //     announcementDetail.result.detail) || {
        //     content: `<p style="text-align: center">暂无数据</p>`
        //   };
        //   this.updateTitle(scope.detail.title);
        //   this.isLoading = false;
        // }
      );
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
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
  margin: 0 0.45rem;
}
a {
  color: #42b983;
}

.footer-text {
  margin: 0 1rem 0 4rem;;
}
</style>
