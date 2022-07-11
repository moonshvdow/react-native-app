import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyBJg8HcxvwVmIsY4AnbSaTEknGaPyuB8Tg",
  authDomain: "rn-project-150a7.firebaseapp.com",
  projectId: "rn-project-150a7",
  storageBucket: "rn-project-150a7.appspot.com",
  messagingSenderId: "217945269047",
  appId: "1:217945269047:web:22c6d43a44cf5bebfc30b2"
};


// const firebaseConfig = {
//     apiKey: "AIzaSyA-jxP3efML-97dnc8iBexzygSd7tgchPY",
//     authDomain: "rn-project-14299.firebaseapp.com",
//     projectId: "rn-project-14299",
//     storageBucket: "rn-project-14299.appspot.com",
//     messagingSenderId: "3545650182",
//     appId: "1:3545650182:web:15d5e83df4be9f89b61f87",
//     measurementId: "G-VZWE1X3RE1"
//   };
  
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app)
