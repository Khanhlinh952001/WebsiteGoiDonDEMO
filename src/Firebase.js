import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDtkvWKzGRpW5sihX5ds5Hu31kzV1_LO7I",
  authDomain: "reactnative-8477f.firebaseapp.com",
  projectId: "reactnative-8477f",
  storageBucket: "reactnative-8477f.appspot.com",
  messagingSenderId: "554881387392",
  appId: "1:554881387392:web:6526db6fde843ac05b0f65",
  measurementId: "G-03H3EGEB61",
  databaseURL : "https://reactnative-8477f-default-rtdb.firebaseio.com"
};

// Initialize Firebase
 const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const database = getDatabase(app);
export const auth = getAuth(app);
