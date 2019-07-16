import React, { Component } from 'react'
import Util from '../../helpers/util'
import Firebase from '../../firebase'
import { Button, Modal, Container, Form, Input, TextArea, Select, Message, Grid, Portal, Segment } from 'semantic-ui-react'

class Edit extends Component {
  constructor (props) {
    super(props)

    this.state = {
      loading: true,
      name: null,
      update: false,
      newFecha: false,
      dataCocinas: [],
      error: null,
      ...this.props
    }
    // this.firebase = this.props.firebase
    this.firebase = new Firebase()
    // this.util = new Utilidad()
    // this.fechaInput = React.createRef()
    // this.cantidadInput = React.createRef()
    // this.tipoSelect = React.createRef()
    // this.observacionesText = React.createRef()
  }

  onChange = event => {
    // console.log({ [event.target.name]: event.target.value })
    if (event.target.name === 'fecha') {
      this.setState({
        newFecha: event.target.value
      })
    }

    this.setState({ [event.target.name]: event.target.value })
  }

  onSubmit = event => {
    event.preventDefault()
    const { id, equipo, fecha, actividades, cantidad, tipo, observaciones, realizado, recibido } = this.state
    const user = this.firebase.auth.currentUser

    // const cantidad = this.cantidadInput.current.value
    // const fecha = this.fechaInput.current.value
    // const tipo = this.tipoSelect.current.value
    // const observaciones = this.observacionesText.current.value

    if (user == null) {
      console.warn('Para crear el document debes estar autenticado')
    } else {
      // console.log(id, equipo, fecha, actividades, cantidad, tipo, observaciones, realizado, recibido)
      this.firebase
        .doUpdateDocumentDb(id, equipo, fecha, actividades, cantidad, tipo, observaciones, realizado, recibido)
        .then(() => {
          console.log('Document successfully updated!')
          this.setState({
            open: false
          })
        })
        .catch((error) => {
          console.error('Error adding document: ', error)
        })
    }
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    // console.log(prevProps)
    // console.log(prevState)
    if (this.props.id !== prevProps.id) {
      this.setState({
        ...this.props,
        newFecha: false
      })
    }

    if (this.props.open !== prevProps.open) {
      // console.log('ok paso Edit')
      this.setState({
        open: true
      })
    }
  }

  handleClose = () => this.setState({ open: false })

  render () {
    const { equipo, fecha, actividades, cantidad, tipo, observaciones, realizado, recibido, newFecha, error, open } = this.state
    // console.log(this.state)
    // console.log(fecha)

    const isInvalid = equipo === '' || actividades === '' || realizado === '' || recibido === ''
    // console.log(fecha)

    const typeOptions = [
      { key: 'pr', text: 'Preventivo', value: 'pr' },
      { key: 'cr', text: 'Correctivo', value: 'cr' }
    ]

    return (
      <section id='Edit'>
        <Container>
          <Grid columns={2}>
            <Grid.Column>
              <Portal open={open}>
                <Segment>
                  <Modal
                    open={open}
                    onClose={this.handleClose}
                  >
                    <Modal.Header>Editar mantenimiento</Modal.Header>
                    <Modal.Content image>
                      <Modal.Description>
                        <Form onSubmit={this.onSubmit}>
                          <Form.Group widths='equal'>
                            <Form.Field
                              id='form-input-control-equipo'
                              control={Input}
                              label='Equipo y ubicación'
                              name='equipo' placeholder='Equipo - ubicación' onChange={this.onChange}
                              value={equipo}
                            />
                            <Form.Field>
                              <label htmlFor='Fecha'>Fecha</label>
                              <input type='date' id='fecha' name='fecha' onChange={this.onChange} value={newFecha || Util.fechaYMD(fecha.toDate())} />
                            </Form.Field>
                            <Form.Field
                              id='form-textarea-control-actividades'
                              control={TextArea}
                              label='Actividades efectuadas'
                              name='actividades' onChange={this.onChange} placeholder='Actividades efectuadas'
                              value={actividades}
                            />
                          </Form.Group>

                          <Form.Group widths='equal'>
                            <Form.Field
                              id='form-input-control-cantidad'
                              control={Input}
                              label='Cantidad cambio refrigerante'
                              name='cantidad' placeholder='Cantidad cambio refrigerante' onChange={this.onChange}
                              value={cantidad}
                            />
                            <Form.Field
                              control={Select}
                              options={typeOptions}
                              label={{ children: 'Tipo de mantenimiento', htmlFor: 'form-select-control-tipo' }}
                              placeholder='Preventivo'
                              search
                              searchInput={{ id: 'form-select-control-tipo' }}
                              name='tipo'
                              value={tipo.cr || tipo === 'cr' ? 'cr' : tipo.pr || tipo === 'pr' ? 'pr' : ''}
                              onChange={this.onChange}
                            />

                            <Form.Field
                              id='form-textarea-control-observaciones'
                              control={TextArea}
                              label='Observaciones'
                              name='observaciones' onChange={this.onChange} placeholder='Observaciones'
                              value={observaciones}
                            />
                          </Form.Group>

                          <Form.Group widths='equal'>
                            <Form.Field
                              id='form-input-control-realizado'
                              control={Input}
                              label='Realizado'
                              name='realizado' placeholder='Realizado' onChange={this.onChange}
                              value={realizado}
                            />
                            <Form.Field
                              id='form-input-control-recibido'
                              control={Input}
                              label='Recibido'
                              name='recibido' placeholder='Recibido' onChange={this.onChange}
                              value={recibido}
                            />
                          </Form.Group>

                          <Form.Group size='mini'>
                            <Button
                              id='form-button-control-public'
                              primary
                              disabled={isInvalid}
                              className={!isInvalid ? 'active' : ''}
                              type='submit'
                            >Editar</Button>
                            <Button content='Cancelar' onClick={this.handleClose} negative />
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
                </Segment>
              </Portal>
            </Grid.Column>
          </Grid>
        </Container>

        {/* <form id='form__add' onSubmit={this.onSubmit}>
          <label htmlFor='equipo'>Equipo</label>
          <input type='text' id='equipo' name='equipo' placeholder='Equipo y ubicación' value={equipo} onChange={this.onChange} />

          <label htmlFor='fecha'>Fecha</label>
          <input type='date' id='fecha' name='fecha' onChange={this.onChange} value={newFecha || Util.fechaYMD(fecha.toDate())} />

          <label htmlFor='actividades'>Actividades</label>
          <textarea name='actividades' id='actividades' cols='30' rows='10' onChange={this.onChange} value={actividades} />

          <label htmlFor='cantidad'>Cantidad</label>
          <input type='text' id='cantidad' name='cantidad' placeholder='Cantidad cambio refrigerante' onChange={this.onChange} value={cantidad} />

          <label htmlFor='tipo'>Tipo de mantenimiento</label>
          <select name='tipo' id='tipo' onChange={this.onChange} value={tipo.cr || tipo === 'cr' ? 'cr' : tipo.pr || tipo === 'pr' ? 'pr' : ''}>
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
        </form> */}
      </section>
    )
  }
}

export default Edit
