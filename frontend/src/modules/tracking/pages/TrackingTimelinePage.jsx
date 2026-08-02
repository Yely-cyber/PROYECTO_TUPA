import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCurrentUser, getEstadoVisible } from '../../catalog/utils/catalogHelpers';
import { obtenerExpedienteUsuario } from '../services/trackingService';

const statusStyles = {
  Iniciado: { badge: 'bg-blue-50 text-blue-700 ring-blue-600/20', text: 'text-blue-700', icon: 'clock' },
  'En revisión': { badge: 'bg-amber-50 text-amber-700 ring-amber-600/25', text: 'text-amber-700', icon: 'review' },
  Observado: { badge: 'bg-red-50 text-red-700 ring-red-600/20', text: 'text-red-600', icon: 'observed' },
  Rechazado: { badge: 'bg-red-50 text-red-700 ring-red-600/20', text: 'text-red-600', icon: 'observed' },
  Aprobado: { badge: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20', text: 'text-emerald-700', icon: 'approved' }
};

const StatusIcon = ({ type, className = 'h-4 w-4' }) => {
  const paths = {
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    review: <path d="M7 3h10M7 21h10M8 3c0 5 1 6 4 9-3 3-4 4-4 9M16 3c0 5-1 6-4 9 3 3 4 4 4 9" />,
    observed: <><path d="M12 3 2.5 20h19Z" /><path d="M12 9v5M12 17h.01" /></>,
    approved: <path d="m5 12 4 4L19 6" />
  };
  return <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{paths[type]}</svg>;
};

const fechaHora = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return { fecha: '', hora: '' };
  return {
    fecha: date.toLocaleDateString('es-PE'),
    hora: date.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }),
  };
};

const movimientoAEtapa = (movimiento) => {
  const esRechazo = movimiento.estado === 'observado' && movimiento.observaciones?.startsWith('[RECHAZADO]');
  const estado = esRechazo ? 'Rechazado' : getEstadoVisible(movimiento.estado);
  const config = {
    'En revisión': { descripcion: 'El área responsable se encuentra revisando la documentación presentada.', type: 'review' },
    Aprobado: { descripcion: 'Tu trámite fue aprobado.', type: 'approved' },
    Observado: { descripcion: movimiento.observaciones || 'Se requiere corrección o documentación adicional.', type: 'observed' },
    Rechazado: { descripcion: movimiento.observaciones?.replace(/^\[RECHAZADO\]\s*/, '') || 'El expediente fue rechazado.', type: 'observed' },
  }[estado];
  const fechaEstado = movimiento.fecha_recepcion || movimiento.fecha_envio;
  return config ? { id: movimiento.id_movimiento, estado, ...fechaHora(fechaEstado), ...config } : null;
};

