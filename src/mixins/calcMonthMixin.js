export default {
  methods: {
    calcMonth() {
      var d = new Date();
      var date = d.toDateString().slice(4, 7);
      console.log("date", date);
      return date;
    },
  },
};
