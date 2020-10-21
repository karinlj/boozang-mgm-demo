import Vue from "vue";
import App from "./App.vue";
import mgRouter from "./router";
import VueToastr from "vue-toastr";

Vue.config.productionTip = false;

// use plugin
Vue.use(VueToastr, {
  /* OverWrite Plugin Options if you need */
});

new Vue({
  router: mgRouter,
  render: (h) => h(App),
}).$mount("#app");
