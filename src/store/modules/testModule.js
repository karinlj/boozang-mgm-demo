import db from "@/firebase/init";

export const testModule = {
  state: {
    tests: [],
  },
  getters: {
    tests(state) {
      // console.log("state.tests", state.tests);
      return state.tests;
    },
  },
  actions: {
    //fetch projects from db
    fetchTests(context) {
      // console.log("hej fetchTests");
      let testsFromDb = [];
      db.collection("tests")
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            let test = doc.data(); //all the data
            //lägger in id:t i data() temporärt
            test.id = doc.id;
            test.latestExecution = test.latestExecution.seconds;
            testsFromDb = [...testsFromDb, test];
          });
          //call the mutation
          context.commit("setTests", testsFromDb);
        })
        .catch((error) => console.error("error", error));
    },
  },

  mutations: {
    setTests: (state, payload) => {
      // console.log("get_tests", payload);
      state.tests = payload;
    },
  },
};
