import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, getEstadoVisible } from '../../catalog/utils/catalogHelpers';
import { listarExpedientesUsuario } from '../services/trackingService';

const estadoStyles = {
  Aprobado: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  'En revisión': 'bg-amber-50 text-amber-700 ring-amber-600/20',
  Iniciado: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  Observado: 'bg-rose-50 text-rose-700 ring-rose-600/20',
  Rechazado: 'bg-rose-50 text-rose-700 ring-rose-600/20'
};

const estadoVisible = (estado, observaciones) => {
  const estadoNormalizado = String(estado || '').toLowerCase();
  if (estadoNormalizado === 'rechazado') return 'Rechazado';
  if (estadoNormalizado === 'observado' && observaciones?.startsWith('[RECHAZADO]')) return 'Rechazado';
  return getEstadoVisible(estado);
};

const SearchIcon = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-4-4" />
  </svg>
);

export function HistoryPage() {
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState('');
  const [estado, setEstado] = useState('Todos');
  const [tramites, setTramites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const user = getCurrentUser();
    if (!user?.email) {
      setError('No se encontró el usuario actual.');
      setLoading(false);
      return;
    }

    listarExpedientesUsuario(user.email)
      .then((expedientes) => setTramites(expedientes.map((expediente) => ({
        id: expediente.numero_expediente,
        tipo: expediente.tramite,
        estado: estadoVisible(expediente.estado || 'enviado', expediente.observaciones),
        fecha: expediente.fecha_registro,
      }))))
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, []);

  const tramitesFiltrados = useMemo(() => {
    const termino = busqueda.trim().toLocaleLowerCase('es');
    const historialCompleto = [...tramites]
      .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
      .map((tramite) => ({
        ...tramite,
        estado: estadoVisible(tramite.estado),
        fecha: new Date(tramite.fecha).toLocaleDateString('es-PE'),
      }));

    return historialCompleto.filter((tramite) => {
      const coincideNombre = tramite.tipo.toLocaleLowerCase('es').includes(termino);
      const coincideEstado = estado === 'Todos' || tramite.estado === estado;
      return coincideNombre && coincideEstado;
    });
  }, [busqueda, estado, tramites]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-700">
<div className="min-h-screen">
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
                    <option>Rechazado</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                {loading && <p className="px-6 py-10 text-center text-sm text-slate-500">Cargando expedientes...</p>}
                {error && <p className="px-6 py-10 text-center text-sm text-red-600">{error}</p>}
                {!loading && !error && (
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
                              navigate(`/seguimiento/${tramite.id}`)
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
                )}
              </div>

              {!loading && !error && tramitesFiltrados.length === 0 && (
                <div className="border-t border-slate-100 px-6 py-14 text-center">
                  <p className="font-semibold text-slate-700">No se encontraron trámites</p>
                  <p className="mt-1 text-sm text-slate-500">Prueba con otro nombre o selecciona un estado diferente.</p>
                </div>
              )}

              <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50/60 px-6 py-4 text-xs text-slate-500">
                <span>{tramitesFiltrados.length} trámite{tramitesFiltrados.length === 1 ? '' : 's'} encontrado{tramitesFiltrados.length === 1 ? '' : 's'}</span>
                <span>Datos actualizados al {new Date().toLocaleDateString('es-PE')}</span>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
