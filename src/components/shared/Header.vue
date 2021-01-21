<template>
  <header class="list_header">
    <h5 :class="headingColor">{{ heading }}</h5>
    <router-link
      v-if="linkName"
      :to="{ name: linkName }"
      class="btn-small green accent-4"
    >
      {{ btnName }}
    </router-link>
  </header>
</template>

<script>
export default {
  name: "Header",
  props: {
    headingColor: {
      type: String,
      required: true,
      default: "",
    },
    heading: {
      type: String,
      required: true,
      default: "",
    },
    linkName: {
      type: String,
      required: false,
      default: "",
    },
    btnName: {
      type: String,
      required: false,
      default: "",
    },
    // handleClick: {
    //   type: Function,
    //   required: false,
    // },
  },
};
</script>

<style lang="scss">
.list_header {
  position: relative;
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  h5 {
    margin-top: 0;
    max-width: 50%;
  }
}
</style>
