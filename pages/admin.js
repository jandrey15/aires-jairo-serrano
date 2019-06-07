import React, { Component } from 'react'
import Router from 'next/router'
import Layout from '../components/Layout'
import Firebase from '../firebase'

class Admin extends Component {
  constructor (props) {
    super(props)

    this.state = {
      loading: true,
      name: null
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
        this.setState({
          name: user.displayName
        })
        if (user.photoURL) {
          console.log(user.photoURL)
        } else {
          console.log('user sin photo')
        }
      } else {
        console.info('Iniciar sesión')
        Router.push('/')
      }
    })
  }

  componentWillUnmount () {
    this.fireBaseListener && this.fireBaseListener()
  }

  handleSignOut = event => {
    this.firebase.doSignOut()
    event.preventDefault()
  }

  render () {
    const { loading, name } = this.state

    if (loading) {
      return <span>Loading...</span>
    }

    return (
      <Layout title='Admin'>
        <h3>Hello admin - {name}</h3>
        <button type='button' onClick={this.handleSignOut}>
          Sign Out
        </button>
      </Layout>
    )
  }
}

export default Admin
