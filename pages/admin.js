import React, { Component } from 'react'
import Router from 'next/router'
import Layout from '../components/Layout'
import Firebase from '../firebase'
import Util from '../helpers/util'
import Edit from '../components/containers/Edit'
import Link from 'next/link'

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
      getDocument: {}
    }

    this.firebase = new Firebase()
    // this.util = new Utilidad()
    this.fechaInput = React.createRef()
    this.cantidadInput = React.createRef()
    this.tipoSelect = React.createRef()
    this.observacionesText = React.createRef()

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
          loading: false
        })
        this.setState({
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

    // .then((querySnapshot) => {
    //   let data = []
    //   querySnapshot.forEach(doc => {
    //     data.push({ ...doc.data(), id: doc.id })
    //   })
    //   console.log(data)
    //   this.setState({
    //     data: data
    //   })
    // })
    // .catch(error => {
    //   console.error('Error getting document:', error)
    // })
  }

  componentWillUnmount () {
    this.fireBaseListener && this.fireBaseListener()
    this.unsubscribe && this.unsubscribe()
    this.unsubscribeFilter && this.unsubscribeFilter()
  }

  handleSignOut = event => {
    this.firebase.doSignOut()
    event.preventDefault()
  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value })
  }

  onSubmit = event => {
    event.preventDefault()
    const { equipo, actividades, realizado, recibido } = this.state
    const user = this.firebase.auth.currentUser

    const cantidad = this.cantidadInput.current.value
    const fecha = this.fechaInput.current.value
    const tipo = this.tipoSelect.current.value
    const observaciones = this.observacionesText.current.value

    if (user == null) {
      console.warn('Para crear el document debes estar autenticado')
    } else {
      this.firebase
        .doCreateDocumentDb(user.uid, equipo, fecha, actividades, cantidad, tipo, observaciones, realizado, recibido)
        .then(function (docRef) {
          console.log('Document written with ID: ', docRef.id)
        })
        .catch(function (error) {
          console.error('Error adding document: ', error)
        })
    }
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
    const { loading, id, name, data, equipo, actividades, realizado, recibido } = this.state

    const isInvalid = equipo === '' || actividades === '' || realizado === '' || recibido === ''

    if (loading) {
      return <span>Loading...</span>
    }

    return (
      <Layout title='Admin'>
        <div className='container'>
          <h3>Hello admin - {name}</h3>
          <button type='button' onClick={this.handleSignOut}>
            Sign Out
          </button>
        </div>

        <form id='form__add' onSubmit={this.onSubmit}>
          <label htmlFor='equipo'>Equipo</label>
          <input type='text' id='equipo' name='equipo' placeholder='Equipo y ubicación' onChange={this.onChange} />

          <label htmlFor='fecha'>Fecha</label>
          <input type='date' id='fecha' name='fecha' ref={this.fechaInput} />

          <label htmlFor='actividades'>Actividades</label>
          <textarea name='actividades' id='actividades' cols='30' rows='10' onChange={this.onChange} placeholder='Actividades efectuadas' />

          <label htmlFor='cantidad'>Cantidad</label>
          <input type='text' id='cantidad' name='cantidad' placeholder='Cantidad cambio refrigerante' ref={this.cantidadInput} />

          <label htmlFor='tipo'>Tipo de mantenimiento</label>
          <select name='tipo' id='tipo' ref={this.tipoSelect}>
            <option value='pr'>Preventivo</option>
            <option value='cr'>Correctivo</option>
          </select>

          <label htmlFor='observaciones'>Observaciones</label>
          <textarea name='observaciones' id='observaciones' cols='30' rows='10' ref={this.observacionesText} />

          <label htmlFor='realizado'>Realizado</label>
          <input type='text' id='realizado' name='realizado' placeholder='Realizado por' onChange={this.onChange} />

          <label htmlFor='recibido'>Recibido</label>
          <input type='text' id='recibido' name='recibido' placeholder='Recibido por' onChange={this.onChange} />

          <button disabled={isInvalid} className={!isInvalid ? 'active' : false} type='submit'>
            Agregar
          </button>
        </form>

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
            <section className='data__cocinas'>
              <table>
                <thead>
                  <tr>
                    <th>Equipo</th>
                    <th>Fecha</th>
                    <th>Actividades</th>
                    <th>Cantidad</th>
                    <th>Tipo de mantenimiento</th>
                    <th>Observaciones</th>
                    <th>Realizado</th>
                    <th>Recibido</th>
                    <th />
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {
                    data.map((data) => (
                      <tr className='mantenimiento' key={data.id}>
                        <td>{data.equipo}</td>
                        <td>{Util.obtenerFecha(data.fecha.toDate())}</td>
                        <td width='250'>{data.actividades}</td>
                        <td>{data.cantidad}</td>
                        <td>{data.tipo.cr ? 'Correctivo' : data.tipo.pr ? 'Preventivo' : ''}</td>
                        <td>{data.observaciones}</td>
                        <td>{data.realizado}</td>
                        <td>{data.recibido}</td>
                        <td>
                          <a href={`/editar/${data.id}`} onClick={(e) => this.handleEdit(data.id, e)}>Editar</a>
                        </td>
                        <td>
                          <a href={`/eliminar/${data.id}`} onClick={(e) => this.handleDelete(data.id, e)}>Eliminar</a>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </section>
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
          .container {
            max-width: 500px;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            height: 20vh;
            align-items: center;
            justify-content: center;
          }

          #form__add {
            margin: 150px auto;
            max-width: 500px;
            display: flex;
            flex-direction: column;
          }

          #form__add button {
            cursor: not-allowed;
          }

          #form__add .active {
            cursor: pointer;
          }

          .data__cocinas {
            max-width: 800px;
            margin: 0 auto;
            overflow-x: scroll;
          }

          .data__cocinas table {
            border-collapse: separate;
            border-spacing: 10px 5px;
            table-layout: fixed;
            width: 800px;
          }

          .data__cocinas th, .data__cocinas td {
              width: 150px;
          }
        `}</style>
      </Layout>
    )
  }
}

export default Admin
