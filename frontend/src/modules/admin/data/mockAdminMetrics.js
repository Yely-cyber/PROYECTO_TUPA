// Datos de prueba para el Dashboard administrativo (Fig. 23)
// Reemplazar por la respuesta real de GET /api/admin/dashboard cuando el backend esté listo.

export const mockAdminMetrics = {
  totales: {
    totalTramites: { valor: 248, delta: "+12%", tendencia: "up" },
    tramitesAprobados: { valor: 189, delta: "+15%", tendencia: "up" },
    pendientesRevision: { valor: 45, delta: "-3%", tendencia: "down" },
  },

  actividadReciente: [
    {
      id: 1,
      tipo: "aprobado",
      titulo: "Trámite aprobado",
      detalle: "Certificado de Estudios - Juan Pérez",
      hace: "Hace 5 min",
    },
    {
      id: 2,
      tipo: "nueva",
      titulo: "Nueva solicitud",
      detalle: "Grados y Títulos - María García",
      hace: "Hace 15 min",
    },
    {
      id: 3,
      tipo: "observado",
      titulo: "Trámite observado",
      detalle: "Carnet Universitario - Carlos López",
      hace: "Hace 30 min",
    },
    {
      id: 4,
      tipo: "aprobado",
      titulo: "Trámite aprobado",
      detalle: "Constancia de Matrícula - Ana Sánchez",
      hace: "Hace 1 hora",
    },
  ],

  tramitesPendientes: [
    {
      id: "#4590",
      titulo: "Certificado de Estudios",
      usuario: "Usuario Alberto Vargas",
      fecha: "2024-05-27",
      estado: "Pendiente",
    },
    {
      id: "#4591",
      titulo: "Grados y Títulos",
      usuario: "Usuario María Torres",
      fecha: "2024-05-27",
      estado: "En Revisión",
    },
    {
      id: "#4589",
      titulo: "Rectificación de Notas",
      usuario: "Usuario José Ramírez",
      fecha: "2024-05-26",
      estado: "Pendiente",
    },
  ],

  categoriasMasUtilizadas: [
    { nombre: "Académico", tramites: 124, porcentaje: 100 },
    { nombre: "Administrativo", tramites: 78, porcentaje: 63 },
    { nombre: "Grados y Títulos", tramites: 46, porcentaje: 37 },
  ],

  estadisticasMensuales: [
    { mes: "Enero 2024", total: 198 },
    { mes: "Febrero 2024", total: 215 },
    { mes: "Marzo 2024", total: 248 },
  ],
};
