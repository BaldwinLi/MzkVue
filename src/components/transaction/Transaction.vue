<template>
  <div class="blank-page">
    <group>
      <cell-box @click.native="queryBalance" is-link>
        <i class="mzk mzk-bag" style="color: #0181ca;"></i>&nbsp;明珠卡余额查询
      </cell-box>
      <!-- <cell-box @click.native="queryTransactionHistory" is-link>
        <i class="mzk mzk-searchforfiles" style="color: #0181ca;"></i>&nbsp;交易明细查询
      </cell-box> -->
      <!-- <cell-box @click.native="queryReconciliation" is-link>
        交易对账
      </cell-box> -->
    </group>
  </div>
</template>

<script>
import { Badge, CellBox, Group } from "vux";
import { mapMutations } from "vuex";
export default {
  name: 'Transaction',
  components: {
    Group,
    CellBox
  },
  data () {
    return {
    }
  },
  methods: {
    queryBalance() {
      this.$router.push({ path: `/card_balance` });
    },
    queryTransactionHistory() {
      this.$router.push({ path: `/transaction_history` });
    },
    queryReconciliation() {
      this.$router.push({ path: `/reconciliation` });
    },
    ...mapMutations(["updateTitle"])
  },
  mounted() {
    this.updateTitle("明珠卡查询");
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
