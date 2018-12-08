import axios from "axios";
import * as Promise from "bluebird";
import { AppendToHeader } from "./Utils";

var loading = null;
const errorHandle = function(error) {
  if (error.response.status === 403) {
    window.vm.$store.commit("logout");
    error.message = "登录已过期，请重新登录！";
  }
  if (loading) {
    loading.close();
  }
  window.vm.$message({ message: error.message, type: "error" });
  return Promise.reject(error);
};

const ActionService = axios.create({
  baseURL: "/",
  timeout: 10000,
  headers: {
    "User-Te": encodeURI("this is a test user token just for test 为")
  }
});

// Add a request interceptor
ActionService.interceptors.request.use(function(config) {
  AppendToHeader(config);
  loading = window.vm.$loading({
    lock: true,
    text: config.loadingMsg ? config.loadingMsg : "正在操作。。。",
    spinner: "el-icon-loading",
    background: "rgba(0, 0, 0, 0.7)"
  });
  return config;
}, errorHandle);

// Add a response interceptor
ActionService.interceptors.response.use(function(response) {
  if (loading) {
    loading.close();
  }
  const { data, config } = response;

  const successMsg = config.successMsg ? config.successMsg : "操作成功";
  const errorMsg = config.successMsg ? config.successMsg : "操作失败";
  if (data.success === true) {
    const msg = data.operationSuccess === true ? successMsg : errorMsg;
    window.vm.$message({
      message: msg,
      type: data.operationSuccess === true ? "success" : "error"
    });
    return data.operationSuccess;
  }

  var err = new Error({ message: data.message });
  window.vm.$message({ message: data.message, type: "error" });
  return Promise.reject(err);
}, errorHandle);

export default ActionService;
