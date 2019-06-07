import * as firebase from 'firebase/app'

console.log('This is key -> ', process.env.API_KEY)

const config = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DATABASE_URL,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: '1:48388955611:web:b0fcb351e7ed2497'
}

export default !firebase.apps.length ? firebase.initializeApp(config) : firebase.app()
