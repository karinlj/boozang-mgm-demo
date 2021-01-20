import db from "@/firebase/init";
// import firebase from "firebase";
import firestore from "firebase/firestore";
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
      let myTimestamp = firestore.Timestamp.fromDate(new Date());

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
    updateProject(context, payload) {
      console.log("payload", payload);
      let myTimestamp = firestore.Timestamp.fromDate(new Date());
      // console.log("Date", myTimestamp);

      const updatedData = {
        name: payload.name,
        description: payload.description,
        latestActivity: myTimestamp,
        id: payload.id,
        slug: payload.slug,
      };
      //uppdatera detta projekt
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
      state.projects = [...state.projects, payload];
    },
    updProjectInGui: (state, payload) => {
      console.log("updProjectInGui", state.testers, payload);
    },
    removeProjectFromGui(state, payload) {
      console.log("removeProjectFromGui", payload);
    },
  },
};
