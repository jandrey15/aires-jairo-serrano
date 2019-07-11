import React, { Component } from 'react'
import Router from 'next/router'
import Layout from '../components/Layout'
import Firebase from '../firebase'
import { Button, Container, Form, Grid, Segment, Message } from 'semantic-ui-react'
import Loading from '../components/Loading'

class Home extends Component {
  constructor (props) {
    super(props)

    this.state = {
      email: '',
      password: '',
      error: null,
      errorMessage: null,
      loading: true
    }
    this.firebase = new Firebase()
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
        Router.push('/admin')
        // if (user.photoURL) {
        //   console.log(user.photoURL)
        // } else {
        //   console.log('user sin photo')
        // }
      } else {
        console.info('Iniciar sesión')
        this.setState({
          loading: false
        })
      }
    })
  }

  componentWillUnmount () {
    this.fireBaseListener && this.fireBaseListener()
  }

  onSubmit = event => {
    const { email, password } = this.state

    this.firebase
      .doAutEmailPass(email, password)
      .then((result) => {
        this.setState({ ...this.state })
        if (result.user.emailVerified) {
          console.info(`Bienvenido ${result.user.displayName}`)
        } else {
          this.firebase.doSignOut()
          console.warn('Por favor realiza la verificación de la cuenta')
        }
      })
      .catch(error => {
        console.error(error)
        // Si pasa algo o esta mal el pass.
        this.setState({
          errorMessage: 'La contraseña no es válida o el usuario no tiene una contraseña.',
          error
        })
      })

    event.preventDefault()
  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value })
  }

  render () {
    const { email, password, error, errorMessage, loading } = this.state

    const isInvalid = password === '' || email === ''
    // console.log(isInvalid)
    if (loading) {
      return <Loading />
    }

    return (
      <Layout title='Login'>
        <section id='Login'>
          <Container>
            <Segment placeholder>
              <Grid relaxed='very' stackable>
                <Grid.Column>
                  <Form onSubmit={this.onSubmit}>
                    <Form.Input icon='user' iconPosition='left' label='Username' name='email'
                      value={email}
                      onChange={this.onChange}
                      type='text'
                      placeholder='Correo electrónico' error={error} />
                    <Form.Input icon='lock' iconPosition='left' label='Password'name='password'
                      value={password}
                      onChange={this.onChange}
                      type='password'
                      placeholder='Contraseña' error={error} />

                    <Button content='Iniciar sesión' primary disabled={isInvalid} />

                  </Form>
                </Grid.Column>
              </Grid>
            </Segment>
            {error && (
              <Message negative>
                <Message.Header>{errorMessage}</Message.Header>
                <p>Comuniquese con el administrador</p>
              </Message>
            )}
          </Container>
        </section>
        <style jsx>{`
          #Login {
            max-width: 500px;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            height: 100vh;
            align-items: center;
            justify-content: center;
          }
        `}</style>
      </Layout>
    )
  }
}

export default Home
