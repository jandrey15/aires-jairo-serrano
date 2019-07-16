import { Header, Table, Container, Responsive, Button, Form } from 'semantic-ui-react'
import Util from '../helpers/util'

const ListDocuments = ({ data, handleEdit, showDelete, role }) => {
  return (
    <section id='List__Documents'>
      <Container>
        <Table celled padded compact size='small'>
          <Table.Header>
            <Table.Row>
              <Responsive as={Table.HeaderCell} singleLine minWidth={Responsive.onlyComputer.minWidth}>
                Equipo - ubicación
              </Responsive>
              <Responsive as={Table.HeaderCell} minWidth={Responsive.onlyComputer.minWidth}>
                Fecha
              </Responsive>
              <Responsive as={Table.HeaderCell} singleLine minWidth={Responsive.onlyComputer.minWidth}>
                Actividades
              </Responsive>
              <Responsive as={Table.HeaderCell} singleLine minWidth={Responsive.onlyComputer.minWidth}>
                Cantidad
              </Responsive>
              <Responsive as={Table.HeaderCell} singleLine minWidth={Responsive.onlyComputer.minWidth}>
                Tipo de mantenimiento
              </Responsive>
              <Responsive as={Table.HeaderCell} singleLine minWidth={Responsive.onlyComputer.minWidth}>
                Observaciones
              </Responsive>
              <Responsive as={Table.HeaderCell} singleLine minWidth={Responsive.onlyComputer.minWidth}>
                Realizado
              </Responsive>
              <Responsive as={Table.HeaderCell} singleLine minWidth={Responsive.onlyComputer.minWidth}>
                Recibido
              </Responsive>
              <Responsive as={Table.HeaderCell} singleLine minWidth={Responsive.onlyComputer.minWidth} />
              {/* <Table.HeaderCell singleLine></Table.HeaderCell> */}
              {/* <Table.HeaderCell>Fecha</Table.HeaderCell>
              <Table.HeaderCell>Actividades</Table.HeaderCell>
              <Table.HeaderCell>Cantidad</Table.HeaderCell>
              <Table.HeaderCell>Tipo de mantenimiento</Table.HeaderCell>
              <Table.HeaderCell>Observaciones</Table.HeaderCell>
              <Table.HeaderCell>Realizado</Table.HeaderCell>
              <Table.HeaderCell>Recibido</Table.HeaderCell>
              <Table.HeaderCell></Table.HeaderCell> */}
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {
              data.map((data) => (
                <Table.Row key={data.id}>
                  <Responsive as={Table.Cell} minWidth={Responsive.onlyMobile.minWidth}>
                    <Header as='h4'>
                      {data.equipo}
                    </Header>
                  </Responsive>
                  <Responsive as={Table.Cell} minWidth={Responsive.onlyMobile.minWidth}>
                    <Responsive maxWidth={Responsive.onlyMobile.maxWidth}>
                      <h4>Fecha</h4>
                    </Responsive>
                    {Util.obtenerFecha(data.fecha.toDate())}
                  </Responsive>
                  <Responsive as={Table.Cell} minWidth={Responsive.onlyMobile.minWidth}>
                    <Responsive maxWidth={Responsive.onlyMobile.maxWidth}>
                      <h4>Actividades</h4>
                    </Responsive>
                    {data.actividades}
                  </Responsive>
                  <Responsive as={Table.Cell} minWidth={Responsive.onlyMobile.minWidth}>
                    <Responsive maxWidth={Responsive.onlyMobile.maxWidth}>
                      <h4>Cantidad</h4>
                    </Responsive>
                    {data.cantidad}
                  </Responsive>
                  <Responsive as={Table.Cell} minWidth={Responsive.onlyMobile.minWidth}>
                    <Responsive maxWidth={Responsive.onlyMobile.maxWidth}>
                      <h4>Tipo de mantenimiento</h4>
                    </Responsive>
                    {data.tipo.cr ? 'Correctivo' : data.tipo.pr ? 'Preventivo' : ''}
                  </Responsive>
                  <Responsive as={Table.Cell} minWidth={Responsive.onlyMobile.minWidth}>
                    <Responsive maxWidth={Responsive.onlyMobile.maxWidth}>
                      <h4>Observaciones</h4>
                    </Responsive>
                    {data.observaciones}
                  </Responsive>
                  <Responsive as={Table.Cell} minWidth={Responsive.onlyMobile.minWidth}>
                    <Responsive maxWidth={Responsive.onlyMobile.maxWidth}>
                      <h4>Realizado</h4>
                    </Responsive>
                    {data.realizado}
                  </Responsive>
                  <Responsive as={Table.Cell} minWidth={Responsive.onlyMobile.minWidth}>
                    <Responsive maxWidth={Responsive.onlyMobile.maxWidth}>
                      <h4>Recibido</h4>
                    </Responsive>
                    {data.recibido}
                  </Responsive>
                  <Responsive as={Table.Cell} minWidth={Responsive.onlyMobile.minWidth}>
                    {
                      role && (
                        <Form widths='equal'>
                          <Form.Group inline>
                            <Button size='medium' primary onClick={(e) => handleEdit(data.id, e)}>
                              Editar
                            </Button>
                          </Form.Group>
                          <Form.Group inline>
                            <Button size='medium' negative onClick={(e) => showDelete(data.id, e)}>
                              Eliminar
                            </Button>
                          </Form.Group>
                        </Form>
                      )
                    }
                  </Responsive>
                </Table.Row>
              ))
            }
          </Table.Body>
        </Table>
      </Container>
    </section>
  )
}

export default ListDocuments
