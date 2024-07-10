// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAnalytics, logEvent } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { ENV_VARS } from "../envConfig";

// https://firebase.google.com/docs/web/setup#available-libraries

// Initialize Firebase
const app = initializeApp({
  apiKey: ENV_VARS.VITE_FIREBASE_API_KEY,
  authDomain: ENV_VARS.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: ENV_VARS.VITE_FIREBASE_PROJECT_ID,
  storageBucket: ENV_VARS.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: ENV_VARS.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: ENV_VARS.VITE_FIREBASE_APP_ID,
  measurementId: ENV_VARS.VITE_FIREBASE_MEASUREMENT_ID,
});
export const auth = getAuth(app);
const analytics = getAnalytics(app);
// Initialize Realtime Database and get a reference to the service
const databaseRealTime = getDatabase(app);

export const analyticsLogger = {
  logEvent: ({ eventName, eventParams }) => {
    logEvent(analytics, eventName, eventParams);
  },
};

export const firebaseModule = {
  auth,
  app,
  databaseRealTime,
};
