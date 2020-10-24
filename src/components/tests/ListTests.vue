<template>
  <div class="card">
    <div class="card-content">
      <header class="list_header">
        <h5 class="cyan-text">Test executions</h5>
      </header>
      <table id="testers_table" class="responsive-table striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
            <th>Duration</th>
            <th>Latest execution</th>
            <th>Project</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="test in tests" :key="test.id">
            <td>{{ test.name }}</td>
            <td>
              <!-- dynamic class -->
              <i class="material-icons" :class="test.success ? 'green-text' : 'red-text'"
                >fiber_manual_record</i
              >
            </td>
            <td class="duration">{{ secondsToMinutes(test.duration) }}</td>
            <td class="latest_execution">{{ formatDate(test.latestExecution) }}</td>
            <td>
              <p class="btn btn-floating purple">
                {{ getProject(test.projectId) }}
              </p>
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
  name: "ListTests",
  data() {
    return {
      tests: [],
      projects: [],
      feedback: null,
      latestActivity: null,
    };
  },
  methods: {
    getProject(projectId) {
      //bara en kolumn
      //för detta projectId leta upp motsvarande projectId i Projects och få namnet därifrån
      let project = this.projects.find((project) => {
        return project.id === projectId;
      });
      //console.log("project", project.name);
      return project.name[0] + project.name[1];
    },
    secondsToMinutes(time) {
      let testTime = Math.floor(time / 60) + "min " + Math.floor(time % 60) + "s ";
      // console.log("testTime", testTime);
      return testTime;
    },

    //  calculateStatus(latestExecution) {
    //   //today - latestActivity in seconds
    //   let diffTime = Math.floor(Date.now() / 1000) - latestExecution;
    //   //  console.log("####");
    //   //within one hour
    //   if (diffTime < 3600) {
    //     //console.log("diffHour");
    //     return "green-text";
    //     //within one week
    //   } else if (diffTime < 3600 * 24 * 7) {
    //     // console.log("diffWeek");
    //     return "yellow-text";
    //     //more than one week
    //   } else {
    //     // console.log("diffMoreThanWeek");
    //     return "grey-text";
    //   }
    // },
    formatDate(latestExecution) {
      let date = new Date(latestExecution * 1000);
      let format = date
        .toISOString()
        .slice(0, 16)
        .replace("T", " ");
      return format;
    },
  },

  created() {
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
      });
    this.secondsToMinutes();
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
  #testers_table {
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
      &.latest_execution {
        color: #999;
        font-size: 80%;
      }
      &.duration {
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
