// import Vue from "vue";
import Router from "vue-router";
// import About from "./About.vue";

// Vue.use(Router);
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
    //   // component: () => import(/* webpackChunkName: "about" */ "./About.vue")
    //   component: About
    // },
    {
      path: "/admin/account",
      name: "account",
      component: () =>
        import(/* webpackChunkName: "account" */ "./views/admin/account.vue")
    },
    {
      path: "/admin/org",
      name: "org",
      component: () =>
        import(/* webpackChunkName: "org" */ "./views/admin/org.vue")
    },
    {
      path: "/admin/right",
      name: "right",
      component: () =>
        import(/* webpackChunkName: "right" */ "./views/admin/right.vue")
    },
    {
      path: "/admin/role",
      name: "role",
      component: () =>
        import(/* webpackChunkName: "role" */ "./views/admin/role.vue")
    }
  ]
});
export default router;
