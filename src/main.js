import Vue from "vue";
import App from "./App.vue";
import mgRouter from "./router";

Vue.config.productionTip = false;

new Vue({
  router: mgRouter,
  render: (h) => h(App),
}).$mount("#app");
