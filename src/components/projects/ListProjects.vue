<template>
  <div class="card">
    <div class="card-content">
      <Header
        headingColor="purple-text"
        heading="Projects"
        linkName="AddProject"
        btnName="Add Project"
      ></Header>

      <table id="dashboard_table" class="table striped">
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
              <p class="btn btn-floating purple">
                {{ project.name[0] }}{{ project.name[1] }}
              </p>
            </td>
            <td>{{ project.name }}</td>
            <td class="timestamp">
              {{ formatDate(project.lastUpdated) }}
            </td>
            <td class="">{{ numberoOfTesters(project.id) }}</td>
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
import { mapGetters } from "vuex";
import { mapActions } from "vuex";
import Header from "../shared/Header";
import mixins from "../../mixins/mixins";
export default {
  name: "ListProjects",
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
      testers: "testers",
      projects: "projects",
    }),
  },
  methods: {
    //fetch projects firestore
    ...mapActions(["fetchProjects", "fetchTesters"]),

    numberoOfTesters(projectId) {
      //i HTML: loopar över project collection
      //ett projekt-id, en testare
      //console.log("projectId", projectId);
      //kolla vilka testare som har detta projekt
      //loopa igenom testare,loopa igenom deras projekt, kolla vilka som har detta projekt.id
      //i koden: loopa över testare
      let testersOnProject = this.testers.filter((tester) => {
        return tester.projects.find((project) => {
          return project.id == projectId;
        });
      });
      // console.log("testersOnProject", testersOnProject);

      //kolla hur många testare som har detta projekt
      let numberOfTesters = testersOnProject.length;
      //console.log("numberOfTesters", numberOfTesters);
      return numberOfTesters;
    },
  },
  created() {
    this.fetchProjects();
    this.fetchTesters();
  },
  mixins: [mixins],
};
</script>

<style lang="scss"></style>
