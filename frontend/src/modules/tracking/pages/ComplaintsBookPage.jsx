const fieldStyles =
  'mt-2 h-11 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#9d2449] focus:ring-3 focus:ring-[#9d2449]/10';

const buildComunicacionPayload = (formData) => {
  const payload = new FormData();
  payload.append('categoria', formData.get('tipoSolicitud'));
  payload.append('nombreCompleto', formData.get('nombres'));
  payload.append('correo', formData.get('correo'));
  payload.append('telefono', formData.get('telefono'));
  payload.append('servicioRelacionado', formData.get('servicioRelacionado'));
  payload.append('mensaje', formData.get('detalle'));

  const archivos = formData.getAll('archivos');
  archivos.forEach((archivo) => {
    if (archivo && archivo.name) {
      payload.append('archivos', archivo);
    }
  });

  return payload;
};

export function ComplaintsBookPage() {
  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    try {
      await registrarComunicacion(buildComunicacionPayload(data));
      form.reset();
      window.alert('Comunicación registrada correctamente.');
    } catch (error) {
      window.alert(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-700">
<div className="min-h-screen">
<main className="min-w-0 pt-16 lg:pl-56">
          <div className="mx-auto max-w-6xl px-4 py-8 sm:px-7 lg:px-10 lg:py-10">
            <div className="mb-7">
              <h1 className="text-3xl font-extrabold tracking-tight text-[#7f112d] sm:text-4xl">Libro de Reclamaciones</h1>
              <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-500 sm:text-base">
                Presenta tu reclamo o queja sobre el servicio recibido. Tu opinión es importante para mejorar continuamente.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-[#ead4d9] bg-white p-5 shadow-[0_10px_35px_rgba(100,20,45,0.08)] sm:p-7 lg:p-8"
            >
              <div className="grid gap-x-6 gap-y-5 md:grid-cols-2">
                <label className="text-sm font-bold text-slate-700">
                  Tipo de solicitud
                  <select name="tipoSolicitud" defaultValue="Reclamo" className={fieldStyles}>
                    <option>Reclamo</option>
                    <option>Consulta</option>
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

                <label className="text-sm font-bold text-slate-700 md:col-span-2">
                  Archivos adjuntos
                  <input name="archivos" type="file" multiple className={`${fieldStyles} h-auto px-3 py-2`} />
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
import { registrarComunicacion } from '../services/comunicacionesService';
