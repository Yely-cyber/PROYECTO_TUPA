import { useLocation, useNavigate, useParams } from 'react-router-dom';

const registeredStep = {
  estado: 'Solicitud registrada',
  fecha: '13/10/2024',
  hora: '09:15 AM',
  descripcion: 'Tu solicitud fue recibida correctamente en TUPA Digital.',
  type: 'completed'
};

const reviewStep = {
  estado: 'En revisión',
  fecha: '14/10/2024',
  hora: '04:00 PM',
  descripcion: 'El área académica se encuentra revisando la documentación presentada.',
  type: 'review'
};

const timelineByStatus = {
  Iniciado: [
    registeredStep,
    {
      estado: 'Solicitud iniciada',
      fecha: '13/10/2024',
      hora: '09:30 AM',
      descripcion: 'Tu expediente fue creado y se encuentra en proceso de atención.',
      type: 'started'
    }
  ],
  'En revisión': [registeredStep, reviewStep],
  Observado: [
    registeredStep,
    reviewStep,
    {
      estado: 'Observación',
      fecha: '14/10/2024',
      hora: '11:20 AM',
      descripcion: 'Se requiere corrección o documentación adicional.',
      type: 'observed'
    }
  ],
  Aprobado: [
    registeredStep,
    reviewStep,
    {
      estado: 'Trámite aprobado',
      fecha: '15/10/2024',
      hora: '10:30 AM',
      descripcion: 'Tu trámite fue aprobado y el documento está listo para descargar.',
      type: 'approved'
    }
  ]
};

const statusStyles = {
  Iniciado: {
    badge: 'bg-blue-50 text-blue-700 ring-blue-600/20',
    text: 'text-blue-700',
    icon: 'clock'
  },
  'En revisión': {
    badge: 'bg-amber-50 text-amber-700 ring-amber-600/25',
    text: 'text-amber-700',
    icon: 'review'
  },
  Observado: {
    badge: 'bg-red-50 text-red-700 ring-red-600/20',
    text: 'text-red-600',
    icon: 'observed'
  },
  Aprobado: {
    badge: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
    text: 'text-emerald-700',
    icon: 'approved'
  }
};

const StatusIcon = ({ type, className = 'h-4 w-4' }) => {
  const paths = {
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    review: <path d="M7 3h10M7 21h10M8 3c0 5 1 6 4 9-3 3-4 4-4 9M16 3c0 5-1 6-4 9 3 3 4 4 4 9" />,
    observed: <><path d="M12 3 2.5 20h19Z" /><path d="M12 9v5M12 17h.01" /></>,
    approved: <path d="m5 12 4 4L19 6" />
  };

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[type]}
    </svg>
  );
};

export function TrackingTimelinePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { expedienteId = '4592' } = useParams();
  const selectedStatus = statusStyles[location.state?.estado] ? location.state.estado : 'Iniciado';
  const selectedType = location.state?.tipo ?? 'Certificado de Estudios';
  const selectedDate = location.state?.fecha ?? '13/10/2024';
  const timeline = timelineByStatus[selectedStatus];
  const currentStyle = statusStyles[selectedStatus];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-700">
