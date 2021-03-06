import Vue from "vue";
import App from "./App.vue";
import store from "./store";
// import ElementUI from "element-ui";
import _ from "lodash";
// import "element-ui/lib/theme-chalk/index.css";
import ListService from "./services/ListService";
import ActionService from "./services/ActionService";
import BaseHttpService from "./services/BaseHttpService";
import { HandleDeleteClick, ToggleEnableAndAlert } from "./services/Utils";
import router from "./router";

Vue.config.productionTip = false;
// Vue.use(ElementUI);
Vue.prototype._ = _;
window.ListService = ListService;
window.ActionService = ActionService;
window.BaseHttpService = BaseHttpService;
window.HandleDeleteClick = HandleDeleteClick;
window.ToggleEnableAndAlert = ToggleEnableAndAlert;

window.vm = new Vue({
  router,
  store,
  render: h => h(App)
});
window.vm.$mount("#app");

if (window.loginMsg) {
  window.vm.$message(window.loginMsg);
  delete window.loginMsg;
}
