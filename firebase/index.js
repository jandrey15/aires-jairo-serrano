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
      .collection('mantenimientos')
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

  // https://firebase.google.com/docs/firestore/manage-data/add-data?authuser=0#update-data
  doUpdateDocumentDb = (id, equipo, fecha, actividades, cantidad, tipo, observaciones, realizado, recibido) => {
    let pr = false
    let cr = false
    // console.log(tipo)

    if (tipo === 'pr' || tipo.pr) {
      pr = true
    } else if (tipo === 'cr' || tipo.cr) {
      cr = true
    }
    // console.log(fecha)
    if (typeof fecha === 'string') {
      let newDate = new Date(fecha)
      const dias = 1
      newDate.setDate(newDate.getDate() + dias)
      fecha = newDate
    }
    // console.log(fecha)

    // console.log(new Date(fecha))
    // console.log(newDate)
    return this.db
      .collection('mantenimientos')
      .doc(id)
      .update({
        equipo: equipo,
        fecha: fecha,
        actividades: actividades,
        cantidad: cantidad,
        'tipo.pr': pr,
        'tipo.cr': cr,
        observaciones: observaciones,
        realizado: realizado,
        recibido: recibido
      })
  }

  doGetAllDocuments = () => this.db.collection('mantenimientos').orderBy('fecha', 'desc').limit(15)

  doGetDocument = (id) => this.db.collection('mantenimientos').doc(id).get()
  // doGetAllCocina = () => this.db.collection('cocina').orderBy('fecha', 'desc').limit(15).get()
  // https://www.djamware.com/post/5bc50ea680aca7466989441d/reactjs-firebase-tutorial-building-firestore-crud-web-application#ch8

  doDeleteDocumentDb = (id) => {
    return this.db
      .collection('mantenimientos')
      .doc(id)
      .delete()
  }

  doFilterType = (type) => {
    if (type !== 'all') {
      return this.db.collection('mantenimientos').where(`tipo.${type}`, '==', true)
    }

    return this.db.collection('mantenimientos').orderBy('fecha', 'desc').limit(15)
  }

  // https://365airsoft.com/es/questions/1617509/firestore-consulta-por-rango-de-fechas?utm_source=programandonet.com&utm_medium=Redirect

  // doFilterTypeCr = () => this.db.collection('mantenimientos').where('tipo.cr', '==', true)
}

export default Firebase
