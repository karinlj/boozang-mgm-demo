export default {
  methods: {
    secondsToMinutes(time) {
      let testTime =
        Math.floor(time / 60) + "min " + Math.floor(time % 60) + "s ";
      // console.log("testTime", testTime);
      return testTime;
    },
  },
};
