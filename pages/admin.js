import React, { Component } from 'react'
import Router from 'next/router'
import Layout from '../components/Layout'
import Firebase from '../firebase'
import Util from '../helpers/util'

class Admin extends Component {
  constructor (props) {
    super(props)

    this.state = {
      loading: true,
      name: null,
      dataCocinas: []
    }
    this.firebase = new Firebase()
    // this.util = new Utilidad()
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

    this.firebase
      .doGetAllCocina()
      .then((querySnapshot) => {
        const data = querySnapshot.docs.map(doc => doc.data())
        console.log(data)
        this.setState({
          dataCocinas: data
        })
      })
      .catch(error => {
        console.error('Error getting document:', error)
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
    const { loading, name, dataCocinas } = this.state

    if (loading) {
      return <span>Loading...</span>
    }

    return (
      <Layout title='Admin'>
        <div className='container'>
          <h3>Hello admin - {name}</h3>
          <button type='button' onClick={this.handleSignOut}>
            Sign Out
          </button>
        </div>

        <section className='data__cocinas container'>
          {
            dataCocinas.map(data => {
              return (
                <div className='mantenimiento' key={data.uid}>
                  <h1>{data.actividades}</h1>
                  <p>{data.equipo}</p>
                  {Util.obtenerFecha(data.fecha.toDate())}
                  <p>{data.observaciones}</p>
                </div>
              )
            })
          }
        </section>
        <style jsx>{`
          .container {
            max-width: 500px;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            height: 20vh;
            align-items: center;
            justify-content: center;
          }
        `}</style>
      </Layout>
    )
  }
}

export default Admin
