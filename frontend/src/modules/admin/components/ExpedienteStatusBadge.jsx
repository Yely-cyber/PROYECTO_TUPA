import React from "react";
import { estadoToClass } from "../utils/adminHelpers";

/**
 * Badge visual reutilizable para estados de trámites y expedientes:
 * Aprobado, Pendiente, Observado, Iniciado, Rechazado, Publicado, etc.
 */
export default function ExpedienteStatusBadge({ estado }) {
  return <span className={`admin-badge ${estadoToClass(estado)}`}>{estado}</span>;
}
