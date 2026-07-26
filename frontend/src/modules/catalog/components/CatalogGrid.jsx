import { CatalogCard } from './CatalogCard';

export const CatalogGrid = ({ tramites, onSolicitar }) => {
    if (tramites.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-[#ecd9d3] bg-white/60 px-6 py-16 text-center">
                <p className="text-sm font-medium text-slate-500">No encontramos trámites con esos filtros.</p>
            </div>
        );
    }

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tramites.map((tramite) => (
                <CatalogCard key={tramite.id} tramite={tramite} onSolicitar={onSolicitar} />
            ))}
        </div>
    );
};
