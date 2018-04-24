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
            <p style="padding: 0.5rem; font-size:1.6rem; color:#0000EE;">商户名称: {{sum.shopName}}</p>
            <p style="padding: 0.5rem; font-size:1.6rem; color:#999;">交易笔数: {{sum.amount || 0}} 笔</p>
            <p style="padding: 0.5rem; font-size:1.6rem; color:#FF0000;">交易总金额: ¥ {{sum.sum || '0.00'}}</p>
        </div>
    </card>
    <div slot="footer" style="position: fixed; bottom: 0px; width: 100%;">
        <x-button @click.native="confirmReconcilate" style="background: #4682B4; color: #fff; float: left; width: 60%">确认账单对账信息</x-button>
        <x-button @click.native="showChangePwdModel = true" style="background: #FF6347; color: #fff; float: left; width: 40%; margin-top: 0">修改密码</x-button>
    </div>
    <div v-transfer-dom>
      <confirm v-model="showUserLoginModel"
      :title="'请输入用户名和密码'"
      :close-on-confirm="false"
      @on-confirm="onConfirm"
      @on-cancel="onCancel">
        <div class="vux-prompt">
          <input class="vux-prompt-msgbox" type="text" placeholder="用户名" v-model="loginfo.username">
          <input class="vux-prompt-msgbox" style="margin-top: 0.5rem" type="password" placeholder="密码" v-model="loginfo.password">
        </div>
      </confirm>
    </div>
    <div v-transfer-dom>
      <confirm v-model="showChangePwdModel"
      :title="'修改密码'"
      :close-on-confirm="false"
      @on-confirm="changePwd">
        <div class="vux-prompt">
          <input class="vux-prompt-msgbox" type="password" placeholder="旧密码" v-model="changePwdInfo.password">
          <input class="vux-prompt-msgbox" style="margin-top: 0.5rem" type="password" placeholder="新密码" v-model="changePwdInfo.newpassword">
          <input class="vux-prompt-msgbox" style="margin-top: 0.5rem" type="password" placeholder="新密码确认" v-model="changePwdInfo.newpasswordConfirm">
          <p v-if="!isPwdConfirm" style="color: #EE2C2C" >两次输入的密码不一致。</p>
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
      showChangePwdModel: false,
      loginfo: {
        username: "",
        password: ""
      },
      changePwdInfo: {
        password: "",
        newpassword: "",
        newpasswordConfirm: ""
      },
      isPwdConfirm: true
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
          if (success.data.status === "OK") {
            this.$vux.alert.show({
              title: "",
              content: "确认成功"
            });
          } else if (
            success.data.status === "FAIL" &&
            success.data.result ==
              "Can't find shopInfo with given user and pwd."
          ) {
            this.showUserLoginModel = true;
          }
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
            .join("")}&end=${this.endDate.split("-").join("")}`,
          {
            headers: {
              user: this.loginfo.username,
              pwd: this.loginfo.password
            }
          }
        )
        .then(success => {
          if (success.data.status === "OK") {
            scope.sum =
              (success &&
                success.data &&
                success.data.result &&
                success.data.result.sum) ||
              {};
          } else if (
            success.data.status === "FAIL" &&
            success.data.result ==
              "Can't find shopInfo with given user and pwd."
          ) {
            this.showUserLoginModel = true;
          }

          this.isLoading = false;
        });
    },
    onConfirm() {
      if (this.loginfo.username && this.loginfo.password) {
        this.showUserLoginModel = false;
        this.queryReconcilationInfo();
      }
    },
    onCancel() {
      const scope = this;
      this.$vux.confirm.show({
        title: "",
        content: "取消用户验证将退出对账, 是否确认取消？",
        onCancel() {
          scope.showUserLoginModel = true;
        },
        onConfirm() {
          window.history.back();
        }
      });
    },
    changePwd() {
      if (
        this.changePwdInfo.password &&
        this.changePwdInfo.newpassword &&
        this.changePwdInfo.newpasswordConfirm
      ) {
        if (
          this.changePwdInfo.newpassword !==
          this.changePwdInfo.newpasswordConfirm
        ) {
          this.isPwdConfirm = false;
        } else {
          this.showChangePwdModel = false;
          this.isLoading = true;
          this.$http
            .get(
              `${this.appContextPath}appweb/balance/chgpwd?pwd=${
                this.changePwdInfo.newpassword
              }`,
              {
                headers: {
                  user: this.loginfo.username,
                  pwd: this.changePwdInfo.password
                }
              }
            )
            .then(success => {
              if (success.data.status === "OK") {
                this.$vux.alert.show({
                  title: "",
                  content: "修改密码成功"
                });
              } else if (
                success.data.status === "FAIL" &&
                success.data.result ==
                  "Can't find shopInfo with given user and pwd."
              ) {
                this.showUserLoginModel = true;
              }
              this.isLoading = false;
            });
        }
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
  padding: 1.5rem;
}
</style>
