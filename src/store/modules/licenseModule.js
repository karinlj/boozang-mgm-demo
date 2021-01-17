import db from "@/firebase/init";
export const licenseModule = {
  state: {
    license: null,
    //slug: "scale-up",
  },
  getters: {
    license(state) {
      console.log("state.license", state.license);
      return state.license;
    },
  },
  actions: {
    //fetch license firestore
    fetchLicense(context) {
      console.log("hej fetchLicens");
      let slug = "scale-up";
      //1.  get license by the slug, we dont have the id??
      let licenseFromDb = {};
      db.collection("licenses")
        .where("slug", "==", slug)
        //get the data (should be just one, but in a collection)
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            licenseFromDb = doc.data();
            // console.log("license", this.license);
            licenseFromDb.id = doc.id;
            //console.log("license.id", this.license.id);
          });
          this.getConditions();
          context.commit("setLicense", licenseFromDb);
        })
        .catch((error) => console.error("error", error));
    },
    getConditions() {
      let conditionExceeded = false;
      let conditionExceededType = "";
      if (
        this.license.maxTeamMembers < this.testers.length ||
        this.license.maxActions < this.actions ||
        this.license.maxNumberOfProjects < this.projects.length
      ) {
        conditionExceeded = true;
      }
      if (this.license.maxTeamMembers < this.testers.length) {
        conditionExceededType = "Max number of Team Members exceeded.";
      } else if (this.license.maxActions < this.actions) {
        conditionExceededType = "Max number of Actions exceeded.";
      } else {
        conditionExceededType = "Max number of Projects exceeded.";
      }
      return [conditionExceeded, conditionExceededType];
    },
  },

  mutations: {
    setLicense: (state, payload) => {
      console.log("get_license", payload);
      state.license = payload;
    },
  },
};
