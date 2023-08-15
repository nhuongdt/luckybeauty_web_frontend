// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: 'AIzaSyCld8eOOZxhvseoSOBj2IJXgwHmg2Zctoo',
    authDomain: 'luckybeauty-c382a.firebaseapp.com',
    projectId: 'luckybeauty',
    storageBucket: 'luckybeauty.appspot.com',
    messagingSenderId: '113127509068',
    appId: '1:113127509068:web:50c36226e95604c7b278e9',
    measurementId: 'G-1HLVLPMD6G'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase storage reference
const storage = getStorage(app);
export default storage;
