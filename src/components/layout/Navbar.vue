<template>
  <div class="navbar">
    <nav class="blue">
      <div class="container">
        <router-link :to="{ name: 'Home' }" class="brand-logo left">
          My Company
        </router-link>

        <ul class="right">
          <li>
            <a href="">Some link</a>
          </li>
        </ul>
      </div>
    </nav>
  </div>
</template>

<script>
export default {
  name: "Navbar",
  props: {},
  data() {
    return {};
  },
  methods: {},
};
</script>

<style lang="scss">
.navbar {
  position: relative;
  z-index: 100;

  nav {
    height: 8rem;
    @media all and (min-width: 576px) {
      height: auto;
    }
    padding: 0 20px;
    .brand-logo {
      position: relative;
    }
    .container {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      @media all and (min-width: 576px) {
        flex-direction: row;
      }
    }
  }
}
</style>
