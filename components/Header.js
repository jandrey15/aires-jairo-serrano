import React, { Component } from 'react'
import { Container, Menu, Dropdown } from 'semantic-ui-react'
import Router from 'next/router'

class Header extends Component {
  state = { activeItem: 'home' }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  handleProfile = () => Router.push('/perfil')
  handleInicio = () => Router.push('/admin')

  render () {
    const { name, handleSignOut } = this.props
    const { activeItem } = this.state

    return (
      <header>
        <Container>
          <Menu size='large'>
            <Menu.Item name='Admin' active={activeItem === 'home'} onClick={this.handleItemClick} />
            {/* <Menu.Item
              name='messages'
              active={activeItem === 'messages'}
              onClick={this.handleItemClick}
            /> */}

            <Menu.Menu position='right'>
              <Dropdown item text={name}>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={this.handleInicio}>Inicio</Dropdown.Item>
                  <Dropdown.Item onClick={this.handleProfile}>Perfil</Dropdown.Item>
                  <Dropdown.Item onClick={handleSignOut}>Cerrar sesión</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Menu.Menu>
          </Menu>
        </Container>
        <style jsx global>{`
          header {
            padding: 20px 0 5px;
          }      
        `}</style>
      </header>
    )
  }
}

export default Header