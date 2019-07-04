import React, { Component } from 'react'
import Util from '../../helpers/util'

class Edit extends Component {
  constructor (props) {
    super(props)

    this.state = {
      loading: true,
      name: null,
      update: false,
      dataCocinas: [],
      ...this.props
    }
    this.firebase = this.props.firebase
    // this.util = new Utilidad()
    // this.fechaInput = React.createRef()
    // this.cantidadInput = React.createRef()
    // this.tipoSelect = React.createRef()
    // this.observacionesText = React.createRef()
  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value })
  }

  onSubmit = event => {
    event.preventDefault()
    const { equipo, fecha, actividades, cantidad, tipo, observaciones, realizado, recibido } = this.state
    const user = this.firebase.auth.currentUser

    // const cantidad = this.cantidadInput.current.value
    // const fecha = this.fechaInput.current.value
    // const tipo = this.tipoSelect.current.value
    // const observaciones = this.observacionesText.current.value

    if (user == null) {
      console.warn('Para crear el document debes estar autenticado')
    } else {
      console.log(equipo, fecha, actividades, cantidad, tipo, observaciones, realizado, recibido)
      // this.firebase
      //   .doCreateDocumentDb(user.uid, equipo, fecha, actividades, cantidad, tipo, observaciones, realizado, recibido)
      //   .then(function (docRef) {
      //     console.log('Document written with ID: ', docRef.id)
      //   })
      //   .catch(function (error) {
      //     console.error('Error adding document: ', error)
      //   })
    }
  }

  render () {
    const { equipo, fecha, actividades, cantidad, tipo, observaciones, realizado, recibido } = this.state
    // console.log(this.state)

    const isInvalid = equipo === '' || actividades === '' || realizado === '' || recibido === ''
    // console.log(fecha)

    return (
      <section id='Edit'>
        <form id='form__add' onSubmit={this.onSubmit}>
          <label htmlFor='equipo'>Equipo</label>
          <input type='text' id='equipo' name='equipo' placeholder='Equipo y ubicación' value={equipo} onChange={this.onChange} />

          <label htmlFor='fecha'>Fecha</label>
          <input type='date' id='fecha' name='fecha' onChange={this.onChange} value={Util.fechaYMD(fecha.toDate())} />

          <label htmlFor='actividades'>Actividades</label>
          <textarea name='actividades' id='actividades' cols='30' rows='10' onChange={this.onChange} value={actividades} />

          <label htmlFor='cantidad'>Cantidad</label>
          <input type='text' id='cantidad' name='cantidad' placeholder='Cantidad cambio refrigerante' onChange={this.onChange} value={cantidad} />

          <label htmlFor='tipo'>Tipo de mantenimiento</label>
          <select name='tipo' id='tipo' onChange={this.onChange} value={tipo.cr ? 'cr' : tipo.pr ? 'pr' : ''}>
            <option value='pr'>Preventivo</option>
            <option value='cr'>Correctivo</option>
          </select>

          <label htmlFor='observaciones'>Observaciones</label>
          <textarea name='observaciones' id='observaciones' cols='30' rows='10' onChange={this.onChange} value={observaciones} />

          <label htmlFor='realizado'>Realizado</label>
          <input type='text' id='realizado' name='realizado' placeholder='Realizado por' onChange={this.onChange} value={realizado} />

          <label htmlFor='recibido'>Recibido</label>
          <input type='text' id='recibido' name='recibido' placeholder='Recibido por' onChange={this.onChange} value={recibido} />

          <button disabled={isInvalid} className={!isInvalid ? 'active' : false} type='submit'>
            Editar
          </button>
        </form>
      </section>
    )
  }
}

export default Edit
