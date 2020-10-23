<template>
  <div class="card">
    <div class="card-content">
      <header class="list_header">
        <h5 class="blue-text">Team members</h5>
        <router-link :to="{ name: 'AddTester' }" class="btn-small green accent-4">
          Add Team member
        </router-link>
      </header>
      <table id="testers_table" class="responsive-table striped">
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Latest activity</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="tester in testers" :key="tester.id">
            <td>
              <p class="btn btn-floating blue">
                {{ tester.firstname[0] + tester.lastname[0] }}
              </p>
            </td>
            <td>{{ tester.firstname }} {{ tester.lastname }}</td>
            <td class="latest_activity">{{ formatDate(tester.latestActivity) }}</td>
            <td>
              <!-- dynamic class set in method -->
              <i class="material-icons" :class="calculateStatus(tester.latestActivity)"
                >fiber_manual_record</i
              >
            </td>
            <td>
              <router-link
                :to="{
                  name: 'EditTester',
                  params: { tester_slug: tester.slug },
                }"
              >
                <i class="material-icons blue-text edit">edit</i>
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- lägger toggling på div runt om span -->
      <!-- <div class="test">
        <h5>Dynamic CSS</h5>
        <h6>Exampe 2</h6>
        <button @click="nearby = !nearby">Toggle nearby</button>
        <button @click="available = !available">Toggle available</button>
        <div :class="compclasses">
          <span>Ryu</span>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script>
import db from "@/firebase/init";

export default {
  name: "ListTesters",
  data() {
    return {
      // available: false,
      // nearby: false,

      testers: [],
      feedback: null,
      latestActivity: null,
    };
  },
  methods: {
    calculateStatus(latestActivity) {
      //today - latestActivity in seconds
      let diffTime = Math.floor(Date.now() / 1000) - latestActivity;
      //  console.log("####");
      //within one hour
      if (diffTime < 3600) {
        //console.log("diffHour");
        return "green-text";
        //within one week
      } else if (diffTime < 3600 * 24 * 7) {
        // console.log("diffWeek");
        return "yellow-text";
        //more than one week
      } else {
        // console.log("diffMoreThanWeek");
        return "grey-text";
      }
    },
    formatDate(latestActivity) {
      let date = new Date(latestActivity * 1000);
      let format = date.toISOString().slice(0, 10);
      return format;
    },
  },

  created() {
    //fetch data from firestore
    db.collection("testers")
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          // console.log("doc.data()", doc.data());
          // console.log("doc.id", doc.id);
          let tester = doc.data(); //all the data
          tester.latestActivity = tester.latestActivity.seconds;
          this.testers.push(tester);
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
  // .test {
  //   span {
  //     display: inline-block;
  //     padding: 0.5rem;
  //     color: white;
  //     background: red;
  //     margin-bottom: 2rem;
  //   }
  //   .availableClass {
  //     span {
  //       background: green;
  //     }
  //   }
  //   .nearbyClass {
  //     span {
  //       &:after {
  //         content: "nearby";
  //         margin-left: 10px;
  //       }
  //     }
  //   }
  // }
}
</style>
