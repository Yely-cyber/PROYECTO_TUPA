const VIDEO_TUTORIAL_URL = 'https://www.youtube.com/embed/hMX_uSFRS44';
const MANUAL_PDF_URL = '#';

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
<div className="min-h-screen">
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
