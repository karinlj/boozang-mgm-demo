<template>
  <div class="card">
    <div class="card-content">
      <Header
        headingColor="blue-text"
        heading="Team members"
        linkName="AddTester"
        btnName="Add Team member"
      ></Header>

      <table id="dashboard_table" class="table striped">
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
            <!-- single tester -->
            <td>
              <p class="btn btn-floating blue">
                {{ tester.firstname[0] + tester.lastname[0] }}
              </p>
            </td>
            <td>{{ tester.firstname }} {{ tester.lastname }}</td>
            <!-- dynamic class set in method -->
            <td class="timestamp">{{ formatDate(tester.latestActivity) }}</td>
            <td>
              <i
                class="material-icons"
                :class="calculateStatus(tester.latestActivity)"
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
    </div>
  </div>
</template>

<script>
import Header from "../shared/Header";
import { mapGetters } from "vuex";
import { mapActions } from "vuex";
import mixins from "../../mixins/mixins";

export default {
  name: "ListTesters",
  components: {
    Header,
  },
  data() {
    return {
      feedback: null,
      latestActivity: null,
    };
  },
  //getters in computed
  computed: {
    //get from state
    ...mapGetters({
      testers: "testers",
    }),
    // getTesters() {
    //   return this.$store.getters["testers"];
    // },
  },
  //actions in methods
  methods: {
    //fetch from db
    ...mapActions(["fetchTesters"]),
    // fetchTesters() {
    //   this.$store.dispatch("fetchTesters");
    // },

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
  },
  created() {
    this.fetchTesters();
  },
  mixins: [mixins],
};
</script>

<style lang="scss"></style>
