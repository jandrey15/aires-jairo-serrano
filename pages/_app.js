import React from 'react'
import App, { Container } from 'next/app'
import Firebase, { FirebaseContext } from '../components/Firabase'

class MyApp extends App {
  static async getInitialProps ({ Component, ctx }) {
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return { pageProps }
  }

  render () {
    const { Component, pageProps } = this.props

    return (
      <Container>
        <FirebaseContext.Provider value={new Firebase()}>
          <Component {...pageProps} />
        </FirebaseContext.Provider>
      </Container>
    )
  }
}

export default MyApp
