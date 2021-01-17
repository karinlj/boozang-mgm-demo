import db from "@/firebase/init";

export const testerModule = {
  state: {
    testers: [],
  },
  //getting the state into our components
  getters: {
    testers(state) {
      // console.log("state.testers", state.testers);
      return state.testers;
    },
  },
  //action to make a data request, get a response and call a mutation
  actions: {
    fetchTesters(context) {
      let testersFromDb = [];
      db.collection("testers")
        .get()
        .then((snapshot) => {
          //do something when testers are fetched
          snapshot.forEach((doc) => {
            // console.log("doc.data()", doc.data());
            // console.log("doc.id", doc.id);
            let tester = doc.data(); //all the data
            tester.latestActivity = tester.latestActivity.seconds;
            testersFromDb = [...testersFromDb, tester];
          });
          //call the mutation
          context.commit("setTesters", testersFromDb);
        })
        .catch((error) => console.error("error", error));
    },
  },
  //change the state
  //state 1st argument
  mutations: {
    //take the response (array of testers) and add to the state
    setTesters: (state, payload) => {
      // console.log("get_testers", payload);
      state.testers = payload;
    },
  },
};
