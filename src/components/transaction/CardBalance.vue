<template>
  <div>
    <loading v-model="isLoading"></loading>
    <group>
      <cell title="明珠卡余额" :value="balance"></cell>
    </group>
  </div>
</template>

<script>
import { Badge, Cell, Group, Loading } from "vux";
import { mapGetters, mapMutations } from "vuex";

export default {
  name: "CardBalance",
  components: {
    Group,
    Cell,
    Loading
  },
  data() {
    return {
      balance: 0,
      isLoading: false
    };
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
      .get(`${this.appContextPath}appweb/cardQuery/balance?cardNo=10`)
      .then(success => {
        scope.balance =
          success &&
          success.data &&
          success.data.result &&
          success.data.result.balance;
        if (scope.balance) scope.balance = "¥ " + scope.balance;
        else scope.balance = "无数据";
        this.isLoading = false;
      });
    this.updateTitle("明珠卡余额");
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
