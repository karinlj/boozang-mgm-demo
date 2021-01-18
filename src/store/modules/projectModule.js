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
    //fetch projects firestore
    fetchProjects(context) {
      // console.log("hej fetchProjects");
      let projectsFromDb = [];
      db.collection("projects")
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            let project = doc.data(); //all the data
            //lägger in id:t i data() temporärt
            project.id = doc.id;
            project.lastUpdated = project.lastUpdated.seconds;
            //lägger projekten i tom array
            projectsFromDb = [...projectsFromDb, project];
          });
          context.commit("setProjects", projectsFromDb);
        })
        .catch((error) => console.error("error", error));
    },
    addProject(context, payload) {
      //sätt firebase timestamp
      let myTimestamp = firebase.firestore.Timestamp.fromDate(new Date());

      const projectData = {
        name: payload.name,
        lastUpdated: myTimestamp,
        slug: payload.slug,
      };
      console.log("projectData", projectData);
      //add to db
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
  },

  mutations: {
    setProjects: (state, payload) => {
      // console.log("get_projects", payload);
      state.projects = payload;
    },
    addProjectToDb: (state, payload) => {
      state.projects = [...state.projects, payload];
    },
  },
};
