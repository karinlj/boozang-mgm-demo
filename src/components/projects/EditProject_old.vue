<template>
  <!-- wait to render until we have the data from db -->
  <div v-if="project" class="edit_comp edit_project container">
    <form @submit.prevent="updateProject" class="card-panel">
      <header class="edit_header">
        <h4 class="center-align purple-text">{{ project.name }}</h4>
        <i class="material-icons red-text delete">delete</i>
      </header>
      <div class="row">
        <div class="field col s4">
          <div class="name">
            <label for="name">Name</label>
            <input type="text" name="name" v-model="project.name" />
          </div>
          <div class="description">
            <label for="description">Description</label>
            <textarea
              name="description"
              class="materialize-textarea"
              v-model="project.description"
            >
            </textarea>
          </div>
        </div>
        <div class="field col s7 offset-s1">
          <div class="row">
            <div class="field col s6">
              <!-- add tester -->
              <label for="add-tester">Tester:</label>

              <select name="add-tester" v-model="selectedTester">
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
                title="Add Tester"
                @click="updateTester()"
                >add_box</i
              >
            </div>
          </div>
          <div class="row">
            <div class="field col s10">
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
                  <tr v-for="(tester, index) in addedTesters" :key="index">
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
                        @click="deleteTester(tester.id)"
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
import db from "@/firebase/init";
//import firebase from "firebase";
import firestore from "firebase/firestore";
export default {
  name: "EditProject",

  data() {
    return {
      //store the db-answer from created() in project
      project: null,
      feedback: null,
      testers: [],
      selectedTester: null,
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
      addedTesters: [],
    };
  },
  methods: {
    updateProject() {
      // // required???
      if (this.project.name) {
        //slug with slugify
        this.project.slug = slugify(this.project.name, {
          replacement: "-",
          remove: /[$*_+~.()'"!:@]/g,
          lower: true,
        });
        this.feedback = null;
        //sätt firebase timestamp
        let myTimestamp = firestore.Timestamp.fromDate(new Date());
        // console.log("Date", myTimestamp);

        //uppdatera detta projekt
        db.collection("projects")
          //this.project.id = doc.id from created()
          .doc(this.project.id)
          .update({
            name: this.project.name,
            description: this.project.description,
            lastUpdated: myTimestamp,
            slug: this.project.slug,
          })
          .then(() => {
            this.$router.push({ name: "Home" });
          });
      } else {
        this.$toastr.e("Please fill in project name.");
        //this.feedback = "Please fill in project name.";
      }
    },

    updateTester() {
      //skicka project.id och roll till rätt testare.id
      //om projekt-id:t redan finns på vald testare i db, men jag byter roll, byt rollen på projektet.
      //om projekt-id:t redan finns på vald testare i db, så ska det inte gå att lägga till det projektet igen.
      if (this.selectedTester) {
        this.feedback = null;

        //hitta vald testare i dropdown på id:t
        let currentTester = this.testers.find((tester) => {
          return tester.id == this.selectedTester;
        });
        //console.log("currentTester", currentTester);

        //vald testares projekt i db
        let currentProjects = currentTester.projects;
        // console.log("currentProjects", currentProjects);

        let projectExists = false;
        //loopa vald testares projekt i db
        currentProjects.forEach((project) => {
          //console.log("project", project);

          //kolla om project.id redan finns i db
          if (project.id == this.project.id) {
            projectExists = true;

            //byt bara roll
            project.role = this.selectedRole;
            console.log("projectExists");
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
        //uppdatera vald testares projektlista
        db.collection("testers")
          //grab the doc and update it
          .doc(this.selectedTester)
          .update({
            projects: currentProjects,
          })
          .then(() => {
            this.updateTesterUiList();
            this.$toastr.s("Project updated");
          });
        //tillagt
      } else {
        this.$toastr.e("Please choose Tester and Role.");
        // this.feedback = "Please choose Tester and Role.";
      }
      // this.selectedTester = null;
      // this.selectedRole = null;
    },
    updateTesterUiList() {
      //uppdatera GUI-listan med testare även när man laddar om och inte valt något nytt
      //testare och projekt måste vara laddade för att listan ska finnas vid reload
      //updateTesterUiList() kallas på i then() i updateTester() och i created() när testare är hämtade

      //loopa igenom testarna i db
      //kolla i respektive projektlista om den har detta projekt
      //lägg dessa testare i GUI-listan
      //annars loopa över listan med if-satser
      //bara output i UI
      this.addedTesters = this.testers.filter((tester) => {
        return tester.projects.find((project) => {
          return project.id == this.project.id;
          //(blir bara ett projekt ju per tester här)
        });
      });
      // console.log("addedTesters", this.addedTesters);
    },
    deleteTester(id) {
      //hitta testare i GUI-listan man klickat på
      let deletedTester = this.testers.find((tester) => {
        return tester.id == id;
      });
      // console.log("deletedTester", deletedTester);

      //uppdatera testarens projektlista (ta bort detta projekt)
      let testerProjects = deletedTester.projects.filter((project) => {
        project.id !== this.project.id;
      });
      // console.log("testerProjects", testerProjects);

      //uppdatera testarens projektlista
      db.collection("testers")
        //grab the doc and update it
        .doc(id)
        .update({
          projects: testerProjects,
        })
        .then(() => {
          this.deleteTesterFromUiList(id);
          this.$toastr.s("Project updated");
        });
    },
    deleteTesterFromUiList(id) {
      //uppdatera addedTesters
      this.addedTesters = this.addedTesters.filter((tester) => {
        //return bara de testare som inte har id:t vi klickat på
        return tester.id !== id;
      });
    },
    cancel() {
      this.$router.push({ name: "Home" });
    },
    deleteProject(id) {
      // console.log("project.id", id);
      //uppdatera projekt-tabellen
      //uppdatera flera testares projektlista

      db.collection("projects")
        .doc(id)
        .delete()
        .then(() => {
          // console.log("delete project");
          this.$router.push({ name: "Home" });
        });

      // let testProjectList = [
      //   { id: 1, role: "owner" },
      //   { id: 2, role: "owner" },
      // ];
      // let testerProjects = this.testers[0].projects;
      // let filteredProjects = testerProjects.filter((project) => {
      //   return project.id !== 1;
      // });
      // console.log("filteredProjects", filteredProjects);

      // // db.collection("testers")
      // //   .document()
      // //   .updateData({
      // //     projects: FieldValue.arrayRemove([{}.remove(1)]),
      // //   });

      // //uppdatera testarens projektlista
      // db.collection("testers")
      //   .get()
      //   .then(function(querySnapshot) {
      //     console.log("querySnapshot", querySnapshot);
      //     querySnapshot.forEach(function(doc) {
      //       doc.ref.update({
      //         projects: testProjectList,
      //       });
      //     });
      //   });
    },
  },
  created() {
    //1.  get this project by the slug, we dont have the id
    db.collection("projects")
      .where("slug", "==", this.$route.params.project_slug)
      //get the data (should be just one, but stored in a collection)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          this.project = doc.data(); //all the data in this project
          //id is in the doc
          console.log("project", this.project);

          this.project.id = doc.id;
          //console.log("id", this.project.id);
        });
      });

    //fetch whole testers collection
    db.collection("testers")
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          let tester = doc.data(); //all the data in all testers
          //lägger tillfälligt doc.id i testers för att ha tillgång till det även om det eg ligger en nivå upp
          tester.id = doc.id;
          //  console.log("id", tester.id);
          this.testers.push(tester);
          //  console.log("testers", this.testers);
        });
        //testare och projekt måste vara laddade för att listan ska finnas vid reload
        this.updateTesterUiList();
      });
  },
  mounted() {
    // You are able to access plugin from everywhere via this.$toastr
    this.$toastr.defaultPosition = "toast-top-right";
    this.$toastr.defaultTimeout = 2000;
  },
};
</script>

<style lang="scss">
.edit_project {
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
