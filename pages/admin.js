import React, { Component } from 'react'
import Router from 'next/router'
import Layout from '../components/Layout'
import Firebase from '../firebase'
import Edit from '../components/containers/Edit'
import ListDocuments from '../components/ListDocuments'
import Add from '../components/containers/Add'
import Loading from '../components/Loading'
import Header from '../components/Header'
import { Divider, Grid, Segment, Container, Form, Input, Button, Select, Confirm } from 'semantic-ui-react'

class Admin extends Component {
  constructor (props) {
    super(props)

    this.state = {
      loading: true,
      name: null,
      update: false,
      id: null,
      data: [],
      search: null,
      getDocument: {},
      tipoFilter: 'all',
      open: false,
      openDelete: false,
      idDelete: null,
      total: 0
    }

    this.firebase = new Firebase()
    // this.util = new Utilidad()

    this.tipoSelectFilter = React.createRef()
    this.fechaInputStart = React.createRef()
    this.fechaInputEnd = React.createRef()

    // this.searchInput = React.createRef()
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
          // console.log('user sin photo')
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

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value })
  }

  handleEdit = (id, event) => {
    event.preventDefault()

    // console.log(id)
    this.firebase
      .doGetDocument(id)
      .then(doc => {
        if (doc.exists) {
          let open = true
          if (this.state.id === id) {
            // console.log('ok paso Admin')
            open = false
          }

          this.setState({
            update: true,
            getDocument: doc.data(),
            id,
            open: open
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

  handleDelete = (id) => {
    // event.preventDefault()

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
    const tipo = this.state.tipoFilter
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
    const { search } = this.state
    // console.log(search)

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

  onChangeFilter = (event, data) => {
    // console.log(data.value)
    if (data.name === 'tipoFilter') {
      // console.log(data.value)
      this.setState({
        tipoFilter: data.value
      })
    }
  }

  showDelete = (id) => {
    this.setState({ openDelete: true, idDelete: id })
  }

  handleConfirm = () => {
    this.setState({ result: 'confirmed', openDelete: false })
    const { idDelete } = this.state
    this.handleDelete(idDelete)
  }
  handleCancel = () => this.setState({ result: 'cancelled', openDelete: false })

  render () {
    const { loading, id, name, data, open, openDelete } = this.state
    // console.log(open)

    if (loading) {
      return <Loading />
    }

    const typeOptions = [
      { key: 'all', text: 'Todos', value: 'all' },
      { key: 'pr', text: 'Preventivo', value: 'pr' },
      { key: 'cr', text: 'Correctivo', value: 'cr' }
    ]

    return (
      <Layout title='Admin'>
        <Header name={name} handleSignOut={this.handleSignOut} />
        <section className='controls'>
          <Container>
            <Segment basic textAlign='center'>
              <Grid columns={2} stackable textAlign='center'>
                <Grid.Row>
                  <Grid.Column>
                    <Form id='filter'>
                      <Form.Group widths='equal'>
                        <Form.Field
                          control={Select}
                          options={typeOptions}
                          label={{ children: 'Tipo de mantenimiento', htmlFor: 'form-select-control-tipo' }}
                          placeholder='Todos'
                          search
                          searchInput={{ id: 'form-select-control-tipo' }}
                          name='tipoFilter'
                          onChange={this.onChangeFilter}
                        />
                      </Form.Group>
                      <Form.Group widths='equal'>
                        <Form.Field>
                          <label htmlFor='Fecha'>Fecha inicial</label>
                          <input type='date' name='fechaStart' ref={this.fechaInputStart} />
                        </Form.Field>
                        <Form.Field>
                          <label htmlFor='Fecha'>Fecha final</label>
                          <input type='date' name='fechaEnd' ref={this.fechaInputEnd} />
                        </Form.Field>
                      </Form.Group>
                      <Button
                        onClick={this.handleFilter}
                        primary
                      >Filtrar</Button>
                    </Form>
                  </Grid.Column>

                  <Grid.Column verticalAlign='middle'>
                    <Add />
                  </Grid.Column>
                </Grid.Row>
              </Grid>

              <Divider horizontal>Or</Divider>

              <div className='form__search'>
                <Form onSubmit={this.onSubmitSearch} widths='equal'>
                  <Input
                    action={{ color: 'blue', content: 'Buscar' }}
                    icon='search'
                    iconPosition='left'
                    type='text'
                    name='search'
                    placeholder='Equipo o ubicación'
                    fluid
                    onChange={this.onChange}
                  />
                </Form>
              </div>
            </Segment>
          </Container>
        </section>
        {
          data.length > 0 ? (
            <ListDocuments
              data={data}
              showDelete={this.showDelete}
              handleEdit={this.handleEdit}
            />
          ) : (
            <Container textAlign='center'>
              <h2>No hay datos</h2>
            </Container>
          )
        }

        <Confirm
          open={openDelete}
          onCancel={this.handleCancel}
          onConfirm={this.handleConfirm}
          content='¿Estás seguro de eliminar el mantenimiento?'
        />

        <hr />
        {
          this.state.update && (
            <Edit {...this.state.getDocument} id={id} open={open} />
          )
        }

        <Container>
          <div className='copyright'>
            <h4>By <a href='https://johnserrano.co' target='_blank'>John Serrano</a></h4>
            <span><a href='https://twitter.com/Jandrey15' target='_blank'>@jandrey15</a></span>
          </div>
        </Container>
        <style jsx>{`
          .controls {
            margin: 50px 0;
          }
          .form__search {
            margin: 30px auto 0;
            max-width: 500px;
          }

          hr {
            border: 2px solid #e4e4e4;
            margin: 50px 0 20px;
          }

          .copyright {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            margin: 20px 0;
          }
        `}</style>
      </Layout>
    )
  }
}

export default Admin
