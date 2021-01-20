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
            tester.id = doc.id;
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
      // console.log("testerData", testerData);
      //add to db
      db.collection("testers")
        .add(testerData)
        //do something when todo is added
        .then(() => {
          context.commit("addTesterInGui", {
            //take all props and merge them into a new object
            ...testerData,
          });
        })
        .catch((error) => console.error("error", error));
    },
    //action for any kind of update
    updateTester(context, payload) {
      //sätt firebase timestamp
      let myTimestamp = firebase.firestore.Timestamp.fromDate(new Date());

      const updatedData = {
        firstname: payload.firstname,
        lastname: payload.lastname,
        latestActivity: myTimestamp,
        email: payload.email,
        slug: payload.slug,
        id: payload.id,
      };
      //console.log("updatedData", updatedData);

      db.collection("testers")
        //grab the doc and update it
        //this.tester.id = doc.id from created()
        .doc(updatedData.id)
        .update(updatedData)
        .then(() => {
          context.commit("updTesterInGui", {
            ...updatedData,
          });
        })
        .catch((error) => console.error("error", error));
    },
    removeTester(context, payload) {
      db.collection("testers")
        //ref to a doc with an id, delete from db
        .doc(payload)
        .delete()
        .then(() => {
          context.commit("removeTesterFromGui", payload);
        })
        .catch((error) => console.error("error", error));
    },
    //projects on tester
    addProjectOnTester(context, payload) {
      console.log("currentProjects_payload[0])", payload[0]);
      console.log("id_payload[1])", payload[1]);

      let currentProjects = payload[0];
      let id = payload[1];

      db.collection("testers")
        //grab the doc and update it
        .doc(id)
        .update({
          projects: currentProjects,
        })
        .then(() => {
          context.commit("addProjectOnTesterInGui", {
            ...currentProjects,
          });
        })
        .catch((error) => console.error("error", error));
    },
    //projects on tester
    removeProjectOnTester(context, payload) {
      let testerProjects = payload[0];
      let id = payload[1];

      db.collection("testers")
        //grab the doc and update it
        .doc(id)
        .update({
          projects: testerProjects,
        })
        .then(() => {
          context.commit("removeProjectOnTesterFromGui", {
            ...testerProjects,
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
      //console.log("get_testers", payload);
      state.testers = payload;
    },
    addTesterInGui: (state, payload) => {
      state.testers = [payload, ...state.testers];
    },
    updTesterInGui: (state, payload) => {
      const index = state.testers.findIndex((tester) => {
        return tester.id === payload.id;
      });
      //console.log("index", index);
      if (index !== -1) {
        //At position index, remove 1 item and add the updatedTodo
        state.testers.splice(index, 1, payload);
      }
      // console.log("updTesterInDb", payload);
    },

    removeTesterFromGui(state, payload) {
      console.log("removeTesterFromGui", payload);
      state.testers = state.testers.filter((tester) => {
        return tester.id !== payload;
      });
      console.log("removeTesterFromGui", state.testers);
    },

    //projects on tester
    addProjectOnTesterInGui: (state, payload) => {
      console.log("addProjectOnTesterInGui", state.testers, payload);
    },
    removeProjectOnTesterFromGui(state, payload) {
      console.log("removeProjectOnTesterFromGui", payload);
    },
  },
};
