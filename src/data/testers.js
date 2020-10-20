import moment from "moment";

const testers = [
  {
    id: 1,
    firstname: "Karin",
    lastname: "Ljunggren",
    email: "karin@gmail.com",
    latestActivity: moment(Date.now()).format("ll"),
    active: true,
    projects: ["projectA", "projectB", "projectC", "projedtD"],
  },
  {
    id: 2,
    firstname: "Filip",
    lastname: "Ljunggren",
    email: "filip@gmail.com",
    latestActivity: moment(Date.now() - 100000000).format("ll"),
    active: true,
    projects: ["projectA", "projectB", "projectC"],
  },
  {
    id: 3,
    firstname: "Hugo",
    lastname: "Ljunggren",
    email: "hugo@gmail.com",
    latestActivity: moment(Date.now() - 1000000000).format("ll"),
    active: false,
    projects: ["projectB", "projectC"],
  },
  {
    id: 4,
    firstname: "Truls",
    lastname: "Ljunggren",
    email: "truls@gmail.com",
    latestActivity: moment(Date.now()).format("ll"),
    active: true,
    projects: ["projectA"],
  },
  {
    id: 5,
    firstname: "Mats",
    lastname: "Ljunggren",
    email: "mats@gmail.com",
    latestActivity: moment(Date.now() - 100000000).format("ll"),
    active: true,
    projects: ["projectA", "projectB"],
  },
  {
    id: 6,
    firstname: "Johan",
    lastname: "Ljunggren",
    email: "johan@gmail.com",
    latestActivity: moment(Date.now() - 100000000000).format("ll"),
    active: false,
    projects: ["projectA", "projectC"],
  },
];

export default testers;
