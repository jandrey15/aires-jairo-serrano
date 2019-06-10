import React, { Component } from 'react'
import Firebase from '../../firebase'
import Link from 'next/link'

class SignUpForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      username: '',
      email: '',
      passwordOne: '',
      passwordTwo: '',
      error: null
    }
    this.firebase = new Firebase()
  }

  onSubmit = event => {
    const { username, email, passwordOne } = this.state

    event.preventDefault()

    this.firebase
      .doCreateUserEmailPass(email, passwordOne)
      .then(result => {
        // console.log('data', result.user)
        this.setState({ ...this.state })
        result.user.updateProfile({
          displayName: username
        })

        const config = {
          url: 'https://blog-platzi-5a564.firebaseapp.com/'
        }

        result.user.sendEmailVerification(config).catch(error => {
          console.error(error.message)
        })

        console.info(`Bienvenido ${username}, debes realizar el proceso de verificación`)

        return this.firebase
          .doCreateUserDb(result.user.uid, username, email, 'https://images.jpg')
      })
      .catch(error => {
        console.error(`Error creando el user => ${error}`)
        this.setState({ error })
      })
      .then(refDoc => {
        console.log(`Id del user is => ${refDoc.id}`)
        this.firebase.doSignOut() // Cierra la sesión.
      })
      .catch(error => {
        console.error(`Error creando el user en db => ${error}`)
      })
  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value })
  };

  render () {
    const {
      username,
      email,
      passwordOne,
      passwordTwo,
      error
    } = this.state

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      email === '' ||
      username === ''

    return (
      <form onSubmit={this.onSubmit}>
        <input
          name='username'
          value={username}
          onChange={this.onChange}
          type='text'
          placeholder='Full Name'
        />
        <input
          name='email'
          value={email}
          onChange={this.onChange}
          type='text'
          placeholder='Email Address'
        />
        <input
          name='passwordOne'
          value={passwordOne}
          onChange={this.onChange}
          type='password'
          placeholder='Password'
        />
        <input
          name='passwordTwo'
          value={passwordTwo}
          onChange={this.onChange}
          type='password'
          placeholder='Confirm Password'
        />
        <button disabled={isInvalid} type='submit'>Sign Up</button>

        <Link href='/post?slug=something' as='/post/something'>
          <a>Post</a>
        </Link>

        {error && <p>{error.message}</p>}
      </form>
    )
  }
}

export default SignUpForm
