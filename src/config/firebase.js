// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth"
import {getFirestore} from "firebase/firestore"
import {getStorage} from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCdIfhwlJITG53y_LpKV9dOQXboPLogHMA",
  authDomain: "pindasher-69c9d.firebaseapp.com",
  projectId: "pindasher-69c9d",
  storageBucket: "pindasher-69c9d.appspot.com",
  messagingSenderId: "627565982454",
  appId: "1:627565982454:web:2b468828e41344a1eb72d7",
  measurementId: "G-1S4336SXY1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const storage = getStorage(app)

export async function getUser(){
    return new Promise(async (resolve, reject) =>  {
            await onAuthStateChanged(auth, (user) => {
                if (user) {
                  // User is signed in, see docs for a list of available properties
                  // https://firebase.google.com/docs/reference/js/firebase.User
                  
                  resolve(user);
                } else {
                  // User is signed out
                  // ...
                  reject({error:"Please Sign in"});
                }
              });    
    })
    
} 



export const db = getFirestore(app);