<template>
  <!-- wait to render until we have the data from db -->
  <div v-if="tester" class="edit_comp container">
    <form @submit.prevent="editTester" class="card-panel">
      <header class="edit_header">
        <h4 class="center-align blue-text">
          {{ tester.firstname + " " + tester.lastname }}
        </h4>
        <i class="material-icons red-text" @click="deleteTester(tester.id)"
          >delete</i
        >
      </header>
      <!-- <p>{{ testers }}</p> -->

      <div class="row">
        <div class="field col s6">
          <label for="firstname">Firstname</label>
          <input type="text" name="firstname" v-model="tester.firstname" />
        </div>
        <div class="field col s6">
          <label for="lastname">Lastname</label>
          <input type="text" name="lastname" v-model="tester.lastname" />
        </div>
      </div>
      <div class="row">
        <div class="field col s6">
          <label for="email">Email</label>
          <input type="text" name="email" v-model="tester.email" />
        </div>
        <div class="field col s6">
          <label for="">Projects</label>
          <table id="dashboard_table" class="responsive-table striped">
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(project, index) in projectsOnTester" :key="index">
                <td>
                  <p class="btn btn-floating purple">
                    {{ project.name[0] }}{{ project.name[1] }}
                  </p>
                </td>
                <td>{{ project.name }}</td>
                <td>{{ project.role }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <footer class="field center-align">
        <p class="red-text" v-if="feedback">{{ feedback }}</p>
        <button type="button" class="btn grey" @click="cancel">Cancel</button>
        <button class="btn green accent-4" type="submit">
          Update
        </button>
      </footer>
    </form>
  </div>
</template>

<script>
import slugify from "slugify";
import { mapGetters } from "vuex";
import { mapActions } from "vuex";
export default {
  name: "EditTester",
  data() {
    return {
      //store the db-answer from created() in tester
      tester: null,
      // projects: [],
      feedback: null,
      projectsOnTester: [],
    };
  },
  computed: {
    //get from state
    ...mapGetters({
      testers: "testers",
      projects: "projects",
    }),
  },
  methods: {
    //fetch from db
    ...mapActions([
      "fetchTesters",
      "fetchProjects",
      "updateTester",
      "removeTester",
    ]),

    getSingleTester() {
      //get tester by slug
      let slug = this.$route.params.tester_slug;
      this.tester = this.testers.find((tester) => {
        return tester.slug === slug;
      });
      //console.log("tester", this.tester);
    },

    findProjects() {
      //find testers projects
      this.tester.projects.forEach((item) => {
        let project = this.projects.find((project) => {
          return project.id === item.id;
        });
        //console.log("project.name", project.name);
        this.projectsOnTester.push({ name: project.name, role: item.role });
      });
      // console.log("projectsOnTester", this.projectsOnTester);
    },
    editTester() {
      if (this.tester.firstname && this.tester.lastname && this.tester.email) {
        //create new slug with slugify
        this.tester.slug = slugify(
          this.tester.firstname + this.tester.lastname,
          {
            replacement: "-",
            remove: /[$*_+~.()'"!:@]/g,
            lower: true,
          }
        );
        //console.log("slug", this.tester.slug);
        this.feedback = null;

        const updatedTester = {
          firstname: this.tester.firstname,
          lastname: this.tester.lastname,
          email: this.tester.email,
          slug: this.tester.slug,
          id: this.tester.id,
        };
        //calling action in store
        this.updateTester(updatedTester);
        this.$router.push({ name: "Home" });
      } else {
        this.feedback = "Please fill in full name and email.";
      }
    },
    cancel() {
      this.$router.push({ name: "Home" });
    },
    deleteTester(id) {
      // console.log("id", id);
      this.removeTester(id);
      this.$router.push({ name: "Home" });
    },
  },
  created() {
    this.fetchTesters();
    this.fetchProjects();
    this.getSingleTester();
    this.findProjects();
  },
};
</script>

<style lang="scss"></style>
