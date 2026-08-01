// Archivo de exportación pública del módulo de administración (barrel file).
// Importa desde "modules/admin" en el resto de la app en lugar de rutas profundas.
// NOTA: no exporta login/logout — eso vive en tu módulo de auth (authService.js).

export { AdminRoutes } from "./admin.routes";

// Layout
export { default as AdminLayout } from "./components/AdminLayout";

// Componentes reutilizables
export { default as TramiteReviewModal } from "./components/TramiteReviewModal";
export { default as TramiteEditModal } from "./components/TramiteEditModal";
export { default as CategoryFormModal } from "./components/CategoryFormModal";
export { default as ExpedienteStatusBadge } from "./components/ExpedienteStatusBadge";
export { default as AdminDataTable } from "./components/AdminDataTable";

// Páginas
export { default as AdminDashboardPage } from "./pages/AdminDashboardPage";
export { default as TramiteManagerPage } from "./pages/TramiteManagerPage";
export { default as TramiteCreateEditPage } from "./pages/TramiteCreateEditPage";
export { default as ExpedientesManagerPage } from "./pages/ExpedientesManagerPage";
export { default as ExpedienteReviewPage } from "./pages/ExpedienteReviewPage";
export { default as CategoriesManagerPage } from "./pages/CategoriesManagerPage";
export { default as DocumentManagerPage } from "./pages/DocumentManagerPage";

// Hooks
export { default as useExpedientes } from "./hooks/useExpedientes";
export { default as useTramitesManager } from "./hooks/useTramitesManager";
export { default as useCategories } from "./hooks/useCategories";
export { default as useDocuments } from "./hooks/useDocuments";

// Servicio HTTP
export { default as adminService } from "./services/adminService";
