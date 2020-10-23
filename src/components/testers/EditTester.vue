<template>
  <!-- wait to render until we have the data from db -->
  <div v-if="tester" class="edit_tester container">
    <form @submit.prevent="editTester" class="card-panel">
      <header class="edit_header">
        <h4 class="center-align blue-text">{{ tester.firstname + " " + tester.lastname }}</h4>
        <i class="material-icons red-text" @click="deleteTester(tester.id)">delete</i>
      </header>

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
          <table id="projects_table" class="responsive-table striped">
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              <!-- <div @click="findProjects">Projekt</div> -->
              <tr v-for="(project, index) in projectsOnHugo" :key="index">
                <td>
                  <p class="btn btn-floating purple">{{ project.name[0] }}{{ project.name[1] }}</p>
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
import db from "@/firebase/init";
import firebase from "firebase";
export default {
  name: "EditTester",

  data() {
    return {
      //store the db-answer from created() in tester
      tester: null,
      projects: [],
      feedback: null,
      projectsOnHugo: [],
    };
  },
  methods: {
    findProjects() {
      //make new array of Hugo's project.id:s
      // let projectIdsOnHugo = this.tester.projects.map((project) => {
      //   return project.id;
      // });
      // console.log("projectIdsOnHugo[0]", projectIdsOnHugo[0]);

      //löpa över hugo's id:n för att hämta namn från projekt-tabell
      // for (let i = 0; i < projectIdsOnHugo.length; i++) {
      //   // console.log("index", projectIdsOnHugo[i]);
      //   let project = this.projects.find((project) => {
      //     return project.id === projectIdsOnHugo[i];
      //   });
      //   console.log("project.name", project.name);
      // }
      //let projectsOnHugo = [];

      let projectsOnOtto = this.tester.projects.map((project) => {
        return project;
      });
      console.log("projectsOnOtto", projectsOnOtto);

      projectsOnOtto.forEach((item) => {
        let project = this.projects.find((project) => {
          return project.id === item.id;
        });
        //console.log("project.name", project.name);
        this.projectsOnHugo.push({ name: project.name, role: item.role });
      });
      console.log("projectsOnHugo", this.projectsOnHugo);
      //  return projectsOnHugo;
    },
    editTester() {
      // // required???
      if (this.tester.firstname && this.tester.lastname && this.tester.email) {
        //create new slug with slugify
        this.tester.slug = slugify(this.tester.firstname + this.tester.lastname, {
          replacement: "-",
          remove: /[$*_+~.()'"!:@]/g,
          lower: true,
        });
        //console.log("slug", this.tester.slug);
        this.feedback = null;

        //sätt firebase timestamp
        let myTimestamp = firebase.firestore.Timestamp.fromDate(new Date());

        db.collection("testers")
          //grab the doc and update it
          //this.tester.id = doc.id from created()
          .doc(this.tester.id)
          .update({
            firstname: this.tester.firstname,
            lastname: this.tester.lastname,
            latestActivity: myTimestamp,
            email: this.tester.email,
            slug: this.tester.slug,
            //projects:
          })
          .then(() => {
            this.$router.push({ name: "Home" });
          });
      } else {
        this.feedback = "Please fill in full name and email.";
      }
    },
    cancel() {
      this.$router.push({ name: "Home" });
    },
    deleteTester(id) {
      // console.log("id", id);
      db.collection("testers")
        //ref to a doc with an id, delete from db
        .doc(id)
        .delete()
        .then(() => {
          //delete from gui??
          this.$router.push({ name: "Home" });
        });
    },
  },
  created() {
    //1.  get tester by the slug, we dont have the id
    let ref = db.collection("testers").where("slug", "==", this.$route.params.tester_slug);
    //get the data (should be just one, but in a collection)
    ref.get().then((snapshot) => {
      snapshot.forEach((doc) => {
        //update my empty tester-prop
        this.tester = doc.data();
        //  console.log("tester", this.tester);
        //här får vi this.tester.id till editTester() ovan
        this.tester.id = doc.id;
        //console.log("tester.id", this.tester.id);
      });
    });
    //fetch projects firestore
    db.collection("projects")
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          let project = doc.data(); //all the data
          //lägger in id:t i data() temporärt
          project.id = doc.id;
          this.projects.push(project);
        });
        //console.log("projects", this.projects);
        this.findProjects();
      });
  },
};
</script>

<style lang="scss">
.edit_tester {
  position: relative;
  z-index: 1000;
  margin-top: 60px;
  max-width: 800px;
  .edit_header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    h4 {
      margin: 0.8rem auto;
    }
  }
  footer {
    margin-top: 4rem;
  }
  .field {
    position: relative;
  }
  .btn {
    margin-right: 2rem !important;
  }

  #projects_table {
    tr {
      .edit {
        font-size: 20px;
      }
    }
    th {
      color: #999;
      font-size: 80%;
      padding: 10px 5px;
    }

    td {
      padding: 10px 5px;
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
