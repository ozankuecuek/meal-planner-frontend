import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from 'firebase/storage';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyBmmTNJR4M2u6IRvJ6iyGCfATUgHfrUYuQ",
    authDomain: "meal-planner-app-60835.firebaseapp.com",
    projectId: "meal-planner-app-60835",
    storageBucket: "meal-planner-app-60835.appspot.com",
    messagingSenderId: "808220364724",
    appId: "1:808220364724:web:be51d4cbfea43c47a36ce1",
    measurementId: "G-FBD5CYS497"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);

export { db, auth, storage, analytics };

