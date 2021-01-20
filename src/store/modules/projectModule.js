import db from "@/firebase/init";
import firebase from "firebase";
export const projectModule = {
  state: {
    projects: [],
  },
  getters: {
    projects(state) {
      // console.log("state.projects", state.projects);
      return state.projects;
    },
  },
  actions: {
    fetchProjects(context) {
      //console.log("hej fetchProjects");
      let projectsFromDb = [];
      db.collection("projects")
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            let project = doc.data(); //all the data
            //lägger in id:t i data() temporärt
            project.id = doc.id;
            project.lastUpdated = project.lastUpdated.seconds;
            projectsFromDb = [...projectsFromDb, project];
          });
          context.commit("setProjects", projectsFromDb);
        })
        .catch((error) => console.error("error", error));
    },
    addProject(context, payload) {
      let myTimestamp = firebase.firestore.Timestamp.fromDate(new Date());

      const projectData = {
        name: payload.name,
        latestActivity: myTimestamp,
        slug: payload.slug,
      };
      //console.log("projectData", projectData);
      db.collection("projects")
        .add(projectData)
        .then(() => {
          context.commit("addProjectToDb", {
            //take all props and merge them into a new object
            ...projectData,
          });
        })
        .catch((error) => console.log("error", error));
    },
    updateProject(context, payload) {
      // console.log("payload", payload);
      let myTimestamp = firebase.firestore.Timestamp.fromDate(new Date());

      const updatedData = {
        name: payload.name,
        description: payload.description,
        lastUpdated: myTimestamp,
        id: payload.id,
        slug: payload.slug,
      };
      //console.log("updateProject", updatedData);
      db.collection("projects")
        //this.project.id = doc.id from created()
        .doc(updatedData.id)
        .update(updatedData)
        .then(() => {
          context.commit("updProjectInGui", {
            ...updatedData,
          });
        });
    },
    removeProject(context, payload) {
      console.log("payload", payload);
    },
  },

  mutations: {
    setProjects: (state, payload) => {
      // console.log("get_projects", payload);
      state.projects = payload;
    },
    addProjectToDb: (state, payload) => {
      state.projects = [payload, ...state.projects];
    },
    updProjectInGui: (state, payload) => {
      //behövs detta??
      console.log("updProjectInGui_before_func", state.projects, payload);
      const index = state.projects.findIndex((project) => {
        return project.id === payload.id;
      });
      state.projects.splice(index, 1, payload);
      console.log("updProjectInGui_after_func", state.projects);
    },
    removeProjectFromGui(state, payload) {
      console.log("removeProjectFromGui", payload);
    },
  },
};
