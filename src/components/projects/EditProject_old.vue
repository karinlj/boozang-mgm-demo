<template>
  <!-- wait to render until we have the data from db -->
  <div v-if="project" class="edit_project container">
    <form @submit.prevent="editProject" class="card-panel">
      <header class="edit_header">
        <h4 class="center-align purple-text">{{ project.name }}</h4>
        <i class="material-icons red-text" @click="deleteProject(project.id)">delete</i>
      </header>
      <div class="row">
        <div class="field col s4">
          <label for="name">Name</label>
          <input type="text" name="name" v-model="project.name" />
        </div>
        <div class="field col s7 offset-s1">
          <div class="row">
            <div class="field col s6">
              <!-- add tester -->
              <label for="add-tester">Tester:</label>

              <select name="add-tester" v-model="selectedTester.name">
                <option value="" disabled selected>Choose tester</option>
                <option v-for="(tester, index) in testers" :key="index"
                  >{{ tester.firstname }} {{ tester.lastname }}</option
                >
              </select>
            </div>
            <div class="field col s4">
              <!-- add role -->
              <label for="role">Role</label>
              <select name="role" v-model="selectedTester.role">
                <option value="" disabled selected>Choose role</option>
                <option v-for="(role, index) in roles" :key="index">{{ role }}</option>
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
              <table id="added_testers" class="responsive-table striped">
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
                      <p class="btn btn-floating blue">{{ tester.name[0] }}</p>
                    </td>
                    <td>{{ tester.name }}</td>
                    <td>{{ tester.role }}</td>
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
export default {
  name: "EditProject",

  data() {
    return {
      //store the db-answer from created() in project
      project: null,
      feedback: null,
      testers: [], //finns inga id här
      selectedTester: {
        name: null,
        role: null,
      },

      roles: ["CI", "Owner", "Viewer", "Developer", "Architect", "Team Lead", "QA"],
      addedTesters: [],
    };
  },
  methods: {
    editProject() {
      // // required???
      if (this.project.name) {
        //create new slug with slugify
        this.project.slug = slugify(this.project.name, {
          replacement: "-",
          remove: /[$*_+~.()'"!:@]/g,
          lower: true,
        });
        //console.log("slug", this.project.slug);
        this.feedback = null;

        //get collection
        db.collection("projects")
          //grab the doc and update it
          //this.project.id = doc.id from created()
          .doc(this.project.id)
          .update({
            name: this.project.name,
            slug: this.project.slug,
          })
          .then(() => {
            this.$router.push({ name: "Home" });
          });
      } else {
        this.feedback = "Please fill in project name.";
      }
    },

    updateTester() {
      //skicka project.id och roll till rätt testare.id

      if (this.selectedTester) {
        this.feedback = null;
        //hitta rätt tester
        let selectedTesterSlug = slugify(this.selectedTester.name, {
          replacement: "-",
          remove: /[$*_+~.()'"!:@]/g,
          lower: true,
        });
        //sluggen
        //  console.log("slug", selectedTesterSlug);
        // //get selected tester by slug
        let refTesters = db.collection("testers").where("slug", "==", selectedTesterSlug);
        //get the tester(stored in a collection)
        refTesters.get().then((snapshot) => {
          snapshot.forEach((doc) => {
            //tester-datan
            // console.log("tester-doc.data()", doc.data());
            let projectsOnTesters = doc.data().projects;

            //tester-id
            // console.log("tester-doc.id", doc.id);

            //nytt projekt
            let newProjectOnTester = {
              id: this.project.id,
              role: this.selectedTester.role,
            };
            // console.log("newProjectOnTester", newProjectOnTester);

            let foundProject = false;

            projectsOnTesters.forEach((project) => {
              console.log("project", project);
              //kolla om project-id finns redan
              if (project.id == this.project.id) {
                project.role = this.selectedTester.role;
                foundProject = true;
                this.addedTesters.forEach((tester) => {
                  if (tester.name == this.selectedTester.name) {
                    tester.role = this.selectedTester.role;
                  }
                });
              }
            });

            if (!foundProject) {
              projectsOnTesters.push(newProjectOnTester);
              this.addedTesters.push(this.selectedTester);
            }

            // console.log("projectsOnTesters", projectsOnTesters);
            // //update tester
            db.collection("testers")
              //grab the doc and update it
              .doc(doc.id)
              .update({
                projects: projectsOnTesters,
              })
              .then(() => {
                // console.log("selectedTester", this.selectedTester);
                // this.addedTesters.push(this.selectedTester);
                // this.selectedTester = {};
                //this.$router.push({ name: "Home" });
              });
          });
        });
      } else {
        this.feedback = "Please choose Tester and Role.";
      }
    },
    cancel() {
      this.$router.push({ name: "Home" });
    },
    deleteProject(id) {
      //även på användaren ska det bort??
      // console.log("id", id);
      db.collection("projects")
        //ref to a doc with an id delete from db
        .doc(id)
        .delete()
        .then(() => {
          //delete from gui??
          this.$router.push({ name: "Home" });
        });
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
          this.project.id = doc.id;
        });
      });

    //fetch whole testers collection
    db.collection("testers")
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          let tester = doc.data(); //all the data in all testers
          tester.id = doc.id;
          console.log("id", tester.id);
          // let testerId = doc.id; //all id:s in all testers
          // console.log("id", testerId);
          //lägger projekten i min data-prop
          this.testers.push(tester);
          console.log("testers", this.testers);
        });
      });
  },
};
</script>

<style lang="scss">
.edit_project {
  position: relative;
  z-index: 1000;
  margin-top: 60px;
  margin-bottom: 25rem;
  .edit_header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    h4 {
      margin: 0.8rem auto;
    }
  }
  .field {
    position: relative;
    .add-tester {
      margin-top: 2rem;
      cursor: pointer;
      font-size: 30px;
    }
    .btn {
      margin-right: 2rem !important;
    }
    select {
      display: block;
    }
  }
  footer {
    margin-top: 4rem;
  }
  #added_testers {
    tr {
      cursor: pointer;
      .edit {
        font-size: 20px;
      }
    }
    th {
      color: #999;
      font-size: 80%;
      padding: 10px 5px;
      //font-weight: 400;
    }

    td {
      padding: 10px 5px;
      &.latest_activity {
        color: #999;
        font-size: 80%;
      }
      .material-icons {
        font-size: 16px;
      }
    }
    .btn-floating {
      width: 30px;
      height: 30px;
      line-height: 30px;
      font-size: 12px;
      margin: 0;
    }
  }
}
</style>
