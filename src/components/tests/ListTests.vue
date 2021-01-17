<template>
  <div class="card">
    <div class="card-content">
      <Header headingColor="cyan-text" heading="Test executions"></Header>

      <table id="dashboard_table" class="responsive-table striped">
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
              <i
                class="material-icons"
                :class="test.success ? 'green-text' : 'red-text'"
                >fiber_manual_record</i
              >
            </td>
            <td class="timestamp">{{ secondsToMinutes(test.duration) }}</td>
            <td class="timestamp">
              {{ formatDate(test.latestExecution) }}
            </td>
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
import { mapGetters } from "vuex";
import { mapActions } from "vuex";
import Header from "../shared/Header";
import mixins from "../../mixins/mixins";

export default {
  name: "ListTests",
  components: {
    Header,
  },
  data() {
    return {
      feedback: null,
    };
  },
  computed: {
    ...mapGetters({
      tests: "tests",
      projects: "projects",
    }),
  },
  methods: {
    //fetch tests and projects
    ...mapActions(["fetchTests", "fetchProjects"]),

    getProject(projectId) {
      //bara en kolumn
      //för detta projectId leta upp motsvarande projectId i Projects och få namnet därifrån
      let project = this.projects.find((project) => {
        return project.id === projectId;
      });
      return project.name[0] + project.name[1];
    },
  },
  created() {
    this.fetchTests();
    this.fetchProjects();
    //this.secondsToMinutes();
  },
  mixins: [mixins],
};
</script>

<style lang="scss"></style>
