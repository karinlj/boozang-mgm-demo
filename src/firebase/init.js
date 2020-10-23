import firebase from "firebase";

/* eslint-disable no-unused-vars */
import firestore from "firebase/firestore";
// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyBE-13yDLt41gQSR8XBaBFzAWksYK5beL0",
  authDomain: "mgmdemo-9b70f.firebaseapp.com",
  databaseURL: "https://mgmdemo-9b70f.firebaseio.com",
  projectId: "mgmdemo-9b70f",
  storageBucket: "mgmdemo-9b70f.appspot.com",
  messagingSenderId: "214515055363",
  appId: "1:214515055363:web:9985e39e30d212cefdc736",
};
// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);
//exporting db
export default firebaseApp.firestore();
