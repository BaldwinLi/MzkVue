<template>
    <div>
        <loading v-model="isLoading"></loading>
        <card>
            <img slot="header" :src="detail.picUrl" style="width:100%;display:block;">
            <div slot="content" class="card-padding">
                <div>
                    <i class="fa fa-map-marker" style="float: left;margin-top: 12px;"></i>
                    <x-input title="邮寄地址" v-model="detail.address"></x-input>
                </div>
                <p class="card-padding" style="font-size:18px;">{{detail.name}}</p>
                <p class="card-padding" style="font-size:14px;line-height:1 ;color:#999;">{{detail.description}}</p>
                <p class="card-padding" style="font-size:16px;color:#FF0000;">¥ {{detail.price}}</p>
                <!-- <x-address title="请选择地址" @on-hide="selectedAddress" v-model="detail.address" :list="addressData" placeholder="请选择地址">
                    <template slot="title" slot-scope="props">
                        <span style="vertical-align:middle;"><i class="fa fa-map-marker"></i> 邮寄地址</span>
                    </template>
                </x-address> -->
            </div>
            <div slot="footer">
                <x-button @click.native="submit" style="background: #FF6347; color: #fff">确认下单</x-button>
            </div>
        </card>
        <!-- <div v-transfer-dom>
            <alert v-model="show2" :title="$t('Congratulations')" :content="$t('Your Message is sent successfully~')"></alert>
        </div> -->
  </div>
</template>

<script>
import {
  Loading,
  Card,
  XButton,
  XInput,
  ChinaAddressV4Data
  //   AlertModule,
  //   Alert
  //   TransferDomDirective as TransferDom
} from "vux";
import { mapGetters } from "vuex";

export default {
  name: "CommodityDetail",
  //   directives: {
  //     TransferDom
  //   },
  components: {
    Loading,
    Card,
    XButton,
    // XAddress
    XInput
    // Alert
  },
  data() {
    return {
      detail: {},
      isLoading: false,
      addressData: ChinaAddressV4Data
    };
  },
  computed: {
    ...mapGetters(["appContextPath"])
  },
  methods: {
    selectedAddress(str) {},
    submit() {
      if (!this.detail.address) {
        this.$vux.alert.show({
          title: "提交失败",
          content: "请输入您的邮寄地址。"
        });
        return;
      }
    }
  },
  mounted() {
    const scope = this;
    this.isLoading = true;
    this.$http
      .get(
        `${this.appContextPath}appweb/pointExchange/detailItem?id=${
          this.$route.params.id
        }`
      )
      .then(success => {
        scope.detail =
          (success &&
            success.data &&
            success.data.result &&
            success.data.result.detail) ||
          "无数据";
        this.isLoading = false;
      });
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.card-padding {
  padding: 15px;
}
</style>
