import Util from '../helpers/util'
const ListDocuments = ({ data, handleEdit, handleDelete }) => {
  return (
    <section id='List__Documents'>
      <table>
        <thead>
          <tr>
            <th>Equipo</th>
            <th>Fecha</th>
            <th>Actividades</th>
            <th>Cantidad</th>
            <th>Tipo de mantenimiento</th>
            <th>Observaciones</th>
            <th>Realizado</th>
            <th>Recibido</th>
            <th />
            <th />
          </tr>
        </thead>
        <tbody>
          {
            data.map((data) => (
              <tr className='mantenimiento' key={data.id}>
                <td>{data.equipo}</td>
                <td>{Util.obtenerFecha(data.fecha.toDate())}</td>
                <td width='250'>{data.actividades}</td>
                <td>{data.cantidad}</td>
                <td>{data.tipo.cr ? 'Correctivo' : data.tipo.pr ? 'Preventivo' : ''}</td>
                <td>{data.observaciones}</td>
                <td>{data.realizado}</td>
                <td>{data.recibido}</td>
                <td>
                  <a href={`/editar/${data.id}`} onClick={(e) => handleEdit(data.id, e)}>Editar</a>
                </td>
                <td>
                  <a href={`/eliminar/${data.id}`} onClick={(e) => handleDelete(data.id, e)}>Eliminar</a>
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </section>
  )
}

export default ListDocuments
