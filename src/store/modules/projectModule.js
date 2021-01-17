import db from "@/firebase/init";
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
  },

  mutations: {
    setProjects: (state, payload) => {
      // console.log("get_projects", payload);
      state.projects = payload;
    },
  },
};
