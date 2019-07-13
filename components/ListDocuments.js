import { Header, Table, Container, Responsive, Button, Form } from 'semantic-ui-react'
import Util from '../helpers/util'

const ListDocuments = ({ data, handleEdit, showDelete }) => {
  return (
    <section id='List__Documents'>
      <Container>
        <Table celled padded compact size='small'>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell singleLine>Equipo - ubicación</Table.HeaderCell>
              <Table.HeaderCell>Fecha</Table.HeaderCell>
              <Table.HeaderCell>Actividades</Table.HeaderCell>
              <Table.HeaderCell>Cantidad</Table.HeaderCell>
              <Table.HeaderCell>Tipo de mantenimiento</Table.HeaderCell>
              <Table.HeaderCell>Observaciones</Table.HeaderCell>
              <Table.HeaderCell>Realizado</Table.HeaderCell>
              <Table.HeaderCell>Recibido</Table.HeaderCell>
              <Table.HeaderCell></Table.HeaderCell>
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
                    {Util.obtenerFecha(data.fecha.toDate())}
                  </Responsive>
                  <Responsive as={Table.Cell} minWidth={Responsive.onlyMobile.minWidth}>
                    {data.actividades}
                  </Responsive>
                  <Responsive as={Table.Cell} minWidth={Responsive.onlyMobile.minWidth}>
                    {data.cantidad}
                  </Responsive>
                  <Responsive as={Table.Cell} minWidth={Responsive.onlyMobile.minWidth}>
                    {data.tipo.cr ? 'Correctivo' : data.tipo.pr ? 'Preventivo' : ''}
                  </Responsive>
                  <Responsive as={Table.Cell} minWidth={Responsive.onlyMobile.minWidth}>
                    {data.observaciones}
                  </Responsive>
                  <Responsive as={Table.Cell} minWidth={Responsive.onlyMobile.minWidth}>
                    {data.realizado}
                  </Responsive>
                  <Responsive as={Table.Cell} minWidth={Responsive.onlyMobile.minWidth}>
                    {data.recibido}
                  </Responsive>
                  <Responsive as={Table.Cell} minWidth={Responsive.onlyMobile.minWidth}>
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
