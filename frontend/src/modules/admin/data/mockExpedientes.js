// Solicitudes de trámite recibidas para revisión administrativa (Fig. 26 / Fig. 27)
// Reemplazar por GET /api/admin/expedientes cuando el backend esté conectado.

export const mockExpedientes = [
  {
    id: "#4592",
    tipoTramite: "Certificado de Estudios",
    estado: "Aprobado",
    fecha: "15/10/2024",
    usuarioResponsable: "Juan Carlos Pérez Sánchez",
    descripcion: "Certificado de estudios completo",
  },
  {
    id: "#4591",
    tipoTramite: "Grados y Títulos",
    estado: "Pendiente",
    fecha: "14/10/2024",
    usuarioResponsable: "María Torres Quispe",
    descripcion: "Solicitud de título profesional en Ingeniería de Sistemas",
  },
  {
    id: "#4590",
    tipoTramite: "Carnet Universitario",
    estado: "Iniciado",
    fecha: "12/10/2024",
    usuarioResponsable: "Alberto Vargas Mamani",
    descripcion: "Duplicado por pérdida del carnet universitario",
  },
  {
    id: "#4589",
    tipoTramite: "Rectificación de Nota",
    estado: "Observado",
    fecha: "10/10/2024",
    usuarioResponsable: "José Ramírez Huamán",
    descripcion: "Rectificación de nota del curso de Cálculo II",
  },
  {
    id: "#4588",
    tipoTramite: "Constancia de Egresado",
    estado: "Aprobado",
    fecha: "8/10/2024",
    usuarioResponsable: "Rosa Flores Condori",
    descripcion: "Constancia de egresado para trámite laboral",
  },
  {
    id: "#4587",
    tipoTramite: "Matrícula Extemporánea",
    estado: "Aprobado",
    fecha: "5/10/2024",
    usuarioResponsable: "Luis Chávez Apaza",
    descripcion: "Matrícula extemporánea semestre 2024-II",
  },
  {
    id: "#4586",
    tipoTramite: "Solicitud de Beca",
    estado: "Pendiente",
    fecha: "3/10/2024",
    usuarioResponsable: "Katherine Zúñiga Rojas",
    descripcion: "Solicitud de beca socioeconómica",
  },
  {
    id: "#4582",
    tipoTramite: "Traslado Interno",
    estado: "Pendiente",
    fecha: "22/9/2024",
    usuarioResponsable: "Diego Salazar Ttito",
    descripcion: "Traslado interno a la Escuela de Ingeniería Civil",
  },
];

export const ESTADOS_EXPEDIENTE = ["Iniciado", "Pendiente", "Aprobado", "Observado", "Rechazado"];

