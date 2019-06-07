import React, { Component } from 'react'
import Layout from '../components/Layout'
import Firebase from '../firebase'

class Home extends Component {
  constructor (props) {
    super(props)

    this.state = {
      email: '',
      password: '',
      error: null
    }
    this.firebase = new Firebase()
  }

  componentDidMount () {
    this.firebase.auth.onAuthStateChanged(user => {
      if (user) {
        // $('#btnInicioSesion').text('Salir')
        if (user.photoURL) {
          console.log(user.photoURL)
        } else {
          console.log('user sin photo')
        }
      } else {
        console.info('Iniciar sesión')
      }
    })
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
        this.setState({ error })
      })

    event.preventDefault()
  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value })
  }

  render () {
    const { email, password, error } = this.state

    const isInvalid = password === '' || email === ''
    // console.log(isInvalid)

    return (
      <Layout title='Login'>
        <form onSubmit={this.onSubmit}>
          <input
            name='email'
            value={email}
            onChange={this.onChange}
            type='text'
            placeholder='Email Address'
          />
          <input
            name='password'
            value={password}
            onChange={this.onChange}
            type='password'
            placeholder='Password'
          />
          <button disabled={isInvalid} type='submit'>
          Sign In
          </button>

          {error && <p>{error.message}</p>}
        </form>
      </Layout>
    )
  }
}

export default Home
