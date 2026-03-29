import React from 'react'

interface Column {
  key: string
  header: string
}

interface DataTableProps {
  columns: Column[]
  data: Record<string, unknown>[]
  renderRow?: (item: Record<string, unknown>) => React.ReactNode
}

function DataTable({ columns, data, renderRow }: DataTableProps): React.JSX.Element {
  return (
    <table className="data-table">
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.key}>{col.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {renderRow
          ? data.map((item, idx) => <tr key={idx}>{renderRow(item)}</tr>)
          : data.map((item, idx) => (
              <tr key={idx}>
                {columns.map((col) => (
                  <td key={col.key}>{String(item[col.key] ?? '')}</td>
                ))}
              </tr>
            ))}
      </tbody>
    </table>
  )
}

export default DataTable
