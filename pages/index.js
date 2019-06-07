import React, { Component } from 'react'
import Router from 'next/router'
import Layout from '../components/Layout'
import Firebase from '../firebase'

class Home extends Component {
  constructor (props) {
    super(props)

    this.state = {
      email: '',
      password: '',
      error: null,
      loading: true
    }
    this.firebase = new Firebase()
  }

  static async getInitialProps ({ pathname }) {
    console.log('PATHNAME', pathname)
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
        this.setState({ error })
      })

    event.preventDefault()
  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value })
  }

  render () {
    const { email, password, error, loading } = this.state

    const isInvalid = password === '' || email === ''
    // console.log(isInvalid)
    if (loading) {
      return <span>Loading...</span>
    }

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
