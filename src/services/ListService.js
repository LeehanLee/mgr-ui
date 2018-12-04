import axios from "axios";
import * as Promise from "bluebird";
import _ from "lodash";

const ListService = axios.create({
  baseURL: "/",
  timeout: 10000,
  headers: {
    openInfo: localStorage.getItem("openInfo"),
    token: localStorage.getItem("token")
  }
});
var loading = null;
// Add a request interceptor
ListService.interceptors.request.use(
  function(config) {
    config.headers.openInfo = localStorage.getItem("openInfo");
    config.headers.token = localStorage.getItem("token");
    if (_.has(config, "vm.loadingMsg")) {
      config.vm.loadingMsg = "正在加载数据...";
    }
    loading = window.vm.$loading({
      lock: true,
      text: config.loadingMsg ? config.loadingMsg : "拼命加载中...",
      spinner: "el-icon-loading",
      background: "rgba(0, 0, 0, 0.7)"
    });
    return config;
  },
  function(error) {
    if (_.has(error, "config.vm.loadingMsg")) {
      error.config.vm.loadingMsg = error.message;
    }
    if (loading) {
      loading.close();
    }
    return Promise.reject(error);
  }
);

// Add a response interceptor
ListService.interceptors.response.use(
  function(response) {
    if (_.has(response, "config.vm.loadingMsg")) {
      response.config.vm.loadingMsg = "";
    }

    if (loading) {
      loading.close();
    }

    if (response.data.success === true) {
      return response.data.responseModel;
    }

    var err = new Error({ message: response.data.message });
    window.vm.$message({ message: response.data.message, type: "error" });
    return Promise.reject(err);
  },
  function(error) {
    if (error.response.status === 401) {
      window.vm.$store.commit("logout");
      error.message = "登录已过期，请重新登录！";
    }
    if (_.has(error, "config.vm.loadingMsg")) {
      error.config.vm.loadingMsg = error.message;
    }

    if (loading) {
      loading.close();
    }
    window.vm.$message({ message: error.message, type: "error" });
    return Promise.reject(error);
  }
);
export default ListService;
