import React from "react";
import { FileText, CheckCircle2, Clock } from "lucide-react";

const ICONS = {
  total: { Icon: FileText, bg: "#a91d3a" },
  aprobados: { Icon: CheckCircle2, bg: "#1f9d55" },
  pendientes: { Icon: Clock, bg: "#d98c1c" },
};

/**
 * Tarjetas de métricas del Dashboard : Total de trámites,
 * Trámites Aprobados, Pendientes de Revisión.
 */
export default function AdminMetricsCards({ totales }) {
  const items = [
    { key: "total", label: "Total de Trámites", data: totales.totalTramites },
    { key: "aprobados", label: "Trámites Aprobados", data: totales.tramitesAprobados },
    { key: "pendientes", label: "Pendientes de Revisión", data: totales.pendientesRevision },
  ];

  return (
    <div className="admin-grid admin-grid-3">
      {items.map(({ key, label, data }) => {
        const { Icon, bg } = ICONS[key];
        return (
          <div className="admin-card admin-metric-card" key={key}>
            <div className="admin-metric-top">
              <div className="admin-metric-icon" style={{ background: bg }}>
                <Icon size={18} />
              </div>
              <span className={`admin-metric-delta ${data.tendencia}`}>{data.delta}</span>
            </div>
            <div className="admin-metric-label">{label}</div>
            <div className="admin-metric-value">{data.valor}</div>
          </div>
        );
      })}
    </div>
  );
}
