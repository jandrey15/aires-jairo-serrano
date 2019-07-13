import React, { Component } from 'react'
import Firebase from '../../firebase'
import { Button, Modal, Container, Form, Input, TextArea, Select, Message } from 'semantic-ui-react'

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
      tipo: '',
      getDocument: {},
      open: false,
      error: null,
      success: false
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

  onChange = (event, data) => {
    // console.log(data)
    if (data === undefined) {
      this.setState({ [event.target.name]: event.target.value })
    } else if (data.name === 'tipo') {
      // console.log(data.value)
      this.setState({
        tipo: data.value
      })
    }

    this.setState({ [event.target.name]: event.target.value })
  }

  onSubmit = event => {
    event.preventDefault()
    const { equipo, actividades, realizado, recibido, fecha, cantidad, tipo, observaciones } = this.state
    const user = this.firebase.auth.currentUser
    // console.log(tipo)

    if (user == null) {
      console.warn('Para crear el document debes estar autenticado')
    } else {
      this.firebase
        .doCreateDocumentDb(user.uid, equipo, fecha, actividades, cantidad, tipo, observaciones, realizado, recibido)
        .then(docRef => {
          console.log('Document written with ID: ', docRef.id)
          this.close()
          this.setState({
            success: true
          })
          this.timer = setTimeout(() => {
            this.setState({ success: false })
          }, 12000)
        })
        .catch(error => {
          console.error('Error adding document: ', error)
          this.setState({
            error: 'Error al tratar de agregar el mantenimiento.'
          })
        })
    }
  }

  componentWillUnmount () {
    clearTimeout(this.timer)
  }

  open = () => this.setState({ open: true })
  close = () => this.setState({ open: false })

  handleDismiss = () => {
    this.setState({ success: false })
  }

  render () {
    const { equipo, actividades, realizado, recibido, open, error } = this.state

    const isInvalid = equipo === '' || actividades === '' || realizado === '' || recibido === ''

    const typeOptions = [
      { key: 'pr', text: 'Preventivo', value: 'pr' },
      { key: 'cr', text: 'Correctivo', value: 'cr' }
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
                      name='equipo' placeholder='Equipo - ubicación' onChange={this.onChange}
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
                      label={{ children: 'Tipo de mantenimiento', htmlFor: 'form-select-control-tipo' }}
                      placeholder='Preventivo'
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
                    <Button
                      id='form-button-control-public'
                      primary
                      disabled={isInvalid}
                      className={!isInvalid ? 'active' : ''}
                      type='submit'
                    >Agregar</Button>
                    <Button content='Cancelar' onClick={this.close} color='red' />
                  </Form.Group>
                  {error && (
                    <Message negative>
                      <Message.Header>{error}</Message.Header>
                      <p>Comuniquese con el administrador</p>
                    </Message>
                  )}
                </Form>
              </Modal.Description>
            </Modal.Content>
          </Modal>
          {
            this.state.success && (
              <Message
                positive
                onDismiss={this.handleDismiss}
                header='Guardado exitosamente'
                content={`Se guardó el siguiente mantenimiento en la base de datos: ${equipo}`}
              />
            )
          }
        </Container>
      </section>
    )
  }
}

export default Add
