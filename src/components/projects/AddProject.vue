<template>
  <div class="add_project container">
    <form @submit.prevent="addProject" class="card-panel">
      <h4 class="center-align purple-text">Add project</h4>

      <div class="row">
        <div class="field col s6">
          <label for="name">Name</label>
          <input type="text" name="name" v-model="project.name" required />
        </div>
        <div class="field col s6">
          <!-- <label for="lastname">Lastname</label>
          <input type="text" name="lastname" v-model="project.lastname" required /> -->
        </div>
      </div>
      <div class="row">
        <div class="field col s6">
          <!-- <label for="email">Email</label>
          <input type="text" name="email" v-model="project.email" required /> -->
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
import db from "@/firebase/init";

export default {
  name: "Addproject",

  data() {
    return {
      project: {
        name: "",
        slug: "",
      },
      feedback: null,
    };
  },
  methods: {
    addProject() {
      if (this.project.name) {
        //create slug with slugify
        this.project.slug = slugify(this.project.name, {
          replacement: "-",
          remove: /[$*_+~.()'"!:@]/g,
          lower: true,
        });
        //  console.log("slug", this.project.slug);
        this.feedback = null;
        //add to db
        db.collection("projects")
          .add({
            name: this.project.name,
            slug: this.project.slug,
          })
          .then(() => {
            //när project addad-redirect
            this.$router.push({ name: "Home" });
          });
      } else {
        this.feedback = "Please fill in project name.";
      }
    },

    cancel() {
      this.$router.push({ name: "Home" });
    },
  },
};
</script>

<style lang="scss">
.add_project {
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
  //   .delete {
  //     position: absolute;
  //     right: 0;
  //     bottom: 16px;
  //     color: #e91e63;
  //     font-size: 1.4rem;
  //     cursor: pointer;
  //     opacity: 0.7;
  //   }
  .btn {
    margin-right: 2rem !important;
  }
}
</style>
