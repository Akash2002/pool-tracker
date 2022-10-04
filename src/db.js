// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDZcrrjtqDnV7vXoJLzNHNeW4XUyYCLJGQ",
  authDomain: "project-3765083428805952916.firebaseapp.com",
  projectId: "project-3765083428805952916",
  storageBucket: "project-3765083428805952916.appspot.com",
  messagingSenderId: "497439077524",
  appId: "1:497439077524:web:c15ae47c54a51b5c38b081",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
let database = firebase.firestore();
export { database, firebase };
