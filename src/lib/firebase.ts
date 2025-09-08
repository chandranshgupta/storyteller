// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  "projectId": "nakshatra-narratives",
  "appId": "1:929258642354:web:0588c63ae417cf58b7e2ab",
  "storageBucket": "nakshatra-narratives.firebasestorage.app",
  "apiKey": "AIzaSyDYSzMvfBEKOWxvzyxMXUln7Fm0L767nsk",
  "authDomain": "nakshatra-narratives.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "929258642354"
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const functions = getFunctions(app);

export { app, functions };
