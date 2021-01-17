export default {
  methods: {
    formatDate(someDate) {
      let date = new Date(someDate * 1000);
      let format = date.toISOString().slice(0, 10);
      return format;
    },
  },
};
