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
      <p>{{ testers }}</p>

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
import db from "@/firebase/init";
import firestore from "firebase/firestore";
//import firebase from "firebase";
import { mapGetters } from "vuex";
import { mapActions } from "vuex";
export default {
  name: "EditTester",
  data() {
    return {
      //store the db-answer from created() in tester
      tester: null,
      projects: [],
      feedback: null,
      projectsOnTester: [],
    };
  },
  computed: {
    //get from state
    ...mapGetters({
      testers: "testers",
    }),
  },
  methods: {
    //fetch from db
    ...mapActions(["fetchTesters"]),

    // getSingleTester(){
    //   console.log('this.testers', this.testers)
    // }

    findProjects() {
      //hela gui-tabellen
      //löpa över hugo's alla projekt för att hämta projekt från projekt-tabell

      // console.log("this.tester.projects[0]", this.tester.projects[0]);

      //1. löpa över hugo's alla projekt
      // for (let i = 0; i < this.tester.projects.length; i++) {
      //   //console.log("this.tester.projects-index", this.tester.projects[i]);
      //   //2. löpa över alla projekt i projekt-tabell, lägg i variabel
      //   //3. hitta projekt med samma id som projectsOnTester[i]
      //   let projectInTable = this.projects.find((item) => {
      //     return item.id === this.tester.projects[i].id;
      //   });
      //   console.log("projectInTable", projectInTable);
      // }

      //1. löpa över hugo's alla projekt
      this.tester.projects.forEach((item) => {
        //2. löpa över alla projekt i projekt-tabell, lägg i variabel
        let project = this.projects.find((project) => {
          //3. hitta projekt med samma id som item
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

        //sätt firebase timestamp
        let myTimestamp = firestore.Timestamp.fromDate(new Date());

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
          this.$router.push({ name: "Home" });
        });
    },
    // getTester() {
    //   let slug = this.$route.params.tester_slug;
    //   //console.log("slug", slug);
    //   //console.log("this.testers", this.testers);

    //   this.tester = this.testers.find((tester) => {
    //     return tester.slug === slug;
    //   });
    //   console.log("tester", this.tester);
    // },
  },
  created() {
    this.fetchTesters();
    // this.getTester();
    //1.  get tester by the slug, we dont have the id
    let ref = db
      .collection("testers")
      .where("slug", "==", this.$route.params.tester_slug);
    //get the data (should be just one, but in a collection)
    ref.get().then((snapshot) => {
      snapshot.forEach((doc) => {
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

<style lang="scss"></style>
