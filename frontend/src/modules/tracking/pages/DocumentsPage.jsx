import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

const documents = [
  {
    name: 'Constancia_Estudios_2026.pdf',
    expediente: 'EXP-2026-000123',
    tramite: 'Constancia de Estudios',
    category: 'Constancia',
    format: 'PDF',
    date: '18/07/2026'
  },
  {
    name: 'Solicitud_Beca_2026.pdf',
    expediente: 'EXP-2026-000119',
    tramite: 'Solicitud de Beca',
    category: 'Solicitud',
    format: 'PDF',
    date: '15/07/2026'
  },
  {
    name: 'Comprobante_Pago_2026.pdf',
    expediente: 'EXP-2026-000098',
    tramite: 'Pago de trámite',
    category: 'Comprobante',
    format: 'PDF',
    date: '10/07/2026'
  },
  {
    name: 'Resolucion_Matricula_2026.pdf',
    expediente: 'EXP-2026-000077',
    tramite: 'Reserva de matrícula',
    category: 'Resolución',
    format: 'PDF',
    date: '05/07/2026'
  },
  {
    name: 'Constancia_Egresado_2026.pdf',
    expediente: 'EXP-2026-000045',
    tramite: 'Constancia de Egresado',
    category: 'Constancia',
    format: 'PDF',
    date: '02/07/2026'
  }
];

const MenuIcon = ({ name, className = 'h-5 w-5' }) => {
  const paths = {
    home: <><path d="m3 10 9-7 9 7" /><path d="M5 9.5V21h14V9.5M9 21v-7h6v7" /></>,
    new: <><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v5h5M9 14h6M12 11v6" /></>,
    history: <><path d="M7 3h10a2 2 0 0 1 2 2v16H5V5a2 2 0 0 1 2-2Z" /><path d="M8.5 8h7M8.5 12h7M8.5 16h4" /></>,
    documents: <><path d="M3 7.5h7l2 2h9v10.5H3z" /><path d="M3 7.5V5h7l2 2h7v2.5" /></>,
    help: <><circle cx="12" cy="12" r="9" /><path d="M9.8 9a2.3 2.3 0 1 1 3.1 2.16c-.9.38-.9.94-.9 1.84M12 17h.01" /></>,
    complaints: <><path d="M6 3h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" /><path d="M9 3v18M13 8h3M13 12h3M13 16h2" /></>,
    contact: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></>,
    logout: <><path d="M10 5H5v14h5" /><path d="m14 8 4 4-4 4" /><path d="M8 12h10" /></>
  };

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
};

const menuItems = [
  { label: 'Inicio', to: '/dashboard', icon: 'home' },
  { label: 'Nuevo Trámite', to: '/catalogo', icon: 'new' },
  { label: 'Mis Trámites', to: '/mis-tramites', icon: 'history' },
  { label: 'Mis Documentos', to: '/documentos', icon: 'documents' },
  { label: 'Ayuda', to: '/ayuda', icon: 'help' },
  { label: 'Libro de Reclamaciones', to: '/libro-reclamaciones', icon: 'complaints' },
  { label: 'Contáctanos', to: '/contacto', icon: 'contact' }
];

const SearchIcon = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-4-4" />
  </svg>
);

const FileIcon = () => (
  <svg aria-hidden="true" viewBox="0 0 32 38" className="h-10 w-9 shrink-0" fill="none">
    <path d="M5 1h14l8 8v27H5a3 3 0 0 1-3-3V4a3 3 0 0 1 3-3Z" fill="#fff" stroke="#b31232" strokeWidth="1.7" />
    <path d="M19 1v8h8" stroke="#b31232" strokeWidth="1.7" />
    <path d="M7 23h18v8H7z" fill="#b31232" />
    <text x="16" y="29" textAnchor="middle" fill="#fff" fontSize="7" fontFamily="Arial" fontWeight="700">PDF</text>
  </svg>
);

