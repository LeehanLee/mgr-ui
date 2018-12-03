import Vue from "vue";
import Router from "vue-router";
// import Home from "./views/Home.vue";
// import Auth from "./Auth.js";

Vue.use(Router);
const router = new Router({
  routes: [
    // {
    //   path: "/home",
    //   name: "home",
    //   component: Home
    // },
    // {
    //   path: "/about",
    //   name: "about",
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () =>
    //     import(/* webpackChunkName: "about" */ "./views/About.vue")
    // },
    {
      path: "/user/list",
      name: "user",
      component: () =>
        import(/* webpackChunkName: "1" */ "./views/user/UserIndex.vue")
    },
    {
      path: "/role/list",
      name: "role",
      component: () =>
        import(/* webpackChunkName: "2" */ "./views/role/RoleIndex.vue")
    },
    {
      path: "/org/list",
      name: "org",
      component: () =>
        import(/* webpackChunkName: "3" */ "./views/org/OrgIndex.vue")
    }
  ]
});
router.beforeEach((to, from, next) => {
  next();
});
export default router;
