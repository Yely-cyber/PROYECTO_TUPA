// Configuración de trámites TUPA (Fig. 24 / Fig. 25)
// Reemplazar por GET /api/admin/tramites cuando el backend esté conectado.

export const mockTramitesAdmin = [
  {
    id: 1,
    titulo: "Certificado de Estudios",
    categoria: "Académico",
    costo: 15.0,
    tiempoEstimado: "3 días",
    descripcion: "Documento que certifica los estudios realizados",
    estado: "Publicado",
  },
  {
    id: 2,
    titulo: "Carnet Universitario",
    categoria: "Administrativo",
    costo: 10.0,
    tiempoEstimado: "5 días",
    descripcion: "Carnet de identificación como estudiante de la universidad",
    estado: "Publicado",
  },
  {
    id: 3,
    titulo: "Grados y Títulos",
    categoria: "Grados y Títulos",
    costo: 250.0,
    tiempoEstimado: "30 días",
    descripcion: "Trámite para la obtención del grado o título profesional",
    estado: "Publicado",
  },
  {
    id: 4,
    titulo: "Constancia de Matrícula",
    categoria: "Académico",
    costo: 5.0,
    tiempoEstimado: "1 día",
    descripcion: "Constancia que acredita la matrícula vigente del estudiante",
    estado: "Publicado",
  },
];

export const emptyTramite = {
  id: null,
  titulo: "",
  categoria: "",
  costo: "",
  tiempoEstimado: "",
  descripcion: "",
  estado: "Publicado",
};
