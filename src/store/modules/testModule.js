import db from "@/firebase/init";
import firebase from "firebase";
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
    //add tester
    addTester(context, payload) {
      //sätt firebase timestamp
      let myTimestamp = firebase.firestore.Timestamp.fromDate(new Date());

      const testerData = {
        firstname: payload.firstname,
        lastname: payload.lastname,
        email: payload.email,
        latestActivity: myTimestamp,
        slug: payload.slug,
        projects: [],
      };

      //add to db
      db.collection("testers")
        .add(testerData)
        .then(() => {
          //  redirect
          //     this.$router.push({ name: "Home" });
        });
      context.commit("addTesterToDb", {
        //take all props and merge them into a new object
        ...testerData,
      });
    },
  },

  mutations: {
    setTests: (state, payload) => {
      // console.log("get_tests", payload);
      state.tests = payload;
    },
    addTesterToDb(state, payload) {
      state.tests = [...state.tests, payload];
    },
  },
};
