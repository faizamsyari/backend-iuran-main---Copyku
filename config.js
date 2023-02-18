const firebase=require('firebase')
const firebaseConfig = {
    apiKey: "AIzaSyAYymB-cQrN_Fdvsg5SfK9AxfqdxpWtMGM",
    authDomain: "crudvue-630a1.firebaseapp.com",
    projectId: "crudvue-630a1",
    storageBucket: "crudvue-630a1.appspot.com",
    messagingSenderId: "509042434773",
    appId: "1:509042434773:web:5cf31dbf762b1bbbd4f85c",
    measurementId: "G-EK5TDV5PXX"
  };
  const User = firebase.initializeApp(firebaseConfig)
  // const db=firebase.firestore()
  // const User= db.collection("Data User")
  module.exports=User;
