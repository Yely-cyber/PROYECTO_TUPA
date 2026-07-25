import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const tramites = [
  {
    id: 'EXP-2026-001248',
    tipo: 'Constancia de estudios',
    estado: 'Aprobado',
    fecha: '18/07/2026'
  },
  {
    id: 'EXP-2026-001196',
    tipo: 'Duplicado de carné universitario',
    estado: 'En revisión',
    fecha: '12/07/2026'
  },
  {
    id: 'EXP-2026-001087',
    tipo: 'Certificado de notas',
    estado: 'Iniciado',
    fecha: '04/07/2026'
  },
  {
    id: 'EXP-2026-000954',
    tipo: 'Solicitud de reserva de matrícula',
    estado: 'Observado',
    fecha: '26/06/2026'
  },
  {
    id: 'EXP-2026-000832',
    tipo: 'Constancia de egresado',
    estado: 'Aprobado',
    fecha: '10/06/2026'
  }
];

const estadoStyles = {
  Aprobado: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  'En revisión': 'bg-amber-50 text-amber-700 ring-amber-600/20',
  Iniciado: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  Observado: 'bg-rose-50 text-rose-700 ring-rose-600/20'
};

const SearchIcon = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-4-4" />
  </svg>
);

const MenuIcon = ({ name, className = 'h-5 w-5' }) => {
  const paths = {
    home: (
      <>
        <path d="m3 10 9-7 9 7" />
        <path d="M5 9.5V21h14V9.5M9 21v-7h6v7" />
      </>
    ),
    new: (
      <>
        <path d="M6 3h8l4 4v14H6z" />
        <path d="M14 3v5h5M9 14h6M12 11v6" />
      </>
    ),
    history: (
      <>
        <path d="M7 3h10a2 2 0 0 1 2 2v16H5V5a2 2 0 0 1 2-2Z" />
        <path d="M8.5 8h7M8.5 12h7M8.5 16h4" />
      </>
    ),
    documents: (
      <>
        <path d="M3 7.5h7l2 2h9v10.5H3z" />
        <path d="M3 7.5V5h7l2 2h7v2.5" />
      </>
    ),
    help: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M9.8 9a2.3 2.3 0 1 1 3.1 2.16c-.9.38-.9.94-.9 1.84M12 17h.01" />
      </>
    ),
    complaints: <><path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z" /><path d="M8 17h11" /></>,
    contact: <><rect x="3" y="6" width="18" height="12" rx="2" /><path d="m4 8 8 6 8-6" /></>,
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

export function HistoryPage() {
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState('');
  const [estado, setEstado] = useState('Todos');

  const tramitesFiltrados = useMemo(() => {
    const termino = busqueda.trim().toLocaleLowerCase('es');

    return tramites.filter((tramite) => {
      const coincideNombre = tramite.tipo.toLocaleLowerCase('es').includes(termino);
      const coincideEstado = estado === 'Todos' || tramite.estado === estado;
      return coincideNombre && coincideEstado;
    });
  }, [busqueda, estado]);

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
            <div>
              <p className="text-xs font-semibold text-[#9d0015]">Centro de Trámites</p>
              <p className="text-[10px] text-slate-500">Servicio en línea</p>
            </div>
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
          <button type="button" className="flex h-16 items-center gap-3 border-t border-[#ead2d3] px-6 text-sm font-medium text-[#a90016] hover:bg-red-50">
            <MenuIcon name="logout" className="h-4 w-4" />
            Salir
          </button>
        </aside>

        <main className="min-w-0 pt-16 lg:pl-56">
          <div className="mx-auto max-w-6xl px-4 py-8 sm:px-7 lg:px-10 lg:py-10">
            <div className="mb-7">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#9d2449]">Mis solicitudes</p>
              <h1 className="text-3xl font-extrabold tracking-tight text-[#7f112d] sm:text-4xl">Historial de Trámites</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500 sm:text-base">
                Revisa el estado y progreso de todas tus solicitudes administrativas
              </p>
            </div>

            <section className="overflow-hidden rounded-2xl border border-[#ead4d9] bg-white shadow-[0_10px_35px_rgba(100,20,45,0.08)]">
              <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                <div className="relative w-full sm:max-w-md">
                  <label htmlFor="buscar-tramite" className="sr-only">Buscar trámite por nombre</label>
                  <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
                    <SearchIcon />
                  </span>
                  <input
                    id="buscar-tramite"
                    type="search"
                    value={busqueda}
                    onChange={(event) => setBusqueda(event.target.value)}
                    placeholder="Buscar por nombre o tipo de trámite..."
                    className="h-11 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#9d2449] focus:ring-3 focus:ring-[#9d2449]/10"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <label htmlFor="filtro-estado" className="whitespace-nowrap text-sm font-semibold text-slate-600">
                    Estado:
                  </label>
                  <select
                    id="filtro-estado"
                    value={estado}
                    onChange={(event) => setEstado(event.target.value)}
                    className="h-11 min-w-40 rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 outline-none focus:border-[#9d2449] focus:ring-3 focus:ring-[#9d2449]/10"
                  >
                    <option>Todos</option>
                    <option>Aprobado</option>
                    <option>En revisión</option>
                    <option>Iniciado</option>
                    <option>Observado</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[780px] border-collapse text-left">
                  <thead className="bg-slate-50">
                    <tr className="border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
                      <th className="px-6 py-4">ID</th>
                      <th className="px-6 py-4">Tipo de Trámite</th>
                      <th className="px-6 py-4">Estado</th>
                      <th className="px-6 py-4">Fecha</th>
                      <th className="px-6 py-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {tramitesFiltrados.map((tramite) => (
                      <tr key={tramite.id} className="transition hover:bg-slate-50/80">
                        <td className="whitespace-nowrap px-6 py-5 text-sm font-semibold text-slate-700">{tramite.id}</td>
                        <td className="px-6 py-5 text-sm font-medium text-slate-900">{tramite.tipo}</td>
                        <td className="px-6 py-5">
                          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ring-1 ring-inset ${estadoStyles[tramite.estado]}`}>
                            {tramite.estado}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-5 text-sm text-slate-600">{tramite.fecha}</td>
                        <td className="px-6 py-5 text-right">
                          <button
                            type="button"
                            onClick={() =>
                              navigate(`/seguimiento/${tramite.id}`, {
                                state: {
                                  expedienteId: tramite.id,
                                  tipo: tramite.tipo,
                                  estado: tramite.estado,
                                  fecha: tramite.fecha
                                }
                              })
                            }
                            className="rounded-lg border border-[#9d2449] px-4 py-2 text-sm font-bold text-[#8b1538] transition hover:bg-[#8b1538] hover:text-white focus:outline-none focus:ring-3 focus:ring-[#9d2449]/20"
                          >
                            Ver detalles
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {tramitesFiltrados.length === 0 && (
                <div className="border-t border-slate-100 px-6 py-14 text-center">
                  <p className="font-semibold text-slate-700">No se encontraron trámites</p>
                  <p className="mt-1 text-sm text-slate-500">Prueba con otro nombre o selecciona un estado diferente.</p>
                </div>
              )}

              <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50/60 px-6 py-4 text-xs text-slate-500">
                <span>{tramitesFiltrados.length} trámite{tramitesFiltrados.length === 1 ? '' : 's'} encontrado{tramitesFiltrados.length === 1 ? '' : 's'}</span>
                <span>Datos actualizados al 24/07/2026</span>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
