<template>
  <!-- wait to render until we have the data from db -->
  <div v-if="project" class="edit_comp edit_project container">
    <form @submit.prevent="editProject" class="card-panel">
      <header class="edit_header">
        <h4 class="center-align purple-text">{{ project.name }}</h4>
        <i class="material-icons red-text delete" title="Delete project"
          >delete</i
        >
      </header>
      <div class="row">
        <div class="field col s4">
          <div class="name">
            <label for="name">Name</label>
            <input type="text" name="name" v-model="project.name" required />
          </div>
          <div class="description">
            <label for="description">Description</label>
            <textarea
              name="description"
              class="materialize-textarea"
              v-model="project.description"
              required
            >
            </textarea>
          </div>
        </div>
        <div class="field col s7 offset-s1">
          <div class="row">
            <div class="field col s6">
              <!-- select tester for this project -->
              <label for="add-tester">Tester:</label>
              <select name="add-tester" v-model="selectedTesterId">
                <option value="" disabled selected>Choose tester</option>
                <option
                  v-for="(tester, index) in testers"
                  :key="index"
                  v-bind:value="tester.id"
                  >{{ tester.firstname }} {{ tester.lastname }}</option
                >
              </select>
            </div>
            <div class="field col s4">
              <label for="role">Role</label>
              <select name="role" v-model="selectedRole">
                <option value="" disabled selected>Choose role</option>
                <option v-for="(role, index) in roles" :key="index">{{
                  role
                }}</option>
              </select>
            </div>
            <div class="field col s1">
              <i
                class="material-icons green-text add-tester"
                title="Add Project on Tester"
                @click="handleAdd()"
                >add_box</i
              >
            </div>
          </div>
          <div class="row">
            <div class="field col s10">
              <!-- list testers for this project -->
              <label for="">Added testers: </label>
              <table id="dashboard_table" class="responsive-table striped">
                <thead>
                  <tr>
                    <th></th>
                    <th>Name</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(tester, index) in testersOnProject" :key="index">
                    <td>
                      <p class="btn btn-floating blue">
                        {{ tester.firstname[0] }}{{ tester.lastname[0] }}
                      </p>
                    </td>
                    <td>{{ tester.firstname }}</td>
                    <td>{{ tester.projects[0].role }}</td>
                    <td>
                      <i
                        class="material-icons red-text delete"
                        title="Remove Project on Tester"
                        @click="handleDelete(tester.id)"
                        >delete</i
                      >
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <footer class="field center-align">
        <!-- <p class="red-text" v-if="feedback">{{ feedback }}</p> -->
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
import db from "@/firebase/init";
import { mapGetters } from "vuex";
import { mapActions } from "vuex";
//import firebase from "firebase";
//import firestore from "firebase/firestore";
export default {
  name: "EditProject",

  data() {
    return {
      //store the db-answer from created() in project
      project: null,
      selectedTesterId: null,
      selectedRole: null,
      roles: [
        "CI",
        "Owner",
        "Viewer",
        "Developer",
        "Architect",
        "Team Lead",
        "QA",
      ],
      testersOnProject: [],
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
      "updateProject",
      "addProjectOnTester",
      "removeProjectOnTester",
    ]),
    getSingleProject() {
      //get tester by slug
      let slug = this.$route.params.project_slug;
      this.project = this.projects.find((project) => {
        return project.slug === slug;
      });
    },
    editProject() {
      if (this.project.name && this.project.description) {
        this.project.slug = slugify(this.project.name, {
          replacement: "-",
          remove: /[$*_+~.()'"!:@]/g,
          lower: true,
        });
        const updatedProject = {
          name: this.project.name,
          description: this.project.description,
          id: this.project.id,
          slug: this.project.slug,
        };
        //calling action in store
        this.updateProject(updatedProject);
        this.$router.push({ name: "Home" });
      } else {
        this.$toastr.e("Please fill in project name and description.");
      }
    },

    handleAdd() {
      //skicka project.id och roll till rätt testare.id
      //om projekt-id:t redan finns på vald testare i db, men jag byter roll, byt rollen på projektet.
      //om projekt-id:t redan finns på vald testare i db, så ska det inte gå att lägga till det projektet igen.
      if (this.selectedTesterId) {
        //hitta vald testare i dropdown på id:t
        let currentTester = this.testers.find((tester) => {
          return tester.id == this.selectedTesterId;
        });
        let currentProjects = currentTester.projects;
        //initalize to false
        let projectExists = false;
        currentProjects.forEach((project) => {
          //kolla om project.id redan finns i db
          if (project.id == this.project.id) {
            projectExists = true;
            //byt bara roll
            project.role = this.selectedRole;
            //console.log("projectExists");
          }
        });
        //om projekt.id:t inte redan finns i db: pusha projektet till projektlistan
        if (!projectExists) {
          // console.log("projectExists not");
          let newProject = {
            id: this.project.id,
            name: this.project.name,
            role: this.selectedRole,
          };
          currentProjects.push(newProject);
        }
        const payload = [currentProjects, currentTester.id];
        //call tester-action
        this.addProjectOnTester(payload);
        this.addTesterToUiList();
        this.$toastr.s("Project on tester added");
      } else {
        this.$toastr.e("Please choose Tester and Role.");
      }
    },
    addTesterToUiList() {
      //uppdatera GUI-listan med testare även när man laddar om och inte valt något nytt
      //testare och projekt måste vara laddade för att listan ska finnas vid reload
      //addTesterToUiList() kallas på i handleAdd() och i created()

      //loopa igenom testarna i db
      //kolla i respektive projektlista om den har detta projekt
      //lägg dessa testare i GUI-listan
      this.testersOnProject = this.testers.filter((tester) => {
        return tester.projects.find((project) => {
          return project.id == this.project.id;
          //(blir bara ett projekt ju per tester här)
        });
      });
      console.log("testersOnProject_add", this.testersOnProject);
    },
    handleDelete(id) {
      //hitta testare i GUI-listan man klickat på
      let deletedTester = this.testers.find((tester) => {
        return tester.id == id;
      });
      //uppdatera testarens projektlista (ta bort detta projekt)
      let testerProjects = deletedTester.projects.filter((project) => {
        project.id !== this.project.id;
      });

      const payload = [testerProjects, id];
      //call tester-action
      this.removeProjectOnTester(payload);
      this.deleteTesterFromUiList(id);
      this.$toastr.s("Project on tester deleted");
    },
    deleteTesterFromUiList(id) {
      this.testersOnProject = this.testersOnProject.filter((tester) => {
        return tester.id !== id;
      });
      console.log("testersOnProject_delete", this.testersOnProject);
    },
    cancel() {
      this.$router.push({ name: "Home" });
    },
    //does not work right now
    deleteProject(id) {
      //uppdatera projekt-tabellen
      //uppdatera flera testares projektlista

      db.collection("projects")
        .doc(id)
        .delete()
        .then(() => {
          // console.log("delete project");
          this.$router.push({ name: "Home" });
        });
    },
  },
  created() {
    this.fetchTesters();
    this.fetchProjects();
    this.getSingleProject();
    this.addTesterToUiList();
  },
  mounted() {
    // You are able to access plugin from everywhere via this.$toastr
    this.$toastr.defaultPosition = "toast-top-right";
    this.$toastr.defaultTimeout = 2000;
  },
};
</script>

<style lang="scss">
.edit_header {
  .delete {
    cursor: pointer;
  }
  .name {
    margin-bottom: 3rem;
  }
  .add-tester {
    margin-top: 2rem;
    cursor: pointer;
    font-size: 30px;
  }
  select {
    display: block;
  }
  textarea {
    min-height: 6rem;
  }
}
</style>
