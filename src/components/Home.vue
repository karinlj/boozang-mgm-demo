<template>
  <div class="home">
    <div class="container">
      <div class="row">
        <div class="col s12 l6">
          <ListTesters></ListTesters>
        </div>

        <div class="col s12 l6">
          <ListProjects></ListProjects>
        </div>

        <div class="col s12 m6 l3">
          <License></License>
        </div>

        <div class="col s12 m6 l3">
          <BugReports></BugReports>
        </div>
        <div class="col s12 l6">
          <ListTests></ListTests>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ListTesters from "./testers/ListTesters";
import ListProjects from "./projects/ListProjects";
import ListTests from "./tests/ListTests";
import License from "./License";
import BugReports from "./BugReports";
export default {
  name: "Home",
  components: {
    ListTesters,
    ListProjects,
    ListTests,
    License,
    BugReports,
  },
  data() {
    return {};
  },
  methods: {},
  created() {},
};
</script>

<style lang="scss">
.home {
  margin-top: 2rem;
  .container {
    max-width: 1300px;
    @media all and (min-width: 993px) {
      width: 90%;
    }
  }
  .overflow-hidden {
    overflow: hidden;
  }
}
</style>
