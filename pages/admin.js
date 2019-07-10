import React, { Component } from 'react'
import Router from 'next/router'
import Layout from '../components/Layout'
import Firebase from '../firebase'
import Link from 'next/link'
import Edit from '../components/containers/Edit'
import ListDocuments from '../components/ListDocuments'
import Add from '../components/containers/Add'
import Loading from '../components/Loading'
import HeaderContent from '../components/Header'

class Admin extends Component {
  constructor (props) {
    super(props)

    this.state = {
      loading: true,
      name: null,
      update: false,
      id: null,
      data: [],
      equipo: '',
      actividades: '',
      realizado: '',
      recibido: '',
      getDocument: {},
      total: 0
    }

    this.firebase = new Firebase()
    // this.util = new Utilidad()

    this.tipoSelectFilter = React.createRef()
    this.fechaInputStart = React.createRef()
    this.fechaInputEnd = React.createRef()

    this.searchInput = React.createRef()
  }

  static async getInitialProps ({ pathname }) {
    // console.log('PATHNAME', pathname)
    return { pathname }
  }

  componentDidMount () {
    this.fireBaseListener = this.firebase.auth.onAuthStateChanged(user => {
      if (user) {
        // user está logueado.
        this.setState({
          loading: false,
          name: user.displayName
        })
        if (user.photoURL) {
          console.log(user.photoURL)
        } else {
          console.log('user sin photo')
        }
      } else {
        console.info('Iniciar sesión')
        Router.push('/')
      }
    })

    this.unsubscribe = this.firebase
      .doGetAllDocuments()
      .onSnapshot((querySnapshot) => {
        let data = []
        querySnapshot.forEach(doc => {
          data.push({ ...doc.data(), id: doc.id })
        })
        // console.log(data)
        this.setState({
          data: data
        })
      })
  }

  componentWillUnmount () {
    this.fireBaseListener && this.fireBaseListener()
    this.unsubscribe && this.unsubscribe()
    this.unsubscribeFilter && this.unsubscribeFilter()
    this.unsubscribeSearch && this.unsubscribeSearch()
  }

  handleSignOut = event => {
    this.firebase.doSignOut()
    event.preventDefault()
  }

  handleEdit = (id, event) => {
    event.preventDefault()

    // console.log(id)
    this.firebase
      .doGetDocument(id)
      .then(doc => {
        if (doc.exists) {
          this.setState({
            update: true,
            getDocument: doc.data(),
            id
          })
          console.log('Document data:', doc.data())
        } else {
          // doc.data() will be undefined in this case
          console.log('No such document!')
        }
      })
      .catch(error => {
        console.log('Error getting document:', error)
      })
  }

  handleDelete = (id, event) => {
    event.preventDefault()

    // console.log(id)
    this.firebase
      .doDeleteDocumentDb(id)
      .then(() => {
        console.log('Document successfully deleted!')
      }).catch(error => {
        console.error('Error removing document: ', error)
      })
  }

  handleFilter = event => {
    event.preventDefault()
    const tipo = this.tipoSelectFilter.current.value
    // console.log(tipo)
    const dateStart = this.fechaInputStart.current.value
    const dateEnd = this.fechaInputEnd.current.value
    // console.log(dateStart)
    // console.log(dateEnd)

    this.unsubscribeFilter = this.firebase
      .doFilterType(tipo, dateStart, dateEnd)
      .onSnapshot(querySnapshot => {
        let data = []
        querySnapshot.forEach(doc => {
          data.push({ ...doc.data(), id: doc.id })
        })
        // console.log(data)
        this.setState({
          data: data
        })
      })
  }

  onSubmitSearch = event => {
    event.preventDefault()
    const search = this.searchInput.current.value
    // console.log(this.searchInput.current.value)

    this.unsubscribeSearch = this.firebase
      .doSearchDocuments()
      .onSnapshot(querySnapshot => {
        // let data = []
        let results = []
        querySnapshot.forEach(doc => {
          // console.log(doc.data().equipo)
          const equipo = doc.data().equipo.toLowerCase()
          const query = search.toLowerCase()
          if (equipo.includes(query)) {
            // console.log(item);
            results.push({ ...doc.data(), id: doc.id })
          }
          // data.push({ ...doc.data(), id: doc.id })
        })
        // console.log(results)
        this.setState({
          data: results
        })
      })
  }

  render () {
    const { loading, id, name, data } = this.state

    if (loading) {
      return <Loading />
    }

    return (
      <Layout title='Admin'>
        <HeaderContent name={name} handleSignOut={this.handleSignOut} />

        <Add />

        <form id='filter'>
          <label htmlFor='tipo'>Tipo de mantenimiento</label>
          <select name='tipo' id='tipo' ref={this.tipoSelectFilter}>
            <option value='all'>Todos</option>
            <option value='pr'>Preventivo</option>
            <option value='cr'>Correctivo</option>
          </select>
          <input type='date' name='fechaStart' ref={this.fechaInputStart} />
          <input type='date' name='fechaEnd' ref={this.fechaInputEnd} />
          <button onClick={this.handleFilter}>Filter</button>
        </form>

        <form id='search' onSubmit={this.onSubmitSearch}>
          <input type='text' name='search' placeholder='Equipo o ubicación' ref={this.searchInput} />
          <button className='btn__searc' type='submit'>Buscar</button>
        </form>

        {
          data.length > 0 ? (
            <ListDocuments data={data} handleEdit={this.handleEdit} handleDelete={this.handleDelete} />
          ) : (
            <h2>No hay datos</h2>
          )
        }
        <hr />
        {
          this.state.update && (
            <Edit {...this.state.getDocument} id={id} />
          )
        }

        <Link href='/signup'>
          <a >signup</a>
        </Link>
        <style jsx>{`
          
        `}</style>
      </Layout>
    )
  }
}

export default Admin
