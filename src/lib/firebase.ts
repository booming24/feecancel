
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
const firebaseConfig = {
  apiKey: "AIzaSyBOLxrK7T-r81J2BPwVHN7qN769E0dofpY",
  authDomain: "fee-cancel.firebaseapp.com",
  projectId: "fee-cancel",
  storageBucket: "fee-cancel.appspot.com",
  messagingSenderId: "382992312133",
  appId: "1:382992312133:web:7ae65d11265863768fc02c",
  measurementId: "G-0LXH278WDJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);