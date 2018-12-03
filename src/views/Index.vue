<template>
  <div class="about">
    <h1>This is an about page</h1>
      <p>index 页面</p>
      <el-button type="primary" @click="handleBtnClick">主要按钮</el-button>
      <el-tag>{{count}}</el-tag>
  </div>
</template>

<script>
export default {
  data: () => {
    return {
      count: 0
    };
  },
  methods: {
    handleBtnClick: function(e) {
      this.$message("这是一条消息提示");
      this.count++;
      this.$message("malkwr");
    }
  }
};
</script>
