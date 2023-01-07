import {getFirestore} from "firebase/firestore"
import {initializeApp} from "firebase/app"

const firebaseConfig = {
    apiKey: "AIzaSyAK9JMoESefqfO9ahJNKkW84zC1depuxoI",
    authDomain: "midtown-mma.firebaseapp.com",
    projectId: "midtown-mma",
    storageBucket: "midtown-mma.appspot.com",
    messagingSenderId: "981936819151",
    appId: "1:981936819151:web:3a2da782bd4dd6695ae0ba"
  };

initializeApp(firebaseConfig)
export const db = getFirestore()