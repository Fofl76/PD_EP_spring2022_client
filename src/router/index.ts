import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import MapsPage from "../pages/MapsPage.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    beforeEnter(to, from, next) {
      next('/maps')
    }
  },
  {
    path: "/maps",
    name: "maps page",
    component: MapsPage,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
