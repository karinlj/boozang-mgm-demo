import db from "@/firebase/init";
import firebase from "firebase";
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
    //add tester
    addTester(context, payload) {
      //sätt firebase timestamp
      let myTimestamp = firebase.firestore.Timestamp.fromDate(new Date());
      console.log("myTimestamp", myTimestamp);

      const testerData = {
        firstname: payload.firstname,
        lastname: payload.lastname,
        email: payload.email,
        latestActivity: myTimestamp,
        slug: payload.slug,
        projects: [],
      };
      console.log("testerData", testerData);
      //add to db
      db.collection("testers")
        .add(testerData)
        //do something when todo is added
        .then(() => {
          context.commit("addTesterToDb", {
            //take all props and merge them into a new object
            ...testerData,
          });
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
    addTesterToDb(state, payload) {
      state.testers = [...state.testers, payload];
    },
  },
};
