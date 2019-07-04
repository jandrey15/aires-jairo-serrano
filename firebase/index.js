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
    // db.collection("cities").doc("new-city-id").set(data);
    return this.db
      .collection('users')
      .doc(uid)
      .set({
        uid: uid,
        displayName: displayName,
        email: email,
        lastLogin: dateNow,
        photoURL: photoURL,
        roles: {
          admin: false,
          editor: false,
          subscriber: true
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
    // console.log(fecha)
    let newDate = new Date(fecha)
    const dias = 1
    newDate.setDate(newDate.getDate() + dias)

    // console.log(new Date(fecha))
    // console.log(newDate)
    return this.db
      .collection('cocina')
      .add({
        uid: uid,
        equipo: equipo,
        fecha: newDate,
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

  doUpdateDocumentDb = (id, uid, equipo, fecha, actividades, cantidad, tipo, observaciones, realizado, recibido) => {
    let pr = false
    let cr = false

    if (tipo === 'pr') {
      pr = true
    } else if (tipo === 'cr') {
      cr = true
    }
    // console.log(fecha)
    let newDate = new Date(fecha)
    const dias = 1
    newDate.setDate(newDate.getDate() + dias)

    // console.log(new Date(fecha))
    // console.log(newDate)
    return this.db
      .collection('cocina')
      .doc(id)
      .set({
        uid: uid,
        equipo: equipo,
        fecha: newDate,
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

  doGetAllCocina = () => this.db.collection('cocina').orderBy('fecha', 'desc').limit(15).get()
}

export default Firebase
