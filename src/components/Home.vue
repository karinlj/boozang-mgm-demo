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
          <div class="card green accent-4">
            <div class="card-content">
              <h5 class="white-text">Some content here</h5>
            </div>
          </div>
        </div>
        <div class="col s12 m6 l3">
          <div class="card">
            <div class="card-content">
              <h5 class="pink-text">Some content here</h5>
            </div>
          </div>
        </div>
        <div class="col s12 m6">
          <div class="card">
            <div class="card-content">
              <h5 class="cyan-text">Some content here</h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ListTesters from "./testers/ListTesters";
import ListProjects from "./projects/ListProjects";
export default {
  name: "Home",
  components: {
    ListTesters,
    ListProjects,
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
