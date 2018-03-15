<template>
  <div>
    <loading v-model="isLoading"></loading>
        <group title="对账区间">
            <datetime
                v-model="startDate"
                @on-change="changeStart"
                title="开始时间"></datetime>
                <datetime
                v-model="endDate"
                @on-change="changeEnd"
                title="结束时间">
            </datetime>
        </group>
    <card>
        <div slot="content" class="card-padding">
            <p style="padding: 5px; font-size:16px; color:#0000EE;">商户名称: {{sum.shopName}}</p>
            <p style="padding: 5px; font-size:16px; color:#999;">交易笔数: {{sum.amount || 0}} 笔</p>
            <p style="padding: 5px; font-size:16px; color:#FF0000;">交易总金额: ¥ {{sum.sum || '0.00'}}</p>
        </div>
    </card>
    <div slot="footer" style="position: fixed; bottom: 0px; width: 100%;">
        <x-button @click.native="confirmReconcilate" style="background: #4682B4; color: #fff; left;">确认账单对账信息</x-button>
    </div>
  </div>
</template>

<script>
import { Group, Datetime, Loading, dateFormat, Card, XButton } from "vux";
import { mapGetters, mapMutations } from "vuex";

export default {
  name: "CardBalance",
  components: {
    Group,
    Datetime,
    Loading,
    Card,
    XButton
  },
  data() {
    return {
      startDate: dateFormat(
        (() => {
          const lastMonth = new Date();
          lastMonth.setMonth(new Date().getMonth() - 1);
          return lastMonth;
        })(),
        "YYYY-MM-DD"
      ),
      endDate: dateFormat(new Date(), "YYYY-MM-DD"),
      isLoading: false,
      sum: {}
    };
  },
  computed: {
    ...mapGetters(["appContextPath"])
  },
  methods: {
    ...mapMutations(["updateTitle"]),
    changeStart(value) {
      this.startDate = value;
      this.queryReconcilationInfo();
    },
    changeEnd(value) {
      this.endDate = value;
      this.queryReconcilationInfo();
    },
    confirmReconcilate() {
      this.isLoading = true;
      this.$http
        .get(
          `${
            this.appContextPath
          }appweb/balance/confirm?start=${this.startDate
            .split("-")
            .join("")}&end=${this.endDate.split("-").join("")}`
        )
        .then(success => {
          this.$vux.alert.show({
            title,
            content: "确认成功"
          });
          this.isLoading = false;
        });
    },
    queryReconcilationInfo() {
      const scope = this;
      this.isLoading = true;
      this.$http
        .get(
          `${
            this.appContextPath
          }appweb/balance/query?start=${this.startDate
            .split("-")
            .join("")}&end=${this.endDate.split("-").join("")}`
        )
        .then(success => {
          scope.sum =
            (success &&
              success.data &&
              success.data.result &&
              success.data.result.sum) ||
            "无数据";
          this.isLoading = false;
        });
    }
  },
  mounted() {
    this.updateTitle("明珠卡对账");
    this.queryReconcilationInfo();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.card-padding {
  padding: 15px;
}
</style>
