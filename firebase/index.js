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

  doGetAllDocuments = () => this.db.collection('mantenimientos').orderBy('fecha', 'desc').limit(50)

  doGetDocument = (id) => this.db.collection('mantenimientos').doc(id).get()
  // doGetAllCocina = () => this.db.collection('cocina').orderBy('fecha', 'desc').limit(50).get()
  // https://www.djamware.com/post/5bc50ea680aca7466989441d/reactjs-firebase-tutorial-building-firestore-crud-web-application#ch8

  doDeleteDocumentDb = (id) => {
    return this.db
      .collection('mantenimientos')
      .doc(id)
      .delete()
  }

  doFilterType = (type, dateStart, dateEnd) => {
    if (type !== 'all') {
      // Filter solo por type
      if (dateStart === '' && dateEnd === '') {
        // console.log('ok paso here.')
        return this.db.collection('mantenimientos').where(`tipo.${type}`, '==', true).orderBy('fecha', 'desc').limit(50)
      } else if (dateStart !== '' && dateEnd !== '') {
        // Filter por type and fecha inicio and final
        let start = new Date(dateStart)
        let end = new Date(dateEnd)

        const dias = 1
        start.setDate(start.getDate() + dias)
        end.setDate(end.getDate() + dias)
        return this.db.collection('mantenimientos').where(`tipo.${type}`, '==', true).where('fecha', '>=', start).where('fecha', '<=', end).orderBy('fecha', 'desc').limit(50)
      } else if (dateStart === '' && dateEnd !== '') {
        // Filter por type and fecha final
        // console.log('Dates here')
        let start = new Date('2000-01-01')
        let end = new Date(dateEnd)

        const dias = 1
        start.setDate(start.getDate() + dias)
        end.setDate(end.getDate() + dias)
        return this.db.collection('mantenimientos').where(`tipo.${type}`, '==', true).where('fecha', '>=', start).where('fecha', '<=', end).orderBy('fecha', 'desc').limit(50)
      } else if (dateEnd === '' && dateStart !== '') {
        // Filter por type and fecha inicial
        let start = new Date(dateStart)
        let end = new Date('2100-01-01')

        const dias = 1
        start.setDate(start.getDate() + dias)
        end.setDate(end.getDate() + dias)
        return this.db.collection('mantenimientos').where(`tipo.${type}`, '==', true).where('fecha', '>=', start).where('fecha', '<=', end).orderBy('fecha', 'desc').limit(50)
      }
    }

    // Filter por all and Date start - Date end
    if (dateStart !== '' && dateEnd !== '' && type === 'all') {
      let start = new Date(dateStart)
      let end = new Date(dateEnd)

      const dias = 1
      start.setDate(start.getDate() + dias)
      end.setDate(end.getDate() + dias)
      // console.log(start)
      // console.log(end)
      return this.db.collection('mantenimientos').where('fecha', '>=', start).where('fecha', '<=', end).orderBy('fecha', 'desc').limit(50)
    } else if (dateStart === '' && dateEnd !== '') {
      // Filter por all and Date end
      let start = new Date('2000-01-01')
      let end = new Date(dateEnd)

      const dias = 1
      start.setDate(start.getDate() + dias)
      end.setDate(end.getDate() + dias)
      return this.db.collection('mantenimientos').where('fecha', '>=', start).where('fecha', '<=', end).orderBy('fecha', 'desc').limit(50)
    } else if (dateEnd === '' && dateStart !== '') {
      // Filter por all and Date start
      let start = new Date(dateStart)
      let end = new Date('2100-01-01')

      const dias = 1
      start.setDate(start.getDate() + dias)
      end.setDate(end.getDate() + dias)
      return this.db.collection('mantenimientos').where('fecha', '>=', start).where('fecha', '<=', end).orderBy('fecha', 'desc').limit(50)
    }

    // Filter por all sin dates
    return this.db.collection('mantenimientos').orderBy('fecha', 'desc').limit(50)
  }

  // https://365airsoft.com/es/questions/1617509/firestore-consulta-por-rango-de-fechas?utm_source=programandonet.com&utm_medium=Redirect

  // doFilterTypeCr = () => this.db.collection('mantenimientos').where('tipo.cr', '==', true)

  doSearchDocuments = () => {
    return this.db.collection('mantenimientos').orderBy('fecha', 'desc').limit(100)
  }

  doGetDocuments = () => this.db.collection('mantenimientos').orderBy('fecha', 'desc')

  doCurrentUser = () => this.auth().currentUser

  doUpdateProfile = (name, id) => {
    return this.db
      .collection('users')
      .doc(id)
      .update({
        displayName: name
      })
  }
}

export default Firebase
