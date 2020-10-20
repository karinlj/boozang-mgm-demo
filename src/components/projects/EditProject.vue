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

              <select name="add-tester" v-model="selectedTester">
                <option value="" disabled selected>Choose tester</option>
                <option v-for="(tester, index) in testers" :key="index" v-bind:value="tester.id"
                  >{{ tester.firstname }} {{ tester.lastname }}</option
                >
              </select>
            </div>
            <div class="field col s4">
              <!-- add role -->
              <label for="role">Role</label>
              <select name="role" v-model="selectedRole">
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
                      <p class="btn btn-floating blue">
                        {{ tester.firstname[0] }}{{ tester.lastname[0] }}
                      </p>
                    </td>
                    <td>{{ tester.firstname }}</td>
                    <td>{{ tester.projects[0].role }}</td>
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
      testers: [],
      selectedTester: null,
      selectedRole: null,

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
        this.feedback = null;

        //get collection
        db.collection("projects")
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

        //om projekt-id:t redan finns på vald testare i db, men jag byter roll, så vill jag att rollen byts på projektet.
        //om projekt-id:t redan finns på vald testare i db, så ska det inte gå att lägga till det projektet igen.

        //hitta vald testare - find() hittar första som matchar
        let currentTester = this.testers.find((tester) => {
          return tester.id == this.selectedTester;
        });
        //console.log("currentTester", currentTester);

        let currentProjects = currentTester.projects;
        // console.log("currentProjects", currentProjects);

        let projectExists = false;
        currentProjects.forEach((project) => {
          //console.log("project", project);

          //kolla om project-id finns redan
          if (project.id == this.project.id) {
            project.role = this.selectedRole;
            projectExists = true;
            console.log("projectExists");
          }
        });

        if (!projectExists) {
          console.log("projectExists not");
          let newProject = { id: this.project.id, role: this.selectedRole };
          currentProjects.push(newProject);
          // this.addedTesters.push(this.selectedTester);
        }

        db.collection("testers")
          //grab the doc and update it
          .doc(this.selectedTester)
          .update({
            projects: currentProjects,
          })
          .then(() => {
            this.updateTesterList();
          });
      } else {
        this.feedback = "Please choose Tester and Role.";
      }
    },
    updateTesterList() {
      //hitta alla testare som har detta projektet
      // console.log("this.testers", this.testers);
      console.log("this.project.id", this.project.id);

      this.addedTesters = this.testers.filter((tester) => {
        return tester.projects.find((project) => {
          return project.id == this.project.id;
          //blir bara ett projekt ju per tester här
        });
      });
      console.log("addedTesters", this.addedTesters);
      //this.$router.push({ name: "Home" });
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
          console.log("id", this.project.id);
        });
      });

    //fetch whole testers collection
    db.collection("testers")
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          let tester = doc.data(); //all the data in all testers
          tester.id = doc.id;
          //  console.log("id", tester.id);
          // let testerId = doc.id; //all id:s in all testers
          // console.log("id", testerId);
          //lägger projekten i min data-prop
          this.testers.push(tester);
          //  console.log("testers", this.testers);
        });
        //för att ha fått testarna
        this.updateTesterList();
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
