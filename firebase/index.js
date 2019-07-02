import firebase from './FirebaseConfig'
import 'firebase/auth'
import 'firebase/firestore'

// Doc -> https://firebase.google.com/docs/firestore/security/get-started?hl=es-419

class Firebase {
  constructor () {
    this.auth = firebase.auth()
    this.db = firebase.firestore()
  }

  doCreateUserEmailPass = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password)

  doAutEmailPass = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password)

  doSignOut = () => this.auth.signOut()

  doPasswordReset = email => this.auth.sendPasswordResetEmail(email)

  doPasswordUpdate = password =>
    this.auth.currentUser.updatePassword(password)

  doCurrentUser = () => this.auth.currentUser // Verificar si esta autenticado.

  doCreateUserDb = (uid, displayName, email, photoURL) => {
    // https://firebase.google.com/docs/firestore/manage-data/add-data
    const dateNow = new Date()
    // console.log(dateNow)
    return this.db
      .collection('users')
      .add({
        uid: uid,
        displayName: displayName,
        email: email,
        lastLogin: dateNow,
        photoURL: photoURL,
        roles: {
          admin: false,
          editor: false,
          subcriber: true
        }
      })
  }

  // https://firebase.google.com/docs/firestore/manage-data/add-data?authuser=0

  doCreateDocumentDb = (uid, equipo, fecha, actividades, cantidad, tipo, observaciones, realizado, recibido) => {
    let pr = false
    let cr = false

    if (tipo === 'pr') {
      pr = true
    } else if (tipo === 'cr') {
      cr = true
    }
    return this.db
      .collection('cocina')
      .add({
        uid: uid,
        equipo: equipo,
        fecha: fecha,
        actividades: actividades,
        cantidad: cantidad,
        tipo: {
          pr: pr,
          cr: cr
        },
        observaciones: observaciones,
        realizado: realizado,
        recibido: recibido
      })
  }

  doGetAllCocina = () => this.db.collection('cocina').get()
}

export default Firebase
