<template>
  <div class="home">
    <div class="container">
      <div class="row">
        <div class="col s12 m6">
          <ListTesters></ListTesters>
        </div>

        <div class="col s12 m6">
          <ListProjects></ListProjects>
        </div>

        <div class="col s12 m6 l3">
          <License></License>
        </div>

        <div class="col s12 m6 l3">
          <div class="card ">
            <div class="card-content">
              <h5 class="pink-text">Some content here</h5>
            </div>
          </div>
        </div>
        <div class="col s12 m6">
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
export default {
  name: "Home",
  components: {
    ListTesters,
    ListProjects,
    ListTests,
    License,
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
