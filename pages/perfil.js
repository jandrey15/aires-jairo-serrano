import React, { Component } from 'react'
import Header from '../components/Header'
import Layout from '../components/Layout'
import Firebase from '../firebase'
import Router from 'next/router'
import Loading from '../components/Loading'
import { Message, Container, Segment, Form, Button } from 'semantic-ui-react'
import * as firebase from 'firebase/app'

class Perfil extends Component {
  constructor (props) {
    super(props)

    this.state = {
      loading: true,
      name: '',
      email: '',
      currentPassword: '',
      password: '',
      password2: '',
      uid: '',
      visible: true,
      success: false,
      failed: false,
      emailVerified: false,
      message: '',
      errorPassword: false,
      errorPassword2: false
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
          loading: false,
          name: user.displayName,
          email: user.email,
          emailVerified: user.emailVerified,
          uid: user.uid
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
  }

  componentWillUnmount () {
    this.fireBaseListener && this.fireBaseListener()
    clearTimeout(this.timer)
  }

  handleSignOut = event => {
    this.firebase.doSignOut()
    event.preventDefault()
  }

  handleDismiss = () => this.setState({ visible: false })

  handleDismissSuccess = () => this.setState({ success: false })
  handleDismissFailed = () => this.setState({ failed: false })

  handleChange = (e, { name, value }) => {
    this.setState({ [name]: value })
    // console.log({ [name]: value })
  }

  reauthenticate = (currentPassword) => {
    const user = this.firebase.doCurrentUser()
    // console.log(user.email, currentPassword)
    const credential = firebase.auth.EmailAuthProvider.credential(
      user.email,
      currentPassword
    )
    return user.reauthenticateWithCredential(credential)
  }

  updateProfile = () => {
    const { name, uid, currentPassword, password, password2 } = this.state

    // console.log(password)
    // console.log(password2)
    if (password !== '' && password2 !== '' && currentPassword !== '') {
      if (password.length >= 6 && password2.length >= 6) {
        if (password === password2) {
          // console.log('ok paso')
          this.setState({
            errorPassword: false,
            errorPassword2: false
          })

          this.reauthenticate(currentPassword)
            .then(() => {
              this.firebase.doCurrentUser()
                .updatePassword(password)
                .then(() => {
                  this.setState({
                    message: 'Se actualizo correctamente la contraseña.',
                    success: true,
                    currentPassword: '',
                    password: '',
                    password2: ''
                  })

                  this.timer = setTimeout(() => {
                    this.setState({ success: false })
                  }, 12000)
                }).catch((error) => {
                // An error happened.
                  console.error('Algo salio mal password', error)
                  this.setState({
                    message: 'Algo salio mal al cambiar la contraseña intentalo mas tarde.',
                    failed: true
                  })
                })
            }).catch((error) => {
              console.log(error)
              this.setState({
                message: 'La contraseña actual parece no ser correcta intertarlo nuevamente.',
                failed: true
              })
            })
        } else {
          console.warn('Las contraseñas no coinciden.')
          this.setState({
            errorPassword: 'Las contraseñas no coinciden.',
            errorPassword2: 'Las contraseñas no coinciden.'
          })
        }
      } else {
        console.warn('La contraseña debe tener mínimo 6 caracteres.')
        this.setState({
          errorPassword: 'La contraseña debe tener mínimo 6 caracteres.',
          errorPassword2: 'La contraseña debe tener mínimo 6 caracteres.'
        })
      }
    } else if (password !== '' && password2 === '') {
      this.setState({
        errorPassword2: 'La contraseña debe tener mínimo 6 caracteres.'
      })
    } else {
      this.firebase.doCurrentUser()
        .updateProfile({
          displayName: name
        }).then(() => {
          this.setState({
            message: 'Se guardo correctamente la información.',
            success: true
          })

          this.firebase.doUpdateProfileDb(name, uid)

          this.timer = setTimeout(() => {
            this.setState({ success: false })
          }, 12000)
        }).catch((error) => {
          // An error happened.
          console.error(error)
          this.setState({
            message: 'Algo salio mal intentalo mas tarde.',
            failed: true
          })
        })
    }
  }

  render () {
    const { name, loading, visible, email, emailVerified, message, success, failed, errorPassword, errorPassword2, currentPassword, password, password2 } = this.state

    if (loading) {
      return <Loading />
    }

    return (
      <Layout title='Perfil'>
        <Header name={name} handleSignOut={this.handleSignOut} />

        {visible && !emailVerified && (
          <Container>
            <section className='message'>
              <Message
                onDismiss={this.handleDismiss}
                header='Verificar correo electrónico'
                content={`Por favor verifique su correo electrónico, se le envió un enlace a ${email} para verificar su correo.`}
              />
            </section>
          </Container>
        )}

        <section id='Profile'>
          <Container>
            <Segment.Group piled>
              <Segment>
                <Form>
                  <Form.Group widths='equal'>
                    <Form.Input
                      fluid
                      label='Nombre'
                      name='name'
                      placeholder='Nombre'
                      value={name}
                      onChange={this.handleChange}
                    />
                  </Form.Group>
                </Form>
              </Segment>
              <Segment>
                <Form>
                  <Form.Group widths='equal'>
                    <Form.Input
                      fluid
                      label='Correo electrónico'
                      placeholder='mi@email.com'
                      name='email'
                      value={email}
                      readOnly
                    />
                  </Form.Group>
                </Form>
              </Segment>
              <Segment>
                <Form>
                  <Form.Group widths='equal'>
                    <Form.Input
                      fluid
                      label='Actual contraseña'
                      placeholder='xxxxxx'
                      name='currentPassword'
                      onChange={this.handleChange}
                      type='password'
                      required
                      value={currentPassword}
                    />
                    <Form.Input
                      fluid
                      label='Nueva contraseña'
                      placeholder='xxxxxx'
                      name='password'
                      onChange={this.handleChange}
                      type='password'
                      required
                      value={password}
                      error={errorPassword}
                    />
                    <Form.Input
                      fluid
                      label='Repetir contraseña'
                      placeholder='xxxxxx'
                      name='password2'
                      onChange={this.handleChange}
                      type='password'
                      required
                      value={password2}
                      error={errorPassword2}
                    />
                  </Form.Group>
                </Form>
                <Button primary onClick={this.updateProfile}>Guardar</Button>
              </Segment>
            </Segment.Group>
            {success && (
              <Message
                onDismiss={this.handleDismissSuccess}
                header={message}
                positive
              />
            )}
            {failed && (
              <Message
                onDismiss={this.handleDismissFailed}
                header={message}
                negative
              />
            )}
          </Container>
        </section>

        <hr />

        <Container>
          <div className='copyright'>
            <h4>By <a href='https://johnserrano.co' target='_blank'>John Serrano</a></h4>
            <span><a href='https://twitter.com/Jandrey15' target='_blank'>@jandrey15</a></span>
          </div>
        </Container>
        <style jsx>{`
          .message {
            margin: 50px 0;
          }

          #Profile {
            margin: 50px auto;
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

export default Perfil
