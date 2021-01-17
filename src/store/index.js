import Vuex from "vuex";
import Vue from "vue";
import { testerModule } from "./modules/testerModule";
import { projectModule } from "./modules/projectModule";
import { testModule } from "./modules/testModule";
//import { licenseModule } from "./modules/licenseModule";

//load vuex
Vue.use(Vuex);

//create store
export const store = new Vuex.Store({
  modules: {
    testerModule,
    projectModule,
    testModule,
    // licenseModule,
  },
});
