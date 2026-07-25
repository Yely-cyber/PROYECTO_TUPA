import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { mockTramiteConfirmation } from '../data/mockConfirmation';

const BRAND_RED = '#a90016';

const Icon = ({ name, className = 'h-5 w-5' }) => {
  const paths = {
    home: <><path d="m3 11 9-8 9 8" /><path d="M5 10v10h14V10" /><path d="M9 20v-6h6v6" /></>,
    plus: <><path d="M12 5v14" /><path d="M5 12h14" /></>,
    documents: <><path d="M6 3h9l3 3v15H6z" /><path d="M14 3v4h4" /><path d="M9 12h6M9 16h6" /></>,
    help: <><circle cx="12" cy="12" r="9" /><path d="M9.7 9a2.4 2.4 0 0 1 4.6 1c0 2-2.3 2.2-2.3 4" /><path d="M12 18h.01" /></>,
    book: <><path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z" /><path d="M8 17h11" /></>,
    contact: <><rect x="3" y="6" width="18" height="12" rx="2" /><path d="m4 8 8 6 8-6" /></>,
    logout: <><path d="M10 5H5v14h5" /><path d="m14 8 4 4-4 4" /><path d="M8 12h10" /></>,
    user: <><circle cx="12" cy="8" r="3" /><path d="M6 20c0-4 2.7-6 6-6s6 2 6 6" /></>,
    file: <><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v5h5" /><path d="M9 13h6M9 17h4" /></>,
    card: <><rect x="3" y="6" width="18" height="12" rx="2" /><path d="M3 10h18" /></>,
    upload: <><path d="M12 16V4" /><path d="m7 9 5-5 5 5" /><path d="M5 15v5h14v-5" /></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></>,
  };

  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
};

const navigationItems = [
  { label: 'Inicio', to: '/dashboard', icon: 'home' },
  { label: 'Nuevo Trámite', to: '/catalogo', icon: 'plus' },
  { label: 'Mis Trámites', to: '/mis-tramites', icon: 'documents' },
  { label: 'Mis Documentos', to: '/documentos', icon: 'file' },
  { label: 'Ayuda', to: '/ayuda', icon: 'help' },
  { label: 'Libro de Reclamaciones', to: '/libro-de-reclamaciones', icon: 'book' },
  { label: 'Contáctanos', to: '/contacto', icon: 'contact' },
];

const SectionCard = ({ title, icon, children, className = '' }) => (
  <section className={`rounded-lg border border-[#e8c7c9] bg-white p-5 shadow-[0_1px_2px_rgba(80,20,28,0.04)] sm:p-6 ${className}`}>
    <h2 className="mb-5 flex items-center gap-2 text-base font-semibold text-slate-800">
      <span className="text-[#b4273c]"><Icon name={icon} className="h-5 w-5" /></span>
      {title}
    </h2>
    {children}
  </section>
);

const DataField = ({ label, value, children }) => (
  <div>
    <dt className="mb-1 text-xs font-medium text-slate-500">{label}</dt>
    <dd className="text-sm font-semibold leading-5 text-slate-800">{children ?? value}</dd>
  </div>
);

