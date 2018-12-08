import axios from "axios";
import * as Promise from "bluebird";
// import _ from "lodash";
import { AppendToHeader } from "./Utils";

const BaseHttpService = axios.create({
  baseURL: "/",
  timeout: 10000
});
// Add a request interceptor
BaseHttpService.interceptors.request.use(
  function(config) {
    AppendToHeader(config);
    return config;
  },
  function(error) {
    return Promise.reject(error);
  }
);

// Add a response interceptor
BaseHttpService.interceptors.response.use(
  function(response) {
    if (response.data.success === true) {
      return response.data.responseModel;
    }

    var err = new Error({ message: response.data.message });
    return Promise.reject(err);
  },
  function(error) {
    if (error.response.status === 403) {
      window.vm.$store.commit("logout");
      error.message = "登录已过期，请重新登录！";
    }

    return Promise.reject(error);
  }
);
export default BaseHttpService;
