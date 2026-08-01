// Funciones auxiliares para el módulo de administración TUPA Digital

/** Normaliza un estado a la clase CSS del badge correspondiente (ver ExpedienteStatusBadge). */
export function estadoToClass(estado = "") {
  return estado
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-");
}

/** Formatea un monto en soles peruanos. */
export function formatSoles(valor) {
  const num = Number(valor) || 0;
  return `S/ ${num.toFixed(2)}`;
}

/** Formatea una fecha ISO o Date a dd/mm/aaaa. */
export function formatFecha(fecha) {
  if (!fecha) return "-";
  const d = new Date(fecha);
  if (Number.isNaN(d.getTime())) return fecha; // ya viene formateada
  return d.toLocaleDateString("es-PE");
}

/** Filtra un array de objetos por texto libre sobre las llaves indicadas. */
export function filterByText(items, query, keys) {
  if (!query) return items;
  const q = query.toLowerCase();
  return items.filter((item) =>
    keys.some((key) => String(item[key] ?? "").toLowerCase().includes(q))
  );
}

/** Exporta un array de objetos a un archivo CSV (basado en Excel) y dispara la descarga. */
export function exportToExcel(rows, filename = "reporte.csv") {
  if (!rows || rows.length === 0) return;
  const headers = Object.keys(rows[0]);
  const csvLines = [
    headers.join(","),
    ...rows.map((row) =>
      headers
        .map((h) => `"${String(row[h] ?? "").replace(/"/g, '""')}"`)
        .join(",")
    ),
  ];
  const blob = new Blob([csvLines.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

/** Exporta un array de objetos a PDF simple usando window.print sobre una tabla generada. */
export function exportToPDF(rows, title = "Reporte") {
  if (!rows || rows.length === 0) return;
  const headers = Object.keys(rows[0]);
  const win = window.open("", "_blank");
  win.document.write(`
    <html>
      <head><title>${title}</title></head>
      <body>
        <h2>${title}</h2>
        <table border="1" cellspacing="0" cellpadding="6" style="border-collapse:collapse;width:100%;font-family:sans-serif;font-size:13px">
          <thead><tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr></thead>
          <tbody>
            ${rows
              .map(
                (r) => `<tr>${headers.map((h) => `<td>${r[h] ?? ""}</td>`).join("")}</tr>`
              )
              .join("")}
          </tbody>
        </table>
      </body>
    </html>
  `);
  win.document.close();
  win.print();
}

/** Formatea bytes a KB/MB legibles. */
export function formatFileSize(bytes) {
  if (!bytes && bytes !== 0) return "-";
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
