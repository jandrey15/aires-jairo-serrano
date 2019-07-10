import React, { Component } from 'react'
import Firebase from '../../firebase'
import { Button, Modal, Container, Form, Input, TextArea, Select } from 'semantic-ui-react'

class Add extends Component {
  constructor (props) {
    super(props)

    this.state = {
      data: [],
      equipo: '',
      actividades: '',
      realizado: '',
      recibido: '',
      fecha: '',
      cantidad: '',
      observaciones: '',
      getDocument: {},
      open: false
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
    const { equipo, actividades, realizado, recibido, fecha, cantidad, tipo, observaciones } = this.state
    const user = this.firebase.auth.currentUser

    // const cantidad = this.cantidadInput.current.value
    // const fecha = this.fechaInput.current.value
    // const tipo = this.tipoSelect.current.value
    // const observaciones = this.observacionesText.current.value

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

  open = () => this.setState({ open: true })
  close = () => this.setState({ open: false })

  render () {
    const { equipo, actividades, realizado, recibido, open } = this.state

    const isInvalid = equipo === '' || actividades === '' || realizado === '' || recibido === ''

    const typeOptions = [
      { key: 'p', text: 'Preventivo', value: 'pr' },
      { key: 'c', text: 'Correctivo', value: 'cr' }
    ]

    return (
      <section id='Add'>

        <Container>
          <Modal open={open}
            onOpen={this.open}
            onClose={this.close} trigger={<Button color='teal' content='Agregar' icon='add' labelPosition='left' size='small' />}>
            <Modal.Header>Agregar mantenimiento</Modal.Header>
            <Modal.Content image>
              <Modal.Description>
                <Form onSubmit={this.onSubmit}>
                  <Form.Group widths='equal'>
                    <Form.Field
                      id='form-input-control-equipo'
                      control={Input}
                      label='Equipo y ubicación'
                      name='equipo' placeholder='Equipo y ubicación' onChange={this.onChange}
                    />
                    <Form.Field>
                      <label htmlFor='Fecha'>Fecha</label>
                      <input type='date' id='fecha' name='fecha' onChange={this.onChange} />
                    </Form.Field>
                    <Form.Field
                      id='form-textarea-control-actividades'
                      control={TextArea}
                      label='Actividades efectuadas'
                      name='actividades' onChange={this.onChange} placeholder='Actividades efectuadas'
                    />

                  </Form.Group>

                  <Form.Group widths='equal'>
                    <Form.Field
                      id='form-input-control-cantidad'
                      control={Input}
                      label='Cantidad cambio refrigerante'
                      name='cantidad' placeholder='Cantidad cambio refrigerante' onChange={this.onChange}
                    />
                    <Form.Field
                      control={Select}
                      options={typeOptions}
                      label={{ children: 'Preventivo', htmlFor: 'form-select-control-tipo' }}
                      placeholder='Tipo de mantenimiento'
                      search
                      searchInput={{ id: 'form-select-control-tipo' }}
                      name='tipo'
                      onChange={this.onChange}
                    />

                    <Form.Field
                      id='form-textarea-control-observaciones'
                      control={TextArea}
                      label='Observaciones'
                      name='observaciones' onChange={this.onChange} placeholder='Observaciones'
                    />
                  </Form.Group>

                  <Form.Group widths='equal'>
                    <Form.Field
                      id='form-input-control-realizado'
                      control={Input}
                      label='Realizado'
                      name='realizado' placeholder='Realizado' onChange={this.onChange}
                    />
                    <Form.Field
                      id='form-input-control-recibido'
                      control={Input}
                      label='Recibido'
                      name='recibido' placeholder='Recibido' onChange={this.onChange}
                    />
                  </Form.Group>

                  <Form.Group size='mini'>
                    <Form.Field
                      id='form-button-control-public'
                      control={Button}
                      content='Agregar'
                      disabled={isInvalid}
                      className={!isInvalid ? 'active' : ''}
                    />
                    <Button content='Cancelar' onClick={this.close} color='red' />
                  </Form.Group>

                </Form>
                {/* <form id='form__add' onSubmit={this.onSubmit}>
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
                </form> */}
              </Modal.Description>
            </Modal.Content>
          </Modal>
        </Container>

      </section>
    )
  }
}

export default Add
