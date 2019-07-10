import React from 'react'
import { Loader } from 'semantic-ui-react'
import Layout from './Layout'

const Loading = () => (
  <Layout>
    <section id='Loading'>
      <Loader active inline='centered' size='medium' />
    </section>
    <style jsx>{`
      #Loading {
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

export default Loading