export function DocumentsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Todos');
  const [currentPage, setCurrentPage] = useState(1);
  const documentsPerPage = 5;

  const filteredDocuments = useMemo(() => {
    const term = search.trim().toLocaleLowerCase('es');

    return documents.filter((document) => {
      const matchesSearch =
        document.name.toLocaleLowerCase('es').includes(term) ||
        document.tramite.toLocaleLowerCase('es').includes(term);
      const matchesCategory = category === 'Todos' || document.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [category, search]);

  const totalPages = Math.max(1, Math.ceil(filteredDocuments.length / documentsPerPage));
  const paginatedDocuments = filteredDocuments.slice(
    (currentPage - 1) * documentsPerPage,
    currentPage * documentsPerPage
  );

  const downloadDocument = (document) => {
    const content = [
      'TUPA Digital UNSAAC',
      '',
      `Documento: ${document.name}`,
      `Expediente: ${document.expediente}`,
      `Trámite relacionado: ${document.tramite}`,
      `Fecha de emisión: ${document.date}`,
      '',
      'Este es un documento simulado generado para fines de demostración.'
    ].join('\n');
    const blob = new Blob([content], { type: 'application/pdf' });
    const objectUrl = URL.createObjectURL(blob);
    const link = window.document.createElement('a');
    link.href = objectUrl;
    link.download = document.name;
    window.document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(objectUrl);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-700">
      <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between bg-[#a90016] px-5 text-white shadow-sm sm:px-7">
        <p className="text-base font-extrabold tracking-tight text-white">UNSAAC | TUPA Digital</p>
        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-white">María Quispe</p>
            <p className="text-xs text-white/75">Ciudadano</p>
          </div>
          <div className="grid h-9 w-9 place-items-center rounded-full border-2 border-white/75 bg-white text-sm font-bold text-[#8b1538]">
            MQ
          </div>
        </div>
      </header>

      <div className="min-h-screen">
        <aside className="fixed bottom-0 left-0 top-16 z-30 hidden w-56 flex-col border-r border-[#ead2d3] bg-white lg:flex">
          <div className="flex h-20 items-center gap-3 border-b border-[#ead2d3] px-5">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#d7ae19] text-sm font-bold text-white">G</div>
            <div><p className="text-xs font-semibold text-[#9d0015]">Centro de Trámites</p><p className="text-[10px] text-slate-500">Servicio en línea</p></div>
          </div>
          <nav className="flex-1 space-y-1 px-4 py-5" aria-label="Navegación principal">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="flex min-h-10 items-center gap-3 rounded-md px-2.5 py-2 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-[#a90016]"
              >
                <span className="grid h-4 w-4 shrink-0 place-items-center">
                  <MenuIcon name={item.icon} className="h-4 w-4" />
                </span>
                {item.label}
              </Link>
            ))}
          </nav>
          <button type="button" className="flex h-16 items-center gap-3 border-t border-[#ead2d3] px-6 text-sm font-medium text-[#a90016] hover:bg-red-50"><MenuIcon name="logout" className="h-4 w-4" />Salir</button>
        </aside>

        <main className="min-w-0 pt-16 lg:pl-56">
          <div className="mx-auto max-w-6xl px-4 py-8 sm:px-7 lg:px-10 lg:py-10">
            <div className="mb-7">
              <h1 className="text-3xl font-extrabold tracking-tight text-[#7f112d] sm:text-4xl">Mis Documentos</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500 sm:text-base">
                Consulta y descarga los documentos generados durante tus trámites realizados.
              </p>
            </div>

            <section className="overflow-hidden rounded-2xl border border-[#ead4d9] bg-white shadow-[0_10px_35px_rgba(100,20,45,0.08)]">
              <div className="grid gap-4 border-b border-slate-200 p-5 sm:p-6 md:grid-cols-[minmax(0,1fr)_18rem] md:items-end">
                <div>
                  <label htmlFor="document-search" className="text-sm font-bold text-slate-700">Buscar documento</label>
                  <div className="relative mt-2">
                    <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400"><SearchIcon /></span>
                    <input
                      id="document-search"
                      type="search"
                      value={search}
                      onChange={(event) => {
                        setSearch(event.target.value);
                        setCurrentPage(1);
                      }}
                      placeholder="Buscar documento..."
                      className="h-11 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#9d2449] focus:ring-3 focus:ring-[#9d2449]/10"
                    />
                  </div>
                </div>
                <label htmlFor="document-type" className="text-sm font-bold text-slate-700">
                  Filtrar por tipo
                  <select
                    id="document-type"
                    value={category}
                    onChange={(event) => {
                      setCategory(event.target.value);
                      setCurrentPage(1);
                    }}
                    className="mt-2 h-11 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-sm text-slate-800 outline-none focus:border-[#9d2449] focus:ring-3 focus:ring-[#9d2449]/10"
                  >
                    <option>Todos</option>
                    <option>Constancia</option>
                    <option>Solicitud</option>
                    <option>Comprobante</option>
                    <option>Resolución</option>
                  </select>
                </label>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] border-collapse text-left">
                  <thead className="bg-slate-50">
                    <tr className="border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
                      <th className="px-6 py-4">Documento</th>
                      <th className="px-6 py-4">Trámite relacionado</th>
                      <th className="px-6 py-4">Tipo</th>
                      <th className="px-6 py-4">Fecha de emisión</th>
                      <th className="px-6 py-4 text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedDocuments.map((document) => (
                      <tr key={document.expediente} className="transition hover:bg-slate-50/80">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <FileIcon />
                            <div>
                              <p className="text-sm font-bold text-slate-900">{document.name}</p>
                              <p className="mt-1 text-xs text-slate-500">Expediente: {document.expediente}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-sm font-medium text-slate-700">{document.tramite}</td>
                        <td className="px-6 py-5">
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">{document.category}</span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-5 text-sm text-slate-600">{document.date}</td>
                        <td className="px-6 py-5 text-right">
                          <button
                            type="button"
                            onClick={() => downloadDocument(document)}
                            className="inline-flex items-center gap-2 rounded-lg border border-[#9d2449] px-4 py-2 text-sm font-bold text-[#8b1538] transition hover:bg-[#8b1538] hover:text-white focus:outline-none focus:ring-3 focus:ring-[#9d2449]/20"
                          >
                            <span aria-hidden="true">⇩</span>
                            Descargar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredDocuments.length === 0 && (
                <div className="border-t border-slate-100 px-6 py-14 text-center">
                  <p className="font-semibold text-slate-700">No se encontraron documentos</p>
                  <p className="mt-1 text-sm text-slate-500">Prueba con otro término o selecciona un tipo diferente.</p>
                </div>
              )}

              <div className="flex flex-col gap-4 border-t border-slate-200 bg-slate-50/60 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-slate-500">
                  Mostrando {filteredDocuments.length} de {documents.length} documentos
                </p>
                <nav aria-label="Paginación de documentos" className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                    disabled={currentPage === 1}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Anterior
                  </button>
                  {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setCurrentPage(page)}
                      aria-current={currentPage === page ? 'page' : undefined}
                      className={`grid h-9 w-9 place-items-center rounded-lg text-xs font-bold ${
                        currentPage === page
                          ? 'bg-[#9d001f] text-white'
                          : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                    disabled={currentPage === totalPages}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Siguiente
                  </button>
                </nav>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
