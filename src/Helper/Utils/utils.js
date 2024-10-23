// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import 'firebase/database';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBFCAPQkHjO73doAzrOP10ePeYcOJunj8E",
  authDomain: "mac-solutions.firebaseapp.com",
  projectId: "mac-solutions",
  storageBucket: "mac-solutions.appspot.com",
  messagingSenderId: "908354481632",
  appId: "1:908354481632:web:f5895d48be3c8fa8c30f85",
  measurementId: "G-45GTVS4TGV",
  databaseURL: "https://mac-solutions-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
// const analytics = getAnalytics(firebaseApp);

export const auth = getAuth(firebaseApp);
export const dbFirestore = getFirestore(firebaseApp);
export default firebaseApp;