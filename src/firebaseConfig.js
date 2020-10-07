import firebase from 'firebase'
import 'firebase/firestore'

// Initialize Firebase
var config = {
  apiKey: 'AIzaSyA_z1Z8Ix4xGpRhsgBBT1h64At5WzdEPeI',
  authDomain: 'vubhub-33fde.firebaseapp.com',
  databaseURL: 'https://vubhub-33fde.firebaseio.com',
  projectId: 'vubhub-33fde',
  storageBucket: 'vubhub-33fde.appspot.com',
  messagingSenderId: '340254224586'
}

firebase.initializeApp(config)

// firebase utils
const db = firebase.firestore()
const auth = firebase.auth()
const currentUser = auth.currentUser

// date issue fix according to firebase
const settings = {
  timestampsInSnapshots: true
}
db.settings(settings)

// firebase collections
const usersCollection = db.collection('users')

const cellDataCollection = db.collection('cellData')

export {
  db,
  auth,
  currentUser,
  usersCollection,
  cellDataCollection
}
