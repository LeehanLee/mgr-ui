import axios from "axios";
import * as Promise from "bluebird";

const ListService = axios.create({
  baseURL: "/",
  timeout: 10000,
  headers: {
    "User-Te": encodeURI("this is a test user token just for test 为")
  }
});
var loading = null;
// Add a request interceptor
ListService.interceptors.request.use(
  function(config) {
    loading = window.vm.$loading({
      lock: true,
      text: config.loadingMsg ? config.loadingMsg : "拼命加载中。。。",
      spinner: "el-icon-loading",
      background: "rgba(0, 0, 0, 0.7)"
    });
    return config;
  },
  function(error) {
    console.log(error);
    return Promise.reject(error);
  }
);

// Add a response interceptor
ListService.interceptors.response.use(
  function(response) {
    if (loading) {
      loading.close();
    }

    if (response.data.success === true) {
      return response.data.responseModel;
    }

    var err = new Error({ message: response.data.message });
    console.error(err);
    window.vm.$message({ message: response.data.message, type: "error" });
    return Promise.reject(err);
  },
  function(error) {
    if (loading) {
      loading.close();
    }
    console.error(error);
    window.vm.$message({ message: error.message, type: "error" });
    return Promise.reject(error);
  }
);
window.ListService = ListService;
export default ListService;
