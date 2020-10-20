<template>
  <div class="home">
    <div class="container">
      <div class="row">
        <div class="col s12 m12">
          <div class="card">
            <div class="card-content">
              <header class="tester_header">
                <h5 class="cyan-text">Boozang testers</h5>
                <!-- <button class="btn-small green accent-4" @click="$refs.addModal.openModal()">
                  Add tester
                </button> -->
              </header>

              <div class="col s12 m6">
                <h6 class="blue-text">Add tester</h6>
                <form @submit.prevent="addtester" class="card-panel">
                  <div class="row">
                    <div class="field col s6">
                      <label for="firstname">Firstname</label>
                      <input type="text" name="firstname" v-model="tester.firstname" required />
                    </div>
                    <div class="field col s6">
                      <label for="lastname">Lastname</label>
                      <input type="text" name="lastname" v-model="tester.lastname" required />
                    </div>
                  </div>
                  <div class="row">
                    <div class="field col s6">
                      <label for="email">Email</label>
                      <input type="text" name="email" v-model="tester.email" required />
                    </div>
                    <!-- outputting editable ingredients with input-element-->
                    <div class="field col s6">
                      <div v-for="(project, index) in tester.projects" :key="index">
                        <label for="project">Project</label>
                        <!-- must bind to something in data(): projects (not project) -->
                        <input type="text" name="project" v-model="tester.projects[index]" />
                      </div>

                      <div class="field add-project">
                        <label for="add-project">Project:</label>
                        <input
                          type="text"
                          name="add-project"
                          @keydown.enter.prevent="addProject"
                          v-model="anotherProject"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="field center-align">
                    <p class="red-text" v-if="feedback">{{ feedback }}</p>
                  </div>
                </form>
              </div>

              <table id="testers_table" class="responsive-table striped">
                <thead>
                  <tr>
                    <th></th>
                    <th>Name</th>
                    <th>Latest activity</th>
                    <th>Active Projects</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="tester in testers"
                    :key="tester.id"
                    @click="$refs.editModal.openModal()"
                  >
                    <td>
                      <p class="btn btn-floating cyan">
                        {{ tester.firstname[0] + tester.lastname[0] }}
                      </p>
                    </td>
                    <td>{{ tester.firstname }} {{ tester.lastname }}</td>
                    <td class="latest_activity">{{ tester.latestActivity }}</td>
                    <td class="active"><i class="material-icons" v-if="tester.active">done</i></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- <div class="col s12 m6">
          <div class="card">
            <div class="card-content">
              <h5 class="pink-text">Some content here</h5>
            </div>
          </div>
        </div> -->
        <div class="col s12 m6 l3">
          <div class="card green accent-4">
            <div class="card-content">
              <h5 class="white-text">Some content here</h5>
            </div>
          </div>
        </div>
        <div class="col s12 m6 l3">
          <div class="card">
            <div class="card-content">
              <h5 class="amber-text">Some content here</h5>
            </div>
          </div>
        </div>
        <div class="col s12 m6">
          <div class="card">
            <div class="card-content">
              <h5 class="purple-text">Some content here</h5>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- addModal -->
    <modal ref="addModal">
      <template v-slot:header>
        <h5 class="blue-text">Add tester</h5>
      </template>
      <template v-slot:body>
        <!-- <form @submit.prevent="addtester" class="card-panel"> -->
        <form class="card-panel">
          <div class="row">
            <div class="field col s6">
              <label for="firstname">Firstname</label>
              <input type="text" name="firstname" v-model="tester.firstname" required />
            </div>
            <div class="field col s6">
              <label for="lastname">Lastname</label>
              <input type="text" name="lastname" v-model="tester.lastname" required />
            </div>
          </div>
          <div class="row">
            <div class="field col s6">
              <label for="email">Email</label>
              <input type="text" name="email" v-model="tester.email" required />
            </div>
            <!-- outputting editable ingredients with input-element-->
            <div class="field col s6">
              <div v-for="(project, index) in tester.projects" :key="index">
                <label for="project">Project</label>
                <!-- must bind to something in data(): projects (not project) -->
                <input type="text" name="project" v-model="tester.projects[index]" />
              </div>

              <div class="field add-project">
                <label for="add-project">Project:</label>
                <input
                  type="text"
                  name="add-project"
                  @keydown.enter.prevent="addProject"
                  v-model="anotherProject"
                />
              </div>
            </div>
          </div>
          <div class="field center-align">
            <p class="red-text" v-if="feedback">{{ feedback }}</p>
          </div>
        </form>
      </template>
      <template v-slot:footer>
        <button class="btn-small grey lighten-1" @click="$refs.addModal.closeModal()">
          Cancel
        </button>
        <button class="btn-small green accent-4" type="submit" @click="addtester">
          Save
        </button>
      </template>
    </modal>

    <!-- editModal -->
    <modal ref="editModal">
      <template v-slot:header>
        <h5 class="blue-text">Edit tester</h5>
      </template>
      <template v-slot:body>
        <form @submit.prevent="edittester" class="card-panel">
          <div class="row">
            <div class="field col s6">
              <label for="firstname">Firstname</label>
              <input type="text" name="firstname" v-model="tester.firstname" />
            </div>
            <div class="field col s6">
              <label for="lastname">Lastname</label>
              <input type="text" name="lastname" v-model="tester.lastname" />
            </div>
          </div>
          <div class="row">
            <div class="field col s6">
              <label for="email">Email</label>
              <input type="text" name="email" v-model="tester.email" />
            </div>
            <div class="field col s6">
              <div v-for="project in tester.projects" :key="project">
                <label for="projects">Projects</label>
                <input type="text" name="projects" v-model="tester.projects" />
              </div>
            </div>
          </div>
          <div class="field center-align">
            <p class="red-text" v-if="feedback">{{ feedback }}</p>
          </div>
        </form>
      </template>
      <template v-slot:footer>
        <button class="btn-small grey lighten-1" @click="$refs.editModal.closeModal()">
          Cancel
        </button>
        <button class="btn-small green accent-4" @click="$refs.editModal.closeModal()">
          Save
        </button>
      </template>
    </modal>
  </div>
</template>

<script>
import testers from "../data/testers";
import Modal from "./modals/Modal";
//import moment from "moment";
export default {
  name: "Home",
  components: {
    Modal,
  },
  data() {
    return {
      testers: [],
      feedback: null,
      tester: {
        id: Math.floor(Math.random() * 100),
        initials: "",
        firstname: "",
        lastname: "",
        latestActivity: null,
        active: true,
        projects: [],
      },
      anotherProject: null,
    };
  },
  methods: {
    edittester() {
      //
    },
    addtester() {
      // required???
      if (this.tester) {
        this.testers.push(this.tester);
        this.$refs.addModal.closeModal();
        this.feedback = null;
      } else {
        this.feedback = "Please fill in full name and email";
      }
    },
    addProject() {
      if (this.anotherProject) {
        this.tester.projects.push(this.anotherProject);
        //console.log(this.tester.projects);
        this.anotherProject = null;
        this.feedback = null;
      } else {
        this.feedback = "Please enter a project.";
      }
    },
  },
  created() {
    this.testers = testers;
  },
};
</script>

<style lang="scss">
.home {
  margin-top: 2rem;
  .card {
    height: 600px;
    // height: 350px;
    overflow: auto;
    border-radius: 5px;
    .tester_header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
    }
    #testers_table {
      tr {
        cursor: pointer;
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
        &.active {
          i {
            color: limegreen;
          }
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
  .overflow-hidden {
    overflow: hidden;
  }
}
</style>
