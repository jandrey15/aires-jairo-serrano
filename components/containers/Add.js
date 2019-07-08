import React, { Component } from 'react'
import Firebase from '../../firebase'

class Add extends Component {
  constructor (props) {
    super(props)

    this.state = {
      update: false,
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
  }

  static async getInitialProps ({ pathname }) {
    // console.log('PATHNAME', pathname)
    return { pathname }
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

  render () {
    const { equipo, actividades, realizado, recibido } = this.state

    const isInvalid = equipo === '' || actividades === '' || realizado === '' || recibido === ''

    return (
      <section id='Add'>
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

          <button disabled={isInvalid} className={!isInvalid ? 'active' : ''} type='submit'>
            Agregar
          </button>
        </form>
      </section>
    )
  }
}

export default Add
