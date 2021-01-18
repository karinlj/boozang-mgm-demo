<template>
  <div class="add_tester container">
    <form @submit.prevent="handleSubmit" class="card-panel">
      <h4 class="center-align blue-text">Add Team member</h4>

      <div class="row">
        <div class="field col s6">
          <label for="firstname">Firstname</label>
          <input
            type="text"
            name="firstname"
            v-model="tester.firstname"
            required
          />
        </div>
        <div class="field col s6">
          <label for="lastname">Lastname</label>
          <input
            type="text"
            name="lastname"
            v-model="tester.lastname"
            required
          />
        </div>
      </div>
      <div class="row">
        <div class="field col s6">
          <label for="email">Email</label>
          <input type="text" name="email" v-model="tester.email" required />
        </div>
      </div>
      <div class="field center-align">
        <p class="red-text" v-if="feedback">{{ feedback }}</p>
        <button type="button" class="btn grey" @click="cancel">Cancel</button>
        <button class="btn green accent-4" type="submit">
          Add
        </button>
      </div>
    </form>
  </div>
</template>
<script>
import slugify from "slugify";
//import firebase from "firebase";
import { mapActions } from "vuex";

export default {
  name: "AddTester",
  data() {
    return {
      tester: {
        firstname: "",
        lastname: "",
        email: "",
        slug: "",
      },
      feedback: null,
    };
  },
  methods: {
    ...mapActions(["addTester"]),
    handleSubmit() {
      console.log(this.tester.firstname);
      if (this.tester.firstname && this.tester.lastname && this.tester.email) {
        //create slug with slugify
        this.tester.slug = slugify(
          this.tester.firstname + "-" + this.tester.lastname,
          {
            replacement: "-",
            remove: /[$*_+~.()'"!:@]/g,
            lower: true,
          }
        );
        this.feedback = null;
        //make object
        const newTester = {
          firstname: this.tester.firstname,
          lastname: this.tester.lastname,
          email: this.tester.email,
          slug: this.tester.slug,
          projects: [],
        };
        //calling action
        // wait until the promise returns us a value
        //this.$store.dispatch("addTester", newTester);
        this.addTester(newTester);

        //redirect
        this.$router.push({ name: "Home" });
      } else {
        this.feedback = "Please fill in full name and email.";
      }
    },
    cancel() {
      this.$router.push({ name: "Home" });
    },
  },
};
</script>

<style lang="scss">
.add_tester {
  position: relative;
  z-index: 1000;
  margin-top: 60px;
  max-width: 500px;
  h4 {
    margin: 0.8rem auto;
  }
  .field {
    position: relative;
  }
  .delete {
    position: absolute;
    right: 0;
    bottom: 16px;
    color: #e91e63;
    font-size: 1.4rem;
    cursor: pointer;
    opacity: 0.7;
  }
  .btn {
    margin-right: 2rem !important;
  }
}
</style>
