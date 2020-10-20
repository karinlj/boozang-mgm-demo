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
          </tr>
        </thead>
        <tbody>
          <tr v-for="project in projects" :key="project.id">
            <td>
              <p class="btn btn-floating purple">
                P
              </p>
            </td>
            <td>{{ project.name }}</td>

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
      feedback: null,
    };
  },
  methods: {
    // formatDate(latestActivity) {
    //   let date = new Date(latestActivity * 1000);
    //   let format = date.toISOString().slice(0, 10);
    //   return format;
    // },
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
          //lägger projekten i min data-prop
          this.projects.push(project);
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
    }
  }
  h5 {
    margin-top: 0;
  }
}
</style>
