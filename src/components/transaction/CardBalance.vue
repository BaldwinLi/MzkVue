<template>
  <div class="blank-page">
    <group>
      <x-input title="卡号" ref="cardNo" placeholder="请输入明珠卡号" type="number" :min="12" :max="12" text-align="right" v-model="cardNo"></x-input>
      <div style="height: 16rem; background-color: rgb(251, 249, 254)">
        <box gap="2rem 2rem">
          <divider style="color: #999; font-size: 1rem;">
            <i style="color:#FF0000;">注：</i>请输入12位卡号后点击查询，请不要输入空格或其他符号
          </divider>
          <x-button @click.native="searchBalance" class="search-balance">余额查询</x-button>
          <x-button @click.native="goToDetail" class="search-details">明细查询</x-button>
        </box>
      </div>
      <cell title="余额账户（元）">
        <div style="color: #FF0000; font-size: 2rem;">{{balance | moneyFormat}}</div>
      </cell>
    </group>
  </div>
</template>

<script>
import {
  XInput,
  Cell,
  Group,
  XButton,
  Box,
  Divider,
  numberComma
} from "vux";
import { mapGetters, mapMutations } from "vuex";

export default {
  name: "CardBalance",
  components: {
    XInput,
    Group,
    Cell,
    XButton,
    Box,
    Divider
  },
  data() {
    return {
      cardNo: "",
      balance: 0
    };
  },
  computed: {
    ...mapGetters(["appContextPath"])
  },
  filters: {
    moneyFormat: function(value) {
      const count = parseFloat(value).toFixed(2);
      return "¥ " + numberComma(count);
    }
  },
  methods: {
    searchBalance() {
      if (this.$refs.cardNo.hasErrors) {
        this.$vux.alert.show({
          title: "卡号有误",
          content: this.$refs.cardNo.errors.min || this.$refs.cardNo.errors.max
        });
        return;
      }
      const scope = this;
      this.updateLoadingStatus({ isLoading: true });
      this.$http
        .get(
          `${this.appContextPath}appweb/cardQuery/balance?cardNo=${this.cardNo}`
        )
        .then(success => {
          scope.balance =
            (success &&
              success.data &&
              success.data.result &&
              success.data.result.balance) ||
            0;
          // if (scope.balance) scope.balance = "¥ " + scope.balance;
          // else scope.balance = "无数据";
          this.updateLoadingStatus({ isLoading: false });
        });
    },
    goToDetail() {
      if (this.$refs.cardNo.hasErrors) {
        this.$vux.alert.show({
          title: "卡号有误",
          content: this.$refs.cardNo.errors.min || this.$refs.cardNo.errors.max
        });
        return;
      }
      this.$router.push({
        path: `/transaction_history`,
        query: {
          cardNo: this.cardNo
        }
      });
    },
    ...mapMutations(["updateTitle", "updateLoadingStatus"])
  },
  mounted() {
    this.updateTitle("余额查询");
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.search-balance {
  background-color: #0181ca;
  color: #fff;
}
.search-details {
  background-color: #00bfff;
  color: #fff;
}
</style>