export function TrackingTimelinePage() {
  const navigate = useNavigate();
  const { expedienteId } = useParams();
  const [expediente, setExpediente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const user = getCurrentUser();
    if (!user?.email) {
      setError('No se encontró el usuario actual.');
      setLoading(false);
      return;
    }
    obtenerExpedienteUsuario(expedienteId, user.email)
      .then(setExpediente)
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, [expedienteId]);

  const timeline = useMemo(() => {
    if (!expediente) return [];
    const inicial = {
      id: 'creacion',
      estado: 'Solicitud registrada',
      ...fechaHora(expediente.fecha_registro),
      descripcion: 'Tu solicitud fue recibida correctamente en TUPA Digital.',
      type: 'completed',
    };
    return [inicial, ...expediente.movimientos.filter((m) => m.estado !== 'enviado').map(movimientoAEtapa).filter(Boolean)];
  }, [expediente]);

  const ultimoMovimiento = expediente?.movimientos.at(-1);
  const selectedStatus = ultimoMovimiento?.estado === 'observado' && ultimoMovimiento.observaciones?.startsWith('[RECHAZADO]')
    ? 'Rechazado'
    : getEstadoVisible(ultimoMovimiento?.estado || 'enviado');
  const currentStyle = statusStyles[selectedStatus] || statusStyles.Iniciado;
  const observacion = ['Observado', 'Rechazado'].includes(selectedStatus)
    ? ultimoMovimiento?.observaciones?.replace(/^\[RECHAZADO\]\s*/, '')
    : null;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-700">
      <main className="min-w-0 pt-16 lg:pl-56">
        <div className="mx-auto max-w-6xl px-4 py-7 sm:px-7 lg:px-10 lg:py-9">
          <button type="button" onClick={() => navigate('/mis-tramites')} className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-[#8b1538] transition hover:text-[#b0163b]">
            <span aria-hidden="true">◀</span> Volver al historial
          </button>
          <article className="overflow-hidden rounded-2xl border border-[#ead4d9] bg-white shadow-[0_10px_35px_rgba(100,20,45,0.08)]">
            <div className="p-5 sm:p-7 lg:p-8">
              {loading && <p className="py-12 text-center text-sm text-slate-500">Cargando expediente...</p>}
              {error && <p className="py-12 text-center text-sm text-red-600">{error}</p>}
              {expediente && !loading && !error && <>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-[#9d2449]">Detalle del expediente</p>
                    <h1 className="text-2xl font-extrabold tracking-tight text-[#7f112d] sm:text-3xl">{expediente.tramite}</h1>
                    <p className="mt-2 text-sm font-semibold text-slate-500">Trámite #{expediente.numero_expediente}</p>
                  </div>
                  <span className={`inline-flex w-fit items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold ring-1 ring-inset ${currentStyle.badge}`}>
                    <StatusIcon type={currentStyle.icon} />{selectedStatus}
                  </span>
                </div>
                <dl className="mt-7 grid gap-5 rounded-xl border border-slate-100 bg-slate-50/70 p-5 sm:grid-cols-3">
                  <div><dt className="text-xs font-bold uppercase tracking-wide text-slate-400">Fecha de solicitud</dt><dd className="mt-2 text-sm font-semibold text-slate-800">{fechaHora(expediente.fecha_registro).fecha}</dd></div>
                  <div><dt className="text-xs font-bold uppercase tracking-wide text-slate-400">Descripción</dt><dd className="mt-2 text-sm font-semibold text-slate-800">{expediente.asunto}</dd></div>
                  <div><dt className="text-xs font-bold uppercase tracking-wide text-slate-400">Estado actual</dt><dd className={`mt-2 text-sm font-semibold ${currentStyle.text}`}>{selectedStatus}</dd></div>
                </dl>
                <section className="mt-8 border-t border-slate-200 pt-7">
                  <h2 className="text-lg font-extrabold text-slate-900">Línea de tiempo</h2>
                  <div className="mt-6">
                    {timeline.map((etapa, index) => <div key={etapa.id} className="relative flex gap-4 pb-8 last:pb-0">
                      {index < timeline.length - 1 && <span className="absolute left-[15px] top-8 h-[calc(100%-1rem)] w-0.5 bg-slate-300" aria-hidden="true" />}
                      <span className={`relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-black text-white shadow-sm ring-4 ${etapa.type === 'approved' || etapa.type === 'completed' ? 'bg-emerald-500 ring-emerald-50' : etapa.type === 'review' ? 'bg-amber-500 ring-amber-50' : 'bg-red-500 ring-red-50'}`}>
                        {etapa.type === 'completed' || etapa.type === 'approved' ? '✓' : <StatusIcon type={etapa.type === 'review' ? 'review' : 'observed'} />}
                      </span>
                      <div className="min-w-0 pt-0.5"><h3 className="text-sm font-bold text-slate-900">{etapa.estado}</h3><p className="mt-1 text-xs font-medium text-slate-500">{etapa.fecha} · {etapa.hora}</p><p className="mt-2 text-sm leading-6 text-slate-600">{etapa.descripcion}</p></div>
                    </div>)}
                  </div>
                </section>
                {['Observado', 'Rechazado'].includes(selectedStatus) && <section className="mt-7 flex gap-4 rounded-xl border border-red-200 bg-red-50/70 p-5"><StatusIcon type="observed" className="h-7 w-7 shrink-0 text-red-700" /><div><h2 className="text-sm font-extrabold text-slate-900">{selectedStatus === 'Rechazado' ? 'Rechazo' : 'Observación'}</h2><p className="mt-2 text-sm leading-6 text-slate-600">{observacion || 'El expediente requiere atención.'}</p></div></section>}
              </>}
            </div>
          </article>
        </div>
      </main>
    </div>
  );
}
