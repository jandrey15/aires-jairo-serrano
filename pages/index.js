import React, { Component } from 'react'
import Firebase from '../components/Firabase/firebase'
import Link from 'next/link'

const SignUpPage = () => (
  <div>
    <h1>SignUp</h1>
    <SignUpForm />
  </div>
)

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

    this.firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {
        this.setState({ ...this.state })
      })
      .catch(error => {
        this.setState({ error })
      })

    event.preventDefault()
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

export default SignUpPage
