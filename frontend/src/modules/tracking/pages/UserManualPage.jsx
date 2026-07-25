const VIDEO_TUTORIAL_URL = 'https://www.youtube.com/embed/hMX_uSFRS44';
const MANUAL_PDF_URL = '#';

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

const preguntasFrecuentes = [
  {
    pregunta: '¿Cuáles son los horarios de atención presencial?',
    respuesta:
      'La atención presencial se realiza de lunes a viernes, de 8:00 a. m. a 1:00 p. m. y de 2:00 p. m. a 4:00 p. m., excepto feriados.'
  },
  {
    pregunta: '¿Cómo puedo realizar un trámite virtual?',
    respuesta:
      'Selecciona “Nuevo trámite” en el menú, elige el procedimiento que necesitas, completa tus datos y adjunta los documentos solicitados antes de enviar el expediente.'
  },
  {
    pregunta: '¿Qué documentos necesito para iniciar un expediente?',
    respuesta:
      'Los requisitos dependen del tipo de trámite. Revisa la ficha del procedimiento antes de registrarlo; allí encontrarás los documentos obligatorios y formatos aceptados.'
  }
];

export function UserManualPage() {
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
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#9d2449]">Centro de ayuda</p>
              <h1 className="text-3xl font-extrabold tracking-tight text-[#7f112d] sm:text-4xl">¿Cómo podemos ayudarte hoy?</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500 sm:text-base">
                Encuentra recursos y ayuda para utilizar el portal TUPA Digital de forma rápida y sencilla.
              </p>
            </div>

            <section className="overflow-hidden rounded-2xl border border-[#ead4d9] bg-white p-5 shadow-[0_10px_35px_rgba(100,20,45,0.08)] sm:p-7">
              <div className="mb-5 flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#f8eef1] text-[#9d001f]">
                  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="m10 9 5 3-5 3Z" />
                  </svg>
                </span>
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">Video Tutorial</h2>
                  <p className="text-sm text-slate-500">Aprende a registrar una solicitud paso a paso.</p>
                </div>
              </div>

              <div className="aspect-video w-full overflow-hidden rounded-xl bg-slate-950 shadow-inner">
                <iframe
                  className="h-full w-full"
                  src={VIDEO_TUTORIAL_URL}
                  title="¿Cómo registrar un nuevo expediente TUPA?"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
              <div className="mt-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-bold text-slate-900">¿Cómo registrar un nuevo expediente TUPA?</p>
                <p className="text-xs font-semibold text-slate-500">Duración: 03:24</p>
              </div>
            </section>

            <section className="mt-6 flex flex-col gap-5 rounded-2xl border border-[#ead4d9] bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div className="flex items-start gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#f8eef1] text-[#9d001f]">
                  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 3h8l4 4v14H6zM14 3v5h5M9 13h6M9 17h4" />
                  </svg>
                </span>
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">Manual de Usuario</h2>
                  <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
                    Descarga la guía completa en formato PDF para consultar el uso del portal sin conexión.
                  </p>
                </div>
              </div>
              <a
                href={MANUAL_PDF_URL}
                download
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#9d001f] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#7f0019] focus:outline-none focus:ring-3 focus:ring-[#9d001f]/20"
              >
                <span aria-hidden="true">⇩</span>
                Descargar
              </a>
            </section>

            <section className="mt-8">
              <div className="mb-4">
                <h2 className="text-xl font-extrabold text-slate-900">Preguntas Frecuentes</h2>
                <p className="mt-1 text-sm text-slate-500">Respuestas rápidas a las consultas más comunes.</p>
              </div>
              <div className="space-y-3">
                {preguntasFrecuentes.map((item) => (
                  <details
                    key={item.pregunta}
                    className="group rounded-xl border border-[#ead4d9] bg-white shadow-sm open:shadow-md"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-bold text-slate-800 marker:content-none sm:px-6">
                      {item.pregunta}
                      <span className="flex h-7 w-8 shrink-0 items-center justify-center text-black transition group-open:rotate-180">
                        <svg
                          aria-hidden="true"
                          viewBox="0 0 20 12"
                          className="h-[11px] w-[18px]"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="m2 3 8 6 8-6" />
                        </svg>
                      </span>
                    </summary>
                    <div className="border-t border-slate-100 px-5 py-4 sm:px-6">
                      <p className="text-sm leading-6 text-slate-600">{item.respuesta}</p>
                    </div>
                  </details>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
import { Link } from 'react-router-dom';
