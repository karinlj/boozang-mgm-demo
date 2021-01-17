<template>
  <div class="card cyan">
    <div class="card-content">
      <Header headingColor="white-text" heading="Scale Up License" />
      <i
        class="material-icons yellow-text conditionWarning"
        v-if="conditionExceeded"
        :title="conditionExceededType"
        >warning</i
      >
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
              <span>
                {{ license && license.maxActions }} / {{ calcMonth() }}</span
              >
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
import Header from "./shared/Header";
import { mapGetters } from "vuex";
import { mapActions } from "vuex";
import calcMonthMixin from "../mixins/calcMonthMixin";

export default {
  name: "License",
  components: {
    Header,
  },
  data() {
    return {
      license: null,
      feedback: null,
      conditionExceeded: false,
      conditionExceededType: "",
      slug: "scale-up",
      actions: 300000,
    };
  },
  computed: {
    ...mapGetters({
      testers: "testers",
      projects: "projects",
    }),
  },
  methods: {
    //fetch testers and projects
    ...mapActions(["fetchTesters", "fetchProjects"]),

    countConditions() {
      if (
        this.license.maxTeamMembers < this.testers.length ||
        this.license.maxActions < this.actions ||
        this.license.maxNumberOfProjects < this.projects.length
      ) {
        this.conditionExceeded = true;
      }
      if (this.license.maxTeamMembers < this.testers.length) {
        this.conditionExceededType = "Max number of Team Members exceeded.";
      } else if (this.license.maxActions < this.actions) {
        this.conditionExceededType = "Max number of Actions exceeded.";
      } else {
        this.conditionExceededType = "Max number of Projects exceeded.";
      }
    },
  },

  created() {
    this.fetchTesters();
    this.fetchProjects();
    // //1.  get license by the slug, we dont have the id??
    db.collection("licenses")
      .where("slug", "==", this.slug)
      //get the data (should be just one, but in a collection)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          this.license = doc.data();
          // console.log("license", this.license);
          this.license.id = doc.id;
          //console.log("license.id", this.license.id);
        });
        this.countConditions();
      });
  },
  mixins: [calcMonthMixin],
};
</script>

<style lang="scss">
.conditionWarning {
  cursor: pointer;
  position: absolute;
  top: 20px;
  right: 15px;
}
.license_table {
  color: #fff;
  tr {
    border-bottom: 1px solid #80deea;
  }
}
</style>
