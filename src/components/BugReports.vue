<template>
  <div class="card">
    <div class="card-content">
      <Header headingColor="pink-text" heading="Bug Reports" />
      <p>No bugs reported.</p>
    </div>
  </div>
</template>

<script>
import Header from "./shared/Header";
export default {
  name: "BugReports",
  components: {
    Header,
  },
  data() {
    return {
      title: "",
    };
  },
  methods: {},
  created() {},
};
</script>

<style lang="scss"></style>
