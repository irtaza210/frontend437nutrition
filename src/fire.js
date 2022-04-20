import firebase from 'firebase';
// const firebaseConfig = {
//   apiKey: "AIzaSyDhsJYg1WBo4c-7KKQZxX6j9LdlJzJX6Fw",
//   authDomain: "nutrition-cb1f4.firebaseapp.com",
//   projectId: "nutrition-cb1f4",
//   storageBucket: "nutrition-cb1f4.appspot.com",
//   messagingSenderId: "898129431050",
//   appId: "1:898129431050:web:7c88c03fb45ba4624b6df3",
//   measurementId: "G-N3MK94KJ9N"
// };
const firebaseConfig = {
    apiKey: "AIzaSyA-Btp_lcdnWGs5lGoZKMxCjMz68bbCZuQ",
    authDomain: "nutrition-7f603.firebaseapp.com",
    projectId: "nutrition-7f603",
    storageBucket: "nutrition-7f603.appspot.com",
    messagingSenderId: "151763226983",
    appId: "1:151763226983:web:4eccc970a065f156ec5fc2"
};

  firebase.initializeApp(firebaseConfig);
  export const auth = firebase.auth()
  export const db = firebase.firestore()
  export default firebase