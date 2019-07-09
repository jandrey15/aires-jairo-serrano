import { Header, Container } from 'semantic-ui-react'
const HeaderContent = ({ name }) => (
  <header>
    <Container>
      <Header as='h3' dividing textAlign='right'>
        <a href='/admin'>Admin</a>
        Hello admin - {name}
      </Header>
    </Container>
    <style jsx global>{`
      header {
        padding: 20px 0 5px;
      }      
    `}</style>
  </header>
)

export default HeaderContent
