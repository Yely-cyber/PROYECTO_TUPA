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

const fieldStyles =
  'mt-2 h-11 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#9d2449] focus:ring-3 focus:ring-[#9d2449]/10';

export function ComplaintsBookPage() {
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
              <h1 className="text-3xl font-extrabold tracking-tight text-[#7f112d] sm:text-4xl">Libro de Reclamaciones</h1>
              <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-500 sm:text-base">
                Presenta tu reclamo o queja sobre el servicio recibido. Tu opinión es importante para mejorar continuamente.
              </p>
            </div>

            <form
              onSubmit={(event) => event.preventDefault()}
              className="rounded-2xl border border-[#ead4d9] bg-white p-5 shadow-[0_10px_35px_rgba(100,20,45,0.08)] sm:p-7 lg:p-8"
            >
              <div className="grid gap-x-6 gap-y-5 md:grid-cols-2">
                <label className="text-sm font-bold text-slate-700">
                  Tipo de solicitud
                  <select name="tipoSolicitud" defaultValue="Reclamo" className={fieldStyles}>
                    <option>Reclamo</option>
                    <option>Consulta</option>
                    <option>Queja</option>
                  </select>
                </label>

                <label className="text-sm font-bold text-slate-700">
                  Servicio relacionado
                  <select name="servicioRelacionado" defaultValue="Trámite Académico" className={fieldStyles}>
                    <option>Trámite Académico</option>
                    <option>Trámite Administrativo</option>
                    <option>Otro</option>
                  </select>
                </label>

                <label className="text-sm font-bold text-slate-700 md:col-span-2">
                  Nombres y Apellidos
                  <input
                    name="nombres"
                    type="text"
                    placeholder="Ingresa tu nombre completo"
                    className={fieldStyles}
                  />
                </label>

                <label className="text-sm font-bold text-slate-700">
                  Correo Electrónico
                  <input
                    name="correo"
                    type="email"
                    placeholder="correo@ejemplo.com"
                    className={fieldStyles}
                  />
                </label>

                <label className="text-sm font-bold text-slate-700">
                  Teléfono
                  <input
                    name="telefono"
                    type="tel"
                    placeholder="999 999 999"
                    className={fieldStyles}
                  />
                </label>

                <label className="text-sm font-bold text-slate-700 md:col-span-2">
                  Detalle del reclamo
                  <textarea
                    name="detalle"
                    rows="6"
                    placeholder="Describe detalladamente tu reclamo o queja..."
                    className={`${fieldStyles} h-auto min-h-36 resize-y py-3`}
                  />
                </label>
              </div>

              <div className="mt-7 flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  className="rounded-lg border border-[#9d2449] bg-white px-5 py-2.5 text-sm font-bold text-[#8b1538] transition hover:bg-[#f8eef1] focus:outline-none focus:ring-3 focus:ring-[#9d2449]/10"
                >
                  Cancelar
                </button>
                <div className="flex flex-col-reverse gap-3 sm:flex-row">
                  <button
                    type="reset"
                    className="rounded-lg border border-slate-300 bg-slate-100 px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-200 focus:outline-none focus:ring-3 focus:ring-slate-300/40"
                  >
                    Limpiar
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-[#9d001f] px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#7f0019] focus:outline-none focus:ring-3 focus:ring-[#9d001f]/20"
                  >
                    Enviar Reclamo
                  </button>
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
import { Link } from 'react-router-dom';
