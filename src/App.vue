<template>
  <div>
    <Login v-if="!openInfo"/>
    <Banner v-if="openInfo"/>
    <el-container v-if="openInfo" class="app">
      <div class="left-nav">
        <Navigation/>
      </div>
      <div class="right-main">
        <router-view/>
      </div>
    </el-container>
  </div>
</template>

<script>
import Navigation from "./components/Navigation.vue";
import Banner from "./components/Banner.vue";
import Login from "./Login.vue";

export default {
  components: { Login, Navigation, Banner },
  data: () => {
    return {};
  },
  methods: {},
  computed: {
    openInfo() {
      return this.$store.state.openInfo;
    }
  }
};
</script>

<style lang="less">
::-webkit-scrollbar {
  width: 11px;
  height: 11px;
}
::-webkit-scrollbar-track {
  background: #fafafb;
  border-radius: 5.5px;
  border-left: 1px solid #d8d8d8;
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.2);
}

::-webkit-scrollbar-thumb {
  background: #7f7f7f;
  border-radius: 5.5px;
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
}

::-webkit-scrollbar-thumb:hover {
  background: #8c8c8c;
}

::-webkit-scrollbar-corner {
  background: 0 0;
}
body {
  margin: 0;
  padding: 0;
  .el-message {
    top: 59px;

    &.el-message--success {
      box-shadow: 0px 0px 2px #000;
      .el-message__content {
        color: green;
      }
    }
  }
  .el-dialog {
    background: #e9f2ff;
    box-shadow: 0px 0px 5px black;
    .el-dialog__header {
      background: #cce0fd;
    }
  }

  .app {
    height: 100%;

    .left-nav {
      height: calc(100% - 108px);
      left: 0px;
      overflow: auto;
      position: fixed;
      background: #2c4b73;
      width: 15% !important;
    }
    .right-main {
      background: #f5f7fa;
      height: calc(100% - 108px);
      right: 0px;
      overflow: auto;
      position: fixed;
      width: 85%;
    }

    .el-button--primary {
      color: #fff;
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
      border-color: rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.25);
      filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#ff0088cc',endColorstr='#ff0044cc',GradientType=0);
      filter: progid:DXImageTransform.Microsoft.gradient(enabled=false);

      &:hover {
        background: #04c;
      }
    }
  }
}
</style>
