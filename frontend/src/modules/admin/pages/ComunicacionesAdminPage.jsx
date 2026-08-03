import { useEffect, useMemo, useState } from 'react';
import { Search, Filter, Eye, Paperclip, CheckCircle2 } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import adminService from '../services/adminService';

const estadoLabels = {
  pendiente: 'Pendiente',
  en_proceso: 'En proceso',
  resuelto: 'Resuelto',
  cerrado: 'Cerrado',
};

export default function ComunicacionesAdminPage() {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [categoria, setCategoria] = useState('');
  const [estado, setEstado] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const cargar = async () => {
    setLoading(true);
    setError('');
    const response = await adminService.getComunicaciones({ categoria, estado, search });
    setLoading(false);
    if (response.success) {
      setItems(response.data || []);
      if (!selected) {
        setSelected(response.data?.[0] || null);
      }
      return;
    }
    setError(response.message || 'No se pudieron cargar las comunicaciones.');
  };

  useEffect(() => {
    cargar();
  }, []);

  const categorias = useMemo(() => ['Reclamo', 'Consulta', 'Ayuda'], []);

  const abrirDetalle = async (item) => {
    const response = await adminService.getComunicacionById(item.id);
    if (response.success) {
      setSelected(response.data);
      return;
    }
    setError(response.message || 'No se pudo abrir el detalle.');
  };

  const cambiarEstado = async (nuevoEstado) => {
    if (!selected) return;
    const response = await adminService.actualizarEstadoComunicacion(selected.id, nuevoEstado);
    if (response.success) {
      setSelected(response.data);
      cargar();
      return;
    }
    setError(response.message || 'No se pudo actualizar el estado.');
  };

  const filtrar = (event) => {
    event.preventDefault();
    cargar();
  };

  return (
    <AdminLayout>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="admin-page-title">Comunicaciones</h1>
          <p className="admin-page-sub">Reclamos, consultas y solicitudes de ayuda recibidas desde el portal.</p>
        </div>
      </div>

      {error ? <div className="admin-error-banner">{error}</div> : null}

      <form onSubmit={filtrar} className="admin-card mt-4 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-[1.2fr_1fr_1fr_auto]">
        <label className="text-sm font-semibold text-slate-700">
          Buscar
          <div className="mt-2 flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
            <Search size={16} className="text-slate-400" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Nombre, correo o asunto" className="w-full bg-transparent text-sm outline-none" />
          </div>
        </label>

        <label className="text-sm font-semibold text-slate-700">
          Categoría
          <select value={categoria} onChange={(event) => setCategoria(event.target.value)} className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none">
            <option value="">Todas</option>
            {categorias.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>

        <label className="text-sm font-semibold text-slate-700">
          Estado
          <select value={estado} onChange={(event) => setEstado(event.target.value)} className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none">
            <option value="">Todos</option>
            <option value="pendiente">Pendiente</option>
            <option value="en_proceso">En proceso</option>
            <option value="resuelto">Resuelto</option>
            <option value="cerrado">Cerrado</option>
          </select>
        </label>

        <button type="submit" className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-[#9d001f] px-4 py-2.5 text-sm font-semibold text-white">
          <Filter size={16} /> Filtrar
        </button>
      </form>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="admin-card rounded-2xl border border-slate-200 bg-white p-3">
          <div className="mb-3 flex items-center justify-between px-2">
            <h2 className="text-lg font-semibold text-slate-900">Solicitudes recibidas</h2>
            <span className="rounded-full bg-[#f8eef1] px-3 py-1 text-xs font-semibold text-[#9d001f]">{items.length}</span>
          </div>

          {loading ? <div className="px-2 py-6 text-sm text-slate-500">Cargando...</div> : null}

          {!loading && items.length === 0 ? <div className="px-2 py-6 text-sm text-slate-500">No hay comunicaciones para mostrar.</div> : null}

          <div className="space-y-2">
            {items.map((item) => (
              <button key={item.id} type="button" onClick={() => abrirDetalle(item)} className={`w-full rounded-xl border p-3 text-left transition ${selected?.id === item.id ? 'border-[#9d001f] bg-[#fdf6f7]' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{item.nombreCompleto}</div>
                    <div className="text-xs text-slate-500">{item.asunto || 'Sin asunto'}</div>
                  </div>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold uppercase text-slate-600">{item.categoria}</span>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span>{item.correo}</span>
                  <span>•</span>
                  <span>{new Date(item.fechaRegistro).toLocaleString('es-ES')}</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        <aside className="admin-card rounded-2xl border border-slate-200 bg-white p-4">
          {!selected ? (
            <div className="py-8 text-center text-sm text-slate-500">Selecciona una solicitud para ver el detalle.</div>
          ) : (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Detalle</h2>
                  <p className="text-sm text-slate-500">{selected.asunto || 'Sin asunto'}</p>
                </div>
                <span className="rounded-full bg-[#f8eef1] px-3 py-1 text-xs font-semibold text-[#9d001f]">{estadoLabels[selected.estado] || selected.estado}</span>
              </div>

              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <div><span className="font-semibold text-slate-800">Nombre:</span> {selected.nombreCompleto}</div>
                <div><span className="font-semibold text-slate-800">Correo:</span> {selected.correo}</div>
                {selected.telefono ? <div><span className="font-semibold text-slate-800">Teléfono:</span> {selected.telefono}</div> : null}
                {selected.servicioRelacionado ? <div><span className="font-semibold text-slate-800">Servicio:</span> {selected.servicioRelacionado}</div> : null}
                <div><span className="font-semibold text-slate-800">Mensaje:</span> {selected.mensaje}</div>
              </div>

              {selected.archivos?.length ? (
                <div className="mt-5 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                    <Paperclip size={16} /> Archivos adjuntos
                  </div>
                  <ul className="mt-3 space-y-2 text-sm text-slate-600">
                    {selected.archivos.map((archivo) => (
                      <li key={archivo.id || archivo.nombreArchivo} className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
                        <span>{archivo.nombreArchivo}</span>
                        <a href={`http://localhost:3000${archivo.rutaArchivo}`} target="_blank" rel="noreferrer" className="text-[#9d001f] hover:underline">Ver</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div className="mt-5 flex flex-wrap gap-2">
                <button type="button" onClick={() => cambiarEstado('en_proceso')} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700">Marcar en proceso</button>
                <button type="button" onClick={() => cambiarEstado('resuelto')} className="inline-flex items-center gap-2 rounded-lg bg-[#1f9d55] px-3 py-2 text-sm font-semibold text-white"><CheckCircle2 size={16} /> Resolver</button>
              </div>
            </>
          )}
        </aside>
      </div>
    </AdminLayout>
  );
}
