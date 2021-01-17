export default {
  methods: {
    calcMonth() {
      var d = new Date();
      var date = d.toDateString().slice(4, 7);
      //console.log("date", date);
      return date;
    },
    secondsToMinutes(time) {
      let testTime =
        Math.floor(time / 60) + "min " + Math.floor(time % 60) + "s ";
      // console.log("testTime", testTime);
      return testTime;
    },
    formatDate(someDate) {
      let date = new Date(someDate * 1000);
      let format = date.toISOString().slice(0, 10);
      return format;
    },
  },
};
