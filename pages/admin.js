import React, { Component } from 'react'
import Router from 'next/router'
import Layout from '../components/Layout'
import Firebase from '../firebase'
import Util from '../helpers/util'
import { isValid } from 'ipaddr.js'

class Admin extends Component {
  constructor (props) {
    super(props)

    this.state = {
      loading: true,
      name: null,
      dataCocinas: [],
      equipo: '',
      actividades: '',
      realizado: '',
      recibido: ''
    }
    this.firebase = new Firebase()
    // this.util = new Utilidad()
    this.fechaInput = React.createRef()
    this.cantidadInput = React.createRef()
    this.tipoSelect = React.createRef()
    this.observacionesText = React.createRef()
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

    this.firebase
      .doGetAllCocina()
      .then((querySnapshot) => {
        const data = querySnapshot.docs.map(doc => doc.data())
        console.log(data)
        this.setState({
          dataCocinas: data
        })
      })
      .catch(error => {
        console.error('Error getting document:', error)
      })
  }

  componentWillUnmount () {
    this.fireBaseListener && this.fireBaseListener()
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
    const fecha = this.fechaInput.current.valueAsDate
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

  render () {
    const { loading, name, dataCocinas, equipo, actividades, realizado, recibido } = this.state

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
          <textarea name='actividades' id='actividades' cols='30' rows='10' onChange={this.onChange} />

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

        <section className='data__cocinas'>
          {
            dataCocinas.map((data, index) => {
              return (
                <div className='mantenimiento' key={index}>
                  <h1>{data.actividades}</h1>
                  <p>{data.equipo}</p>
                  {Util.obtenerFecha(data.fecha.toDate())}
                  <p>{data.observaciones}</p>
                </div>
              )
            })
          }
        </section>
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
        `}</style>
      </Layout>
    )
  }
}

export default Admin
