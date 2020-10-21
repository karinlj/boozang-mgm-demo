<template>
  <div class="card">
    <div class="card-content">
      <header class="list_header">
        <h5 class="purple-text">Projects</h5>
        <router-link :to="{ name: 'AddProject' }" class="btn-small green accent-4">
          Add project
        </router-link>
      </header>
      <table id="projects_table" class="responsive-table striped">
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Last updated</th>
            <th>#</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="project in projects" :key="project.id">
            <td>
              <p class="btn btn-floating purple">{{ project.name[0] }}{{ project.name[1] }}</p>
            </td>
            <td>{{ project.name }}</td>
            <td class="last_updated">{{ formatDate(project.lastUpdated) }}</td>
            <td class="number">number</td>
            <td>
              <router-link
                :to="{
                  name: 'EditProject',
                  params: { project_slug: project.slug },
                }"
              >
                <i class="material-icons edit">edit</i>
              </router-link>
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
  name: "ListProjects",
  data() {
    return {
      projects: [],
      testers: [],
      feedback: null,
    };
  },
  methods: {
    formatDate(lastUpdated) {
      let date = new Date(lastUpdated * 1000);
      let format = date.toISOString().slice(0, 10);
      return format;
    },
  },

  created() {
    //fetch data from firestore
    db.collection("projects")
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          // console.log("doc.data()", doc.data());
          // console.log("doc.id", doc.id);
          let project = doc.data(); //all the data
          project.lastUpdated = project.lastUpdated.seconds;
          //lägger projekten i min data-prop
          this.projects.push(project);
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
          this.testers.push(tester);
          console.log("testers", this.testers);
        });
      });
  },
  computed: {
    // compclasses() {
    //   //return an object with class and prop
    //   return {
    //     availableClass: this.available,
    //     nearbyClass: this.nearby,
    //   };
    // },
    //computed watch the variable it needs to run and updates only when needed
  },
};
</script>

<style lang="scss">
.card {
  height: 350px;
  overflow: auto;
  border-radius: 5px;
  .list_header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
  }
  #projects_table {
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
      &.last_updated {
        color: #999;
        font-size: 80%;
      }
      &.number {
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
    }
  }
  h5 {
    margin-top: 0;
  }
}
</style>
