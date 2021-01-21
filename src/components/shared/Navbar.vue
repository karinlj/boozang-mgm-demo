<template>
  <div class="navbar">
    <nav class="blue">
      <div class="container">
        <div class="row">
          <div class="col s12">
            <router-link :to="{ name: 'Home' }" class="brand-logo left">
              My Company
            </router-link>

            <ul class="right">
              <li>
                <a href="">Login</a>
              </li>
            </ul>
          </div>
        </div>
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
    padding: 0 0.75rem;
    .brand-logo {
      position: relative;
    }
    .container {
      @media all and (min-width: 993px) {
        width: 90%;
      }
    }
    ul {
      a {
        padding-right: 0;
      }
    }
  }
}
</style>