export const TramitesConfirmationPage = () => {
  const navigate = useNavigate();
  const { codigo } = useParams();
  const [isConfirming, setIsConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const confirmation = mockTramiteConfirmation;

  const handleCancel = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate('/catalogo');
  };

  const handleConfirm = async () => {
    setIsConfirming(true);

    // Este punto se reemplazará por trackingService cuando el backend esté disponible.
    await Promise.resolve();

    setConfirmed(true);
    setIsConfirming(false);
  };

  const handleAttachmentDownload = (attachment) => {
    const simulatedContent = [
      'TUPA Digital UNSAAC',
      '',
      `Archivo adjunto: ${attachment.name}`,
      'Documento simulado para descarga local.'
    ].join('\n');
    const blob = new Blob([simulatedContent], {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    });
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = attachment.name;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(objectUrl);
  };

  return (
    <div className="min-h-screen bg-[#f7f8fa] text-slate-700">
      <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between bg-[#a90016] px-5 text-white shadow-sm sm:px-7">
        <p className="text-sm font-bold tracking-tight sm:text-base">UNSAAC | TUPA Digital</p>
        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-xs font-semibold leading-4">{confirmation.user.fullName}</p>
            <p className="text-[10px] text-red-100">{confirmation.user.userType}</p>
          </div>
          <div className="grid h-9 w-9 place-items-center rounded-full border-2 border-white/80 bg-white/15">
            <Icon name="user" className="h-5 w-5" />
          </div>
        </div>
      </header>

      <aside className="fixed bottom-0 left-0 top-16 z-30 hidden w-56 flex-col border-r border-[#ead2d3] bg-white lg:flex">
        <div className="flex h-20 items-center gap-3 border-b border-[#ead2d3] px-5">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#d7ae19] text-sm font-bold text-white">G</div>
          <div>
            <p className="text-xs font-semibold text-[#9d0015]">Centro de Trámites</p>
            <p className="text-[10px] text-slate-500">Servicio en línea</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-4 py-5" aria-label="Navegación principal">
          {navigationItems.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="flex min-h-10 items-center gap-3 rounded-md px-2.5 py-2 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-[#a90016]"
            >
              <Icon name={item.icon} className="h-4 w-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className="flex h-16 items-center gap-3 border-t border-[#ead2d3] px-6 text-sm font-medium text-[#a90016] hover:bg-red-50"
        >
          <Icon name="logout" className="h-4 w-4" />
          Salir
        </button>
      </aside>

      <main className="pt-16 lg:pl-56">
        <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
          <div className="mb-7">
            <h1 className="text-2xl font-bold tracking-tight text-[#920014] sm:text-3xl">Confirmar Trámite</h1>
            <p className="mt-2 text-sm text-slate-500">Revisa cuidadosamente la información antes de confirmar tu solicitud</p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <SectionCard title="Información del Usuario" icon="user">
              <dl className="grid gap-4">
                <DataField label="Nombre completo" value={confirmation.user.fullName} />
                <DataField label="Código" value={confirmation.user.code} />
                <DataField label="Tipo de usuario" value={confirmation.user.userType} />
                <DataField label="Correo electrónico">
                  <span className="inline-flex items-center gap-2">
                    <Icon name="mail" className="h-4 w-4 text-slate-500" />
                    {confirmation.user.institutionalEmail}
                  </span>
                </DataField>
              </dl>
            </SectionCard>

            <SectionCard title="Información del Trámite" icon="file">
              <dl className="grid gap-4">
                <DataField label="Tipo de trámite" value={confirmation.procedure.type} />
                <DataField label="Descripción" value={confirmation.procedure.description} />
                <div className="grid grid-cols-2 gap-6">
                  <DataField label="Costo" value={confirmation.procedure.cost} />
                  <DataField label="Tiempo estimado" value={confirmation.procedure.estimatedTime} />
                </div>
              </dl>
            </SectionCard>

            <SectionCard title="Petición" icon="file" className="md:col-span-2">
              <div className="rounded border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                {confirmation.request}
              </div>
            </SectionCard>

            <SectionCard title="Código de Pago" icon="card">
              <div className="rounded border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold tracking-wide text-slate-800">
                {confirmation.paymentCode}
              </div>
            </SectionCard>

            <SectionCard title="Archivos Adjuntos" icon="upload">
              <ul className="space-y-2">
                {confirmation.attachments.map((attachment) => (
                  <li key={attachment.id} className="flex items-center gap-3 rounded border border-slate-200 bg-slate-50 px-4 py-2.5">
                    <button
                      type="button"
                      onClick={() => handleAttachmentDownload(attachment)}
                      className="flex w-full cursor-pointer items-center gap-3 text-left"
                    >
                      <span className="text-[#b4273c]"><Icon name="upload" className="h-5 w-5" /></span>
                      <div className="min-w-0">
                        <p className="truncate text-xs font-semibold text-slate-800 sm:text-sm">{attachment.name}</p>
                        <p className="mt-0.5 text-[10px] text-slate-500">{attachment.size}</p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </SectionCard>

            <div className="flex flex-col-reverse gap-3 rounded-lg border border-[#e8c7c9] bg-white p-5 shadow-[0_1px_2px_rgba(80,20,28,0.04)] sm:flex-row sm:items-center sm:justify-between md:col-span-2">
              <button
                type="button"
                onClick={handleCancel}
                className="rounded border border-[#ba3346] bg-white px-7 py-2.5 text-sm font-semibold text-[#a90016] transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-[#a90016]/30"
              >
                Cancelar
              </button>

              <div className="flex flex-col items-stretch gap-2 sm:items-end">
                {confirmed && (
                  <p role="status" className="text-sm font-medium text-emerald-700">
                    Trámite {codigo ? `#${codigo} ` : ''}confirmado correctamente.
                  </p>
                )}
                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={isConfirming || confirmed}
                  style={{ backgroundColor: BRAND_RED }}
                  className="min-w-36 rounded px-8 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-[#a90016]/30 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isConfirming ? 'Confirmando...' : confirmed ? 'Confirmado' : 'Confirmar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
