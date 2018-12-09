<template>
  <div class="login-page">
    <div class="center-title">
      <h1>欢迎您！</h1>
    </div>
    <div class="center-content">
      <div class="form-container">
        <div class="header">
          <div class="header-left">
            <div class="header-main">请登录</div>
            <div :class="messageClass">{{message}}</div>
          </div>
          <img class="key-icon" src="./assets/keys.jpg">
          <div></div>
        </div>
        <div class="items-container">
          <div class="item" label="用户名" prop="username">
            <input
              class="login-input"
              v-model="currentDto.username"
              placeholder="用户名"
              @keyup.enter="handleSubmitClick"
            >
            <div class="message">{{errorMsg.username}}</div>
          </div>
          <div class="item" label="密码" prop="password">
            <input
              class="login-input"
              v-model="currentDto.password"
              type="password"
              placeholder="密码"
              @keyup.enter="handleSubmitClick"
            >
            <div class="message">{{errorMsg.password}}</div>
          </div>
          <el-button class="submit-btn" @click="handleSubmitClick" :loading="isloginin">登录</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data: () => {
    return {
      messageColor: "",
      isloginin: false,
      message: "输入账号密码进行登录验证",
      currentDto: {
        username: "",
        password: ""
      },
      errorMsg: {
        username: "",
        password: ""
      }
    };
  },
  methods: {
    handleSubmitClick: function() {
      this.isloginin = true;
      const validInput = this.currentDto.username && this.currentDto.password;
      this.errorMsg.username = this.currentDto.username ? null : "请输入用户名";
      this.errorMsg.password = this.currentDto.password ? null : "请输入密码";
      if (!validInput) {
        this.isloginin = false;
        return;
      }
      this.message = null;
      const self = this;
      axios
        .post("/api/restlogin", this.currentDto)
        .then(result => {
          self.isloginin = false;
          if (result.status === 200 && result.data.success) {
            self.messageColor = "green";
            self.message = "登录成功";
            self.$store.commit("login", result.data.responseModel);
          } else {
            self.message = result.data.message
              ? result.data.message
              : "用户名或密码错误";
            self.messageColor = "red";
          }
        })
        .catch(err => {
          self.isloginin = false;
          self.message = err.message;
          self.messageColor = "red";
        });
    }
  },
  computed: {
    messageClass: function() {
      return `header-sub ${this.messageColor}`;
    }
  }
};
</script>

<style lang="less">
.login-page {
  overflow: auto;
  position: fixed;
  margin: 0px;
  padding: 0px;
  border: none;
  width: 100%;
  height: 100%;
  background: url(./assets/1.jpg);

  .center-title {
    width: 620px;
    margin: 70px auto 0 auto;
    color: white;
  }
  .center-content {
    width: 620px;
    margin: 0 auto 30px auto;

    .form-container {
      .header {
        background: white;
        padding: 30px 30px 0 30px;
        .header-left {
          float: left;
          .header-main {
            font-weight: bold;
            font-size: 26px;
            margin: 0 0 14px 0;
          }
          .header-sub {
            font-size: 14px;

            &.red {
              color: red;
            }
            &.green {
              color: green;
            }
          }
        }
        .key-icon {
          float: right;
          height: 100px;
        }

        &:after {
          content: "";
          display: block;
          visibility: visible;
          clear: both;
        }
      }
      .items-container {
        padding: 30px;
        background: #eee;
        .item {
          position: relative;
          margin-bottom: 38px;
          .message {
            font-size: 14px;
            position: absolute;
            left: 16px;
            bottom: -22px;
            color: #ec2517;
          }
          .login-input {
            background-color: #fff;
            border: 1px solid #dcdfe6;
            box-sizing: border-box;
            height: 40px;
            outline: 0;
            padding: 0 15px;
            width: 100%;
            transition: all 0.5s ease;
            &:hover,
            &:focus {
              border-color: #029ae1;
              box-shadow: 0 0 4px #029ae1;
            }
            &:-webkit-autofill {
              box-shadow: 0 0 0 1000px white inset;
            }
          }
        }

        .submit-btn {
          border-radius: 0px !important;
          padding: 0 !important;
          width: 100%;
          color: #fff;
          line-height: 30px;
          text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.25);
          background-color: #006dcc;
          *background-color: #04c;
          background-image: -moz-linear-gradient(top, #08c, #04c);
          background-image: -webkit-gradient(
            linear,
            0 0,
            0 100%,
            from(#08c),
            to(#04c)
          );
          background-image: -webkit-linear-gradient(top, #08c, #04c);
          background-image: -o-linear-gradient(top, #08c, #04c);
          background-image: linear-gradient(to bottom, #08c, #04c);
          background-repeat: repeat-x;
          border-color: #04c #04c #002a80;
          border-color: rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.1)
            rgba(0, 0, 0, 0.25);
          filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#ff0088cc',endColorstr='#ff0044cc',GradientType=0);
          filter: progid:DXImageTransform.Microsoft.gradient(enabled=false);
          &:hover {
            background: #04c;
          }
        }
      }
    }
  }
}
</style>
