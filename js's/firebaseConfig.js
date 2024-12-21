// firebaseConfig.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-database.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyCzT77IureChCmwMkYq45oMVpmNTJgXYUw",
  authDomain: "iutianbookshop.firebaseapp.com",
  databaseURL: "https://iutianbookshop-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "iutianbookshop",
  storageBucket: "iutianbookshop.appspot.com",
  messagingSenderId: "300755004711",
  appId: "1:300755004711:web:fb9a9033b13b016cc78d02",
  measurementId: "G-64VGT3VT75"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
export const storage = getStorage(app);
