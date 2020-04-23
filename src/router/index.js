import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import CheckBody from "../views/CheckBody.vue";
import Training from "../views/Training.vue";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/CheckBody",
    name: "CheckBody",
    component: CheckBody,
  },
  {
    path: "/Training",
    name: "Training",
    component: Training,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
