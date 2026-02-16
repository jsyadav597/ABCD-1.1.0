import './Table.css';

const Table = ({
  columns = [],
  data = [],
  striped = true,
  hover = true,
  bordered = true,
  className = '',
  children,
}) => {
  return (
    <div className="table-wrapper">
      <table
        className={`table ${striped ? 'table-striped' : ''} ${
          hover ? 'table-hover' : ''
        } ${bordered ? 'table-bordered' : ''} ${className}`}
      >
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} style={{ width: col.width }}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((col) => (
                  <td key={col.key}>
                    {col.render
                      ? col.render(row[col.key], row, rowIndex)
                      : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="table-empty">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {children}
    </div>
  );
};

export default Table;
