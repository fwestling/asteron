// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyDpTsGOD27y93ItB-x_dvYpGLufQ7EpdX0",
  authDomain: "boilerplate-0v1.firebaseapp.com",
  projectId: "boilerplate-0v1",
  storageBucket: "boilerplate-0v1.appspot.com",
  messagingSenderId: "935050948820",
  appId: "1:935050948820:web:8d38c32e35577cf8edcb41"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;
