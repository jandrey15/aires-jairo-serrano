import React, { Component } from 'react'
import Header from '../components/Header'
import Layout from '../components/Layout'
import Firebase from '../firebase'
import Router from 'next/router'
import Loading from '../components/Loading'
import { Message, Container, Segment, Form, Button } from 'semantic-ui-react'

class Perfil extends Component {
  constructor (props) {
    super(props)
    this.firebase = new Firebase()
    this.state = {
      loading: true,
      name: null,
      email: null,
      password: null,
      uid: null,
      visible: true,
      emailVerified: false
    }
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

          this.updateProfile()
        }
      } else {
        console.info('Iniciar sesión')
        Router.push('/')
      }
    })
  }

  handleSignOut = event => {
    this.firebase.doSignOut()
    event.preventDefault()
  }

  handleDismiss = () => {
    this.setState({ visible: false })
  }

  handleChange = (e, { name, value }) => {
    this.setState({ [name]: value })
    // console.log({ [name]: value })
  }

  updateProfile = () => {
    const { name, uid } = this.state

    console.log(uid)

    // this.firebase.doCurrentUser()
    //   .updateProfile({
    //     displayName: name
    //   }).then(() => {
    //     // Update successful.
    //   }).catch((error) => {
    //     // An error happened.
    //     console.error(error)
    //   })

    // this.firebase.doUpdateProfile(name, uid)
  }

  render () {
    const { name, loading, visible, email, emailVerified } = this.state

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
                      label='Contraseña nueva'
                      placeholder='xxxxxx'
                      name='password'
                      onChange={this.handleChange}
                      type='password'
                    />
                  </Form.Group>
                </Form>
                <Button primary>Guardar</Button>
              </Segment>
            </Segment.Group>
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
