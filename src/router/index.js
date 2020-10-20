import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../components/Home";
import AddTester from "../components/testers/AddTester";
import EditTester from "../components/testers/EditTester";
import AddProject from "../components/projects/AddProject";
import EditProject from "../components/projects/EditProject";

Vue.use(VueRouter);
//new router instance
const mgRouter = new VueRouter({
  routes: [
    {
      path: "/",
      name: "Home",
      component: Home,
    },
    {
      path: "/add-tester",
      name: "AddTester",
      component: AddTester,
    },
    {
      path: "/edit-tester/:tester_slug",
      name: "EditTester",
      component: EditTester,
    },
    {
      path: "/add-project",
      name: "AddProject",
      component: AddProject,
    },
    {
      path: "/edit-project/:project_slug",
      name: "EditProject",
      component: EditProject,
    },
  ],
  mode: "history",
});

export default mgRouter;
