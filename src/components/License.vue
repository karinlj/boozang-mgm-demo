<template>
  <div class="card cyan">
    <div class="card-content">
      <header class="list_header">
        <h5 class="white-text">Scale Up License</h5>
        <i
          class="material-icons yellow-text conditionWarning"
          v-if="conditionExceeded"
          :title="testers.length"
          >warning</i
        >
      </header>
      <table class="license_table">
        <tbody>
          <tr>
            <td>
              <span>Number of Team Members: </span>
            </td>
            <td>
              <span> {{ testers.length }} /</span>
              <span> {{ license && license.maxTeamMembers }} </span>
            </td>
          </tr>
          <tr>
            <td><span>Actions: </span></td>
            <td>
              <span> {{ actions }} /</span>
              <span> {{ license && license.maxActions }} / month</span>
            </td>
          </tr>
          <tr>
            <td><span>Number of Projects: </span></td>
            <td>
              <span> {{ projects.length }} /</span>
              <span> {{ license && license.maxNumberOfProjects }} </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import db from "@/firebase/init";

export default {
  name: "License",
  data() {
    return {
      license: null,
      testers: [],
      projects: [],
      feedback: null,
      conditionExceeded: false,
      slug: "scale-up",
      actions: 300000,
    };
  },
  methods: {
    countConditions() {
      if (
        this.license.maxTeamMembers < this.testers.length ||
        this.license.maxActions < this.actions ||
        this.license.maxNumberOfProjects < this.projects.length
      ) {
        this.conditionExceeded = true;
        //console.log("conditionExceeded", this.conditionExceeded);
      }
    },
  },
  created() {
    //fetch tests firestore
    db.collection("testers")
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          let tester = doc.data(); //all the data
          //lägger in id:t i data() temporärt
          tester.id = doc.id;
          this.testers.push(tester);
        });
        // console.log("testers", this.testers);
      });
    //fetch projects firestore
    db.collection("projects")
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          let project = doc.data(); //all the data
          //lägger in id:t i data() temporärt
          project.id = doc.id;
          project.lastUpdated = project.lastUpdated.seconds;
          //lägger projekten i min data-prop
          this.projects.push(project);
        });
        //console.log("projects", this.projects);
      });
    //1.  get license by the slug, we dont have the id??
    db.collection("licenses")
      .where("slug", "==", this.slug)
      //get the data (should be just one, but in a collection)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          this.license = doc.data();
          console.log("license", this.license);
          this.license.id = doc.id;
          console.log("license.id", this.license.id);
        });
        this.countConditions();
      });
  },
};
</script>

<style lang="scss">
.conditionWarning {
  cursor: pointer;
}
.license_table {
  color: #fff;
  tr {
    border-bottom: 1px solid #80deea;
  }
}
</style>
