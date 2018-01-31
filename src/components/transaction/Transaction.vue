<template>
  <div>
    <group>
      <cell-box @click.native="queryBalance" is-link>
        明珠卡余额查询
      </cell-box>
      <cell-box @click.native="queryTransactionHistory" is-link>
        交易明细查询
      </cell-box>
    </group>
  </div>
</template>

<script>
import { Badge, CellBox, Group } from "vux";
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
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
