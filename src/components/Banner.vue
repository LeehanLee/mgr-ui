<template>
  <div class="banner-container">
    <div class="banner-row">
      <img class="left-img" src="../assets/logo.png">
      <div class="text">
        <h2>系统管理</h2>
        <p class="lead">对基本功能进行定义并其展示效果。</p>
      </div>
    </div>
    <div class="functional-bar">
      <span class="username">{{openInfo.name}}</span>
      <span class="logout-btn" @click="handleLogoutClick">注销</span>
    </div>
  </div>
</template>

<script>
export default {
  data: () => {
    return {};
  },
  methods: {
    handleLogoutClick() {
      this.$store.commit("logout");
    }
  },
  computed: {
    openInfo() {
      return this.$store.state.openInfo;
    }
  }
};
</script>
<style lang="less">
.banner-container {
  height: 108px;
  position: relative;
  color: #fff;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.4), 0 0 30px rgba(0, 0, 0, 0.075);
  background: #02242c;
  background: -moz-linear-gradient(45deg, #02242c 0%, #eee 100%);
  background: -webkit-gradient(
    linear,
    left bottom,
    right top,
    color-stop(0%, #02242c),
    color-stop(100%, #eee)
  );
  background: -webkit-linear-gradient(45deg, #02242c 0%, #eee 100%);
  background: -o-linear-gradient(45deg, #02242c 0%, #eee 100%);
  background: -ms-linear-gradient(45deg, #02242c 0%, #eee 100%);
  background: linear-gradient(45deg, #02242c 0%, #eee 100%);
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#02242C', endColorstr='#eee',GradientType=1 );
  -webkit-box-shadow: inset 0 3px 7px rgba(0, 0, 0, 0.2),
    inset 0 -3px 7px rgba(0, 0, 0, 0.2);
  -moz-box-shadow: inset 0 3px 7px rgba(0, 0, 0, 0.2),
    inset 0 -3px 7px rgba(0, 0, 0, 0.2);
  box-shadow: inset 0 3px 7px rgba(0, 0, 0, 0.2),
    inset 0 -3px 7px rgba(0, 0, 0, 0.2);

  &::after {
    content: "";
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: url(../assets/bg.png) repeat center center;
    opacity: 0.5;
  }
  .banner-row {
    max-width: 1280px;
    margin: 0 auto;
    display: flex;

    .left-img {
      height: 108px;
    }
  }

  .functional-bar {
    position: absolute;
    top: 16px;
    z-index: 1;
    right: 28px;
    .username {
      margin-right: 20px;
      color: #555;
      &:hover {
        text-shadow: 0px 0px 1px black;
        color: white;
      }
    }
    .logout-btn {
      color: #235bff;
      cursor: pointer;
    }
  }
}
</style>
