// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBMKDWAsAbYjojj4qQ3d5xIu4sL1L1GZnA",
  authDomain: "transportbook-cb28e.firebaseapp.com",
  projectId: "transportbook-cb28e",
  storageBucket: "transportbook-cb28e.appspot.com",
  messagingSenderId: "140819034711",
  appId: "1:140819034711:web:4584d5c97e900cd5a4a912",
  measurementId: "G-7WLLHVJY7V"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };