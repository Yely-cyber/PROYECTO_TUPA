const MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=Universidad+Nacional+de+San+Antonio+Abad+del+Cusco';

const MAP_PREVIEW = `data:image/svg+xml,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="900" height="460" viewBox="0 0 900 460">
    <rect width="900" height="460" fill="#e8f0e8"/>
    <path d="M0 80L180 55l110 65 170-30 130 50 165-35 145 65v290H0Z" fill="#dcebd8"/>
    <path d="M-30 355C150 280 250 405 430 320S720 235 940 290" fill="none" stroke="#b9d8ee" stroke-width="54"/>
    <g fill="none" stroke="#fff" stroke-width="14">
      <path d="M-30 140 180 210l170-85 205 120 375-55"/>
      <path d="M120-20l60 500M410-20l45 500M760-20l-50 500"/>
      <path d="M-20 405 230 280l170 70 190-135 330 105"/>
    </g>
    <g fill="none" stroke="#cad0d2" stroke-width="3">
      <path d="M-30 140 180 210l170-85 205 120 375-55"/>
      <path d="M120-20l60 500M410-20l45 500M760-20l-50 500"/>
      <path d="M-20 405 230 280l170 70 190-135 330 105"/>
    </g>
    <rect x="330" y="160" width="240" height="118" rx="12" fill="#f5e8dc" stroke="#dcc8b5" stroke-width="4"/>
    <circle cx="450" cy="190" r="40" fill="#9d001f"/>
    <path d="M450 166a20 20 0 0 0-20 20c0 15 20 39 20 39s20-24 20-39a20 20 0 0 0-20-20Zm0 29a9 9 0 1 1 0-18 9 9 0 0 1 0 18Z" fill="#fff"/>
    <rect x="325" y="292" width="250" height="70" rx="12" fill="#fff" opacity=".94"/>
    <text x="450" y="320" text-anchor="middle" font-family="Arial,sans-serif" font-size="19" font-weight="700" fill="#253342">UNSAAC - Cusco</text>
    <text x="450" y="346" text-anchor="middle" font-family="Arial,sans-serif" font-size="15" fill="#64748b">Av. de la Cultura 733</text>
  </svg>
`)}`;

const fieldStyles =
  'mt-2 h-11 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#9d2449] focus:ring-3 focus:ring-[#9d2449]/10';

const InfoIcon = ({ type }) => {
  const paths = {
    address: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    phone: <path d="M5 3h4l2 5-2.5 1.5a15 15 0 0 0 6 6L16 13l5 2v4c0 1.1-.9 2-2 2C10.2 21 3 13.8 3 5c0-1.1.9-2 2-2Z" />,
    email: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></>
  };

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {paths[type]}
    </svg>
  );
};

export function ContactPage() {
  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    try {
      await registrarComunicacion({
        categoria: 'Ayuda',
        nombreCompleto: data.get('nombre'),
        correo: data.get('correo'),
        asunto: data.get('asunto'),
        mensaje: data.get('mensaje'),
      });
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
              <h1 className="text-3xl font-extrabold tracking-tight text-[#7f112d] sm:text-4xl">Contáctanos</h1>
              <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-500 sm:text-base">
                ¿Tienes alguna consulta? Estamos aquí para ayudarte. Envíanos un mensaje y te responderemos pronto.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-[#ead4d9] bg-white p-5 shadow-[0_10px_35px_rgba(100,20,45,0.08)] sm:p-7 lg:p-8"
            >
              <h2 className="mb-6 text-xl font-extrabold text-slate-900">Envíanos un mensaje</h2>
              <div className="grid gap-x-6 gap-y-5 md:grid-cols-2">
                <label className="text-sm font-bold text-slate-700">
                  Nombre completo
                  <input name="nombre" type="text" placeholder="Tu nombre" className={fieldStyles} />
                </label>
                <label className="text-sm font-bold text-slate-700">
                  Correo electrónico
                  <input name="correo" type="email" placeholder="correo@ejemplo.com" className={fieldStyles} />
                </label>
                <label className="text-sm font-bold text-slate-700 md:col-span-2">
                  Asunto
                  <input name="asunto" type="text" placeholder="¿En qué podemos ayudarte?" className={fieldStyles} />
                </label>
                <label className="text-sm font-bold text-slate-700 md:col-span-2">
                  Mensaje
                  <textarea
                    name="mensaje"
                    rows="6"
                    placeholder="Escribe tu mensaje aquí..."
                    className={`${fieldStyles} h-auto min-h-36 resize-y py-3`}
                  />
                </label>
              </div>
              <div className="mt-7 flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <button type="reset" className="rounded-lg border border-[#9d2449] bg-white px-5 py-2.5 text-sm font-bold text-[#8b1538] transition hover:bg-[#f8eef1]">
                  Cancelar
                </button>
                <button type="submit" className="rounded-lg bg-[#9d001f] px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#7f0019] focus:outline-none focus:ring-3 focus:ring-[#9d001f]/20">
                  Enviar Mensaje
                </button>
              </div>
            </form>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <section className="rounded-2xl border border-[#ead4d9] bg-white p-6 shadow-sm sm:p-7">
                <h2 className="text-xl font-extrabold text-slate-900">Información Institucional</h2>
                <div className="mt-6 space-y-6">
                  <div className="flex gap-4">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#f8eef1] text-[#9d001f]"><InfoIcon type="address" /></span>
                    <div><p className="text-sm font-bold text-slate-800">Dirección</p><p className="mt-1 text-sm leading-6 text-slate-500">Av. de la Cultura, Nro. 733<br />Cusco, Perú</p></div>
                  </div>
                  <div className="flex gap-4">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#f8eef1] text-[#9d001f]"><InfoIcon type="phone" /></span>
                    <div><p className="text-sm font-bold text-slate-800">Teléfono</p><p className="mt-1 text-sm text-slate-500">(084) 232398</p></div>
                  </div>
                  <div className="flex gap-4">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#f8eef1] text-[#9d001f]"><InfoIcon type="email" /></span>
                    <div><p className="text-sm font-bold text-slate-800">Correo electrónico</p><a href="mailto:mesaayuda@unsaac.edu.pe" className="mt-1 block break-all text-sm text-[#8b1538] hover:underline">mesaayuda@unsaac.edu.pe</a></div>
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-[#ead4d9] bg-white p-6 shadow-sm sm:p-7">
                <h2 className="text-xl font-extrabold text-slate-900">Ubicación</h2>
                <a
                  href={MAPS_URL}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Abrir ubicación de la UNSAAC en Google Maps"
                  className="group mt-5 block overflow-hidden rounded-xl border border-slate-200 bg-slate-100"
                >
                  <img
                    src={MAP_PREVIEW}
                    alt="Mapa de ubicación de la UNSAAC en Cusco"
                    className="aspect-[16/9] w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                  />
                </a>
                <p className="mt-3 text-xs text-slate-500">Haz clic en el mapa para abrir la ubicación en Google Maps.</p>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
import { registrarComunicacion } from '../services/comunicacionesService';
