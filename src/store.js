import Vue from "vue";
import Vuex from "vuex";
import moment from "moment";

Vue.use(Vuex);
let openInfo = JSON.parse(localStorage.getItem("openInfo"));
console.log(openInfo);
if (openInfo) {
  const d = moment(openInfo.loginTime).add(6, "h");
  if (d < new Date()) {
    openInfo = null;
    localStorage.removeItem("token");
    localStorage.removeItem("openInfo");
    window.loginMsg = {
      message: `最近一次登录于 ${moment(openInfo.loginTime).format(
        "YYYY-MM-DD HH:mm:ss"
      )}，已过期，请重新登录`,
      type: "error"
    };
  } else {
    window.loginMsg = {
      message: `最近一次登录于 ${moment(openInfo.loginTime).format(
        "YYYY-MM-DD HH:mm:ss"
      )}`,
      type: "success"
    };
  }
}

export default new Vuex.Store({
  state: {
    openInfo: openInfo
  },
  mutations: {
    login(state, response) {
      const openInfo = atob(response.openInfo);
      const userObj = JSON.parse(openInfo);
      delete userObj.userid;
      delete userObj.openInfo;
      delete userObj.token;
      state.openInfo = userObj;
      localStorage.setItem("token", response.token);
      localStorage.setItem("openInfo", openInfo);
    },
    logout(state) {
      state.openInfo = null;
      localStorage.removeItem("token");
      localStorage.removeItem("openInfo");
    }
  },
  actions: {}
});
