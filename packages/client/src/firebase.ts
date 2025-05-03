// Import the functions you need from the SDKs you need
import { getAnalytics } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: 'AIzaSyDIgwjt2G0ZGnC0crJD6e0cGVXKmgQwE9g',
  authDomain: 'asteron-v1.firebaseapp.com',
  projectId: 'asteron-v1',
  storageBucket: 'asteron-v1.firebasestorage.app',
  messagingSenderId: '172689213437',
  appId: '1:172689213437:web:39ff7fa2ab51a7e9a8fb94',
  measurementId: 'G-VJVSD2NX41',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;
