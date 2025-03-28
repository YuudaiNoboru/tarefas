import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBCuRc5xvZ14fbehGaoHgz7LrpwZv93XYM",
  authDomain: "task-59f64.firebaseapp.com",
  projectId: "task-59f64",
  storageBucket: "task-59f64.firebasestorage.app",
  messagingSenderId: "150413201178",
  appId: "1:150413201178:web:7e3536e71ed1c7ca5ea6a3"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);

export { db };