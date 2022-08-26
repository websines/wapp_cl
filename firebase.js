import firebase from 'firebase';
//yarn dev 
/*const firebaseConfig = {
    apiKey:,
    authDomain:,
    projectId: ,
    storageBucket:,
    messagingSenderId:,
    appId:
  };*/

  const app =!firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

  const db=firebase.firestore();
  const auth=firebase.auth();
  const provider = new firebase.auth.GoogleAuthProvider();

  export{db,auth,provider};