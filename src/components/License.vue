<template>
  <div class="card">
    <div class="card-content">
      <header class="list_header">
        <h5 class="deep-orange-text">License: Scale Up</h5>
      </header>
      <table>
        <tbody v-for="license in licenses" :key="license.id">
          <tr>
            <td><span>Team Members: </span></td>
            <td>{{ license.maxTeamMembers }}</td>
          </tr>
          <tr>
            <td><span>Actions: </span></td>
            <td>{{ license.maxActions }}</td>
          </tr>
          <tr>
            <td><span>Number of Projects: </span></td>
            <td>{{ license.maxNumberOfProjects }}</td>
          </tr>
        </tbody>
      </table>
      <!-- 
      <ul class="collection license_list" v-for="license in licenses" :key="license.id">
        <li class="collection-item">
          <div></div>
        </li>
        <li class="collection-item">
          <span>Actions: </span>
          <div>{{ license.maxActions }}</div>
        </li>
        <li class="collection-item">
          <span>Number of Projects: </span>
          <div>{{ license.maxNumberOfProjects }}</div>
        </li>
      </ul> -->
    </div>
  </div>
</template>

<script>
import db from "@/firebase/init";

export default {
  name: "License",
  data() {
    return {
      licenses: [],
      tests: [],
      projects: [],
      feedback: null,
    };
  },
  methods: {
    // getProject(projectId) {
    //   //bara en kolumn
    //   //för detta projectId leta upp motsvarande projectId i Projects och få namnet därifrån
    //   let project = this.projects.find((project) => {
    //     return project.id === projectId;
    //   });
    //   //console.log("project", project.name);
    //   return project.name[0] + project.name[1];
    // },
  },
  created() {
    //fetch licenses firestore
    db.collection("licenses")
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          let license = doc.data(); //all the data
          //lägger in id:t i data() temporärt
          license.id = doc.id;
          this.licenses.push(license);
        });
        console.log("licenses", this.licenses);
      });

    //fetch tests firestore
    db.collection("tests")
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          let test = doc.data(); //all the data
          //lägger in id:t i data() temporärt
          test.id = doc.id;
          test.latestExecution = test.latestExecution.seconds;
          this.tests.push(test);
        });
        console.log("tests", this.tests);
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
        console.log("projects", this.projects);
      });
  },
};
</script>

<style lang="scss">
// .license_list {
//   li {
//     span,
//     div {
//       display: inline-block;
//     }
//   }
// }
</style>
