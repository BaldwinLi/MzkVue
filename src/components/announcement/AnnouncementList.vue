<template>
  <div>
    <load-more  v-if="topLoading" :show-loading="topLoading" tip="加载中" background-color="#fbf9fe"></load-more>
    <scroller lock-x scrollbar-y @on-scroll="onCellsListScroll" @on-scroll-bottom="onScrollBottom" ref="scrollerEvent" :scroll-bottom-offset="-100">
      <div>
        <cell v-for="item in list" :key="item.id" primary="content" @click.native="goAnnouncementDetail($event, item)" is-link>
          <p slot="title" class="card-padding">{{ item.title }} <badge></badge></p>
          <p slot>{{ item.content }}</p>
        </cell>
        <load-more v-if="bottomLoading" :show-loading="bottomLoading" tip="加载更多" background-color="#fbf9fe"></load-more>
      </div>
    </scroller>
    
  </div>
</template>

<script>
import { Badge, Cell, Scroller, LoadMore } from "vux";
import { mapGetters } from "vuex";

export default {
  name: "AnnouncementList",
  components: {
    Badge,
    Cell,
    Scroller,
    LoadMore
  },
  data() {
    return {
      topLoading: false,
      bottomLoading: false,
      list: [
        {
          id: "1",
          title: `标题一`,
          content:
            "由各种物质组成的巨型球状天体，叫做星球。星球有一定的形状，有自己的运行轨道。"
        },
        {
          id: "2",
          title: "标题二",
          content:
            "由各种物质组成的巨型球状天体，叫做星球。星球有一定的形状，有自己的运行轨道。"
        },
        {
          id: "3",
          title: `标题一`,
          content:
            "由各种物质组成的巨型球状天体，叫做星球。星球有一定的形状，有自己的运行轨道。"
        },
        {
          id: "4",
          title: "标题二",
          content:
            "由各种物质组成的巨型球状天体，叫做星球。星球有一定的形状，有自己的运行轨道。"
        },
        {
          id: "5",
          title: `标题一`,
          content:
            "由各种物质组成的巨型球状天体，叫做星球。星球有一定的形状，有自己的运行轨道。"
        },
        {
          id: "6",
          title: "标题二",
          content:
            "由各种物质组成的巨型球状天体，叫做星球。星球有一定的形状，有自己的运行轨道。"
        },
        {
          id: "7",
          title: `标题一`,
          content:
            "由各种物质组成的巨型球状天体，叫做星球。星球有一定的形状，有自己的运行轨道。"
        },
        {
          id: "8",
          title: "标题二",
          content:
            "由各种物质组成的巨型球状天体，叫做星球。星球有一定的形状，有自己的运行轨道。"
        },
        {
          id: "9",
          title: `标题一`,
          content:
            "由各种物质组成的巨型球状天体，叫做星球。星球有一定的形状，有自己的运行轨道。"
        },
        {
          id: "10",
          title: "标题二",
          content:
            "由各种物质组成的巨型球状天体，叫做星球。星球有一定的形状，有自己的运行轨道。"
        },
        {
          id: "11",
          title: "标题二",
          content:
            "由各种物质组成的巨型球状天体，叫做星球。星球有一定的形状，有自己的运行轨道。"
        },
        {
          id: "12",
          title: `标题一`,
          content:
            "由各种物质组成的巨型球状天体，叫做星球。星球有一定的形状，有自己的运行轨道。"
        },
        {
          id: "13",
          title: "标题二",
          content:
            "由各种物质组成的巨型球状天体，叫做星球。星球有一定的形状，有自己的运行轨道。"
        }
      ]
    };
  },
  computed: {
    ...mapGetters([
            'appContextPath',
            'isLocal'
        ])
  },
  methods: {
    onCellsListScroll(event) {
      const scope = this;
      if (event.top < this.$refs["scrollerEvent"].$el.clientTop - 100) {
        this.topLoading = true;
        setTimeout(() => {
          scope.topLoading = false;
        }, 1000);
      }
    },
    onScrollBottom() {
      const scope = this;
      this.bottomLoading = true;
      setTimeout(() => {
        scope.bottomLoading = false;
      }, 1000);
    },
    goAnnouncementDetail(event, item) {
      this.$router.push({ path: `/announcementDetail/${item.id}` });
    }
  },
  mounted() {
    const scope = this;
    this.$http.get(`${this.appContextPath}appweb/bulletin/list?pageSize=2&pageNum=2`)
    .then(
      success => {
        scope.list = success.list;
      }
    );
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.card-padding {
  padding: 15px;
}
</style>