<div className="min-h-screen">
<main className="min-w-0 pt-16 lg:pl-56">
          <div className="mx-auto max-w-6xl px-4 py-7 sm:px-7 lg:px-10 lg:py-9">
            <button
              type="button"
              onClick={() => navigate('/mis-tramites')}
              className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-[#8b1538] transition hover:text-[#b0163b]"
            >
              <svg aria-hidden="true" viewBox="0 0 12 12" className="h-3 w-3 shrink-0" fill="currentColor">
                <path d="M9.5 1 3 6l6.5 5Z" />
              </svg>
              Volver al historial
            </button>

            <article className="overflow-hidden rounded-2xl border border-[#ead4d9] bg-white shadow-[0_10px_35px_rgba(100,20,45,0.08)]">
              <div className="p-5 sm:p-7 lg:p-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-[#9d2449]">Detalle del expediente</p>
                    <h1 className="text-2xl font-extrabold tracking-tight text-[#7f112d] sm:text-3xl">{selectedType}</h1>
                    <p className="mt-2 text-sm font-semibold text-slate-500">Trámite #{expedienteId}</p>
                  </div>
                  <span className={`inline-flex w-fit items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold ring-1 ring-inset ${currentStyle.badge}`}>
                    <StatusIcon type={currentStyle.icon} />
                    {selectedStatus}
                  </span>
                </div>

                <dl className="mt-7 grid gap-5 rounded-xl border border-slate-100 bg-slate-50/70 p-5 sm:grid-cols-3">
                  <div>
                    <dt className="text-xs font-bold uppercase tracking-wide text-slate-400">Fecha de solicitud</dt>
                    <dd className="mt-2 text-sm font-semibold text-slate-800">{selectedDate}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-bold uppercase tracking-wide text-slate-400">Descripción</dt>
                    <dd className="mt-2 text-sm font-semibold text-slate-800">Solicitud de {selectedType.toLocaleLowerCase('es')}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-bold uppercase tracking-wide text-slate-400">Estado actual</dt>
                    <dd className={`mt-2 text-sm font-semibold ${currentStyle.text}`}>{selectedStatus}</dd>
                  </div>
                </dl>

                <section className="mt-8 border-t border-slate-200 pt-7">
                  <h2 className="text-lg font-extrabold text-slate-900">Línea de tiempo</h2>
                  <div className="mt-6">
                    {timeline.map((etapa, index) => (
                      <div key={etapa.estado} className="relative flex gap-4 pb-8 last:pb-0">
                        {index < timeline.length - 1 && (
                          <span
                            className={`absolute left-[15px] top-8 h-[calc(100%-1rem)] w-0.5 ${
                              etapa.type === 'completed'
                                ? 'bg-emerald-400'
                                : etapa.type === 'review'
                                  ? 'bg-amber-400'
                                  : etapa.type === 'started'
                                    ? 'bg-blue-400'
                                    : 'bg-red-400'
                            }`}
                            aria-hidden="true"
                          />
                        )}
                        <span className={`relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-black text-white shadow-sm ring-4 ${
                          etapa.type === 'completed'
                            ? 'bg-emerald-500 ring-emerald-50'
                            : etapa.type === 'review'
                              ? 'bg-amber-500 ring-amber-50'
                              : etapa.type === 'started'
                                ? 'bg-blue-600 ring-blue-50'
                                : etapa.type === 'approved'
                                  ? 'bg-emerald-500 ring-emerald-50'
                                  : 'bg-red-500 ring-red-50'
                        }`}>
                          {etapa.type === 'completed' ? (
                            '✓'
                          ) : etapa.type === 'observed' ? (
                            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                              <circle cx="12" cy="12" r="9" />
                              <path d="M12 7v6M12 17h.01" />
                            </svg>
                          ) : etapa.type === 'started' ? (
                            <StatusIcon type="clock" />
                          ) : etapa.type === 'approved' ? (
                            <StatusIcon type="approved" />
                          ) : (
                            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M7 3h10M7 21h10M8 3c0 5 1 6 4 9-3 3-4 4-4 9M16 3c0 5-1 6-4 9 3 3 4 4 4 9" />
                            </svg>
                          )}
                        </span>
                        <div className="min-w-0 pt-0.5">
                          <h3 className="text-sm font-bold text-slate-900">{etapa.estado}</h3>
                          <p className="mt-1 text-xs font-medium text-slate-500">{etapa.fecha} · {etapa.hora}</p>
                          <p className="mt-2 text-sm leading-6 text-slate-600">{etapa.descripcion}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {selectedStatus === 'Observado' && (
                  <section className="mt-7 flex gap-4 rounded-xl border border-red-200 bg-red-50/70 p-5">
                    <span className="grid h-9 w-9 shrink-0 place-items-center text-red-700">
                      <StatusIcon type="observed" className="h-7 w-7" />
                    </span>
                    <div>
                      <h2 className="text-sm font-extrabold text-slate-900">Observación</h2>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        Falta adjuntar la copia legible del DNI. Debes subsanar el documento para continuar con el trámite.
                      </p>
                    </div>
                  </section>
                )}

                <div className="mt-8 border-t border-slate-200 pt-6">
                  <button
                    type="button"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#9d001f] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#7f0019] focus:outline-none focus:ring-3 focus:ring-[#9d001f]/20 sm:w-auto"
                  >
                    <span aria-hidden="true">⇩</span>
                    Descargar Documento
                  </button>
                </div>
              </div>
            </article>
          </div>
        </main>
      </div>
    </div>
  );
}
