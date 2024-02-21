import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyABjVkOufChqiA8UI4NxHUE9S8iIviJHa4",
  authDomain: "assignment-16-react-firebasedb.firebaseapp.com",
  projectId: "assignment-16-react-firebasedb",
  storageBucket: "assignment-16-react-firebasedb.appspot.com",
  messagingSenderId: "935197109099",
  appId: "1:935197109099:web:f2b47f4bb9136e7ea27a2e"
};

 export const app = initializeApp(firebaseConfig);