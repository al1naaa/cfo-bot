import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAEL58vy_MNC9dhC1cBXbxcKMVn_EWQIRU",
  authDomain: "cfo-bot-cloud.firebaseapp.com",
  projectId: "cfo-bot-cloud",
  storageBucket: "cfo-bot-cloud.firebasestorage.app",
  messagingSenderId: "851400274008",
  appId: "1:851400274008:web:588427fc0c03dba0e4da2d",
  measurementId: "G-NXFWLDB6BY"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
