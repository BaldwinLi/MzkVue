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
    <div v-transfer-dom>
      <confirm v-model="showUserLoginModel"
      :title="'请输入用户名密码'"
      :close-on-confirm="false"
      @on-confirm="onConfirm">
        <div class="vux-prompt">
          <input class="vux-prompt-msgbox" type="text" placeholder="用户名" v-model="loginfo.username">
          <input class="vux-prompt-msgbox" style="margin-top: 5px" type="password" placeholder="密码" v-model="loginfo.password">
        </div>
      </confirm>
    </div>
  </div>
</template>

<script>
import {
  Group,
  Datetime,
  Loading,
  dateFormat,
  Card,
  XButton,
  Confirm,
  TransferDomDirective as TransferDom
} from "vux";
import { mapGetters, mapMutations } from "vuex";

export default {
  name: "CardBalance",
  directives: { TransferDom },
  components: {
    Group,
    Datetime,
    Loading,
    Card,
    XButton,
    Confirm
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
      sum: {},
      showUserLoginModel: true,
      loginfo: {
        username: "",
        password: ""
      }
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
            .join("")}&end=${this.endDate.split("-").join("")}`,
          {
            headers: {
              user: this.loginfo.username,
              pwd: this.loginfo.password
            }
          }
        )
        .then(success => {
          this.$vux.alert.show({
            title: "",
            content: "确认成功"
          });
          this.isLoading = false;
        });
    },
    queryReconcilationInfo() {
      const scope = this;
      //   this.isLoading = true;
      this.$http
        .get(
          `${
            this.appContextPath
          }appweb/balance/query?start=${this.startDate
            .split("-")
            .join("")}&end=${this.endDate.split("-").join("")}`,
          {
            headers: {
              user: this.loginfo.username,
              pwd: this.loginfo.password
            }
          }
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
    },
    onConfirm() {
      if (this.loginfo.username && this.loginfo.password) {
        this.showUserLoginModel = false;
        this.queryReconcilationInfo();
      }
    }
  },
  mounted() {
    this.updateTitle("明珠卡对账");
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.card-padding {
  padding: 15px;
}
</style>
