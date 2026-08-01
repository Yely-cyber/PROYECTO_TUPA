import React, { useMemo, useState } from "react";

/**
 * Tabla reutilizable con paginación para todas las vistas de administración
 * (Gestión de Trámites, Expedientes, etc).
 *
 * columns: [{ key, header, render?(row) }]
 */
export default function AdminDataTable({
  columns,
  data,
  pageSize = 8,
  emptyMessage = "No se encontraron resultados.",
  getRowKey = (row) => row.id,
}) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));
  const pageSafe = Math.min(page, totalPages);

  const rows = useMemo(
    () => data.slice((pageSafe - 1) * pageSize, pageSafe * pageSize),
    [data, pageSafe, pageSize]
  );

  return (
    <div>
      <table className="admin-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={getRowKey(row)}>
              {columns.map((col) => (
                <td key={col.key}>{col.render ? col.render(row) : row[col.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {rows.length === 0 && <div className="admin-empty">{emptyMessage}</div>}

      {data.length > pageSize && (
        <div className="admin-pagination">
          <span>
            Página {pageSafe} de {totalPages}
          </span>
          <button
            className="admin-btn admin-btn-outline"
            disabled={pageSafe === 1}
            onClick={() => setPage(pageSafe - 1)}
          >
            Anterior
          </button>
          <button
            className="admin-btn admin-btn-outline"
            disabled={pageSafe === totalPages}
            onClick={() => setPage(pageSafe + 1)}
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}
